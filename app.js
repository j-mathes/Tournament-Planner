(function () {
  "use strict";

  var STORAGE_KEY = "tp.static.v1";

  var state = createEmptyState();
  var ui = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    bindEvents();
    loadState();
    renderAll();
  }

  function createEmptyState() {
    return {
      tournament: {
        id: "tournament-1",
        name: "",
        startDate: "",
        endDate: ""
      },
      divisions: [],
      teams: [],
      venues: [],
      matches: []
    };
  }

  function cacheDom() {
    ui.nav = document.getElementById("main-nav");
    ui.views = Array.prototype.slice.call(document.querySelectorAll(".view"));

    ui.tournamentForm = document.getElementById("tournament-form");
    ui.tournamentName = document.getElementById("tournament-name");
    ui.tournamentStart = document.getElementById("tournament-start");
    ui.tournamentEnd = document.getElementById("tournament-end");
    ui.resetData = document.getElementById("reset-data");
    ui.dashboardStats = document.getElementById("dashboard-stats");
    ui.exportJson = document.getElementById("export-json");
    ui.importJson = document.getElementById("import-json");

    ui.divisionForm = document.getElementById("division-form");
    ui.divisionEditId = document.getElementById("division-edit-id");
    ui.divisionName = document.getElementById("division-name");
    ui.divisionSubmitBtn = document.getElementById("division-submit-btn");
    ui.divisionCancelEdit = document.getElementById("division-cancel-edit");
    ui.divisionTableBody = document.getElementById("division-table-body");

    ui.teamForm = document.getElementById("team-form");
    ui.teamEditId = document.getElementById("team-edit-id");
    ui.teamName = document.getElementById("team-name");
    ui.teamClub = document.getElementById("team-club");
    ui.teamCoach = document.getElementById("team-coach");
    ui.teamDivision = document.getElementById("team-division");
    ui.teamSeed = document.getElementById("team-seed");
    ui.teamSubmitBtn = document.getElementById("team-submit-btn");
    ui.teamCancelEdit = document.getElementById("team-cancel-edit");
    ui.teamTableBody = document.getElementById("team-table-body");

    ui.venueForm = document.getElementById("venue-form");
    ui.venueEditId = document.getElementById("venue-edit-id");
    ui.venueName = document.getElementById("venue-name");
    ui.venueCourts = document.getElementById("venue-courts");
    ui.venueSubmitBtn = document.getElementById("venue-submit-btn");
    ui.venueCancelEdit = document.getElementById("venue-cancel-edit");
    ui.venueTableBody = document.getElementById("venue-table-body");

    ui.matchDivision = document.getElementById("match-division");
    ui.generateRoundRobin = document.getElementById("generate-round-robin");
    ui.scheduleVenue = document.getElementById("schedule-venue");
    ui.scheduleStartTime = document.getElementById("schedule-start-time");
    ui.scheduleSlotMinutes = document.getElementById("schedule-slot-minutes");
    ui.scheduleBreakMinutes = document.getElementById("schedule-break-minutes");
    ui.autoAssignSchedule = document.getElementById("auto-assign-schedule");
    ui.printSchedule = document.getElementById("print-schedule");
    ui.matchVenueFilter = document.getElementById("match-venue-filter");
    ui.matchCourtFilter = document.getElementById("match-court-filter");
    ui.matchStatusFilter = document.getElementById("match-status-filter");
    ui.matchTableBody = document.getElementById("match-table-body");

    ui.standingsDivision = document.getElementById("standings-division");
    ui.standingsTableBody = document.getElementById("standings-table-body");

    ui.publicBoard = document.getElementById("public-board");
  }

  function bindEvents() {
    ui.nav.addEventListener("click", handleNavClick);
    ui.tournamentForm.addEventListener("submit", handleTournamentSave);
    ui.resetData.addEventListener("click", handleResetData);
    ui.exportJson.addEventListener("click", exportJson);
    ui.importJson.addEventListener("change", importJson);

    ui.divisionForm.addEventListener("submit", handleDivisionAdd);
    ui.divisionCancelEdit.addEventListener("click", resetDivisionForm);
    ui.divisionTableBody.addEventListener("click", handleDivisionActions);

    ui.teamForm.addEventListener("submit", handleTeamAdd);
    ui.teamCancelEdit.addEventListener("click", resetTeamForm);
    ui.teamTableBody.addEventListener("click", handleTeamActions);

    ui.venueForm.addEventListener("submit", handleVenueSubmit);
    ui.venueCancelEdit.addEventListener("click", resetVenueForm);
    ui.venueTableBody.addEventListener("click", handleVenueActions);

    ui.matchDivision.addEventListener("change", renderMatches);
    ui.generateRoundRobin.addEventListener("click", handleGenerateRoundRobin);
    ui.autoAssignSchedule.addEventListener("click", handleAutoAssignSchedule);
    ui.printSchedule.addEventListener("click", handlePrintSchedule);
    ui.matchVenueFilter.addEventListener("change", function () {
      updateMatchCourtFilterOptions();
      renderMatches();
    });
    ui.matchCourtFilter.addEventListener("change", renderMatches);
    ui.matchStatusFilter.addEventListener("change", renderMatches);
    ui.matchTableBody.addEventListener("submit", handleScoreSubmit);
    ui.matchTableBody.addEventListener("click", handleMatchActions);

    ui.standingsDivision.addEventListener("change", renderStandings);
  }

  function handleNavClick(event) {
    var button = event.target.closest("button[data-view]");
    if (!button) {
      return;
    }

    var viewName = button.getAttribute("data-view");
    Array.prototype.forEach.call(ui.nav.querySelectorAll(".nav-btn"), function (item) {
      item.classList.toggle("is-active", item === button);
    });

    ui.views.forEach(function (view) {
      var isActive = view.id === "view-" + viewName;
      view.classList.toggle("is-active", isActive);
    });
  }

  function handleTournamentSave(event) {
    event.preventDefault();
    state.tournament.name = ui.tournamentName.value.trim();
    state.tournament.startDate = ui.tournamentStart.value;
    state.tournament.endDate = ui.tournamentEnd.value;
    saveState();
    renderDashboardStats();
  }

  function handleResetData() {
    if (!window.confirm("Reset all tournament data? This cannot be undone.")) {
      return;
    }

    state = createEmptyState();
    saveState();
    renderAll();
  }

  function handleDivisionAdd(event) {
    event.preventDefault();
    var name = ui.divisionName.value.trim();
    if (!name) {
      return;
    }

    var editId = ui.divisionEditId.value;
    if (editId) {
      var current = findDivision(editId);
      if (!current) {
        resetDivisionForm();
        return;
      }

      current.name = name;
      resetDivisionForm();
      saveState();
      renderAll();
      return;
    }

    state.divisions.push({
      id: createId("div"),
      name: name
    });

    resetDivisionForm();
    saveState();
    renderAll();
  }

  function handleDivisionActions(event) {
    var button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    var divisionId = button.getAttribute("data-division-id");
    var action = button.getAttribute("data-action");

    if (action === "edit") {
      var division = findDivision(divisionId);
      if (!division) {
        return;
      }

      ui.divisionEditId.value = division.id;
      ui.divisionName.value = division.name;
      ui.divisionSubmitBtn.textContent = "Save Division";
      ui.divisionCancelEdit.hidden = false;
      ui.divisionName.focus();
      return;
    }

    if (action === "delete") {
      var inUse = state.teams.some(function (team) {
        return team.divisionId === divisionId;
      });
      if (inUse) {
        window.alert("Remove or move teams before deleting this division.");
        return;
      }

      state.divisions = state.divisions.filter(function (division) {
        return division.id !== divisionId;
      });

      state.matches = state.matches.filter(function (match) {
        return match.divisionId !== divisionId;
      });
      saveState();
      renderAll();
    }
  }

  function handleTeamAdd(event) {
    event.preventDefault();
    if (!state.divisions.length) {
      window.alert("Add at least one division first.");
      return;
    }

    var name = ui.teamName.value.trim();
    if (!name) {
      return;
    }

    var seed = parseInt(ui.teamSeed.value, 10);
    var editId = ui.teamEditId.value;
    if (editId) {
      var team = findTeam(editId);
      if (!team) {
        resetTeamForm();
        return;
      }

      team.name = name;
      team.club = ui.teamClub.value.trim();
      team.coachName = ui.teamCoach.value.trim();
      team.divisionId = ui.teamDivision.value;
      team.seed = Number.isFinite(seed) ? seed : null;
      resetTeamForm();
      saveState();
      renderAll();
      return;
    }

    state.teams.push({
      id: createId("team"),
      name: name,
      club: ui.teamClub.value.trim(),
      coachName: ui.teamCoach.value.trim(),
      divisionId: ui.teamDivision.value,
      seed: Number.isFinite(seed) ? seed : null
    });

    resetTeamForm();
    saveState();
    renderAll();
  }

  function handleTeamActions(event) {
    var button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    var teamId = button.getAttribute("data-team-id");
    var action = button.getAttribute("data-action");

    if (action === "edit") {
      var editTeam = findTeam(teamId);
      if (!editTeam) {
        return;
      }

      ui.teamEditId.value = editTeam.id;
      ui.teamName.value = editTeam.name;
      ui.teamClub.value = editTeam.club || "";
      ui.teamCoach.value = editTeam.coachName || "";
      ui.teamDivision.value = editTeam.divisionId;
      ui.teamSeed.value = Number.isFinite(editTeam.seed) ? String(editTeam.seed) : "";
      ui.teamSubmitBtn.textContent = "Save Team";
      ui.teamCancelEdit.hidden = false;
      ui.teamName.focus();
      return;
    }

    if (action === "delete") {
      state.teams = state.teams.filter(function (team) {
        return team.id !== teamId;
      });

      state.matches = state.matches.filter(function (match) {
        return match.teamAId !== teamId && match.teamBId !== teamId;
      });

      saveState();
      renderAll();
    }
  }

  function handleVenueSubmit(event) {
    event.preventDefault();
    var name = ui.venueName.value.trim();
    var courtLabels = parseCourtLabels(ui.venueCourts.value);
    if (!name || !courtLabels.length) {
      window.alert("Enter a venue name and at least one court label.");
      return;
    }

    var editId = ui.venueEditId.value;
    if (editId) {
      var existing = findVenue(editId);
      if (!existing) {
        resetVenueForm();
        return;
      }

      existing.name = name;
      existing.courts = courtLabels.map(function (label) {
        return { id: createId("court"), label: label };
      });
      normalizeMatchAssignments();
      resetVenueForm();
      saveState();
      renderAll();
      return;
    }

    state.venues.push({
      id: createId("venue"),
      name: name,
      courts: courtLabels.map(function (label) {
        return { id: createId("court"), label: label };
      })
    });

    resetVenueForm();
    saveState();
    renderAll();
  }

  function handleVenueActions(event) {
    var button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    var venueId = button.getAttribute("data-venue-id");
    var action = button.getAttribute("data-action");

    if (action === "edit") {
      var venue = findVenue(venueId);
      if (!venue) {
        return;
      }

      ui.venueEditId.value = venue.id;
      ui.venueName.value = venue.name;
      ui.venueCourts.value = venue.courts.map(function (court) {
        return court.label;
      }).join(", ");
      ui.venueSubmitBtn.textContent = "Save Venue";
      ui.venueCancelEdit.hidden = false;
      ui.venueName.focus();
      return;
    }

    if (action === "delete") {
      var assignedCount = state.matches.filter(function (match) {
        return match.venueId === venueId;
      }).length;
      if (assignedCount > 0 && !window.confirm("This venue is used by scheduled matches. Delete and clear those assignments?")) {
        return;
      }

      state.venues = state.venues.filter(function (venue) {
        return venue.id !== venueId;
      });
      normalizeMatchAssignments();
      saveState();
      renderAll();
    }
  }

  function handleGenerateRoundRobin() {
    var divisionId = ui.matchDivision.value;
    if (!divisionId) {
      window.alert("Select a division.");
      return;
    }

    var teams = getDivisionTeams(divisionId);
    if (teams.length < 2) {
      window.alert("Need at least two teams in this division.");
      return;
    }

    state.matches = state.matches.filter(function (match) {
      return !(match.divisionId === divisionId && match.stage === "pool");
    });

    var pairs = [];
    for (var i = 0; i < teams.length; i += 1) {
      for (var j = i + 1; j < teams.length; j += 1) {
        pairs.push([teams[i], teams[j]]);
      }
    }

    pairs.forEach(function (pair, index) {
      state.matches.push({
        id: createId("match"),
        divisionId: divisionId,
        stage: "pool",
        roundNumber: index + 1,
        teamAId: pair[0].id,
        teamBId: pair[1].id,
        venueId: null,
        courtId: null,
        startTime: null,
        status: "scheduled",
        setScores: [],
        winnerId: null,
        loserId: null
      });
    });

    saveState();
    renderAll();
  }

  function handleAutoAssignSchedule() {
    var divisionId = ui.matchDivision.value;
    if (!divisionId) {
      window.alert("Select a division to assign.");
      return;
    }

    var venue = findVenue(ui.scheduleVenue.value);
    if (!venue || !venue.courts.length) {
      window.alert("Select a venue with at least one court.");
      return;
    }

    var matches = state.matches
      .filter(function (match) {
        return match.divisionId === divisionId;
      })
      .sort(function (a, b) {
        return a.roundNumber - b.roundNumber;
      });

    if (!matches.length) {
      window.alert("No matches found for this division.");
      return;
    }

    var baseDate = ui.scheduleStartTime.value ? new Date(ui.scheduleStartTime.value) : new Date();
    var slotMinutes = Math.max(10, parseInt(ui.scheduleSlotMinutes.value, 10) || 45);
    var breakMinutes = Math.max(0, parseInt(ui.scheduleBreakMinutes.value, 10) || 10);
    var stepMs = (slotMinutes + breakMinutes) * 60000;

    matches.forEach(function (match, index) {
      var court = venue.courts[index % venue.courts.length];
      var wave = Math.floor(index / venue.courts.length);
      var start = new Date(baseDate.getTime() + wave * stepMs);
      match.venueId = venue.id;
      match.courtId = court.id;
      match.startTime = start.toISOString();
    });

    saveState();
    renderAll();
  }

  function handlePrintSchedule() {
    window.print();
  }

  function handleScoreSubmit(event) {
    var form = event.target.closest("form.score-form");
    if (!form) {
      return;
    }

    event.preventDefault();
    var matchId = form.getAttribute("data-match-id");
    var match = state.matches.find(function (item) {
      return item.id === matchId;
    });
    if (!match) {
      return;
    }

    var setNames = ["s1", "s2", "s3"];
    var sets = [];
    setNames.forEach(function (name, index) {
      var raw = form.elements[name].value.trim();
      if (!raw) {
        return;
      }

      var parsed = parseSet(raw);
      if (!parsed) {
        return;
      }

      sets.push({
        setNumber: index + 1,
        teamAScore: parsed[0],
        teamBScore: parsed[1]
      });
    });

    if (!sets.length) {
      window.alert("Enter at least one valid set score like 25-21.");
      return;
    }

    match.setScores = sets;
    applyMatchOutcome(match);
    saveState();
    renderAll();
  }

  function handleMatchActions(event) {
    var button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    var action = button.getAttribute("data-action");
    if (action !== "clear-score" && action !== "edit-assignment" && action !== "clear-assignment") {
      return;
    }

    var matchId = button.getAttribute("data-match-id");
    var match = state.matches.find(function (item) {
      return item.id === matchId;
    });
    if (!match) {
      return;
    }

    if (action === "edit-assignment") {
      openAssignmentEditor(match);
      return;
    }

    if (action === "clear-assignment") {
      match.venueId = null;
      match.courtId = null;
      match.startTime = null;
      saveState();
      renderAll();
      return;
    }

    match.setScores = [];
    match.winnerId = null;
    match.loserId = null;
    match.status = "scheduled";
    saveState();
    renderAll();
  }

  function applyMatchOutcome(match) {
    var aSets = 0;
    var bSets = 0;

    match.setScores.forEach(function (set) {
      if (set.teamAScore > set.teamBScore) {
        aSets += 1;
      } else if (set.teamBScore > set.teamAScore) {
        bSets += 1;
      }
    });

    if (aSets === bSets) {
      match.status = "in_progress";
      match.winnerId = null;
      match.loserId = null;
      return;
    }

    match.status = "completed";
    if (aSets > bSets) {
      match.winnerId = match.teamAId;
      match.loserId = match.teamBId;
    } else {
      match.winnerId = match.teamBId;
      match.loserId = match.teamAId;
    }
  }

  function parseSet(text) {
    var parts = text.split("-");
    if (parts.length !== 2) {
      return null;
    }

    var left = parseInt(parts[0], 10);
    var right = parseInt(parts[1], 10);
    if (!Number.isFinite(left) || !Number.isFinite(right) || left < 0 || right < 0) {
      return null;
    }

    return [left, right];
  }

  function renderAll() {
    renderTournamentForm();
    renderDivisionOptions();
    renderDashboardStats();
    renderDivisions();
    renderTeams();
    renderVenues();
    updateMatchCourtFilterOptions();
    renderMatches();
    renderStandings();
    renderPublicBoard();
  }

  function renderTournamentForm() {
    ui.tournamentName.value = state.tournament.name || "";
    ui.tournamentStart.value = state.tournament.startDate || "";
    ui.tournamentEnd.value = state.tournament.endDate || "";
  }

  function renderDivisionOptions() {
    var selectedMatchDivision = ui.matchDivision.value;
    var selectedStandingsDivision = ui.standingsDivision.value;
    var selectedTeamDivision = ui.teamDivision.value;
    var selectedScheduleVenue = ui.scheduleVenue.value;
    var selectedVenueFilter = ui.matchVenueFilter.value;

    var divisionOptions = state.divisions.map(function (division) {
      return optionHtml(division.id, division.name);
    }).join("");

    ui.teamDivision.innerHTML = divisionOptions;
    ui.matchDivision.innerHTML = "<option value=\"\">Select division</option>" + divisionOptions;
    ui.standingsDivision.innerHTML = "<option value=\"\">Select division</option>" + divisionOptions;

    var venueOptions = state.venues.map(function (venue) {
      return optionHtml(venue.id, venue.name);
    }).join("");
    ui.scheduleVenue.innerHTML = "<option value=\"\">Select venue</option>" + venueOptions;
    ui.matchVenueFilter.innerHTML = "<option value=\"\">All venues</option>" + venueOptions;

    restoreSelectValue(ui.teamDivision, selectedTeamDivision);
    restoreSelectValue(ui.matchDivision, selectedMatchDivision);
    restoreSelectValue(ui.standingsDivision, selectedStandingsDivision);
    restoreSelectValue(ui.scheduleVenue, selectedScheduleVenue);
    restoreSelectValue(ui.matchVenueFilter, selectedVenueFilter);
  }

  function renderDashboardStats() {
    var completed = state.matches.filter(function (match) {
      return match.status === "completed";
    }).length;
    var courtCount = state.venues.reduce(function (sum, venue) {
      return sum + venue.courts.length;
    }, 0);

    var html = [
      statCard("Divisions", state.divisions.length),
      statCard("Teams", state.teams.length),
      statCard("Venues", state.venues.length),
      statCard("Courts", courtCount),
      statCard("Matches", state.matches.length),
      statCard("Completed", completed)
    ].join("");

    ui.dashboardStats.innerHTML = html;
  }

  function renderDivisions() {
    ui.divisionTableBody.innerHTML = state.divisions
      .map(function (division) {
        var count = getDivisionTeams(division.id).length;
        return "<tr>" +
          "<td>" + escapeHtml(division.name) + "</td>" +
          "<td>" + count + "</td>" +
          "<td>" +
          "<button type=\"button\" data-action=\"edit\" data-division-id=\"" + escapeHtml(division.id) + "\">Edit</button> " +
          "<button type=\"button\" data-action=\"delete\" data-division-id=\"" + escapeHtml(division.id) + "\">Delete</button>" +
          "</td>" +
          "</tr>";
      })
      .join("");
  }

  function renderTeams() {
    ui.teamTableBody.innerHTML = state.teams
      .slice()
      .sort(compareTeams)
      .map(function (team) {
        var division = findDivision(team.divisionId);
        return "<tr>" +
          "<td><strong>" + escapeHtml(team.name) + "</strong><br><small>" + escapeHtml(team.club || "-") + "</small></td>" +
          "<td>" + escapeHtml(division ? division.name : "-") + "</td>" +
          "<td>" + (team.seed || "-") + "</td>" +
          "<td>" +
          "<button type=\"button\" data-action=\"edit\" data-team-id=\"" + escapeHtml(team.id) + "\">Edit</button> " +
          "<button type=\"button\" data-action=\"delete\" data-team-id=\"" + escapeHtml(team.id) + "\">Delete</button>" +
          "</td>" +
          "</tr>";
      })
      .join("");
  }

  function renderVenues() {
    ui.venueTableBody.innerHTML = state.venues
      .map(function (venue) {
        var courts = venue.courts.map(function (court) {
          return court.label;
        }).join(", ");
        return "<tr>" +
          "<td>" + escapeHtml(venue.name) + "</td>" +
          "<td>" + escapeHtml(courts) + "</td>" +
          "<td>" +
          "<button type=\"button\" data-action=\"edit\" data-venue-id=\"" + escapeHtml(venue.id) + "\">Edit</button> " +
          "<button type=\"button\" data-action=\"delete\" data-venue-id=\"" + escapeHtml(venue.id) + "\">Delete</button>" +
          "</td>" +
          "</tr>";
      })
      .join("");
  }

  function renderMatches() {
    var divisionId = ui.matchDivision.value || "";
    var venueId = ui.matchVenueFilter.value || "";
    var courtId = ui.matchCourtFilter.value || "";
    var status = ui.matchStatusFilter.value || "";

    var matches = state.matches
      .filter(function (match) {
        return (!divisionId || match.divisionId === divisionId) &&
          (!venueId || match.venueId === venueId) &&
          (!courtId || match.courtId === courtId) &&
          (!status || match.status === status);
      })
      .sort(function (a, b) {
        var ta = a.startTime || "";
        var tb = b.startTime || "";
        if (ta && tb && ta !== tb) {
          return ta.localeCompare(tb);
        }
        return a.roundNumber - b.roundNumber;
      });

    ui.matchTableBody.innerHTML = matches
      .map(function (match) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        var winner = findTeam(match.winnerId);

        return "<tr>" +
          "<td><strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " + escapeHtml(teamB ? teamB.name : "TBD") + "</strong><br><small>Round " + match.roundNumber + "</small></td>" +
          "<td>" + renderStatusTag(match.status) + "</td>" +
          "<td>" + renderAssignment(match) + "</td>" +
          "<td>" + renderSetSummary(match) + "</td>" +
          "<td>" + escapeHtml(winner ? winner.name : "-") + "</td>" +
          "<td>" + renderAssignmentActions(match) + renderScoreForm(match) + "</td>" +
          "</tr>";
      })
      .join("");
  }

  function renderAssignmentActions(match) {
    return "<div class=\"match-actions\">" +
      "<button type=\"button\" class=\"secondary\" data-action=\"edit-assignment\" data-match-id=\"" + escapeHtml(match.id) + "\">Assign</button> " +
      "<button type=\"button\" class=\"secondary\" data-action=\"clear-assignment\" data-match-id=\"" + escapeHtml(match.id) + "\">Clear Assignment</button>" +
      "</div>";
  }

  function renderStandings() {
    var divisionId = ui.standingsDivision.value || "";
    if (!divisionId) {
      ui.standingsTableBody.innerHTML = "";
      return;
    }

    var rows = computeStandings(divisionId);
    ui.standingsTableBody.innerHTML = rows
      .map(function (row, index) {
        return "<tr>" +
          "<td>" + (index + 1) + "</td>" +
          "<td>" + escapeHtml(row.team.name) + "</td>" +
          "<td>" + row.wins + "</td>" +
          "<td>" + row.losses + "</td>" +
          "<td>" + formatRatio(row.setsWon, row.setsLost) + "</td>" +
          "<td>" + formatRatio(row.pointsFor, row.pointsAgainst) + "</td>" +
          "</tr>";
      })
      .join("");
  }

  function renderPublicBoard() {
    var live = state.matches
      .filter(function (match) {
        return match.status !== "completed";
      })
      .sort(function (a, b) {
        return (a.startTime || "9999").localeCompare(b.startTime || "9999");
      })
      .slice(0, 8);

    if (!live.length) {
      ui.publicBoard.innerHTML = "<p>No upcoming or active matches yet.</p>";
      return;
    }

    ui.publicBoard.innerHTML = "<h3>Upcoming / Active Matches</h3>" + live
      .map(function (match) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        var division = findDivision(match.divisionId);
        return "<p><strong>" + escapeHtml(teamA ? teamA.name : "TBD") +
          " vs " + escapeHtml(teamB ? teamB.name : "TBD") +
          "</strong> <span class=\"tag\">" + escapeHtml(match.status) +
          "</span><br><small>" + escapeHtml(division ? division.name : "") +
          " | " + escapeHtml(renderAssignmentText(match)) + "</small></p>";
      })
      .join("<hr>");
  }

  function computeStandings(divisionId) {
    var teams = getDivisionTeams(divisionId);
    var completed = state.matches.filter(function (match) {
      return match.divisionId === divisionId && match.status === "completed";
    });

    var stats = teams.map(function (team) {
      return {
        team: team,
        wins: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        pointsFor: 0,
        pointsAgainst: 0
      };
    });

    completed.forEach(function (match) {
      var a = findStat(stats, match.teamAId);
      var b = findStat(stats, match.teamBId);
      if (!a || !b) {
        return;
      }

      match.setScores.forEach(function (set) {
        a.pointsFor += set.teamAScore;
        a.pointsAgainst += set.teamBScore;
        b.pointsFor += set.teamBScore;
        b.pointsAgainst += set.teamAScore;

        if (set.teamAScore > set.teamBScore) {
          a.setsWon += 1;
          b.setsLost += 1;
        } else if (set.teamBScore > set.teamAScore) {
          b.setsWon += 1;
          a.setsLost += 1;
        }
      });

      if (match.winnerId === match.teamAId) {
        a.wins += 1;
        b.losses += 1;
      } else if (match.winnerId === match.teamBId) {
        b.wins += 1;
        a.losses += 1;
      }
    });

    stats.sort(function (left, right) {
      if (right.wins !== left.wins) {
        return right.wins - left.wins;
      }

      var leftSetRatio = calcRatio(left.setsWon, left.setsLost);
      var rightSetRatio = calcRatio(right.setsWon, right.setsLost);
      if (rightSetRatio !== leftSetRatio) {
        return rightSetRatio - leftSetRatio;
      }

      var leftPointRatio = calcRatio(left.pointsFor, left.pointsAgainst);
      var rightPointRatio = calcRatio(right.pointsFor, right.pointsAgainst);
      if (rightPointRatio !== leftPointRatio) {
        return rightPointRatio - leftPointRatio;
      }

      return compareTeams(left.team, right.team);
    });

    return stats;
  }

  function exportJson() {
    var payload = JSON.stringify(state, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "tournament-planner-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importJson(event) {
    var file = event.target.files[0];
    if (!file) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function (loadEvent) {
      try {
        var incoming = JSON.parse(loadEvent.target.result);
        if (!isValidState(incoming)) {
          window.alert("Invalid import file format.");
          return;
        }

        state = normalizeLoadedState(incoming);
        saveState();
        renderAll();
      } catch (error) {
        window.alert("Could not read JSON file.");
      }
    };
    reader.readAsText(file);

    event.target.value = "";
  }

  function isValidState(candidate) {
    return candidate &&
      candidate.tournament &&
      Array.isArray(candidate.divisions) &&
      Array.isArray(candidate.teams) &&
      Array.isArray(candidate.matches) &&
      Array.isArray(candidate.venues || []);
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      var parsed = JSON.parse(raw);
      if (isValidState(parsed)) {
        state = normalizeLoadedState(parsed);
      }
    } catch (error) {
      console.warn("Failed to load saved data.", error);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function normalizeLoadedState(input) {
    var normalized = createEmptyState();
    normalized.tournament = input.tournament || normalized.tournament;
    normalized.divisions = Array.isArray(input.divisions) ? input.divisions : [];
    normalized.teams = Array.isArray(input.teams) ? input.teams : [];
    normalized.venues = Array.isArray(input.venues) ? input.venues.map(function (venue) {
      return {
        id: venue.id || createId("venue"),
        name: venue.name || "Unnamed Venue",
        courts: Array.isArray(venue.courts) ? venue.courts.map(function (court) {
          return {
            id: court.id || createId("court"),
            label: court.label || "Court"
          };
        }) : []
      };
    }) : [];
    normalized.matches = Array.isArray(input.matches) ? input.matches.map(function (match) {
      return {
        id: match.id || createId("match"),
        divisionId: match.divisionId || null,
        stage: match.stage || "pool",
        roundNumber: match.roundNumber || 1,
        teamAId: match.teamAId || null,
        teamBId: match.teamBId || null,
        venueId: match.venueId || null,
        courtId: match.courtId || null,
        startTime: match.startTime || null,
        status: match.status || "scheduled",
        setScores: Array.isArray(match.setScores) ? match.setScores : [],
        winnerId: match.winnerId || null,
        loserId: match.loserId || null
      };
    }) : [];

    state = normalized;
    normalizeMatchAssignments();
    return state;
  }

  function normalizeMatchAssignments() {
    state.matches.forEach(function (match) {
      var venue = findVenue(match.venueId);
      if (!venue) {
        match.venueId = null;
        match.courtId = null;
        return;
      }

      var court = venue.courts.find(function (item) {
        return item.id === match.courtId;
      });
      if (!court) {
        match.courtId = null;
      }
    });
  }

  function getDivisionTeams(divisionId) {
    return state.teams
      .filter(function (team) {
        return team.divisionId === divisionId;
      })
      .sort(compareTeams);
  }

  function compareTeams(left, right) {
    var lSeed = Number.isFinite(left.seed) ? left.seed : Number.MAX_SAFE_INTEGER;
    var rSeed = Number.isFinite(right.seed) ? right.seed : Number.MAX_SAFE_INTEGER;
    if (lSeed !== rSeed) {
      return lSeed - rSeed;
    }
    return left.name.localeCompare(right.name);
  }

  function findDivision(id) {
    return state.divisions.find(function (division) {
      return division.id === id;
    });
  }

  function findTeam(id) {
    return state.teams.find(function (team) {
      return team.id === id;
    });
  }

  function findVenue(id) {
    return state.venues.find(function (venue) {
      return venue.id === id;
    });
  }

  function findCourt(venueId, courtId) {
    var venue = findVenue(venueId);
    if (!venue) {
      return null;
    }
    return venue.courts.find(function (court) {
      return court.id === courtId;
    }) || null;
  }

  function findStat(rows, teamId) {
    return rows.find(function (row) {
      return row.team.id === teamId;
    });
  }

  function statCard(label, value) {
    return "<div class=\"stat\"><span>" + escapeHtml(label) + "</span><strong>" + value + "</strong></div>";
  }

  function renderStatusTag(status) {
    var css = status === "completed" ? "tag complete" : "tag";
    return "<span class=\"" + css + "\">" + escapeHtml(status) + "</span>";
  }

  function renderSetSummary(match) {
    if (!match.setScores.length) {
      return "-";
    }
    return match.setScores.map(function (set) {
      return set.teamAScore + "-" + set.teamBScore;
    }).join(", ");
  }

  function renderAssignment(match) {
    return escapeHtml(renderAssignmentText(match));
  }

  function renderAssignmentText(match) {
    var venue = findVenue(match.venueId);
    var court = findCourt(match.venueId, match.courtId);
    var venueName = venue ? venue.name : "Unassigned venue";
    var courtName = court ? court.label : "Unassigned court";
    var timeText = match.startTime ? formatDateTime(match.startTime) : "Unscheduled time";
    return venueName + " | " + courtName + " | " + timeText;
  }

  function renderScoreForm(match) {
    var values = { s1: "", s2: "", s3: "" };
    match.setScores.forEach(function (set, index) {
      var key = "s" + (index + 1);
      values[key] = set.teamAScore + "-" + set.teamBScore;
    });

    return "<form class=\"score-form\" data-match-id=\"" + escapeHtml(match.id) + "\">" +
      "<label>Set 1<input name=\"s1\" value=\"" + escapeHtml(values.s1) + "\" placeholder=\"25-20\"></label>" +
      "<label>Set 2<input name=\"s2\" value=\"" + escapeHtml(values.s2) + "\" placeholder=\"25-22\"></label>" +
      "<label>Set 3<input name=\"s3\" value=\"" + escapeHtml(values.s3) + "\" placeholder=\"15-10\"></label>" +
      "<button type=\"submit\">Save</button>" +
      "<button type=\"button\" data-action=\"clear-score\" data-match-id=\"" + escapeHtml(match.id) + "\">Clear</button>" +
      "</form>";
  }

  function updateMatchCourtFilterOptions() {
    var selected = ui.matchCourtFilter.value;
    var venueId = ui.matchVenueFilter.value;
    var courts = [];

    if (venueId) {
      var venue = findVenue(venueId);
      courts = venue ? venue.courts.slice() : [];
    } else {
      state.venues.forEach(function (venueItem) {
        venueItem.courts.forEach(function (court) {
          courts.push({ id: court.id, label: venueItem.name + " - " + court.label });
        });
      });
    }

    var options = courts.map(function (court) {
      return optionHtml(court.id, court.label);
    }).join("");
    ui.matchCourtFilter.innerHTML = "<option value=\"\">All courts</option>" + options;
    restoreSelectValue(ui.matchCourtFilter, selected);
  }

  function resetDivisionForm() {
    ui.divisionForm.reset();
    ui.divisionEditId.value = "";
    ui.divisionSubmitBtn.textContent = "Add Division";
    ui.divisionCancelEdit.hidden = true;
  }

  function resetTeamForm() {
    ui.teamForm.reset();
    ui.teamEditId.value = "";
    ui.teamSubmitBtn.textContent = "Add Team";
    ui.teamCancelEdit.hidden = true;
  }

  function resetVenueForm() {
    ui.venueForm.reset();
    ui.venueEditId.value = "";
    ui.venueSubmitBtn.textContent = "Add Venue";
    ui.venueCancelEdit.hidden = true;
  }

  function parseCourtLabels(text) {
    return text.split(",").map(function (item) {
      return item.trim();
    }).filter(function (item) {
      return item.length > 0;
    });
  }

  function optionHtml(value, label) {
    return "<option value=\"" + escapeHtml(value) + "\">" + escapeHtml(label) + "</option>";
  }

  function restoreSelectValue(selectElement, value) {
    if (!value) {
      return;
    }
    var exists = Array.prototype.some.call(selectElement.options, function (option) {
      return option.value === value;
    });
    if (exists) {
      selectElement.value = value;
    }
  }

  function formatRatio(numerator, denominator) {
    return calcRatio(numerator, denominator).toFixed(2);
  }

  function calcRatio(numerator, denominator) {
    if (!denominator) {
      return numerator ? numerator : 0;
    }
    return numerator / denominator;
  }

  function formatDateTime(isoText) {
    var date = new Date(isoText);
    if (isNaN(date.getTime())) {
      return "Unscheduled time";
    }
    return date.toLocaleString();
  }

  function openAssignmentEditor(match) {
    if (!state.venues.length) {
      window.alert("Add at least one venue before assigning matches.");
      return;
    }

    var venuePrompt = state.venues.map(function (venue, index) {
      return (index + 1) + ": " + venue.name;
    }).join("\n");

    var venueInput = window.prompt("Choose venue number:\n" + venuePrompt);
    if (venueInput === null) {
      return;
    }

    var venueIndex = parseInt(venueInput, 10) - 1;
    var venue = state.venues[venueIndex];
    if (!venue) {
      window.alert("Invalid venue selection.");
      return;
    }

    if (!venue.courts.length) {
      window.alert("Selected venue has no courts.");
      return;
    }

    var courtPrompt = venue.courts.map(function (court, index) {
      return (index + 1) + ": " + court.label;
    }).join("\n");

    var courtInput = window.prompt("Choose court number for " + venue.name + ":\n" + courtPrompt);
    if (courtInput === null) {
      return;
    }

    var courtIndex = parseInt(courtInput, 10) - 1;
    var court = venue.courts[courtIndex];
    if (!court) {
      window.alert("Invalid court selection.");
      return;
    }

    var existingLocalTime = "";
    if (match.startTime) {
      existingLocalTime = toLocalDateTimeInput(match.startTime);
    }

    var timeInput = window.prompt(
      "Enter start time in local format YYYY-MM-DDTHH:mm\nExample: 2026-05-25T09:00",
      existingLocalTime
    );
    if (timeInput === null) {
      return;
    }

    var parsedDate = new Date(timeInput);
    if (isNaN(parsedDate.getTime())) {
      window.alert("Invalid date/time format.");
      return;
    }

    match.venueId = venue.id;
    match.courtId = court.id;
    match.startTime = parsedDate.toISOString();
    saveState();
    renderAll();
  }

  function toLocalDateTimeInput(isoText) {
    var date = new Date(isoText);
    if (isNaN(date.getTime())) {
      return "";
    }

    var year = String(date.getFullYear());
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");
    return year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
  }

  function createId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10);
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();