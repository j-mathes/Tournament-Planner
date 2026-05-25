(function () {
  "use strict";

  var STORAGE_KEY = "tp.static.v1";
  var DEFAULT_MATCH_MINUTES = 45;
  var MATCH_FORMATS = [
    {
      id: "bo3",
      name: "Best of 3 (25/25/15)",
      setsToWin: 2,
      setPoints: [25, 25, 15],
      winByTwo: true,
      capPoints: 27,
      decidingSetCap: 17,
      durationMinutes: 60
    },
    {
      id: "bo5",
      name: "Best of 5 (25/25/25/25/15)",
      setsToWin: 3,
      setPoints: [25, 25, 25, 25, 15],
      winByTwo: true,
      capPoints: 27,
      decidingSetCap: 17,
      durationMinutes: 90
    },
    {
      id: "2s25",
      name: "Two Sets to 25",
      setsToWin: 2,
      setPoints: [25, 25],
      winByTwo: true,
      capPoints: 27,
      decidingSetCap: null,
      durationMinutes: 45
    },
    {
      id: "1s25",
      name: "Single Set to 25",
      setsToWin: 1,
      setPoints: [25],
      winByTwo: true,
      capPoints: 27,
      decidingSetCap: null,
      durationMinutes: 30
    }
  ];

  var state = createEmptyState();
  var ui = {};
  var assignmentEditMatchId = null;
  var workEditMatchId = null;
  var forfeitMatchId = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    bindEvents();
    window.addEventListener("afterprint", clearPrintContext);
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
    ui.adminAlerts = document.getElementById("admin-alerts");
    ui.divisionStatusBoard = document.getElementById("division-status-board");
    ui.exportJson = document.getElementById("export-json");
    ui.importJson = document.getElementById("import-json");

    ui.divisionForm = document.getElementById("division-form");
    ui.divisionEditId = document.getElementById("division-edit-id");
    ui.divisionName = document.getElementById("division-name");
    ui.divisionFormat = document.getElementById("division-format");
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
    ui.exportTeamsCsv = document.getElementById("export-teams-csv");
    ui.downloadTeamsTemplate = document.getElementById("download-teams-template");
    ui.importTeamsCsv = document.getElementById("import-teams-csv");
    ui.csvImportPreview = document.getElementById("csv-import-preview");

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
    ui.autoAssignWorkTeams = document.getElementById("auto-assign-work-teams");
    ui.printSchedule = document.getElementById("print-schedule");
    ui.printCourtSchedule = document.getElementById("print-court-schedule");
    ui.printWorkSheet = document.getElementById("print-work-sheet");
    ui.exportMatchesCsv = document.getElementById("export-matches-csv");
    ui.exportStandingsCsv = document.getElementById("export-standings-csv");
    ui.courtScheduleBoard = document.getElementById("court-schedule-board");
    ui.workSheetBoard = document.getElementById("work-sheet-board");
    ui.finalResultsBoard = document.getElementById("final-results-board");
    ui.matchVenueFilter = document.getElementById("match-venue-filter");
    ui.matchCourtFilter = document.getElementById("match-court-filter");
    ui.matchStatusFilter = document.getElementById("match-status-filter");
    ui.matchConflicts = document.getElementById("match-conflicts");
    ui.matchTableBody = document.getElementById("match-table-body");
    ui.printMetaMatches = document.getElementById("print-meta-matches");
    ui.bracketDivision = document.getElementById("bracket-division");
    ui.generateBracket = document.getElementById("generate-bracket");
    ui.generateBracketStandings = document.getElementById("generate-bracket-standings");
    ui.bracketScheduleVenue = document.getElementById("bracket-schedule-venue");
    ui.bracketScheduleStartTime = document.getElementById("bracket-schedule-start-time");
    ui.bracketScheduleSlotMinutes = document.getElementById("bracket-schedule-slot-minutes");
    ui.bracketScheduleBreakMinutes = document.getElementById("bracket-schedule-break-minutes");
    ui.bracketPriorityGapMinutes = document.getElementById("bracket-priority-gap-minutes");
    ui.autoScheduleBracket = document.getElementById("auto-schedule-bracket");
    ui.printBracket = document.getElementById("print-bracket");
    ui.exportBracket = document.getElementById("export-bracket");
    ui.importBracketJson = document.getElementById("import-bracket-json");
    ui.printMetaBrackets = document.getElementById("print-meta-brackets");
    ui.bracketBoard = document.getElementById("bracket-board");

    ui.teamScheduleTeam = document.getElementById("team-schedule-team");
    ui.printTeamSchedule = document.getElementById("print-team-schedule");
    ui.teamScheduleBody = document.getElementById("team-schedule-body");
    ui.printMetaTeamSchedule = document.getElementById("print-meta-team-schedule");

    ui.standingsDivision = document.getElementById("standings-division");
    ui.printStandings = document.getElementById("print-standings");
    ui.standingsTableBody = document.getElementById("standings-table-body");
    ui.printMetaStandings = document.getElementById("print-meta-standings");

    ui.publicBoard = document.getElementById("public-board");
    ui.publicVenueFilter = document.getElementById("public-venue-filter");
    ui.publicDivisionFilter = document.getElementById("public-division-filter");
    ui.publicDisplayMode = document.getElementById("public-display-mode");
    ui.publicFullscreen = document.getElementById("public-fullscreen");
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
    ui.exportTeamsCsv.addEventListener("click", handleExportTeamsCsv);
    ui.downloadTeamsTemplate.addEventListener("click", handleDownloadTeamsTemplate);
    ui.importTeamsCsv.addEventListener("change", handleTeamCsvFile);

    ui.venueForm.addEventListener("submit", handleVenueSubmit);
    ui.venueCancelEdit.addEventListener("click", resetVenueForm);
    ui.venueTableBody.addEventListener("click", handleVenueActions);

    ui.matchDivision.addEventListener("change", renderMatches);
    ui.generateRoundRobin.addEventListener("click", handleGenerateRoundRobin);
    ui.autoAssignSchedule.addEventListener("click", handleAutoAssignSchedule);
    ui.autoAssignWorkTeams.addEventListener("click", handleAutoAssignWorkTeams);
    ui.printSchedule.addEventListener("click", handlePrintMatches);
    ui.printCourtSchedule.addEventListener("click", handlePrintCourtSchedule);
    ui.printWorkSheet.addEventListener("click", handlePrintWorkSheet);
    ui.exportMatchesCsv.addEventListener("click", handleExportMatchesCsv);
    ui.exportStandingsCsv.addEventListener("click", handleExportStandingsCsv);
    ui.matchVenueFilter.addEventListener("change", function () {
      updateMatchCourtFilterOptions();
      renderMatches();
    });
    ui.matchCourtFilter.addEventListener("change", renderMatches);
    ui.matchStatusFilter.addEventListener("change", renderMatches);
    ui.matchTableBody.addEventListener("submit", handleMatchTableSubmit);
    ui.matchTableBody.addEventListener("click", handleMatchActions);
    ui.matchTableBody.addEventListener("change", handleMatchTableChange);
    ui.bracketDivision.addEventListener("change", renderBrackets);
    ui.generateBracket.addEventListener("click", handleGenerateBracket);
    ui.generateBracketStandings.addEventListener("click", handleGenerateBracketFromStandings);
    ui.autoScheduleBracket.addEventListener("click", handleAutoScheduleBracket);
    ui.printBracket.addEventListener("click", handlePrintBrackets);
    ui.exportBracket.addEventListener("click", handleExportBracket);
    ui.importBracketJson.addEventListener("change", handleImportBracket);
    ui.bracketBoard.addEventListener("click", handleBracketBoardClick);

    ui.teamScheduleTeam.addEventListener("change", renderTeamSchedule);
    ui.printTeamSchedule.addEventListener("click", handlePrintTeamSchedule);

    ui.standingsDivision.addEventListener("change", function() { renderStandings(); renderFinalResults(); });
    ui.printStandings.addEventListener("click", handlePrintStandings);

    ui.publicVenueFilter.addEventListener("change", renderPublicBoard);
    ui.publicDivisionFilter.addEventListener("change", renderPublicBoard);
    ui.publicDisplayMode.addEventListener("change", renderPublicBoard);
    ui.publicFullscreen.addEventListener("click", handlePublicFullscreen);
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
        durationMinutes: null,
        status: "scheduled",
        setScores: [],
        winnerId: null,
        loserId: null,
        workTeamId: null
      });
    });

    saveState();
    renderAll();
  }

  function handleBracketBoardClick(event) {
    var button = event.target.closest("button[data-repair]");
    if (!button) { return; }
    var action = button.getAttribute("data-repair");
    var divisionId = button.getAttribute("data-division");
    if (!divisionId) { return; }

    if (action === "invalid-winners") {
      repairInvalidWinners(divisionId);
      recomputeBracketProgression(divisionId);
      saveState();
      renderBrackets();
    } else if (action === "duplicate-entries") {
      repairDuplicateRoundEntries(divisionId);
      recomputeBracketProgression(divisionId);
      saveState();
      renderBrackets();
    } else if (action === "self-match") {
      repairSelfMatches(divisionId);
      recomputeBracketProgression(divisionId);
      saveState();
      renderBrackets();
    } else if (action === "all") {
      repairBracketAll(divisionId);
    }
  }

  function handleGenerateBracket() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) {
      window.alert("Select a division.");
      return;
    }

    var teams = getDivisionTeams(divisionId);
    if (teams.length < 2) {
      window.alert("Need at least two teams in this division.");
      return;
    }

    generateBracketForTeams(divisionId, teams);
  }

  function handleGenerateBracketFromStandings() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) {
      window.alert("Select a division.");
      return;
    }

    var completedPoolMatches = state.matches.filter(function (match) {
      return match.divisionId === divisionId && match.stage === "pool" && match.status === "completed";
    });
    if (!completedPoolMatches.length) {
      window.alert("Complete at least one pool match before seeding from standings.");
      return;
    }

    var orderedTeams = computeStandings(divisionId).map(function (row) {
      return row.team;
    });
    if (orderedTeams.length < 2) {
      window.alert("Need at least two teams in this division.");
      return;
    }

    generateBracketForTeams(divisionId, orderedTeams);
  }

  function generateBracketForTeams(divisionId, teams) {
    if (teams.length < 2) {
      return;
    }

    state.matches = state.matches.filter(function (match) {
      return !(match.divisionId === divisionId && match.stage === "bracket");
    });

    var generated = buildSingleEliminationMatches(divisionId, teams);
    state.matches = state.matches.concat(generated);
    recomputeBracketProgression(divisionId);
    saveState();
    renderAll();
  }

  function buildSingleEliminationMatches(divisionId, teams) {
    var size = nextPowerOfTwo(teams.length);
    var rounds = Math.log2(size);
    var seeded = teams.slice();
    while (seeded.length < size) {
      seeded.push(null);
    }

    var roundOneMatches = [];
    for (var i = 0; i < size; i += 2) {
      var teamA = seeded[i];
      var teamB = seeded[i + 1];
      roundOneMatches.push(createBracketMatch(divisionId, 1, (i / 2) + 1, teamA ? teamA.id : null, teamB ? teamB.id : null));
    }

    var all = roundOneMatches.slice();
    var priorRound = roundOneMatches;
    for (var round = 2; round <= rounds; round += 1) {
      var currentRound = [];
      for (var slot = 0; slot < priorRound.length; slot += 2) {
        currentRound.push(createBracketMatch(divisionId, round, (slot / 2) + 1, null, null));
      }
      all = all.concat(currentRound);
      priorRound = currentRound;
    }

    return all;
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
      match.durationMinutes = slotMinutes;
    });

    saveState();
    renderAll();
  }

  function handleAutoScheduleBracket() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) {
      window.alert("Select a division.");
      return;
    }

    var venue = findVenue(ui.bracketScheduleVenue.value);
    if (!venue || !venue.courts.length) {
      window.alert("Select a venue with at least one court.");
      return;
    }

    var rounds = groupBracketRounds(getBracketMatches(divisionId));
    var roundNumbers = Object.keys(rounds).map(function (item) {
      return parseInt(item, 10);
    }).sort(function (a, b) {
      return a - b;
    });
    if (!roundNumbers.length) {
      window.alert("No bracket matches found for this division.");
      return;
    }

    var baseDate = ui.bracketScheduleStartTime.value ? new Date(ui.bracketScheduleStartTime.value) : new Date();
    if (isNaN(baseDate.getTime())) {
      window.alert("Invalid start time.");
      return;
    }

    var slotMinutes = Math.max(10, parseInt(ui.bracketScheduleSlotMinutes.value, 10) || DEFAULT_MATCH_MINUTES);
    var breakMinutes = Math.max(0, parseInt(ui.bracketScheduleBreakMinutes.value, 10) || 10);
    var priorityGapMinutes = Math.max(0, parseInt(ui.bracketPriorityGapMinutes.value, 10) || 20);
    var waveStepMs = (slotMinutes + breakMinutes) * 60000;
    var currentRoundStart = new Date(baseDate.getTime());

    roundNumbers.forEach(function (roundNumber, index) {
      var matches = rounds[roundNumber]
        .slice()
        .sort(function (a, b) {
          return a.indexInRound - b.indexInRound;
        });

      matches.forEach(function (match, matchIndex) {
        var court = venue.courts[matchIndex % venue.courts.length];
        var wave = Math.floor(matchIndex / venue.courts.length);
        var start = new Date(currentRoundStart.getTime() + wave * waveStepMs);
        match.venueId = venue.id;
        match.courtId = court.id;
        match.startTime = start.toISOString();
        match.durationMinutes = slotMinutes;
      });

      var wavesUsed = Math.max(1, Math.ceil(matches.length / venue.courts.length));
      var extraPriorityGap = index >= roundNumbers.length - 2 ? priorityGapMinutes : 0;
      currentRoundStart = new Date(currentRoundStart.getTime() + (wavesUsed * (slotMinutes + breakMinutes) + extraPriorityGap) * 60000);
    });

    saveState();
    renderAll();
  }

  // ── Spec 11: Court Schedule, Work Sheet, CSV Export, Final Results ───────

  function renderCourtSchedule() {
    var divisionId = ui.matchDivision.value || "";
    var venueId = ui.matchVenueFilter.value || "";

    var matches = state.matches
      .filter(function (m) {
        return m.venueId && m.courtId &&
          (!divisionId || m.divisionId === divisionId) &&
          (!venueId || m.venueId === venueId);
      })
      .sort(function (a, b) {
        var ta = a.startTime || "";
        var tb = b.startTime || "";
        return ta.localeCompare(tb) || a.roundNumber - b.roundNumber;
      });

    if (!matches.length) {
      ui.courtScheduleBoard.innerHTML = "";
      return;
    }

    // group by venueId then courtId
    var grouped = {};
    matches.forEach(function (m) {
      var key = m.venueId + "|" + m.courtId;
      if (!grouped[key]) { grouped[key] = []; }
      grouped[key].push(m);
    });

    var html = "<div class='print-meta' id='print-meta-court-schedule'></div><h3>Court Schedule</h3>";
    Object.keys(grouped).forEach(function (key) {
      var courtMatches = grouped[key];
      var venue = findVenue(courtMatches[0].venueId);
      var court = findCourt(courtMatches[0].venueId, courtMatches[0].courtId);
      html += "<section class='court-schedule-section'>" +
        "<h4>" + escapeHtml((venue ? venue.name : "") + " \u2014 " + (court ? court.label : "")) + "</h4>" +
        "<table><thead><tr>" +
        "<th>Time</th><th>Match</th><th>Division</th><th>Format</th><th>Status</th><th>Work Team</th>" +
        "</tr></thead><tbody>";
      courtMatches.forEach(function (m) {
        var teamA = findTeam(m.teamAId);
        var teamB = findTeam(m.teamBId);
        var division = findDivision(m.divisionId);
        var workTeam = findTeam(m.workTeamId);
        var fmt = getFormatForMatch(m);
        html += "<tr>" +
          "<td>" + escapeHtml(m.startTime ? formatDateTime(m.startTime) : "TBD") + "</td>" +
          "<td><strong>" + escapeHtml((teamA ? teamA.name : "TBD") + " vs " + (teamB ? teamB.name : "TBD")) + "</strong></td>" +
          "<td>" + escapeHtml(division ? division.name : "\u2014") + "</td>" +
          "<td>" + escapeHtml(fmt ? fmt.name : "\u2014") + "</td>" +
          "<td>" + renderStatusTag(m.status) + "</td>" +
          "<td>" + escapeHtml(workTeam ? workTeam.name : "\u2014") + "</td>" +
          "</tr>";
      });
      html += "</tbody></table></section>";
    });

    ui.courtScheduleBoard.innerHTML = html;
    renderPrintMeta(document.getElementById("print-meta-court-schedule"), "Court Schedule",
      (findDivision(divisionId) ? findDivision(divisionId).name + " \u2014 " : "") +
      (findVenue(venueId) ? findVenue(venueId).name : "All venues"));
  }

  function renderWorkSheet() {
    var divisionId = ui.matchDivision.value || "";

    var matches = state.matches
      .filter(function (m) {
        return m.workTeamId && (!divisionId || m.divisionId === divisionId);
      })
      .sort(function (a, b) {
        var ta = a.startTime || "";
        var tb = b.startTime || "";
        return ta.localeCompare(tb) || a.roundNumber - b.roundNumber;
      });

    if (!matches.length) {
      ui.workSheetBoard.innerHTML = "";
      return;
    }

    var rows = matches.map(function (m) {
      var teamA = findTeam(m.teamAId);
      var teamB = findTeam(m.teamBId);
      var division = findDivision(m.divisionId);
      var venue = findVenue(m.venueId);
      var court = findCourt(m.venueId, m.courtId);
      var workTeam = findTeam(m.workTeamId);
      return "<tr>" +
        "<td>" + escapeHtml(m.startTime ? formatDateTime(m.startTime) : "TBD") + "</td>" +
        "<td>" + escapeHtml((teamA ? teamA.name : "TBD") + " vs " + (teamB ? teamB.name : "TBD")) + "</td>" +
        "<td>" + escapeHtml(division ? division.name : "\u2014") + "</td>" +
        "<td>" + escapeHtml(venue ? venue.name : "\u2014") + "</td>" +
        "<td>" + escapeHtml(court ? court.label : "\u2014") + "</td>" +
        "<td><strong>" + escapeHtml(workTeam ? workTeam.name : "\u2014") + "</strong></td>" +
        "</tr>";
    }).join("");

    ui.workSheetBoard.innerHTML =
      "<div class='print-meta' id='print-meta-work-sheet'></div>" +
      "<h3>Work Assignments</h3>" +
      "<table><thead><tr>" +
      "<th>Time</th><th>Match</th><th>Division</th><th>Venue</th><th>Court</th><th>Work Team</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table>";

    renderPrintMeta(document.getElementById("print-meta-work-sheet"), "Work Assignments",
      findDivision(divisionId) ? ("Division: " + findDivision(divisionId).name) : "All divisions");
  }

  function renderFinalResults() {
    if (!ui.finalResultsBoard) { return; }
    var divisionId = ui.standingsDivision.value || "";
    if (!divisionId) {
      ui.finalResultsBoard.innerHTML = "";
      return;
    }

    var bracketMatches = getBracketMatches(divisionId);
    var champion = null;
    if (bracketMatches.length) {
      var rounds = groupBracketRounds(bracketMatches);
      var roundNumbers = Object.keys(rounds).map(function (k) { return parseInt(k, 10); }).sort(function (a, b) { return a - b; });
      var finalRound = rounds[roundNumbers[roundNumbers.length - 1]] || [];
      if (finalRound.length === 1 && finalRound[0].winnerId) {
        champion = findTeam(finalRound[0].winnerId);
      }
    }

    var standings = computeStandings(divisionId);
    var html = "<div class='final-results'>";
    if (champion) {
      html += "<div class='champion-banner'><span class='tag complete'>\uD83C\uDFC6 Champion</span> <strong>" + escapeHtml(champion.name) + "</strong></div>";
    }
    if (standings.length) {
      html += "<h4>Final Standings</h4><ol class='final-standings-list'>";
      standings.forEach(function (row) {
        html += "<li>" + escapeHtml(row.team.name) +
          " <small>(" + row.wins + "W\u2013" + row.losses + "L)</small></li>";
      });
      html += "</ol>";
    }
    html += "</div>";
    ui.finalResultsBoard.innerHTML = standings.length || champion ? html : "";
  }

  function handlePrintCourtSchedule() {
    renderCourtSchedule();
    if (!ui.courtScheduleBoard.innerHTML) {
      window.alert("No assigned matches to display. Assign venues and courts to matches first.");
      return;
    }
    setPrintContext("court-schedule");
    window.print();
    clearPrintContext();
  }

  function handlePrintWorkSheet() {
    renderWorkSheet();
    if (!ui.workSheetBoard.innerHTML) {
      window.alert("No work assignments to print. Auto-assign or manually assign work teams first.");
      return;
    }
    setPrintContext("work-sheet");
    window.print();
    clearPrintContext();
  }

  // ── Spec 14: Teams CSV Import / Export ───────────────────────────────────

  var _teamImportRows = []; // staging area for parsed rows

  function handleExportTeamsCsv() {
    var rows = state.teams
      .slice()
      .sort(compareTeams)
      .map(function (team) {
        var division = findDivision(team.divisionId);
        return [
          csvCell(team.name),
          csvCell(team.club || ""),
          csvCell(team.coach || ""),
          csvCell(division ? division.name : ""),
          csvCell(team.seed || "")
        ].join(",");
      });
    var header = "name,club,coach,division,seed";
    downloadCsv("teams.csv", header + "\n" + rows.join("\n"));
  }

  function handleDownloadTeamsTemplate() {
    var divisionNames = state.divisions.map(function (d) { return d.name; }).join(" | ");
    var comment = divisionNames ? "# Available divisions: " + divisionNames + "\n" : "";
    var example = "Example Team A,Example Club,Coach Name," +
      (state.divisions[0] ? state.divisions[0].name : "Division Name") + ",1\n" +
      "Example Team B,,,," ;
    downloadCsv("teams_template.csv", comment + "name,club,coach,division,seed\n" + example);
  }

  function parseCsvRows(text) {
    // Minimal RFC-4180 CSV parser (handles quoted fields with embedded commas/newlines)
    var results = [];
    var lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    lines.forEach(function (line) {
      if (!line.trim() || line.trim().charAt(0) === "#") { return; }
      var row = [];
      var col = "";
      var inQuotes = false;
      for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (inQuotes) {
          if (ch === '"' && line[i + 1] === '"') { col += '"'; i++; }
          else if (ch === '"') { inQuotes = false; }
          else { col += ch; }
        } else {
          if (ch === '"') { inQuotes = true; }
          else if (ch === ",") { row.push(col.trim()); col = ""; }
          else { col += ch; }
        }
      }
      row.push(col.trim());
      results.push(row);
    });
    return results;
  }

  function handleTeamCsvFile(event) {
    var file = event.target.files[0];
    if (!file) { return; }
    var reader = new FileReader();
    reader.onload = function (e) {
      var text = e.target.result;
      _teamImportRows = parseTeamCsvRows(text);
      renderTeamImportPreview();
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function parseTeamCsvRows(text) {
    var all = parseCsvRows(text);
    if (!all.length) { return []; }

    // Detect header row
    var headerRow = all[0].map(function (h) { return h.toLowerCase(); });
    var nameIdx = headerRow.indexOf("name");
    var clubIdx = headerRow.indexOf("club");
    var coachIdx = headerRow.indexOf("coach");
    var divIdx = headerRow.indexOf("division");
    var seedIdx = headerRow.indexOf("seed");

    // If no recognised header, assume positional: name,club,coach,division,seed
    var hasHeader = nameIdx !== -1;
    if (!hasHeader) {
      nameIdx = 0; clubIdx = 1; coachIdx = 2; divIdx = 3; seedIdx = 4;
    }

    var dataRows = hasHeader ? all.slice(1) : all;
    var existingNames = state.teams.map(function (t) { return t.name.toLowerCase(); });

    return dataRows
      .filter(function (row) { return row.some(function (c) { return c; }); }) // skip blank rows
      .map(function (row) {
        var name = (row[nameIdx] || "").trim();
        var club = clubIdx >= 0 ? (row[clubIdx] || "").trim() : "";
        var coach = coachIdx >= 0 ? (row[coachIdx] || "").trim() : "";
        var divisionName = divIdx >= 0 ? (row[divIdx] || "").trim() : "";
        var seedRaw = seedIdx >= 0 ? (row[seedIdx] || "").trim() : "";

        var warnings = [];
        var errors = [];

        if (!name) {
          errors.push("Name is required.");
        } else if (existingNames.indexOf(name.toLowerCase()) !== -1) {
          warnings.push("Team \"" + name + "\" already exists and will be skipped.");
        }

        var division = null;
        if (divisionName) {
          division = state.divisions.find(function (d) {
            return d.name.toLowerCase() === divisionName.toLowerCase();
          });
          if (!division) {
            warnings.push("Division \"" + divisionName + "\" not found \u2014 team will be added without a division.");
          }
        }

        var seed = null;
        if (seedRaw) {
          seed = parseInt(seedRaw, 10);
          if (isNaN(seed) || seed < 1) {
            warnings.push("Seed \"" + seedRaw + "\" is invalid and will be ignored.");
            seed = null;
          }
        }

        return {
          name: name,
          club: club,
          coach: coach,
          divisionName: divisionName,
          divisionId: division ? division.id : null,
          seed: seed,
          warnings: warnings,
          errors: errors
        };
      });
  }

  function renderTeamImportPreview() {
    var rows = _teamImportRows;
    if (!rows.length) {
      ui.csvImportPreview.innerHTML = "<p>No rows found in file.</p>";
      return;
    }

    var validCount = rows.filter(function (r) { return !r.errors.length && !(r.warnings.some(function (w) { return w.indexOf("already exists") !== -1; })); }).length;

    var tableRows = rows.map(function (r) {
      var status = r.errors.length ? "\u274C" : (r.warnings.length ? "\u26A0\uFE0F" : "\u2714\uFE0F");
      var notes = r.errors.concat(r.warnings).map(function (w) { return "<li>" + escapeHtml(w) + "</li>"; }).join("");
      return "<tr>" +
        "<td>" + status + "</td>" +
        "<td>" + escapeHtml(r.name || "\u2014") + "</td>" +
        "<td>" + escapeHtml(r.club || "\u2014") + "</td>" +
        "<td>" + escapeHtml(r.divisionName || "\u2014") + "</td>" +
        "<td>" + (r.seed || "\u2014") + "</td>" +
        "<td><ul style='margin:0;padding-left:1.2rem'>" + notes + "</ul></td>" +
        "</tr>";
    }).join("");

    ui.csvImportPreview.innerHTML =
      "<p><strong>" + validCount + " of " + rows.length + " rows will be added.</strong></p>" +
      "<div style='overflow-x:auto'><table class='csv-preview-table'><thead><tr>" +
      "<th></th><th>Name</th><th>Club</th><th>Division</th><th>Seed</th><th>Notes</th>" +
      "</tr></thead><tbody>" + tableRows + "</tbody></table></div>" +
      (validCount > 0
        ? "<div class='form-actions' style='margin-top:0.75rem'>" +
          "<button type='button' id='apply-team-import'>Apply Import (" + validCount + " teams)</button>" +
          "<button type='button' id='cancel-team-import' class='secondary'>Cancel</button>" +
          "</div>"
        : "<p>No valid rows to import.</p>");

    document.getElementById("apply-team-import") &&
      document.getElementById("apply-team-import").addEventListener("click", handleApplyTeamImport);
    document.getElementById("cancel-team-import") &&
      document.getElementById("cancel-team-import").addEventListener("click", function () {
        _teamImportRows = [];
        ui.csvImportPreview.innerHTML = "";
      });
  }

  function handleApplyTeamImport() {
    var added = 0;
    _teamImportRows.forEach(function (row) {
      if (row.errors.length) { return; }
      if (row.warnings.some(function (w) { return w.indexOf("already exists") !== -1; })) { return; }
      state.teams.push({
        id: generateId(),
        name: row.name,
        club: row.club,
        coach: row.coach,
        divisionId: row.divisionId || (state.divisions[0] ? state.divisions[0].id : null),
        seed: row.seed
      });
      added++;
    });
    _teamImportRows = [];
    ui.csvImportPreview.innerHTML = "<p>\u2714\uFE0F " + added + " team" + (added === 1 ? "" : "s") + " imported successfully.</p>";
    saveState();
    renderAll();
  }

  // ─────────────────────────────────────────────────────────────────────────

  function handleExportMatchesCsv() {
    var divisionId = ui.matchDivision.value || "";
    var rows = state.matches
      .filter(function (m) { return !divisionId || m.divisionId === divisionId; })
      .map(function (m) {
        var teamA = findTeam(m.teamAId);
        var teamB = findTeam(m.teamBId);
        var winner = findTeam(m.winnerId);
        var division = findDivision(m.divisionId);
        var venue = findVenue(m.venueId);
        var court = findCourt(m.venueId, m.courtId);
        var workTeam = findTeam(m.workTeamId);
        var fmt = getFormatForMatch(m);
        var sets = m.setScores.map(function (s) { return s.teamAScore + "-" + s.teamBScore; }).join(" | ");
        return [
          csvCell(division ? division.name : ""),
          csvCell(m.stage),
          csvCell(m.roundNumber),
          csvCell(teamA ? teamA.name : "TBD"),
          csvCell(teamB ? teamB.name : "TBD"),
          csvCell(venue ? venue.name : ""),
          csvCell(court ? court.label : ""),
          csvCell(m.startTime ? formatDateTime(m.startTime) : ""),
          csvCell(fmt ? fmt.name : ""),
          csvCell(m.status),
          csvCell(sets),
          csvCell(winner ? winner.name : ""),
          csvCell(workTeam ? workTeam.name : "")
        ].join(",");
      });
    var header = "Division,Stage,Round,Team A,Team B,Venue,Court,Start Time,Format,Status,Sets,Winner,Work Team";
    downloadCsv("matches.csv", header + "\n" + rows.join("\n"));
  }

  function handleExportStandingsCsv() {
    var divisionId = ui.standingsDivision.value || "";
    if (!divisionId) {
      window.alert("Select a division first.");
      return;
    }
    var division = findDivision(divisionId);
    var rows = computeStandings(divisionId).map(function (row, i) {
      return [
        csvCell(i + 1),
        csvCell(row.team.name),
        csvCell(row.wins),
        csvCell(row.losses),
        csvCell(row.setsWon + "-" + row.setsLost),
        csvCell(row.pointsFor + "-" + row.pointsAgainst)
      ].join(",");
    });
    var header = "Rank,Team,Wins,Losses,Sets,Points";
    downloadCsv((division ? division.name.replace(/\s+/g, "_") : "division") + "_standings.csv",
      header + "\n" + rows.join("\n"));
  }

  function csvCell(value) {
    var s = String(value === null || value === undefined ? "" : value);
    if (s.indexOf(",") !== -1 || s.indexOf('"') !== -1 || s.indexOf("\n") !== -1) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function downloadCsv(filename, content) {
    var blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─────────────────────────────────────────────────────────────────────────
  function handlePrintMatches() {
    preparePrintMeta("matches");
    setPrintContext("matches");
    window.print();
  }

  function handlePrintTeamSchedule() {
    preparePrintMeta("team-schedule");
    setPrintContext("team-schedule");
    window.print();
  }

  function handlePrintStandings() {
    preparePrintMeta("standings");
    setPrintContext("standings");
    window.print();
  }

  function handlePrintBrackets() {
    preparePrintMeta("brackets");
    setPrintContext("brackets");
    window.print();
  }

  function handleExportBracket() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) {
      window.alert("Select a division first.");
      return;
    }

    var division = findDivision(divisionId);
    var bracketMatches = getBracketMatches(divisionId)
      .slice()
      .sort(function (a, b) {
        if (a.roundNumber !== b.roundNumber) {
          return a.roundNumber - b.roundNumber;
        }
        return a.indexInRound - b.indexInRound;
      });

    if (!bracketMatches.length) {
      window.alert("No bracket exists for this division yet.");
      return;
    }

    var payload = {
      tournament: {
        id: state.tournament.id,
        name: state.tournament.name,
        startDate: state.tournament.startDate,
        endDate: state.tournament.endDate
      },
      division: division ? { id: division.id, name: division.name } : { id: divisionId, name: "Unknown" },
      exportedAt: new Date().toISOString(),
      matches: bracketMatches
    };

    var fileNameBase = sanitizeFileName((division ? division.name : "division") + "-bracket");
    downloadJson(payload, fileNameBase + ".json");
  }

  function handleImportBracket(event) {
    var file = event.target.files[0];
    if (!file) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function (loadEvent) {
      try {
        var incoming = JSON.parse(loadEvent.target.result);
        if (!isValidBracketImport(incoming)) {
          window.alert("Invalid bracket import file.");
          return;
        }

        var selectedDivisionId = ui.bracketDivision.value || "";
        var fileDivisionId = incoming.division && incoming.division.id ? incoming.division.id : "";
        var targetDivisionId = selectedDivisionId || fileDivisionId;
        if (!targetDivisionId) {
          window.alert("Select a division before importing bracket data.");
          return;
        }

        var targetDivision = findDivision(targetDivisionId);
        if (!targetDivision) {
          window.alert("Selected division was not found.");
          return;
        }

        if (selectedDivisionId && fileDivisionId && selectedDivisionId !== fileDivisionId) {
          var fileDivisionName = incoming.division.name || fileDivisionId;
          if (!window.confirm("Imported bracket is for " + fileDivisionName + ". Apply it to currently selected division anyway?")) {
            return;
          }
        }

        var normalizedMatches = normalizeImportedBracketMatches(incoming.matches, targetDivisionId);
        if (!normalizedMatches.length) {
          window.alert("Imported bracket did not contain usable matches.");
          return;
        }

        state.matches = state.matches.filter(function (match) {
          return !(match.divisionId === targetDivisionId && match.stage === "bracket");
        }).concat(normalizedMatches);

        ui.bracketDivision.value = targetDivisionId;
        recomputeBracketProgression(targetDivisionId);
        saveState();
        renderAll();
      } catch (error) {
        window.alert("Could not read bracket JSON file.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function handleMatchTableSubmit(event) {
    var assignmentForm = event.target.closest("form.assignment-form");
    if (assignmentForm) {
      handleAssignmentSubmit(event, assignmentForm);
      return;
    }

    var forfeitForm = event.target.closest("form.forfeit-form");
    if (forfeitForm) {
      handleForfeitSubmit(event, forfeitForm);
      return;
    }

    var scoreForm = event.target.closest("form.score-form");
    if (!scoreForm) { return; }
    handleScoreSubmit(event, scoreForm);
  }

  function handleForfeitSubmit(event, form) {
    event.preventDefault();
    var matchId = form.getAttribute("data-match-id");
    var match = state.matches.find(function (m) { return m.id === matchId; });
    if (!match) { return; }

    var forfeitingTeamId = form.querySelector("select[name='forfeitTeam']").value;
    if (!forfeitingTeamId) { return; }

    match.winnerId = (forfeitingTeamId === match.teamAId) ? match.teamBId : match.teamAId;
    match.loserId = forfeitingTeamId;
    match.status = "completed";
    match.forfeited = true;
    match.setScores = [];
    forfeitMatchId = null;

    if (match.stage === "bracket") {
      recomputeBracketProgression(match.divisionId);
    }
    saveState();
    renderAll();
  }

  function handleScoreSubmit(event, form) {
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
    if (match.stage === "bracket") {
      recomputeBracketProgression(match.divisionId);
    }
    saveState();
    renderAll();
  }

  function handleAssignmentSubmit(event, form) {
    event.preventDefault();

    var matchId = form.getAttribute("data-match-id");
    var match = state.matches.find(function (item) {
      return item.id === matchId;
    });
    if (!match) {
      return;
    }

    var courtValue = form.elements.assignmentCourt.value;
    var startValue = form.elements.assignmentStart.value;
    if (!courtValue || !startValue) {
      window.alert("Select a court and start time.");
      return;
    }

    var parts = courtValue.split("|");
    if (parts.length !== 2) {
      window.alert("Invalid assignment selection.");
      return;
    }

    var venue = findVenue(parts[0]);
    var court = findCourt(parts[0], parts[1]);
    if (!venue || !court) {
      window.alert("Selected venue/court no longer exists.");
      return;
    }

    var parsedDate = new Date(startValue);
    if (isNaN(parsedDate.getTime())) {
      window.alert("Invalid date/time format.");
      return;
    }

    match.venueId = venue.id;
    match.courtId = court.id;
    match.startTime = parsedDate.toISOString();
    if (!Number.isFinite(match.durationMinutes)) {
      match.durationMinutes = Math.max(10, parseInt(ui.scheduleSlotMinutes.value, 10) || DEFAULT_MATCH_MINUTES);
    }
    assignmentEditMatchId = null;
    saveState();
    renderAll();
  }

  function handleMatchActions(event) {
    var button = event.target.closest("button[data-action]");
    if (!button) { return; }

    var action = button.getAttribute("data-action");
    var knownActions = [
      "clear-score", "edit-assignment", "clear-assignment", "cancel-assignment",
      "edit-work-team", "clear-work-team", "cancel-work-team",
      "lock-match", "unlock-match", "forfeit-match", "cancel-forfeit"
    ];
    if (knownActions.indexOf(action) === -1) { return; }

    var matchId = button.getAttribute("data-match-id");
    var match = state.matches.find(function (item) { return item.id === matchId; });
    if (!match) { return; }

    if (action === "edit-assignment") {
      assignmentEditMatchId = match.id;
      renderMatches();
      return;
    }
    if (action === "cancel-assignment") {
      assignmentEditMatchId = null;
      renderMatches();
      return;
    }
    if (action === "clear-assignment") {
      match.venueId = null;
      match.courtId = null;
      match.startTime = null;
      assignmentEditMatchId = null;
      saveState();
      renderAll();
      return;
    }
    if (action === "edit-work-team") {
      workEditMatchId = match.id;
      renderMatches();
      return;
    }
    if (action === "cancel-work-team") {
      workEditMatchId = null;
      renderMatches();
      return;
    }
    if (action === "clear-work-team") {
      match.workTeamId = null;
      workEditMatchId = null;
      saveState();
      renderAll();
      return;
    }
    if (action === "lock-match") {
      match.locked = true;
      saveState();
      renderMatches();
      renderDashboardStats();
      return;
    }
    if (action === "unlock-match") {
      match.locked = false;
      saveState();
      renderMatches();
      renderDashboardStats();
      return;
    }
    if (action === "forfeit-match") {
      forfeitMatchId = match.id;
      renderMatches();
      return;
    }
    if (action === "cancel-forfeit") {
      forfeitMatchId = null;
      renderMatches();
      return;
    }
    // clear-score: reset match scores and status
    match.setScores = [];
    match.winnerId = null;
    match.loserId = null;
    match.status = "scheduled";
    if (match.stage === "bracket") {
      recomputeBracketProgression(match.divisionId);
    }
    saveState();
    renderAll();
  }

  function handleMatchTableChange(event) {
    var select = event.target.closest("select[data-action='set-work-team']");
    if (!select) { return; }
    var matchId = select.getAttribute("data-match-id");
    var match = state.matches.find(function (m) { return m.id === matchId; });
    if (!match) { return; }
    match.workTeamId = select.value || null;
    workEditMatchId = null;
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
    renderBrackets();
    renderTeamSchedule();
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
    var selectedBracketScheduleVenue = ui.bracketScheduleVenue.value;
    var selectedVenueFilter = ui.matchVenueFilter.value;
    var selectedScheduleTeam = ui.teamScheduleTeam.value;
    var selectedBracketDivision = ui.bracketDivision.value;
    var selectedPublicVenue = ui.publicVenueFilter.value;
    var selectedPublicDivision = ui.publicDivisionFilter.value;

    var divisionOptions = state.divisions.map(function (division) {
      return optionHtml(division.id, division.name);
    }).join("");

    ui.teamDivision.innerHTML = divisionOptions;
    ui.matchDivision.innerHTML = "<option value=\"\">Select division</option>" + divisionOptions;
    ui.standingsDivision.innerHTML = "<option value=\"\">Select division</option>" + divisionOptions;
    ui.bracketDivision.innerHTML = "<option value=\"\">Select division</option>" + divisionOptions;

    var venueOptions = state.venues.map(function (venue) {
      return optionHtml(venue.id, venue.name);
    }).join("");
    ui.scheduleVenue.innerHTML = "<option value=\"\">Select venue</option>" + venueOptions;
    ui.bracketScheduleVenue.innerHTML = "<option value=\"\">Select venue</option>" + venueOptions;
    ui.matchVenueFilter.innerHTML = "<option value=\"\">All venues</option>" + venueOptions;
    ui.publicVenueFilter.innerHTML = "<option value=\"\">All venues</option>" + venueOptions;

    var divisionOptionsAll = "<option value=\"\">All divisions</option>" + divisionOptions;
    ui.publicDivisionFilter.innerHTML = divisionOptionsAll;

    var teamOptions = state.teams
      .slice()
      .sort(compareTeams)
      .map(function (team) {
        var division = findDivision(team.divisionId);
        var label = team.name + (division ? " (" + division.name + ")" : "");
        return optionHtml(team.id, label);
      })
      .join("");
    ui.teamScheduleTeam.innerHTML = "<option value=\"\">Select team</option>" + teamOptions;

    restoreSelectValue(ui.teamDivision, selectedTeamDivision);
    restoreSelectValue(ui.matchDivision, selectedMatchDivision);
    restoreSelectValue(ui.standingsDivision, selectedStandingsDivision);
    restoreSelectValue(ui.scheduleVenue, selectedScheduleVenue);
    restoreSelectValue(ui.bracketScheduleVenue, selectedBracketScheduleVenue);
    restoreSelectValue(ui.matchVenueFilter, selectedVenueFilter);
    restoreSelectValue(ui.teamScheduleTeam, selectedScheduleTeam);
    restoreSelectValue(ui.bracketDivision, selectedBracketDivision);
    restoreSelectValue(ui.publicVenueFilter, selectedPublicVenue);
    restoreSelectValue(ui.publicDivisionFilter, selectedPublicDivision);
  }

  function renderTeamSchedule() {
    var teamId = ui.teamScheduleTeam.value;
    if (!teamId) {
      ui.teamScheduleBody.innerHTML = "<tr><td colspan=\"7\">Select a team to view schedule.</td></tr>";
      renderPrintMeta(ui.printMetaTeamSchedule, "Team Schedule", "Select a team to print a team schedule.");
      return;
    }

    var selectedTeam = findTeam(teamId);
    if (!selectedTeam) {
      ui.teamScheduleBody.innerHTML = "<tr><td colspan=\"7\">Selected team was not found.</td></tr>";
      renderPrintMeta(ui.printMetaTeamSchedule, "Team Schedule", "Selected team was not found.");
      return;
    }

    var playingMatches = state.matches
      .filter(function (match) {
        return match.teamAId === teamId || match.teamBId === teamId;
      });

    var workingMatches = state.matches
      .filter(function (match) {
        return match.workTeamId === teamId;
      });

    var allItems = playingMatches.concat(
      workingMatches.filter(function (wm) {
        return !playingMatches.some(function (pm) { return pm.id === wm.id; });
      })
    ).sort(function (a, b) {
        var ta = a.startTime || "9999";
        var tb = b.startTime || "9999";
        if (ta !== tb) {
          return ta.localeCompare(tb);
        }
        return a.roundNumber - b.roundNumber;
      });

    if (!allItems.length) {
      ui.teamScheduleBody.innerHTML = "<tr><td colspan=\"7\">No matches scheduled for this team yet.</td></tr>";
      renderPrintMeta(ui.printMetaTeamSchedule, "Team Schedule", getTeamSchedulePrintDetail(selectedTeam));
      return;
    }

    ui.teamScheduleBody.innerHTML = allItems
      .map(function (match) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        var division = findDivision(match.divisionId);
        var venue = findVenue(match.venueId);
        var court = findCourt(match.venueId, match.courtId);
        var isWorking = match.workTeamId === teamId;
        var isPlaying = match.teamAId === teamId || match.teamBId === teamId;
        var roleCell = isWorking && !isPlaying
          ? "<span class='tag work-tag'>Work</span>"
          : (isWorking ? "<span class='tag work-tag'>Work</span> <span class='tag'>Play</span>" : "<span class='tag'>Play</span>");
        return "<tr>" +
          "<td>" + escapeHtml(match.startTime ? formatDateTime(match.startTime) : "Unscheduled") + "</td>" +
          "<td>" + escapeHtml((teamA ? teamA.name : "TBD") + " vs " + (teamB ? teamB.name : "TBD")) + "</td>" +
          "<td>" + escapeHtml(division ? division.name : "-") + "</td>" +
          "<td>" + escapeHtml(venue ? venue.name : "-") + "</td>" +
          "<td>" + escapeHtml(court ? court.label : "-") + "</td>" +
          "<td>" + renderStatusTag(match.status, match) + "</td>" +
          "<td>" + roleCell + "</td>" +
          "</tr>";
      })
      .join("");

    renderPrintMeta(ui.printMetaTeamSchedule, "Team Schedule", getTeamSchedulePrintDetail(selectedTeam));
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
    renderAdminAlerts();
    renderDivisionStatus();
  }

  function renderAdminAlerts() {
    if (!ui.adminAlerts) { return; }
    var alerts = [];

    var inProgress = state.matches.filter(function (m) { return m.status === "in_progress"; }).length;
    if (inProgress) {
      alerts.push({ level: "info", text: inProgress + " match" + (inProgress === 1 ? "" : "es") + " currently in progress." });
    }

    var missingWork = state.matches.filter(function (m) {
      return m.status === "scheduled" && m.venueId && !m.workTeamId;
    }).length;
    if (missingWork) {
      alerts.push({ level: "warn", text: missingWork + " assigned match" + (missingWork === 1 ? "" : "es") + " missing a work team." });
    }

    var conflicts = [];
    state.divisions.forEach(function (div) {
      conflicts = conflicts.concat(computeWorkConflicts(div.id));
    });
    if (conflicts.length) {
      alerts.push({ level: "error", text: conflicts.length + " work assignment conflict" + (conflicts.length === 1 ? "" : "s") + " detected." });
    }

    var locked = state.matches.filter(function (m) { return m.locked; }).length;
    if (locked) {
      alerts.push({ level: "info", text: locked + " match" + (locked === 1 ? "" : "es") + " locked against edits." });
    }

    if (!alerts.length) {
      ui.adminAlerts.innerHTML = "";
      return;
    }

    ui.adminAlerts.innerHTML = "<h3 style='margin:0 0 0.6rem'>Alerts</h3>" +
      alerts.map(function (a) {
        return "<div class='admin-alert admin-alert-" + a.level + "'>" + escapeHtml(a.text) + "</div>";
      }).join("");
  }

  function renderDivisionStatus() {
    if (!ui.divisionStatusBoard) { return; }
    if (!state.divisions.length) {
      ui.divisionStatusBoard.innerHTML = "";
      return;
    }

    var rows = state.divisions.map(function (div) {
      var teams = getDivisionTeams(div.id);
      var allMatches = state.matches.filter(function (m) { return m.divisionId === div.id; });
      var poolMatches = allMatches.filter(function (m) { return m.stage === "pool"; });
      var bracketMatches = allMatches.filter(function (m) { return m.stage === "bracket"; });
      var completedAll = allMatches.filter(function (m) { return m.status === "completed"; }).length;

      var poolsGenerated = poolMatches.length > 0;
      var bracketGenerated = bracketMatches.length > 0;

      var champion = null;
      if (bracketMatches.length) {
        var rounds = groupBracketRounds(bracketMatches);
        var roundNumbers = Object.keys(rounds).map(function (k) { return parseInt(k, 10); }).sort(function (a, b) { return a - b; });
        var finalRound = rounds[roundNumbers[roundNumbers.length - 1]] || [];
        if (finalRound.length === 1 && finalRound[0].winnerId) {
          champion = findTeam(finalRound[0].winnerId);
        }
      }

      var statusLabel = "Setup";
      if (champion) { statusLabel = "Complete"; }
      else if (bracketMatches.some(function (m) { return m.status !== "scheduled"; })) { statusLabel = "Bracket Play"; }
      else if (bracketGenerated) { statusLabel = "Bracket Ready"; }
      else if (poolMatches.some(function (m) { return m.status !== "scheduled"; })) { statusLabel = "Pool Play"; }
      else if (poolsGenerated) { statusLabel = "Pools Ready"; }
      else if (teams.length > 0) { statusLabel = "Teams Added"; }

      return "<tr>" +
        "<td><strong>" + escapeHtml(div.name) + "</strong></td>" +
        "<td>" + teams.length + "</td>" +
        "<td>" + (poolsGenerated ? "\u2713" : "\u2014") + "</td>" +
        "<td>" + (bracketGenerated ? "\u2713" : "\u2014") + "</td>" +
        "<td>" + (allMatches.length ? (completedAll + "/" + allMatches.length) : "\u2014") + "</td>" +
        "<td><span class='tag" + (champion ? " complete" : "") + "'>" + escapeHtml(statusLabel) + "</span></td>" +
        "<td>" + (champion ? "<strong>" + escapeHtml(champion.name) + "</strong>" : "\u2014") + "</td>" +
        "</tr>";
    }).join("");

    ui.divisionStatusBoard.innerHTML =
      "<h3 style='margin:0 0 0.6rem'>Division Status</h3>" +
      "<table><thead><tr>" +
      "<th>Division</th><th>Teams</th><th>Pools</th><th>Bracket</th><th>Matches</th><th>Status</th><th>Champion</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table>";
  }

  function renderDivisions() {
    ui.divisionTableBody.innerHTML = state.divisions
      .map(function (division) {
        var count = getDivisionTeams(division.id).length;
        var fmt = findMatchFormat(division.formatId);
        return "<tr>" +
          "<td>" + escapeHtml(division.name) + "</td>" +
          "<td>" + escapeHtml(fmt ? fmt.name : "\u2014") + "</td>" +
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
    var conflictData = computeScheduleConflicts(state.matches);
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

    renderMatchConflicts(matches, conflictData);

    ui.matchTableBody.innerHTML = matches
      .map(function (match) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        var winner = findTeam(match.winnerId);
        var hasConflict = Boolean(conflictData.byMatchId[match.id]);

        return "<tr>" +
          "<td><strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " + escapeHtml(teamB ? teamB.name : "TBD") + "</strong><br><small>" + escapeHtml(getMatchPhaseLabel(match)) + "</small></td>" +
          "<td>" + renderStatusTag(match.status, match) + "</td>" +
          "<td>" + renderAssignment(match) + (hasConflict ? renderConflictBadge() : "") + "</td>" +
          "<td>" + renderSetSummary(match) + "</td>" +
          "<td>" + escapeHtml(winner ? winner.name : "-") + "</td>" +
          "<td class=\"match-work-col no-print\">" + renderWorkActions(match) + "</td>" +
          "<td class=\"match-update-col\">" + renderAdminActions(match) + renderAssignmentActions(match) + renderScoreForm(match) + "</td>" +
          "</tr>";
      })
      .join("");

      var division = findDivision(divisionId);
      renderPrintMeta(ui.printMetaMatches, "Match Schedule", division ? ("Division: " + division.name) : "All divisions");
  }

  function renderMatchConflicts(filteredMatches, conflictData) {
    var filteredIds = filteredMatches.reduce(function (map, match) {
      map[match.id] = true;
      return map;
    }, {});

    var visible = conflictData.entries.filter(function (entry) {
      return entry.matchIds.some(function (id) {
        return filteredIds[id];
      });
    });

    if (!visible.length) {
      ui.matchConflicts.innerHTML = "<p><strong>No scheduling conflicts detected</strong> for the current filters.</p>";
      return;
    }

    ui.matchConflicts.innerHTML = "<h3>Scheduling Warnings</h3><ul class=\"warning-list\">" + visible
      .map(function (entry) {
        return "<li>" + escapeHtml(entry.message) + "</li>";
      })
      .join("") + "</ul>";

    // Work conflicts for the selected division
    var divisionId = ui.matchDivision.value;
    if (divisionId) {
      var workIssues = computeWorkConflicts(divisionId);
      if (workIssues.length) {
        ui.matchConflicts.innerHTML += "<h3>Work Assignment Warnings</h3><ul class=\"warning-list\">" +
          workIssues.map(function (w) { return "<li>" + escapeHtml(w) + "</li>"; }).join("") +
          "</ul>";
      }
    }
  }

  function computeScheduleConflicts(matches) {
    var scheduled = matches.filter(function (match) {
      return Boolean(match.startTime);
    });

    var entries = [];
    var byMatchId = {};

    for (var i = 0; i < scheduled.length; i += 1) {
      for (var j = i + 1; j < scheduled.length; j += 1) {
        var a = scheduled[i];
        var b = scheduled[j];
        if (!matchesOverlap(a, b)) {
          continue;
        }

        if (a.venueId && b.venueId && a.courtId && b.courtId && a.venueId === b.venueId && a.courtId === b.courtId) {
          addConflict(entries, byMatchId, [a.id, b.id],
            "Court overlap: " + getMatchLabel(a) + " overlaps with " + getMatchLabel(b) + ".");
        }

        var shared = sharedTeams(a, b);
        shared.forEach(function (teamId) {
          var team = findTeam(teamId);
          var teamName = team ? team.name : "Unknown team";
          addConflict(entries, byMatchId, [a.id, b.id],
            "Team overlap: " + teamName + " has overlapping matches (" + getMatchLabel(a) + " and " + getMatchLabel(b) + ").");
        });
      }
    }

    return { entries: entries, byMatchId: byMatchId };
  }

  function matchesOverlap(first, second) {
    var firstStart = new Date(first.startTime);
    var secondStart = new Date(second.startTime);
    if (isNaN(firstStart.getTime()) || isNaN(secondStart.getTime())) {
      return false;
    }

    var firstEnd = new Date(firstStart.getTime() + getMatchDurationMinutes(first) * 60000);
    var secondEnd = new Date(secondStart.getTime() + getMatchDurationMinutes(second) * 60000);

    return firstStart < secondEnd && secondStart < firstEnd;
  }

  function findMatchFormat(formatId) {
    if (!formatId) { return null; }
    return MATCH_FORMATS.filter(function (f) { return f.id === formatId; })[0] || null;
  }

  function getFormatForMatch(match) {
    var division = findDivision(match.divisionId);
    return division ? findMatchFormat(division.formatId) : null;
  }

  function getMaxSets(fmt) {
    if (!fmt) { return 3; }
    return fmt.setsToWin * 2 - 1;
  }

  function validateSetScores(sets, fmt) {
    if (!fmt || !sets.length) { return []; }
    var warnings = [];
    var maxSets = getMaxSets(fmt);
    if (sets.length > maxSets) {
      warnings.push("More sets entered (" + sets.length + ") than the format allows (" + maxSets + ").");
    }
    sets.forEach(function (set, i) {
      var target = i < fmt.setPoints.length ? fmt.setPoints[i] : fmt.setPoints[fmt.setPoints.length - 1];
      var cap = (i === fmt.setPoints.length - 1 && fmt.decidingSetCap) ? fmt.decidingSetCap : fmt.capPoints;
      var hi = Math.max(set.teamAScore, set.teamBScore);
      var lo = Math.min(set.teamAScore, set.teamBScore);
      if (hi < target) {
        warnings.push("Set " + (i + 1) + ": winning score " + hi + " is below the target of " + target + ".");
      }
      if (cap && hi > cap) {
        warnings.push("Set " + (i + 1) + ": score " + hi + " exceeds the cap of " + cap + ".");
      }
      if (fmt.winByTwo && hi >= target && (hi - lo) < 2 && !(cap && hi >= cap)) {
        warnings.push("Set " + (i + 1) + ": score " + set.teamAScore + "-" + set.teamBScore + " does not satisfy win-by-two.");
      }
    });
    return warnings;
  }
  function getMatchDurationMinutes(match) {
    if (Number.isFinite(match.durationMinutes) && match.durationMinutes > 0) {
      return match.durationMinutes;
    }
    return DEFAULT_MATCH_MINUTES;
  }

  function sharedTeams(first, second) {
    var ids = [first.teamAId, first.teamBId];
    return ids.filter(function (id) {
      return id && (second.teamAId === id || second.teamBId === id);
    });
  }

  function addConflict(entries, byMatchId, matchIds, message) {
    entries.push({ matchIds: matchIds, message: message });
    matchIds.forEach(function (id) {
      byMatchId[id] = true;
    });
  }

  // -- Work-team assignment engine ---------------------------------------------

  function autoAssignWorkTeams(divisionId) {
    var divisionTeams = getDivisionTeams(divisionId);
    if (divisionTeams.length < 3) {
      window.alert("Need at least 3 teams in the division to auto-assign work teams.");
      return;
    }

    var matches = state.matches.filter(function (m) {
      return m.divisionId === divisionId;
    }).sort(function (a, b) {
      var ta = a.startTime || "";
      var tb = b.startTime || "";
      if (ta && tb && ta !== tb) { return ta.localeCompare(tb); }
      return a.roundNumber - b.roundNumber;
    });

    var workCount = {};
    divisionTeams.forEach(function (t) { workCount[t.id] = 0; });
    matches.forEach(function (m) {
      if (m.workTeamId) { workCount[m.workTeamId] = (workCount[m.workTeamId] || 0) + 1; }
    });

    matches.forEach(function (match) {
      if (match.workTeamId) { return; }

      var slot = match.startTime || ("round-" + match.roundNumber);

      var busyPlaying = {};
      matches.forEach(function (other) {
        var otherSlot = other.startTime || ("round-" + other.roundNumber);
        if (otherSlot !== slot) { return; }
        if (other.teamAId) { busyPlaying[other.teamAId] = true; }
        if (other.teamBId) { busyPlaying[other.teamBId] = true; }
      });

      var busyWorking = {};
      matches.forEach(function (other) {
        if (!other.workTeamId) { return; }
        var otherSlot = other.startTime || ("round-" + other.roundNumber);
        if (otherSlot !== slot) { return; }
        busyWorking[other.workTeamId] = true;
      });

      var candidates = divisionTeams.filter(function (t) {
        return !busyPlaying[t.id] && !busyWorking[t.id];
      });

      if (!candidates.length) { return; }

      candidates.sort(function (a, b) {
        var diff = (workCount[a.id] || 0) - (workCount[b.id] || 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });

      match.workTeamId = candidates[0].id;
      workCount[candidates[0].id] = (workCount[candidates[0].id] || 0) + 1;
    });
  }

  function computeWorkConflicts(divisionId) {
    var matches = state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.workTeamId;
    });
    var conflicts = [];

    matches.forEach(function (workMatch) {
      var slot = workMatch.startTime || ("round-" + workMatch.roundNumber);
      matches.forEach(function (playMatch) {
        if (playMatch.id === workMatch.id) { return; }
        var playSlot = playMatch.startTime || ("round-" + playMatch.roundNumber);
        if (playSlot !== slot) { return; }
        if (playMatch.teamAId !== workMatch.workTeamId && playMatch.teamBId !== workMatch.workTeamId) { return; }
        var team = findTeam(workMatch.workTeamId);
        conflicts.push((team ? team.name : "Unknown") + " is both playing and working in the same slot (Round " + workMatch.roundNumber + ").");
      });
    });

    return dedupeStrings(conflicts);
  }

  function handleAutoAssignWorkTeams() {
    var divisionId = ui.matchDivision.value;
    if (!divisionId) {
      window.alert("Select a division first.");
      return;
    }
    autoAssignWorkTeams(divisionId);
    saveState();
    renderAll();
  }

  // ---------------------------------------------------------------------------
  function getMatchLabel(match) {
    var a = findTeam(match.teamAId);
    var b = findTeam(match.teamBId);
    var time = match.startTime ? formatDateTime(match.startTime) : "Unscheduled";
    return (a ? a.name : "TBD") + " vs " + (b ? b.name : "TBD") + " at " + time;
  }

  function renderConflictBadge() {
    return "<div><span class=\"tag warning\">conflict</span></div>";
  }

  function renderAssignmentActions(match) {
    if (match.locked) {
      return "<div class='locked-notice'><span class='tag'>\uD83D\uDD12 Locked</span></div>";
    }
    var isEditing = assignmentEditMatchId === match.id;
    var assignLabel = isEditing ? "Editing..." : (match.venueId && match.courtId ? "Edit Assignment" : "Assign");

    return "<div class=\"match-actions\">" +
      "<button type=\"button\" class=\"secondary\" data-action=\"edit-assignment\" data-match-id=\"" + escapeHtml(match.id) + "\">" + escapeHtml(assignLabel) + "</button> " +
      "<button type=\"button\" class=\"secondary\" data-action=\"clear-assignment\" data-match-id=\"" + escapeHtml(match.id) + "\">Clear Assignment</button>" +
      "</div>" +
      (isEditing ? renderInlineAssignmentForm(match) : "");
  }

  function renderInlineAssignmentForm(match) {
    if (!state.venues.length) {
      return "<p><small>Add a venue first to assign this match.</small></p>";
    }

    var selectedKey = (match.venueId && match.courtId) ? (match.venueId + "|" + match.courtId) : "";
    var options = [];
    state.venues.forEach(function (venue) {
      venue.courts.forEach(function (court) {
        var key = venue.id + "|" + court.id;
        var selectedAttr = key === selectedKey ? " selected" : "";
        options.push("<option value=\"" + escapeHtml(key) + "\"" + selectedAttr + ">" +
          escapeHtml(venue.name + " - " + court.label) + "</option>");
      });
    });

    var localValue = match.startTime ? toLocalDateTimeInput(match.startTime) : "";

    return "<form class=\"assignment-form\" data-match-id=\"" + escapeHtml(match.id) + "\">" +
      "<label>Court<select name=\"assignmentCourt\" required><option value=\"\">Select court</option>" + options.join("") + "</select></label>" +
      "<label>Start<input type=\"datetime-local\" name=\"assignmentStart\" value=\"" + escapeHtml(localValue) + "\" required></label>" +
      "<button type=\"submit\">Save Assignment</button>" +
      "<button type=\"button\" class=\"secondary\" data-action=\"cancel-assignment\" data-match-id=\"" + escapeHtml(match.id) + "\">Cancel</button>" +
      "</form>";
  }

  function renderAdminActions(match) {
    var lockAction = match.locked ? "unlock-match" : "lock-match";
    var lockLabel = match.locked ? "\uD83D\uDD13 Unlock" : "\uD83D\uDD12 Lock";
    var lockClass = match.locked ? "secondary" : "secondary";

    var html = "<div class='admin-actions'>" +
      "<button type='button' class='" + lockClass + "' data-action='" + lockAction + "' data-match-id='" + escapeHtml(match.id) + "'>" + lockLabel + "</button>";

    var canForfeit = !match.locked && match.status !== "completed" && (match.teamAId || match.teamBId);
    if (canForfeit) {
      if (forfeitMatchId === match.id) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        html += "<form class='forfeit-form' data-match-id='" + escapeHtml(match.id) + "'>" +
          "<label>Forfeiting team:" +
          "<select name='forfeitTeam' required>" +
          "<option value=''>Select...</option>" +
          (teamA ? "<option value='" + escapeHtml(match.teamAId) + "'>" + escapeHtml(teamA.name) + "</option>" : "") +
          (teamB ? "<option value='" + escapeHtml(match.teamBId) + "'>" + escapeHtml(teamB.name) + "</option>" : "") +
          "</select></label>" +
          "<button type='submit'>Confirm Forfeit</button>" +
          "<button type='button' class='secondary' data-action='cancel-forfeit' data-match-id='" + escapeHtml(match.id) + "'>Cancel</button>" +
          "</form>";
      } else {
        html += " <button type='button' class='secondary' data-action='forfeit-match' data-match-id='" + escapeHtml(match.id) + "'>Forfeit</button>";
      }
    }

    html += "</div>";
    return html;
  }

  function renderStandings() {
    var divisionId = ui.standingsDivision.value || "";
    if (!divisionId) {
      ui.standingsTableBody.innerHTML = "";
      renderPrintMeta(ui.printMetaStandings, "Standings", "Select a division to print standings.");
      return;
    }

    var rows = computeStandings(divisionId);
    var division = findDivision(divisionId);
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

    renderPrintMeta(ui.printMetaStandings, "Standings", division ? ("Division: " + division.name) : "");
  }

  function renderWorkActions(match) {
    var workTeam = findTeam(match.workTeamId);
    var isEditing = workEditMatchId === match.id;

    var label = workTeam
      ? "<span class=\"work-team-label\">" + escapeHtml(workTeam.name) + "</span>"
      : "<span class=\"work-team-label muted\">\u2014</span>";

    var buttons = "<div class=\"work-actions\">" +
      "<button type=\"button\" class=\"secondary\" data-action=\"edit-work-team\" data-match-id=\"" + escapeHtml(match.id) + "\">" +
      (isEditing ? "Editing\u2026" : (match.workTeamId ? "Change" : "Assign Work")) +
      "</button>";

    if (match.workTeamId) {
      buttons += " <button type=\"button\" class=\"secondary\" data-action=\"clear-work-team\" data-match-id=\"" + escapeHtml(match.id) + "\">Clear</button>";
    }
    buttons += "</div>";

    var picker = "";
    if (isEditing) {
      var divisionTeams = getDivisionTeams(match.divisionId);
      var opts = divisionTeams
        .filter(function (t) { return t.id !== match.teamAId && t.id !== match.teamBId; })
        .map(function (t) {
          var sel = t.id === match.workTeamId ? " selected" : "";
          return "<option value=\"" + escapeHtml(t.id) + "\"" + sel + ">" + escapeHtml(t.name) + "</option>";
        }).join("");
      picker = "<div class=\"work-picker\">" +
        "<select data-action=\"set-work-team\" data-match-id=\"" + escapeHtml(match.id) + "\">" +
        "<option value=\"\">\u2014 none \u2014</option>" + opts +
        "</select>" +
        " <button type=\"button\" class=\"secondary\" data-action=\"cancel-work-team\" data-match-id=\"" + escapeHtml(match.id) + "\">Cancel</button>" +
        "</div>";
    }

    return label + buttons + picker;
  }
  function renderBrackets() {
    var divisionId = ui.bracketDivision.value || "";
    if (!divisionId) {
      ui.bracketBoard.innerHTML = "<p>Select a division to view or generate a bracket.</p>";
      renderPrintMeta(ui.printMetaBrackets, "Bracket", "Select a division to print a bracket.");
      return;
    }

    var division = findDivision(divisionId);
    var bracketMatches = getBracketMatches(divisionId);
    if (!bracketMatches.length) {
      ui.bracketBoard.innerHTML = "<p>No bracket yet for " + escapeHtml(division ? division.name : "this division") + ". Generate a single-elimination bracket to begin.</p>";
      renderPrintMeta(ui.printMetaBrackets, "Bracket", division ? ("Division: " + division.name) : "");
      return;
    }

    var rounds = groupBracketRounds(bracketMatches);
    var integrityIssues = computeBracketIntegrityIssues(divisionId);
    var roundKeys = Object.keys(rounds).map(function (key) {
      return parseInt(key, 10);
    }).sort(function (a, b) {
      return a - b;
    });

    var roundHtml = roundKeys.map(function (roundNumber) {
      var matches = rounds[roundNumber]
        .slice()
        .sort(function (a, b) {
          return a.indexInRound - b.indexInRound;
        });

      var title = roundNumber === roundKeys.length ? "Final" : ("Round " + roundNumber);
      var items = matches.map(function (match) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        var winner = findTeam(match.winnerId);
        return "<div class=\"bracket-match\">" +
          "<strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " + escapeHtml(teamB ? teamB.name : "TBD") + "</strong>" +
          "<div class=\"bracket-meta\">" +
          escapeHtml(match.status) +
          (winner ? (" | Winner: " + winner.name) : "") +
          (match.startTime ? (" | " + formatDateTime(match.startTime)) : "") +
          "</div>" +
          "</div>";
      }).join("");

      return "<section class=\"bracket-round\"><h3>" + escapeHtml(title) + "</h3>" + items + "</section>";
    }).join("");

    ui.bracketBoard.innerHTML = "<p><strong>" + escapeHtml(division ? division.name : "Bracket") + "</strong></p>" +
      renderBracketIntegrity(integrityIssues, divisionId) +
      "<div class=\"bracket-grid\">" + roundHtml + "</div>";
    renderPrintMeta(ui.printMetaBrackets, "Bracket", division ? ("Division: " + division.name) : "");
  }

  function renderBracketIntegrity(issues, divisionId) {
    if (!issues.length) {
      return "<section class=\"bracket-integrity\"><p><span class=\"tag complete\">valid</span> Bracket integrity checks passed.</p></section>";
    }

    var issueText = issues.join(" ");
    var hasSelfMatch     = /same team on both sides/.test(issueText);
    var hasDupeEntry     = /appears in multiple matches/.test(issueText);
    var hasInvalidWinner = /missing a winner|winner is not one of the scheduled/.test(issueText);

    var repairButtons = [];
    if (hasSelfMatch) {
      repairButtons.push("<button class=\"btn-repair\" data-repair=\"self-match\" data-division=\"" + escapeHtml(divisionId) + "\">Fix Self-Matches</button>");
    }
    if (hasDupeEntry) {
      repairButtons.push("<button class=\"btn-repair\" data-repair=\"duplicate-entries\" data-division=\"" + escapeHtml(divisionId) + "\">Fix Duplicate Entries</button>");
    }
    if (hasInvalidWinner) {
      repairButtons.push("<button class=\"btn-repair\" data-repair=\"invalid-winners\" data-division=\"" + escapeHtml(divisionId) + "\">Fix Invalid Winners</button>");
    }
    repairButtons.push("<button class=\"btn-repair btn-repair-all\" data-repair=\"all\" data-division=\"" + escapeHtml(divisionId) + "\">Fix All Issues</button>");

    return "<section class=\"bracket-integrity\">" +
      "<p><span class=\"tag warning\">warning</span> Bracket integrity issues detected.</p>" +
      "<ul class=\"warning-list\">" +
      issues.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") +
      "</ul>" +
      "<div class=\"bracket-repair-actions\">" + repairButtons.join("") + "</div>" +
      "</section>";
  }

  function setPrintContext(viewName) {
    document.body.setAttribute("data-print-view", viewName);
  }

  function clearPrintContext() {
    document.body.removeAttribute("data-print-view");
  }

  function preparePrintMeta(viewName) {
    if (viewName === "matches") {
      var division = findDivision(ui.matchDivision.value);
      var detail = division ? ("Division: " + division.name) : "All divisions";
      renderPrintMeta(ui.printMetaMatches, "Match Schedule", detail);
      return;
    }

    if (viewName === "team-schedule") {
      var team = findTeam(ui.teamScheduleTeam.value);
      var teamDetail = team ? getTeamSchedulePrintDetail(team) : "Select a team to print a team schedule.";
      renderPrintMeta(ui.printMetaTeamSchedule, "Team Schedule", teamDetail);
      return;
    }

    if (viewName === "standings") {
      var standingsDivision = findDivision(ui.standingsDivision.value);
      var standingsDetail = standingsDivision ? ("Division: " + standingsDivision.name) : "Select a division to print standings.";
      renderPrintMeta(ui.printMetaStandings, "Standings", standingsDetail);
      return;
    }

    if (viewName === "brackets") {
      var bracketDivision = findDivision(ui.bracketDivision.value);
      var bracketDetail = bracketDivision ? ("Division: " + bracketDivision.name) : "Select a division to print a bracket.";
      renderPrintMeta(ui.printMetaBrackets, "Bracket", bracketDetail);
    }
  }

  function renderPrintMeta(target, title, detail) {
    if (!target) {
      return;
    }

    var name = state.tournament.name ? state.tournament.name : "Tournament Planner";
    var dateLabel = formatTournamentDateRange();
    var printedAt = "Printed: " + new Date().toLocaleString();
    var html = [
      "<h3>" + escapeHtml(title) + "</h3>",
      "<p><strong>" + escapeHtml(name) + "</strong></p>"
    ];

    if (dateLabel) {
      html.push("<p>" + escapeHtml(dateLabel) + "</p>");
    }
    if (detail) {
      html.push("<p>" + escapeHtml(detail) + "</p>");
    }

    html.push("<p>" + escapeHtml(printedAt) + "</p>");
    target.innerHTML = html.join("");
  }

  function getTeamSchedulePrintDetail(team) {
    var division = findDivision(team.divisionId);
    if (!division) {
      return "Team: " + team.name;
    }
    return "Team: " + team.name + " | Division: " + division.name;
  }

  function formatTournamentDateRange() {
    var start = formatDateOnly(state.tournament.startDate);
    var end = formatDateOnly(state.tournament.endDate);
    if (start && end) {
      return "Dates: " + start + " to " + end;
    }
    if (start) {
      return "Start: " + start;
    }
    if (end) {
      return "End: " + end;
    }
    return "";
  }

  function formatDateOnly(value) {
    if (!value) {
      return "";
    }

    var parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return "";
    }
    return parsed.toLocaleDateString();
  }

  function sanitizeFileName(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "bracket";
  }

  function renderPublicBoard() {
    var mode = ui.publicDisplayMode.value || "courts";
    var venueId = ui.publicVenueFilter.value || "";
    var divisionId = ui.publicDivisionFilter.value || "";

    if (mode === "courts") {
      renderPublicCourtBoard(venueId, divisionId);
    } else if (mode === "standings") {
      renderPublicStandings(divisionId);
    } else {
      renderPublicSchedule(venueId, divisionId);
    }
  }

  function renderPublicCourtBoard(venueId, divisionId) {
    // Build a map: venueId|courtId -> { venue, court, matches sorted by time }
    var venues = venueId ? state.venues.filter(function (v) { return v.id === venueId; }) : state.venues;
    if (!venues.length) {
      ui.publicBoard.innerHTML = "<p class='public-empty'>No venues configured. Assign matches to courts to use the court board.</p>";
      return;
    }

    var cards = [];
    venues.forEach(function (venue) {
      venue.courts.forEach(function (court) {
        var courtMatches = state.matches
          .filter(function (m) {
            return m.venueId === venue.id && m.courtId === court.id &&
              (!divisionId || m.divisionId === divisionId);
          })
          .sort(function (a, b) {
            return (a.startTime || "9999").localeCompare(b.startTime || "9999");
          });
        cards.push({ venue: venue, court: court, matches: courtMatches });
      });
    });

    if (!cards.length) {
      ui.publicBoard.innerHTML = "<p class='public-empty'>No courts found for selected filters.</p>";
      return;
    }

    var html = "<div class='public-court-grid'>";
    cards.forEach(function (card) {
      var currentMatch = card.matches.find(function (m) { return m.status === "in_progress"; }) ||
        card.matches.find(function (m) { return m.status === "scheduled"; });
      var nextMatch = null;
      if (currentMatch && currentMatch.status === "in_progress") {
        nextMatch = card.matches.find(function (m) { return m.status === "scheduled"; });
      }

      html += "<div class='court-card'>";
      html += "<div class='court-card-header'>" +
        "<span class='court-card-label'>" + escapeHtml(card.court.label) + "</span>" +
        "<span class='court-card-venue'>" + escapeHtml(card.venue.name) + "</span>" +
        "</div>";

      if (!currentMatch) {
        html += "<div class='court-card-idle'>No upcoming matches</div>";
      } else {
        html += renderPublicMatchBlock(currentMatch, currentMatch.status === "in_progress" ? "NOW PLAYING" : "UP NEXT", "current");
        if (nextMatch) {
          html += renderPublicMatchBlock(nextMatch, "AFTER", "next");
        }
      }

      html += "</div>";
    });
    html += "</div>";

    ui.publicBoard.innerHTML = html;
  }

  function renderPublicMatchBlock(match, label, blockClass) {
    var teamA = findTeam(match.teamAId);
    var teamB = findTeam(match.teamBId);
    var division = findDivision(match.divisionId);
    var workTeam = findTeam(match.workTeamId);
    var fmt = getFormatForMatch(match);

    return "<div class='court-match-block court-match-" + blockClass + "'>" +
      "<div class='court-match-label'>" + escapeHtml(label) + "</div>" +
      "<div class='court-match-teams'>" +
        escapeHtml(teamA ? teamA.name : "TBD") + " <span class='vs-sep'>vs</span> " + escapeHtml(teamB ? teamB.name : "TBD") +
      "</div>" +
      "<div class='court-match-meta'>" +
        (division ? "<span>" + escapeHtml(division.name) + "</span>" : "") +
        (fmt ? " <span>\u00B7 " + escapeHtml(fmt.name) + "</span>" : "") +
        (match.startTime ? " <span>\u00B7 " + escapeHtml(formatDateTime(match.startTime)) + "</span>" : "") +
      "</div>" +
      (workTeam ? "<div class='court-match-work'>Work: <strong>" + escapeHtml(workTeam.name) + "</strong></div>" : "") +
      "</div>";
  }

  function renderPublicStandings(divisionId) {
    var divisions = divisionId
      ? state.divisions.filter(function (d) { return d.id === divisionId; })
      : state.divisions;

    if (!divisions.length) {
      ui.publicBoard.innerHTML = "<p class='public-empty'>No divisions yet.</p>";
      return;
    }

    var html = "<div class='public-standings-grid'>";
    divisions.forEach(function (div) {
      var rows = computeStandings(div.id);
      if (!rows.length) { return; }

      var bracketMatches = getBracketMatches(div.id);
      var champion = null;
      if (bracketMatches.length) {
        var rounds = groupBracketRounds(bracketMatches);
        var roundNumbers = Object.keys(rounds).map(function (k) { return parseInt(k, 10); }).sort(function (a, b) { return a - b; });
        var finalRound = rounds[roundNumbers[roundNumbers.length - 1]] || [];
        if (finalRound.length === 1 && finalRound[0].winnerId) {
          champion = findTeam(finalRound[0].winnerId);
        }
      }

      html += "<div class='public-standings-block'>" +
        "<h3 class='public-standings-title'>" + escapeHtml(div.name) + (champion ? " \u2014 \uD83C\uDFC6 " + escapeHtml(champion.name) : "") + "</h3>" +
        "<table class='public-standings-table'><thead><tr>" +
        "<th>#</th><th>Team</th><th>W</th><th>L</th><th>Sets</th><th>Pts</th>" +
        "</tr></thead><tbody>" +
        rows.map(function (row, i) {
          return "<tr" + (champion && row.team.id === champion.id ? " class='champion-row'" : "") + ">" +
            "<td>" + (i + 1) + "</td>" +
            "<td>" + escapeHtml(row.team.name) + "</td>" +
            "<td>" + row.wins + "</td>" +
            "<td>" + row.losses + "</td>" +
            "<td>" + formatRatio(row.setsWon, row.setsLost) + "</td>" +
            "<td>" + formatRatio(row.pointsFor, row.pointsAgainst) + "</td>" +
            "</tr>";
        }).join("") +
        "</tbody></table></div>";
    });
    html += "</div>";

    ui.publicBoard.innerHTML = html || "<p class='public-empty'>No standings data yet. Complete pool play matches to see standings.</p>";
  }

  function renderPublicSchedule(venueId, divisionId) {
    var matches = state.matches
      .filter(function (m) {
        return m.status !== "completed" &&
          (!venueId || m.venueId === venueId) &&
          (!divisionId || m.divisionId === divisionId);
      })
      .sort(function (a, b) {
        return (a.startTime || "9999").localeCompare(b.startTime || "9999") || a.roundNumber - b.roundNumber;
      })
      .slice(0, 20);

    if (!matches.length) {
      ui.publicBoard.innerHTML = "<p class='public-empty'>No upcoming or active matches.</p>";
      return;
    }

    var inProgress = matches.filter(function (m) { return m.status === "in_progress"; });
    var scheduled = matches.filter(function (m) { return m.status === "scheduled"; });

    var html = "";
    if (inProgress.length) {
      html += "<h3 class='public-section-title'>In Progress</h3><div class='public-match-list'>" +
        inProgress.map(renderPublicMatchRow).join("") + "</div>";
    }
    if (scheduled.length) {
      html += "<h3 class='public-section-title'>Upcoming</h3><div class='public-match-list'>" +
        scheduled.map(renderPublicMatchRow).join("") + "</div>";
    }

    ui.publicBoard.innerHTML = html;
  }

  function renderPublicMatchRow(match) {
    var teamA = findTeam(match.teamAId);
    var teamB = findTeam(match.teamBId);
    var division = findDivision(match.divisionId);
    var venue = findVenue(match.venueId);
    var court = findCourt(match.venueId, match.courtId);
    var workTeam = findTeam(match.workTeamId);

    return "<div class='public-match-row'>" +
      "<div class='public-match-teams'>" +
        "<strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " + escapeHtml(teamB ? teamB.name : "TBD") + "</strong>" +
        " " + renderStatusTag(match.status, match) +
      "</div>" +
      "<div class='public-match-details'>" +
        (division ? escapeHtml(division.name) + " \u00B7 " : "") +
        (venue ? escapeHtml(venue.name) + (court ? " " + escapeHtml(court.label) : "") + " \u00B7 " : "") +
        (match.startTime ? escapeHtml(formatDateTime(match.startTime)) : "Time TBD") +
        (workTeam ? " \u00B7 Work: " + escapeHtml(workTeam.name) : "") +
      "</div>" +
      "</div>";
  }

  function handlePublicFullscreen() {
    var el = document.documentElement;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) { el.requestFullscreen(); }
      ui.publicFullscreen.textContent = "\u2715 Exit Full Screen";
    } else {
      if (document.exitFullscreen) { document.exitFullscreen(); }
      ui.publicFullscreen.textContent = "\u26F6 Full Screen";
    }
  }

  function computeStandings(divisionId) {
    var teams = getDivisionTeams(divisionId);
    var completed = state.matches.filter(function (match) {
      return match.divisionId === divisionId && match.stage === "pool" && match.status === "completed";
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
    downloadJson(state, "tournament-planner-data.json");
  }

  function downloadJson(value, fileName) {
    var payload = JSON.stringify(value, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = fileName;
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

  function isValidBracketImport(candidate) {
    return candidate &&
      Array.isArray(candidate.matches) &&
      candidate.matches.some(function (match) {
        return match && match.stage === "bracket";
      });
  }

  function normalizeImportedBracketMatches(matches, divisionId) {
    return matches
      .filter(function (match) {
        return match && match.stage === "bracket";
      })
      .map(function (match) {
        var teamAId = findTeam(match.teamAId) ? match.teamAId : null;
        var teamBId = findTeam(match.teamBId) ? match.teamBId : null;
        var winnerId = findTeam(match.winnerId) ? match.winnerId : null;
        var loserId = findTeam(match.loserId) ? match.loserId : null;

        return {
          id: createId("match"),
          divisionId: divisionId,
          stage: "bracket",
          roundNumber: Math.max(1, parseInt(match.roundNumber, 10) || 1),
          indexInRound: Math.max(1, parseInt(match.indexInRound, 10) || 1),
          teamAId: teamAId,
          teamBId: teamBId,
          venueId: findVenue(match.venueId) ? match.venueId : null,
          courtId: findCourt(match.venueId, match.courtId) ? match.courtId : null,
          startTime: normalizeImportedDateTime(match.startTime),
          durationMinutes: Number.isFinite(match.durationMinutes) ? match.durationMinutes : null,
          status: normalizeImportedStatus(match.status),
          setScores: normalizeImportedSetScores(match.setScores),
          winnerId: winnerId,
          loserId: loserId,
          workTeamId: findTeam(match.workTeamId) ? match.workTeamId : null
        };
      });
  }

  function normalizeImportedDateTime(value) {
    if (!value) {
      return null;
    }
    var parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toISOString();
  }

  function normalizeImportedStatus(value) {
    if (value === "scheduled" || value === "in_progress" || value === "completed") {
      return value;
    }
    return "scheduled";
  }

  function normalizeImportedSetScores(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map(function (set, index) {
        if (!set) {
          return null;
        }

        var teamAScore = parseInt(set.teamAScore, 10);
        var teamBScore = parseInt(set.teamBScore, 10);
        if (!Number.isFinite(teamAScore) || !Number.isFinite(teamBScore) || teamAScore < 0 || teamBScore < 0) {
          return null;
        }

        return {
          setNumber: index + 1,
          teamAScore: teamAScore,
          teamBScore: teamBScore
        };
      })
      .filter(function (set) {
        return Boolean(set);
      });
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
        indexInRound: match.indexInRound || 1,
        teamAId: match.teamAId || null,
        teamBId: match.teamBId || null,
        venueId: match.venueId || null,
        courtId: match.courtId || null,
        startTime: match.startTime || null,
        durationMinutes: Number.isFinite(match.durationMinutes) ? match.durationMinutes : null,
        status: match.status || "scheduled",
        setScores: Array.isArray(match.setScores) ? match.setScores : [],
        winnerId: match.winnerId || null,
        loserId: match.loserId || null
      };
    }) : [];

    state = normalized;
    normalizeMatchAssignments();
    recomputeAllBracketProgression();
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

  function getBracketMatches(divisionId) {
    return state.matches.filter(function (match) {
      return match.divisionId === divisionId && match.stage === "bracket";
    });
  }

  function groupBracketRounds(matches) {
    return matches.reduce(function (map, match) {
      if (!map[match.roundNumber]) {
        map[match.roundNumber] = [];
      }
      map[match.roundNumber].push(match);
      return map;
    }, {});
  }

  function computeBracketIntegrityIssues(divisionId) {
    var bracketMatches = getBracketMatches(divisionId);
    if (!bracketMatches.length) {
      return [];
    }

    var issues = [];
    var rounds = groupBracketRounds(bracketMatches);
    var roundNumbers = Object.keys(rounds).map(function (item) {
      return parseInt(item, 10);
    }).sort(function (a, b) {
      return a - b;
    });

    if (roundNumbers.length) {
      var finalRound = rounds[roundNumbers[roundNumbers.length - 1]] || [];
      if (finalRound.length !== 1) {
        issues.push("Final round should contain exactly one match.");
      }
    }

    for (var i = 0; i < roundNumbers.length; i += 1) {
      var roundNumber = roundNumbers[i];
      var matches = rounds[roundNumber] || [];
      var teamsInRound = {};

      matches.forEach(function (match) {
        if (match.teamAId && match.teamAId === match.teamBId) {
          issues.push("Round " + roundNumber + ": a match has the same team on both sides.");
        }

        [match.teamAId, match.teamBId].forEach(function (teamId) {
          if (!teamId) {
            return;
          }

          if (teamsInRound[teamId]) {
            var team = findTeam(teamId);
            issues.push("Round " + roundNumber + ": " + (team ? team.name : "Unknown team") + " appears in multiple matches.");
            return;
          }
          teamsInRound[teamId] = true;
        });

        if (match.status === "completed" && !match.winnerId) {
          issues.push("Round " + roundNumber + ": a completed match is missing a winner.");
        }

        if (match.winnerId && match.winnerId !== match.teamAId && match.winnerId !== match.teamBId) {
          issues.push("Round " + roundNumber + ": a match winner is not one of the scheduled teams.");
        }
      });

      if (i > 0) {
        var prevRoundMatches = rounds[roundNumbers[i - 1]] || [];
        var expectedCount = Math.ceil(prevRoundMatches.length / 2);
        if (matches.length !== expectedCount) {
          issues.push("Round " + roundNumber + ": expected " + expectedCount + " matches based on previous round, found " + matches.length + ".");
        }
      }
    }

    var divisionTeams = getDivisionTeams(divisionId);
    var firstRound = rounds[roundNumbers[0]] || [];
    var firstRoundTeamIds = {};
    firstRound.forEach(function (match) {
      if (match.teamAId) {
        firstRoundTeamIds[match.teamAId] = true;
      }
      if (match.teamBId) {
        firstRoundTeamIds[match.teamBId] = true;
      }
    });

    divisionTeams.forEach(function (team) {
      if (!firstRoundTeamIds[team.id]) {
        issues.push("First round is missing team: " + team.name + ".");
      }
    });

    return dedupeStrings(issues);
  }

  function dedupeStrings(values) {
    var seen = {};
    return values.filter(function (value) {
      if (seen[value]) {
        return false;
      }
      seen[value] = true;
      return true;
    });
  }

  // ── Bracket repair helpers ────────────────────────────────────────────────

  /** Remove winners that don't belong to either scheduled team; reset
   *  completed matches that have no winner back to "scheduled". */
  function repairInvalidWinners(divisionId) {
    getBracketMatches(divisionId).forEach(function (match) {
      if (match.winnerId && match.winnerId !== match.teamAId && match.winnerId !== match.teamBId) {
        match.winnerId = null;
        match.loserId = null;
        match.status = "scheduled";
      }
      if (match.status === "completed" && !match.winnerId) {
        match.status = "scheduled";
      }
    });
  }

  /** Remove bracket matches that cause a team to appear more than once in
   *  the same round (keeps the first-seen occurrence). */
  function repairDuplicateRoundEntries(divisionId) {
    var rounds = groupBracketRounds(getBracketMatches(divisionId));
    var idsToRemove = {};

    Object.keys(rounds).forEach(function (roundKey) {
      var seen = {};
      rounds[roundKey].forEach(function (match) {
        var isDupe = false;
        [match.teamAId, match.teamBId].forEach(function (teamId) {
          if (!teamId) { return; }
          if (seen[teamId]) { isDupe = true; }
          seen[teamId] = true;
        });
        if (isDupe) {
          idsToRemove[match.id] = true;
        }
      });
    });

    if (Object.keys(idsToRemove).length) {
      state.matches = state.matches.filter(function (m) { return !idsToRemove[m.id]; });
    }
  }

  /** Clear teamBId on any match where both sides reference the same team. */
  function repairSelfMatches(divisionId) {
    getBracketMatches(divisionId).forEach(function (match) {
      if (match.teamAId && match.teamAId === match.teamBId) {
        match.teamBId = null;
        match.winnerId = null;
        match.loserId = null;
        match.status = "scheduled";
      }
    });
  }

  /** Run all repair passes for a division, then re-run progression. */
  function repairBracketAll(divisionId) {
    repairSelfMatches(divisionId);
    repairDuplicateRoundEntries(divisionId);
    repairInvalidWinners(divisionId);
    recomputeBracketProgression(divisionId);
    saveState();
    renderBrackets();
  }

  // ─────────────────────────────────────────────────────────────────────────

  function recomputeAllBracketProgression() {
    state.divisions.forEach(function (division) {
      recomputeBracketProgression(division.id);
    });
  }

  function recomputeBracketProgression(divisionId) {
    var bracketMatches = getBracketMatches(divisionId);
    if (!bracketMatches.length) {
      return;
    }

    var rounds = groupBracketRounds(bracketMatches);
    var roundNumbers = Object.keys(rounds).map(function (item) {
      return parseInt(item, 10);
    }).sort(function (a, b) {
      return a - b;
    });

    roundNumbers.forEach(function (roundNumber) {
      rounds[roundNumber].sort(function (a, b) {
        return a.indexInRound - b.indexInRound;
      });
    });

    if (rounds[1]) {
      rounds[1].forEach(autoAdvanceByeMatch);
    }

    for (var i = 1; i < roundNumbers.length; i += 1) {
      var current = rounds[roundNumbers[i]];
      var prior = rounds[roundNumbers[i - 1]];
      current.forEach(function (match) {
        var left = prior[(match.indexInRound - 1) * 2];
        var right = prior[(match.indexInRound - 1) * 2 + 1];
        var nextTeamA = left ? left.winnerId : null;
        var nextTeamB = right ? right.winnerId : null;
        if (match.teamAId !== nextTeamA || match.teamBId !== nextTeamB) {
          match.teamAId = nextTeamA;
          match.teamBId = nextTeamB;
          match.setScores = [];
          match.winnerId = null;
          match.loserId = null;
          match.status = "scheduled";
        }
        autoAdvanceByeMatch(match);
      });
    }
  }

  function autoAdvanceByeMatch(match) {
    if (match.status === "completed") {
      return;
    }
    if (match.teamAId && !match.teamBId) {
      match.status = "completed";
      match.winnerId = match.teamAId;
      match.loserId = null;
      match.setScores = [];
      return;
    }
    if (match.teamBId && !match.teamAId) {
      match.status = "completed";
      match.winnerId = match.teamBId;
      match.loserId = null;
      match.setScores = [];
      return;
    }
    if (!match.teamAId || !match.teamBId) {
      match.status = "scheduled";
      match.winnerId = null;
      match.loserId = null;
      match.setScores = [];
    }
  }

  function createBracketMatch(divisionId, roundNumber, indexInRound, teamAId, teamBId) {
    return {
      id: createId("match"),
      divisionId: divisionId,
      stage: "bracket",
      roundNumber: roundNumber,
      indexInRound: indexInRound,
      teamAId: teamAId,
      teamBId: teamBId,
      venueId: null,
      courtId: null,
      startTime: null,
      durationMinutes: null,
      status: "scheduled",
      setScores: [],
      winnerId: null,
      loserId: null,
      workTeamId: null
    };
  }

  function nextPowerOfTwo(value) {
    var size = 1;
    while (size < value) {
      size *= 2;
    }
    return size;
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

  function getMatchPhaseLabel(match) {
    var stageLabel = match.stage === "bracket" ? "Bracket" : "Pool";
    return stageLabel + " Round " + match.roundNumber;
  }

  function renderStatusTag(status, match) {
    var css = status === "completed" ? "tag complete" : "tag";
    var extra = "";
    if (match && match.forfeited) { extra += " <span class='tag warning'>forfeit</span>"; }
    if (match && match.locked) { extra += " <span class='tag'>\uD83D\uDD12</span>"; }
    return "<span class=\"" + css + "\">" + escapeHtml(status) + "</span>" + extra;
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
    if (match.locked) { return ""; }

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