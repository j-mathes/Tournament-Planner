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
  var adminUnlocked = true;
  var ADMIN_PIN_KEY = "tp.admin.pin";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    bindEvents();
    window.addEventListener("afterprint", clearPrintContext);
    loadState();
    applyAdminLockState();
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
      matches: [],
      pools: [],
      auditLog: []
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
    ui.adminSecurityCard = document.getElementById("admin-security-card");
    ui.auditLogSection = document.getElementById("audit-log-section");
    ui.adminLockBtn = document.getElementById("admin-lock-btn");
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
    ui.generateConsolationBracket = document.getElementById("generate-consolation-bracket");
    ui.clearConsolationBracket = document.getElementById("clear-consolation-bracket");
    ui.generateDoubleElimination = document.getElementById("generate-double-elimination");
    ui.generateSwissRound = document.getElementById("generate-swiss-round");
    ui.clearSwissRounds = document.getElementById("clear-swiss-rounds");
    ui.poolCount = document.getElementById("pool-count");
    ui.autoSplitPools = document.getElementById("auto-split-pools");
    ui.generatePoolMatchesPools = document.getElementById("generate-pool-matches-pools");
    ui.generateCrossoversBtnUi = document.getElementById("generate-crossovers-btn");
    ui.generatePlacementBtn = document.getElementById("generate-placement-btn");
    ui.clearPoolsBtn = document.getElementById("clear-pools-btn");
    ui.poolAssignmentBoard = document.getElementById("pool-assignment-board");
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
    ui.generateTestData = document.getElementById("generate-test-data");
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
    ui.generateConsolationBracket.addEventListener("click", handleGenerateConsolationBracket);
    ui.clearConsolationBracket.addEventListener("click", handleClearConsolationBracket);
    ui.generateDoubleElimination.addEventListener("click", handleGenerateDoubleElimination);
    ui.generateSwissRound.addEventListener("click", handleGenerateSwissRound);
    ui.clearSwissRounds.addEventListener("click", handleClearSwissRounds);
    ui.autoSplitPools.addEventListener("click", handleAutoSplitPools);
    ui.generatePoolMatchesPools.addEventListener("click", handleGeneratePoolMatchesPools);
    ui.generateCrossoversBtnUi.addEventListener("click", handleGenerateCrossovers);
    ui.generatePlacementBtn.addEventListener("click", handleGeneratePlacement);
    ui.clearPoolsBtn.addEventListener("click", handleClearPoolsAndPlacement);
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

    ui.generateTestData.addEventListener("click", handleGenerateTestData);
    ui.adminLockBtn.addEventListener("click", handleAdminLockBtn);
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
      current.formatId = ui.divisionFormat.value || null;
      resetDivisionForm();
      saveState();
      renderAll();
      return;
    }

    state.divisions.push({
      id: createId("div"),
      name: name,
      formatId: ui.divisionFormat.value || null
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
      ui.divisionFormat.value = division.formatId || "";
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
      return !(match.divisionId === divisionId && (
        match.stage === "bracket" || match.stage === "losers" || match.stage === "grand-final"
      ));
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

  function getConsolationMatches(divisionId) {
    return state.matches.filter(function (match) {
      return match.divisionId === divisionId && match.stage === "consolation";
    });
  }

  function createConsolationMatch(divisionId, roundNumber, indexInRound, teamAId, teamBId) {
    return {
      id: createId("match"),
      divisionId: divisionId,
      stage: "consolation",
      roundNumber: roundNumber,
      indexInRound: indexInRound,
      teamAId: teamAId || null,
      teamBId: teamBId || null,
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

  function buildConsolationBracket(divisionId, mainR1Matches) {
    // Only use matches where at least one team slot is filled (not pure phantom byes)
    var real = mainR1Matches
      .slice()
      .sort(function (a, b) { return a.indexInRound - b.indexInRound; })
      .filter(function (m) { return m.teamAId || m.teamBId; });

    var count = real.length;
    if (count < 2) { return []; }

    // Consolation Round 1: pair up consecutive R1 losers
    var r1 = [];
    var i;
    for (i = 0; i + 1 < count; i += 2) {
      r1.push(createConsolationMatch(
        divisionId, 1, Math.floor(i / 2) + 1,
        real[i].loserId || null,
        real[i + 1].loserId || null
      ));
    }
    // Odd team gets a bye in consolation R1
    if (count % 2 !== 0) {
      r1.push(createConsolationMatch(
        divisionId, 1, Math.ceil(count / 2),
        real[count - 1].loserId || null, null
      ));
    }

    var all = r1.slice();
    var prior = r1;
    var maxRounds = Math.ceil(Math.log2(Math.max(count, 2)));

    for (var round = 2; round <= maxRounds; round += 1) {
      var curr = [];
      var slot;
      for (slot = 0; slot + 1 < prior.length; slot += 2) {
        curr.push(createConsolationMatch(divisionId, round, Math.floor(slot / 2) + 1, null, null));
      }
      if (prior.length % 2 !== 0) {
        curr.push(createConsolationMatch(divisionId, round, Math.ceil(prior.length / 2), null, null));
      }
      all = all.concat(curr);
      prior = curr;
    }

    return all;
  }

  function handleGenerateConsolationBracket() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) {
      window.alert("Select a division.");
      return;
    }

    var mainR1 = getBracketMatches(divisionId).filter(function (m) { return m.roundNumber === 1; });
    if (!mainR1.length) {
      window.alert("Generate the main bracket first.");
      return;
    }

    if (getLosersMatches(divisionId).length > 0) {
      window.alert("Cannot add a consolation bracket to a double elimination format.");
      return;
    }

    var realR1 = mainR1.filter(function (m) { return m.teamAId || m.teamBId; });
    if (realR1.length < 2) {
      window.alert("Need at least 2 first-round matches with teams assigned to generate a consolation bracket.");
      return;
    }

    // Remove any existing consolation bracket for this division
    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && m.stage === "consolation");
    });

    var generated = buildConsolationBracket(divisionId, mainR1);
    state.matches = state.matches.concat(generated);
    recomputeBracketProgression(divisionId);
    saveState();
    renderAll();
  }

  function handleClearConsolationBracket() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) {
      window.alert("Select a division.");
      return;
    }

    var has = getConsolationMatches(divisionId).length > 0;
    if (!has) {
      window.alert("No consolation bracket exists for this division.");
      return;
    }

    if (!window.confirm("Remove the consolation bracket for this division? This cannot be undone.")) {
      return;
    }

    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && m.stage === "consolation");
    });
    saveState();
    renderAll();
  }

  function recomputeConsolationProgression(divisionId) {
    var consolMatches = getConsolationMatches(divisionId);
    if (!consolMatches.length) { return; }

    // Get the real (non-pure-bye) Round 1 main bracket matches, sorted
    var mainR1 = getBracketMatches(divisionId)
      .filter(function (m) { return m.roundNumber === 1 && (m.teamAId || m.teamBId); })
      .sort(function (a, b) { return a.indexInRound - b.indexInRound; });

    var rounds = groupBracketRounds(consolMatches);
    var roundNumbers = Object.keys(rounds).map(function (n) {
      return parseInt(n, 10);
    }).sort(function (a, b) { return a - b; });

    roundNumbers.forEach(function (rn) {
      rounds[rn].sort(function (a, b) { return a.indexInRound - b.indexInRound; });
    });

    // Populate consolation R1 teams from main bracket R1 losers
    if (rounds[1]) {
      rounds[1].forEach(function (match, idx) {
        var srcA = mainR1[idx * 2] || null;
        var srcB = mainR1[idx * 2 + 1] || null;
        var teamA = srcA ? (srcA.loserId || null) : null;
        var teamB = srcB ? (srcB.loserId || null) : null;
        if (match.teamAId !== teamA || match.teamBId !== teamB) {
          match.teamAId = teamA;
          match.teamBId = teamB;
          match.setScores = [];
          match.winnerId = null;
          match.loserId = null;
          match.status = "scheduled";
        }
        autoAdvanceByeMatch(match);
      });
    }

    // Standard winner-propagation for subsequent rounds
    for (var i = 1; i < roundNumbers.length; i += 1) {
      var current = rounds[roundNumbers[i]];
      var prior = rounds[roundNumbers[i - 1]];
      current.forEach(function (match) {
        var left = prior[(match.indexInRound - 1) * 2];
        var right = prior[(match.indexInRound - 1) * 2 + 1];
        var nextA = left ? left.winnerId : null;
        var nextB = right ? right.winnerId : null;
        if (match.teamAId !== nextA || match.teamBId !== nextB) {
          match.teamAId = nextA;
          match.teamBId = nextB;
          match.setScores = [];
          match.winnerId = null;
          match.loserId = null;
          match.status = "scheduled";
        }
        autoAdvanceByeMatch(match);
      });
    }
  }

  // ── Double Elimination ──────────────────────────────────────────────────

  function getLosersMatches(divisionId) {
    return state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.stage === "losers";
    });
  }

  function getGrandFinalMatches(divisionId) {
    return state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.stage === "grand-final";
    });
  }

  function createLosersMatch(divisionId, roundNumber, indexInRound, teamAId, teamBId) {
    return {
      id: createId("match"),
      divisionId: divisionId,
      stage: "losers",
      roundNumber: roundNumber,
      indexInRound: indexInRound,
      teamAId: teamAId || null,
      teamBId: teamBId || null,
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

  function createGrandFinalMatch(divisionId) {
    return {
      id: createId("match"),
      divisionId: divisionId,
      stage: "grand-final",
      roundNumber: 1,
      indexInRound: 1,
      teamAId: null,
      teamBId: null,
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

  // Build the shell of a Losers Bracket for a bracket of size B (power of 2).
  // LB has 2*(n-1) rounds where n=log2(B).
  // Round r match count = B / 2^(ceil(r/2)+1)
  function buildLosersMatches(divisionId, B) {
    var n = Math.round(Math.log2(B));
    var lbRounds = 2 * (n - 1);
    var all = [];
    for (var r = 1; r <= lbRounds; r += 1) {
      var matchCount = Math.round(B / Math.pow(2, Math.ceil(r / 2) + 1));
      for (var i = 0; i < matchCount; i += 1) {
        all.push(createLosersMatch(divisionId, r, i + 1, null, null));
      }
    }
    return all;
  }

  function generateDoubleEliminationForTeams(divisionId, teams) {
    if (teams.length < 2) { return; }

    // Clear all bracket-type matches for this division
    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && (
        m.stage === "bracket" || m.stage === "losers" ||
        m.stage === "grand-final" || m.stage === "consolation"
      ));
    });

    var B = nextPowerOfTwo(teams.length);
    var wbMatches = buildSingleEliminationMatches(divisionId, teams);
    var lbMatches = buildLosersMatches(divisionId, B);
    var gfMatch = createGrandFinalMatch(divisionId);

    state.matches = state.matches.concat(wbMatches).concat(lbMatches).concat([gfMatch]);
    recomputeBracketProgression(divisionId);
    saveState();
    renderAll();
  }

  function handleGenerateDoubleElimination() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) {
      window.alert("Select a division.");
      return;
    }

    var teams = getDivisionTeams(divisionId);
    if (teams.length < 3) {
      window.alert("Need at least 3 teams for double elimination.");
      return;
    }

    var hasExisting = getBracketMatches(divisionId).length > 0 ||
      getLosersMatches(divisionId).length > 0;
    if (hasExisting && !window.confirm(
      "Replace the existing bracket for this division? All bracket match results will be lost."
    )) {
      return;
    }

    generateDoubleEliminationForTeams(divisionId, teams);
  }

  // Propagate results through the Losers Bracket and into the Grand Final.
  // Called at the end of recomputeBracketProgression whenever LB matches exist.
  function recomputeLosersProgression(divisionId) {
    var lbMatches = getLosersMatches(divisionId);
    if (!lbMatches.length) { return; }

    var wbMatches = getBracketMatches(divisionId);
    if (!wbMatches.length) { return; }

    var wbRounds = groupBracketRounds(wbMatches);
    var wbRoundNums = Object.keys(wbRounds).map(Number).sort(function (a, b) { return a - b; });
    var lbRounds = groupBracketRounds(lbMatches);
    var lbRoundNums = Object.keys(lbRounds).map(Number).sort(function (a, b) { return a - b; });

    wbRoundNums.forEach(function (rn) {
      wbRounds[rn].sort(function (a, b) { return a.indexInRound - b.indexInRound; });
    });
    lbRoundNums.forEach(function (rn) {
      lbRounds[rn].sort(function (a, b) { return a.indexInRound - b.indexInRound; });
    });

    lbRoundNums.forEach(function (r) {
      var lbR = lbRounds[r];

      if (r === 1) {
        // LB R1 is fed by pairs of WB R1 losers
        var wbR1 = (wbRounds[1] || []).filter(function (m) { return m.teamAId || m.teamBId; });
        lbR.forEach(function (match, i) {
          var srcA = wbR1[i * 2] || null;
          var srcB = wbR1[i * 2 + 1] || null;
          var tA = srcA ? (srcA.loserId || null) : null;
          var tB = srcB ? (srcB.loserId || null) : null;
          if (match.teamAId !== tA || match.teamBId !== tB) {
            match.teamAId = tA;
            match.teamBId = tB;
            match.setScores = [];
            match.winnerId = null;
            match.loserId = null;
            match.status = "scheduled";
          }
          autoAdvanceByeMatch(match);
        });

      } else if (r % 2 === 0) {
        // Even "dropout" round: LB R(r-1) winners (slot A) + WB R(r/2+1) losers (slot B)
        var wbK = r / 2 + 1;
        var wbDrop = (wbRounds[wbK] || []);
        var lbPrev = (lbRounds[r - 1] || []);
        lbR.forEach(function (match, i) {
          var tA = lbPrev[i] ? (lbPrev[i].winnerId || null) : null;
          var tB = wbDrop[i] ? (wbDrop[i].loserId || null) : null;
          if (match.teamAId !== tA || match.teamBId !== tB) {
            match.teamAId = tA;
            match.teamBId = tB;
            match.setScores = [];
            match.winnerId = null;
            match.loserId = null;
            match.status = "scheduled";
          }
          autoAdvanceByeMatch(match);
        });

      } else {
        // Odd consolidation round (r > 1): pairs of LB R(r-1) winners
        var lbPrev = (lbRounds[r - 1] || []);
        lbR.forEach(function (match, i) {
          var left = lbPrev[i * 2] || null;
          var right = lbPrev[i * 2 + 1] || null;
          var tA = left ? (left.winnerId || null) : null;
          var tB = right ? (right.winnerId || null) : null;
          if (match.teamAId !== tA || match.teamBId !== tB) {
            match.teamAId = tA;
            match.teamBId = tB;
            match.setScores = [];
            match.winnerId = null;
            match.loserId = null;
            match.status = "scheduled";
          }
          autoAdvanceByeMatch(match);
        });
      }
    });

    // Populate Grand Final: WB champion (slot A) vs LB champion (slot B)
    var gfList = getGrandFinalMatches(divisionId);
    if (gfList.length) {
      var gf = gfList[0];
      var wbFinal = wbRounds[wbRoundNums[wbRoundNums.length - 1]] || [];
      var lbFinal = lbRounds[lbRoundNums[lbRoundNums.length - 1]] || [];
      var wbChamp = wbFinal.length ? (wbFinal[0].winnerId || null) : null;
      var lbChamp = lbFinal.length ? (lbFinal[0].winnerId || null) : null;
      if (gf.teamAId !== wbChamp || gf.teamBId !== lbChamp) {
        gf.teamAId = wbChamp;
        gf.teamBId = lbChamp;
        gf.setScores = [];
        gf.winnerId = null;
        gf.loserId = null;
        gf.status = "scheduled";
      }
      autoAdvanceByeMatch(gf);
    }
  }

  // ── Swiss System ────────────────────────────────────────────────────────

  function getSwissMatches(divisionId) {
    return state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.stage === "swiss";
    });
  }

  function createSwissMatch(divisionId, roundNumber, indexInRound, teamAId, teamBId) {
    return {
      id: createId("match"),
      divisionId: divisionId,
      stage: "swiss",
      roundNumber: roundNumber,
      indexInRound: indexInRound,
      teamAId: teamAId || null,
      teamBId: teamBId || null,
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

  function getSwissWins(teamId, swissMatches) {
    return swissMatches.filter(function (m) {
      return m.status === "completed" && m.winnerId === teamId;
    }).length;
  }

  // Returns standings sorted by wins, then Buchholz (sum of opponents' wins).
  function computeSwissStandings(divisionId) {
    var teams = getDivisionTeams(divisionId);
    var swissDone = getSwissMatches(divisionId).filter(function (m) {
      return m.status === "completed";
    });

    var wins = {};
    var losses = {};
    var opponents = {};
    teams.forEach(function (t) {
      wins[t.id] = 0;
      losses[t.id] = 0;
      opponents[t.id] = [];
    });

    swissDone.forEach(function (m) {
      if (m.teamAId && m.teamBId) {
        if (!opponents[m.teamAId]) { opponents[m.teamAId] = []; }
        if (!opponents[m.teamBId]) { opponents[m.teamBId] = []; }
        opponents[m.teamAId].push(m.teamBId);
        opponents[m.teamBId].push(m.teamAId);
      }
      if (m.winnerId) {
        wins[m.winnerId] = (wins[m.winnerId] || 0) + 1;
        var loserId = m.teamAId === m.winnerId ? m.teamBId : m.teamAId;
        if (loserId) { losses[loserId] = (losses[loserId] || 0) + 1; }
      }
    });

    // Buchholz: sum of opponents' win counts
    var buchholz = {};
    teams.forEach(function (t) {
      buchholz[t.id] = (opponents[t.id] || []).reduce(function (sum, oppId) {
        return sum + (wins[oppId] || 0);
      }, 0);
    });

    var sorted = teams.slice().sort(function (a, b) {
      if ((wins[b.id] || 0) !== (wins[a.id] || 0)) { return (wins[b.id] || 0) - (wins[a.id] || 0); }
      if ((buchholz[b.id] || 0) !== (buchholz[a.id] || 0)) { return (buchholz[b.id] || 0) - (buchholz[a.id] || 0); }
      return a.name.localeCompare(b.name);
    });

    return sorted.map(function (t) {
      return {
        team: t,
        wins: wins[t.id] || 0,
        losses: losses[t.id] || 0,
        buchholz: buchholz[t.id] || 0
      };
    });
  }

  // Pair teams for a Swiss round. Returns array of [teamA, teamB|null] pairs.
  // Teams ordered by current standing (highest first); within each win group,
  // avoids rematches where possible; floats odd-group team down to next group.
  function pairTeamsSwiss(orderedTeams, existingSwissMatches) {
    // Build rematch lookup
    var played = {};
    existingSwissMatches.forEach(function (m) {
      if (m.teamAId && m.teamBId) {
        played[m.teamAId + "|" + m.teamBId] = true;
        played[m.teamBId + "|" + m.teamAId] = true;
      }
    });

    // Group by win count (among Swiss matches only)
    var groups = {};
    orderedTeams.forEach(function (t) {
      var w = getSwissWins(t.id, existingSwissMatches);
      if (!groups[w]) { groups[w] = []; }
      groups[w].push(t);
    });

    var winCounts = Object.keys(groups).map(Number).sort(function (a, b) { return b - a; });
    var pairs = [];
    var floated = null;

    winCounts.forEach(function (wc) {
      var group = groups[wc].slice();
      if (floated) {
        group.unshift(floated);
        floated = null;
      }

      var remaining = group.slice();
      while (remaining.length >= 2) {
        var teamA = remaining.shift();
        // Prefer a non-rematch opponent; fall back to first available
        var oppIdx = -1;
        for (var j = 0; j < remaining.length; j += 1) {
          if (!played[teamA.id + "|" + remaining[j].id]) {
            oppIdx = j;
            break;
          }
        }
        if (oppIdx === -1) { oppIdx = 0; } // forced rematch
        var teamB = remaining.splice(oppIdx, 1)[0];
        pairs.push([teamA, teamB]);
      }

      if (remaining.length === 1) {
        floated = remaining[0];
      }
    });

    // Last team gets a bye
    if (floated) {
      pairs.push([floated, null]);
    }

    return pairs;
  }

  function generateSwissRound(divisionId, roundNumber, existingSwissMatches) {
    var teams = getDivisionTeams(divisionId);

    // Seed: for round 1 use pool standings; for subsequent rounds use Swiss standings
    var ordered;
    if (roundNumber === 1) {
      var poolRows = computeStandings(divisionId);
      ordered = poolRows.length ? poolRows.map(function (r) { return r.team; }) : teams.slice();
    } else {
      ordered = computeSwissStandings(divisionId).map(function (r) { return r.team; });
    }

    var pairs = pairTeamsSwiss(ordered, existingSwissMatches);
    var newMatches = pairs.map(function (pair, i) {
      return createSwissMatch(divisionId, roundNumber, i + 1,
        pair[0] ? pair[0].id : null,
        pair[1] ? pair[1].id : null
      );
    });

    state.matches = state.matches.concat(newMatches);
    newMatches.forEach(autoAdvanceByeMatch);
    saveState();
    renderAll();
  }

  function handleGenerateSwissRound() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) { window.alert("Select a division."); return; }

    var teams = getDivisionTeams(divisionId);
    if (teams.length < 2) { window.alert("Need at least 2 teams in this division."); return; }

    var existing = getSwissMatches(divisionId);

    if (!existing.length) {
      generateSwissRound(divisionId, 1, []);
      return;
    }

    var roundNums = existing.map(function (m) { return m.roundNumber; });
    var lastRound = Math.max.apply(null, roundNums);
    var lastRoundMatches = existing.filter(function (m) { return m.roundNumber === lastRound; });
    var incomplete = lastRoundMatches.filter(function (m) {
      return m.status !== "completed" && m.teamAId && m.teamBId;
    });

    if (incomplete.length > 0) {
      window.alert("Complete all Round " + lastRound + " matches before generating the next round.");
      return;
    }

    generateSwissRound(divisionId, lastRound + 1, existing);
  }

  function handleClearSwissRounds() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) { window.alert("Select a division."); return; }

    if (!getSwissMatches(divisionId).length) {
      window.alert("No Swiss rounds exist for this division.");
      return;
    }

    if (!window.confirm("Remove all Swiss rounds for this division? This cannot be undone.")) { return; }

    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && m.stage === "swiss");
    });
    saveState();
    renderAll();
  }

  // ── Pool Play / Crossover / Full Placement ──────────────────────────────

  function getPools(divisionId) {
    return state.pools.filter(function (p) { return p.divisionId === divisionId; });
  }

  function getCrossoverMatches(divisionId) {
    return state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.stage === "crossover";
    });
  }

  // Compute standings for a subset of teams using only matches where both teams
  // are in the given teamIds list.
  function computePoolStandingsForTeams(teamIds, allCompletedPoolMatches) {
    var poolMatches = allCompletedPoolMatches.filter(function (m) {
      return teamIds.indexOf(m.teamAId) >= 0 && teamIds.indexOf(m.teamBId) >= 0;
    });

    var stats = {};
    teamIds.forEach(function (id) {
      stats[id] = { teamId: id, wins: 0, losses: 0, setsWon: 0, setsLost: 0, pointsFor: 0, pointsAgainst: 0 };
    });

    poolMatches.forEach(function (m) {
      var a = stats[m.teamAId];
      var b = stats[m.teamBId];
      if (!a || !b) { return; }
      m.setScores.forEach(function (set) {
        a.pointsFor += set.teamAScore;
        a.pointsAgainst += set.teamBScore;
        b.pointsFor += set.teamBScore;
        b.pointsAgainst += set.teamAScore;
        if (set.teamAScore > set.teamBScore) { a.setsWon += 1; b.setsLost += 1; }
        else if (set.teamBScore > set.teamAScore) { b.setsWon += 1; a.setsLost += 1; }
      });
      if (m.winnerId === m.teamAId) { a.wins += 1; b.losses += 1; }
      else if (m.winnerId === m.teamBId) { b.wins += 1; a.losses += 1; }
    });

    return teamIds.map(function (id) { return stats[id]; }).sort(function (a, b) {
      if (b.wins !== a.wins) { return b.wins - a.wins; }
      var aS = calcRatio(a.setsWon, a.setsLost), bS = calcRatio(b.setsWon, b.setsLost);
      if (aS !== bS) { return bS - aS; }
      return calcRatio(b.pointsFor, b.pointsAgainst) - calcRatio(a.pointsFor, a.pointsAgainst);
    });
  }

  // Rank all teams in a division cross-pool: all 1st-place teams (sorted by
  // record), then all 2nd-place, etc. Falls back to division standings if no
  // pools are configured.
  function rankTeamsCrossPool(divisionId) {
    var pools = getPools(divisionId);
    if (!pools.length) {
      return computeStandings(divisionId).map(function (r) { return r.team; });
    }

    var completedPoolMatches = state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.stage === "pool" && m.status === "completed";
    });

    var allPoolStandings = pools.map(function (pool) {
      return computePoolStandingsForTeams(pool.teamIds, completedPoolMatches);
    });

    var maxDepth = allPoolStandings.reduce(function (mx, ps) { return Math.max(mx, ps.length); }, 0);
    var ranked = [];

    for (var pos = 0; pos < maxDepth; pos += 1) {
      var teamsAtPos = [];
      allPoolStandings.forEach(function (ps) {
        if (ps[pos]) { teamsAtPos.push(ps[pos]); }
      });
      teamsAtPos.sort(function (a, b) {
        if (b.wins !== a.wins) { return b.wins - a.wins; }
        var aS = calcRatio(a.setsWon, a.setsLost), bS = calcRatio(b.setsWon, b.setsLost);
        if (aS !== bS) { return bS - aS; }
        return calcRatio(b.pointsFor, b.pointsAgainst) - calcRatio(a.pointsFor, a.pointsAgainst);
      });
      ranked = ranked.concat(teamsAtPos);
    }

    return ranked.map(function (stat) { return findTeam(stat.teamId); }).filter(Boolean);
  }

  // Distribute division teams into N pools using snake-draft ordering.
  function handleAutoSplitPools() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) { window.alert("Select a division."); return; }

    var count = parseInt(ui.poolCount.value, 10);
    if (!count || count < 2) { window.alert("Enter at least 2 pools."); return; }

    var teams = getDivisionTeams(divisionId);
    if (teams.length < count * 2) {
      window.alert("Need at least " + (count * 2) + " teams for " + count + " pools.");
      return;
    }

    state.pools = state.pools.filter(function (p) { return p.divisionId !== divisionId; });

    var letters = "ABCDEFGHIJKLMNOP";
    var pools = [];
    for (var i = 0; i < count; i += 1) {
      pools.push({ id: createId("pool"), divisionId: divisionId, name: "Pool " + (letters[i] || (i + 1)), teamIds: [] });
    }

    // Snake draft: round 0 → 0,1,...,N-1; round 1 → N-1,...,1,0; alternating
    teams.forEach(function (team, idx) {
      var round = Math.floor(idx / count);
      var pos = idx % count;
      var poolIdx = round % 2 === 0 ? pos : count - 1 - pos;
      pools[poolIdx].teamIds.push(team.id);
    });

    state.pools = state.pools.concat(pools);
    saveState();
    renderBrackets();
  }

  // Generate round-robin matches within each pool (clears existing pool matches).
  function handleGeneratePoolMatchesPools() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) { window.alert("Select a division."); return; }

    var pools = getPools(divisionId);
    if (!pools.length) { window.alert("Set up pools first using Auto-Split Teams."); return; }

    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && m.stage === "pool");
    });

    var allNew = [];
    pools.forEach(function (pool) {
      var teams = pool.teamIds.map(function (id) { return findTeam(id); }).filter(Boolean);
      var roundNum = 0;
      for (var i = 0; i < teams.length; i += 1) {
        for (var j = i + 1; j < teams.length; j += 1) {
          roundNum += 1;
          allNew.push({
            id: createId("match"), divisionId: divisionId, poolId: pool.id,
            stage: "pool", roundNumber: roundNum, indexInRound: 1,
            teamAId: teams[i].id, teamBId: teams[j].id,
            venueId: null, courtId: null, startTime: null, durationMinutes: null,
            status: "scheduled", setScores: [], winnerId: null, loserId: null, workTeamId: null
          });
        }
      }
    });

    state.matches = state.matches.concat(allNew);
    saveState();
    renderAll();
  }

  // Generate crossover matches: seed 1 vs seed N, 2 vs N-1, etc.
  function handleGenerateCrossovers() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) { window.alert("Select a division."); return; }

    var ranked = rankTeamsCrossPool(divisionId);
    if (ranked.length < 4) {
      window.alert("Need at least 4 ranked teams to generate crossovers. Complete pool play first.");
      return;
    }

    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && (
        m.stage === "crossover" || m.stage === "placement-champ" || m.stage === "placement-consol"
      ));
    });

    var N = ranked.length;
    var half = Math.floor(N / 2);
    var newMatches = [];
    for (var i = 0; i < half; i += 1) {
      newMatches.push({
        id: createId("match"), divisionId: divisionId, stage: "crossover",
        roundNumber: 1, indexInRound: i + 1,
        teamAId: ranked[i].id, teamBId: ranked[N - 1 - i].id,
        venueId: null, courtId: null, startTime: null, durationMinutes: null,
        status: "scheduled", setScores: [], winnerId: null, loserId: null, workTeamId: null
      });
    }

    state.matches = state.matches.concat(newMatches);
    saveState();
    renderBrackets();
  }

  // Build a placement bracket shell (all null slots) for a given side/stage.
  function buildPlacementBracket(divisionId, stage, slotCount) {
    var size = nextPowerOfTwo(slotCount);
    var rounds = Math.round(Math.log2(size));
    var r1 = [];
    for (var i = 0; i < size / 2; i += 1) {
      r1.push({ id: createId("match"), divisionId: divisionId, stage: stage,
        roundNumber: 1, indexInRound: i + 1,
        teamAId: null, teamBId: null, venueId: null, courtId: null,
        startTime: null, durationMinutes: null, status: "scheduled",
        setScores: [], winnerId: null, loserId: null, workTeamId: null });
    }
    var all = r1.slice();
    var prior = r1;
    for (var round = 2; round <= rounds; round += 1) {
      var curr = [];
      for (var slot = 0; slot < prior.length; slot += 2) {
        curr.push({ id: createId("match"), divisionId: divisionId, stage: stage,
          roundNumber: round, indexInRound: Math.floor(slot / 2) + 1,
          teamAId: null, teamBId: null, venueId: null, courtId: null,
          startTime: null, durationMinutes: null, status: "scheduled",
          setScores: [], winnerId: null, loserId: null, workTeamId: null });
      }
      all = all.concat(curr);
      prior = curr;
    }
    return all;
  }

  // Generate full-placement brackets (championship + consolation) from crossovers.
  function handleGeneratePlacement() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) { window.alert("Select a division."); return; }

    var crossoverList = getCrossoverMatches(divisionId);
    if (!crossoverList.length) {
      window.alert("Generate crossover matches first.");
      return;
    }

    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && (
        m.stage === "placement-champ" || m.stage === "placement-consol"
      ));
    });

    var N = crossoverList.length;
    var champMatches = buildPlacementBracket(divisionId, "placement-champ", N);
    var consolMatches = buildPlacementBracket(divisionId, "placement-consol", N);
    state.matches = state.matches.concat(champMatches).concat(consolMatches);
    recomputePlacementProgression(divisionId);
    saveState();
    renderBrackets();
  }

  // Propagate crossover results into both placement brackets and advance them.
  function recomputePlacementProgression(divisionId) {
    var crossoverList = getCrossoverMatches(divisionId)
      .sort(function (a, b) { return a.indexInRound - b.indexInRound; });
    if (!crossoverList.length) { return; }

    [
      { stage: "placement-champ", field: "winnerId" },
      { stage: "placement-consol", field: "loserId" }
    ].forEach(function (side) {
      var pMatches = state.matches.filter(function (m) {
        return m.divisionId === divisionId && m.stage === side.stage;
      });
      if (!pMatches.length) { return; }

      var rounds = groupBracketRounds(pMatches);
      var roundNums = Object.keys(rounds).map(Number).sort(function (a, b) { return a - b; });
      roundNums.forEach(function (rn) { rounds[rn].sort(function (a, b) { return a.indexInRound - b.indexInRound; }); });

      if (rounds[1]) {
        rounds[1].forEach(function (match, i) {
          var srcA = crossoverList[i * 2] || null;
          var srcB = crossoverList[i * 2 + 1] || null;
          var tA = srcA ? (srcA[side.field] || null) : null;
          var tB = srcB ? (srcB[side.field] || null) : null;
          if (match.teamAId !== tA || match.teamBId !== tB) {
            match.teamAId = tA; match.teamBId = tB;
            match.setScores = []; match.winnerId = null;
            match.loserId = null; match.status = "scheduled";
          }
          autoAdvanceByeMatch(match);
        });
      }

      for (var i = 1; i < roundNums.length; i += 1) {
        var current = rounds[roundNums[i]];
        var prior = rounds[roundNums[i - 1]];
        current.forEach(function (match) {
          var left = prior[(match.indexInRound - 1) * 2];
          var right = prior[(match.indexInRound - 1) * 2 + 1];
          var nextA = left ? left.winnerId : null;
          var nextB = right ? right.winnerId : null;
          if (match.teamAId !== nextA || match.teamBId !== nextB) {
            match.teamAId = nextA; match.teamBId = nextB;
            match.setScores = []; match.winnerId = null;
            match.loserId = null; match.status = "scheduled";
          }
          autoAdvanceByeMatch(match);
        });
      }
    });
  }

  // Remove all pools, crossover, and placement matches for the division.
  function handleClearPoolsAndPlacement() {
    var divisionId = ui.bracketDivision.value;
    if (!divisionId) { window.alert("Select a division."); return; }

    var hasPools = getPools(divisionId).length > 0;
    var hasCross = getCrossoverMatches(divisionId).length > 0;
    if (!hasPools && !hasCross) {
      window.alert("No pool or placement data exists for this division.");
      return;
    }

    if (!window.confirm("Remove all pools, crossover matches, and placement brackets for this division?")) { return; }

    state.pools = state.pools.filter(function (p) { return p.divisionId !== divisionId; });
    state.matches = state.matches.filter(function (m) {
      return !(m.divisionId === divisionId && (
        m.stage === "crossover" || m.stage === "placement-champ" || m.stage === "placement-consol"
      ));
    });
    saveState();
    renderAll();
  }

  // Render pool standings cards into the pool assignment board element.
  function renderPoolAssignmentBoard(divisionId) {
    if (!ui.poolAssignmentBoard) { return; }
    if (!divisionId) {
      ui.poolAssignmentBoard.innerHTML = "";
      return;
    }

    var pools = getPools(divisionId);
    if (!pools.length) {
      ui.poolAssignmentBoard.innerHTML = "<p class=\"text-muted\">No pools configured. Set the number of pools and click Auto-Split Teams.</p>";
      return;
    }

    var completedPoolMatches = state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.stage === "pool" && m.status === "completed";
    });

    var poolCards = pools.map(function (pool) {
      var stats = computePoolStandingsForTeams(pool.teamIds, completedPoolMatches);
      var rows = stats.map(function (stat, pos) {
        var team = findTeam(stat.teamId);
        return "<tr><td>" + (pos + 1) + "</td><td>" + escapeHtml(team ? team.name : "?") +
          "</td><td>" + stat.wins + "-" + stat.losses + "</td></tr>";
      }).join("");
      if (!rows) {
        rows = pool.teamIds.map(function (id) {
          var t = findTeam(id);
          return "<tr><td>—</td><td>" + escapeHtml(t ? t.name : "?") + "</td><td>0-0</td></tr>";
        }).join("");
      }
      return "<div class=\"pool-card\">" +
        "<h4>" + escapeHtml(pool.name) + "</h4>" +
        "<table class=\"pool-table\"><thead><tr><th>#</th><th>Team</th><th>W-L</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }).join("");

    ui.poolAssignmentBoard.innerHTML = "<div class=\"pool-grid\">" + poolCards + "</div>";
  }

  // Build HTML for crossover and placement bracket sections (used in renderBrackets).
  function buildCrossoverPlacementHtml(divisionId) {
    var html = "";
    var crossoverList = getCrossoverMatches(divisionId)
      .sort(function (a, b) { return a.indexInRound - b.indexInRound; });

    if (crossoverList.length) {
      var totalCO = crossoverList.length;
      var coItems = crossoverList.map(function (match, idx) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        var winner = findTeam(match.winnerId);
        return "<div class=\"bracket-match\">" +
          "<strong>" + escapeHtml(teamA ? "#" + (idx + 1) + " " + teamA.name : "TBD") +
          " vs " + escapeHtml(teamB ? "#" + (totalCO * 2 - idx) + " " + teamB.name : "TBD") + "</strong>" +
          "<div class=\"bracket-meta\">" + escapeHtml(match.status) +
          (winner ? " | " + escapeHtml(winner.name) + " → Champ; loser → Consol" : "") +
          "</div></div>";
      }).join("");
      html += "<h3 class=\"crossover-heading\">Crossover Matches</h3>" +
        "<div class=\"bracket-grid\"><section class=\"bracket-round\"><h3>Crossovers</h3>" +
        coItems + "</section></div>";
    }

    html += renderSidePlacementHtml(divisionId, "placement-champ", "Championship");
    html += renderSidePlacementHtml(divisionId, "placement-consol", "Consolation");
    return html;
  }

  function renderSidePlacementHtml(divisionId, stage, label) {
    var matches = state.matches.filter(function (m) {
      return m.divisionId === divisionId && m.stage === stage;
    });
    if (!matches.length) { return ""; }

    var rounds = groupBracketRounds(matches);
    var keys = Object.keys(rounds).map(Number).sort(function (a, b) { return a - b; });
    var total = keys.length;

    var sections = keys.map(function (rn) {
      var rMatches = rounds[rn].slice().sort(function (a, b) { return a.indexInRound - b.indexInRound; });
      var title = rn === total ? label + " Final" :
        (rn === total - 1 && total > 2 ? label + " Semifinal" : label + " Round " + rn);
      var items = rMatches.map(function (match) {
        var teamA = findTeam(match.teamAId);
        var teamB = findTeam(match.teamBId);
        var winner = findTeam(match.winnerId);
        return "<div class=\"bracket-match\">" +
          "<strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " +
          escapeHtml(teamB ? teamB.name : "TBD") + "</strong>" +
          "<div class=\"bracket-meta\">" + escapeHtml(match.status) +
          (winner ? " | Winner: " + escapeHtml(winner.name) : "") + "</div></div>";
      }).join("");
      return "<section class=\"bracket-round\"><h3>" + escapeHtml(title) + "</h3>" + items + "</section>";
    }).join("");

    var headingClass = stage === "placement-champ" ? "placement-champ-heading" : "placement-consol-heading";
    return "<h3 class=\"" + headingClass + "\">" + label + " Bracket</h3>" +
      "<div class=\"bracket-grid\">" + sections + "</div>";
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
    auditLog("Imported " + added + " team" + (added === 1 ? "" : "s") + " from CSV");
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

    if (match.stage !== "pool" && match.stage !== "swiss") {
      recomputeBracketProgression(match.divisionId);
    }
    var loserTeam = findTeam(match.loserId);
    auditLog("Forfeit: " + (loserTeam ? loserTeam.name : "unknown") + " forfeited \u2014 " + getMatchLabel(match));
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
    if (match.stage !== "pool" && match.stage !== "swiss") {
      recomputeBracketProgression(match.divisionId);
    }
    auditLog("Score saved: " + getMatchLabel(match) + " \u2192 " + match.status);
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
      auditLog("Match locked: " + getMatchLabel(match));
      saveState();
      renderMatches();
      renderDashboardStats();
      return;
    }
    if (action === "unlock-match") {
      match.locked = false;
      auditLog("Match unlocked: " + getMatchLabel(match));
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
    if (match.stage !== "pool" && match.stage !== "swiss") {
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

  // ── Generate Test Data ───────────────────────────────────────────────────

  function handleGenerateTestData() {
    var hasData = state.divisions.length > 0 || state.teams.length > 0 || state.matches.length > 0;
    if (hasData) {
      if (!window.confirm("This will replace all current tournament data with a test tournament.\n\nContinue?")) {
        return;
      }
    }

    var newState = createEmptyState();

    // Tournament
    var today = new Date();
    var todayStr = today.toISOString().slice(0, 10);
    var tomorrowStr = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
    newState.tournament.name = "Spring Classic 2026";
    newState.tournament.startDate = todayStr;
    newState.tournament.endDate = tomorrowStr;

    // Venues
    var venueMain = {
      id: "v-test-main",
      name: "Main Sports Center",
      courts: [
        { id: "c-test-m1", label: "Court 1" },
        { id: "c-test-m2", label: "Court 2" },
        { id: "c-test-m3", label: "Court 3" },
        { id: "c-test-m4", label: "Court 4" }
      ]
    };
    var venueNorth = {
      id: "v-test-north",
      name: "North Gymnasium",
      courts: [
        { id: "c-test-na", label: "Court A" },
        { id: "c-test-nb", label: "Court B" }
      ]
    };
    newState.venues.push(venueMain, venueNorth);

    // Divisions
    var divisions = [
      { id: "d-test-14g", name: "14U Girls",  formatId: "bo3"  },
      { id: "d-test-16g", name: "16U Girls",  formatId: "bo3"  },
      { id: "d-test-18b", name: "18U Boys",   formatId: "2s25" },
      { id: "d-test-om",  name: "Open Mixed", formatId: "2s25" }
    ];
    divisions.forEach(function (d) { newState.divisions.push(d); });

    // Teams — 4 per division
    var teamGroups = [
      [
        { id: "t-test-14g-1", name: "Lakeside 14U",        club: "Lakeside VC",   seed: 1 },
        { id: "t-test-14g-2", name: "Mountain Fire 14U",   club: "Mountain Fire", seed: 2 },
        { id: "t-test-14g-3", name: "Valley Storm 14U",    club: "Valley SC",     seed: 3 },
        { id: "t-test-14g-4", name: "Westside Thunder 14U",club: "Westside",      seed: 4 }
      ],
      [
        { id: "t-test-16g-1", name: "Lakeside 16U",        club: "Lakeside VC",   seed: 1 },
        { id: "t-test-16g-2", name: "Mountain Fire 16U",   club: "Mountain Fire", seed: 2 },
        { id: "t-test-16g-3", name: "Eastside Sparks 16U", club: "Eastside SC",   seed: 3 },
        { id: "t-test-16g-4", name: "River Valley 16U",    club: "River Valley",  seed: 4 }
      ],
      [
        { id: "t-test-18b-1", name: "Lakeside 18B",        club: "Lakeside VC",   seed: 1 },
        { id: "t-test-18b-2", name: "North County 18B",    club: "North County",  seed: 2 },
        { id: "t-test-18b-3", name: "South Shore 18B",     club: "South Shore",   seed: 3 },
        { id: "t-test-18b-4", name: "Inland Force 18B",    club: "Inland Force",  seed: 4 }
      ],
      [
        { id: "t-test-om-1",  name: "Unity Mixed",         club: "Unity VC",      seed: 1 },
        { id: "t-test-om-2",  name: "Highrise Mixed",      club: "Highrise",      seed: 2 },
        { id: "t-test-om-3",  name: "Crossfire Mixed",     club: "Crossfire",     seed: 3 },
        { id: "t-test-om-4",  name: "Voltage Mixed",       club: "Voltage",       seed: 4 }
      ]
    ];
    teamGroups.forEach(function (group, divIndex) {
      group.forEach(function (team) {
        newState.teams.push({
          id: team.id,
          name: team.name,
          club: team.club,
          coach: "",
          divisionId: divisions[divIndex].id,
          seed: team.seed
        });
      });
    });

    // Matches — round-robin per division, one dedicated court each (sequential).
    // Main Sports Center: 14U Girls → Court 1, 16U Girls → Court 2
    // North Gymnasium:    18U Boys  → Court A, Open Mixed → Court B
    // Sequential scheduling means only 2 teams are ever busy at the same time
    // within a division, keeping the other 2 free for work duties.
    var divCourtMap = [
      { venue: venueMain,  court: venueMain.courts[0]  },
      { venue: venueMain,  court: venueMain.courts[1]  },
      { venue: venueNorth, court: venueNorth.courts[0] },
      { venue: venueNorth, court: venueNorth.courts[1] }
    ];
    var slotMs = (45 + 10) * 60000;
    var base8am = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0);

    divisions.forEach(function (div, divIndex) {
      var teams = teamGroups[divIndex];
      var assign = divCourtMap[divIndex];
      var pairs = [];
      var i, j;
      for (i = 0; i < teams.length; i += 1) {
        for (j = i + 1; j < teams.length; j += 1) {
          pairs.push([teams[i], teams[j]]);
        }
      }
      pairs.forEach(function (pair, idx) {
        var start = new Date(base8am.getTime() + idx * slotMs);
        newState.matches.push({
          id: "m-test-" + div.id + "-" + idx,
          divisionId: div.id,
          stage: "pool",
          roundNumber: idx + 1,
          teamAId: pair[0].id,
          teamBId: pair[1].id,
          venueId: assign.venue.id,
          courtId: assign.court.id,
          startTime: start.toISOString(),
          durationMinutes: 45,
          status: "scheduled",
          setScores: [],
          winnerId: null,
          loserId: null,
          workTeamId: null,
          locked: false,
          forfeited: false
        });
      });
    });

    // Work teams — only assign teams not playing in the same time slot
    divisions.forEach(function (div, divIndex) {
      var teams = teamGroups[divIndex];
      var ids = teams.map(function (t) { return t.id; });
      var divMatches = newState.matches.filter(function (m) { return m.divisionId === div.id; });
      divMatches.forEach(function (match) {
        var slot = match.startTime || ("round-" + match.roundNumber);
        var busyIds = {};
        divMatches.forEach(function (m) {
          if ((m.startTime || ("round-" + m.roundNumber)) === slot) {
            busyIds[m.teamAId] = true;
            busyIds[m.teamBId] = true;
          }
        });
        var eligible = ids.filter(function (tid) { return !busyIds[tid]; });
        if (eligible.length) {
          var mIdx = divMatches.indexOf(match);
          match.workTeamId = eligible[mIdx % eligible.length];
        }
      });
    });

    // Completed scores
    // bo3 divisions (0, 1): 3 completed matches each
    // 2s25 divisions (2, 3): 2 completed matches each (only 2-0 outcomes in 2-set format)
    var completedData = [
      [ // 14U Girls (bo3)
        { idx: 0, sets: [[25, 20], [18, 25], [15, 10]] },
        { idx: 1, sets: [[25, 18], [25, 22]] },
        { idx: 2, sets: [[22, 25], [25, 23], [15, 12]] }
      ],
      [ // 16U Girls (bo3)
        { idx: 0, sets: [[25, 22], [25, 21]] },
        { idx: 1, sets: [[20, 25], [25, 23], [12, 15]] },
        { idx: 2, sets: [[25, 17], [25, 20]] }
      ],
      [ // 18U Boys (2s25)
        { idx: 0, sets: [[25, 21], [25, 19]] },
        { idx: 1, sets: [[19, 25], [22, 25]] }
      ],
      [ // Open Mixed (2s25)
        { idx: 0, sets: [[25, 20], [25, 23]] },
        { idx: 1, sets: [[23, 25], [21, 25]] }
      ]
    ];

    completedData.forEach(function (entries, divIndex) {
      var divId = divisions[divIndex].id;
      var divMatches = newState.matches.filter(function (m) { return m.divisionId === divId; });
      entries.forEach(function (entry) {
        var match = divMatches[entry.idx];
        if (!match) { return; }
        match.setScores = entry.sets.map(function (s) {
          return { teamAScore: s[0], teamBScore: s[1] };
        });
        var aSets = 0, bSets = 0;
        match.setScores.forEach(function (set) {
          if (set.teamAScore > set.teamBScore) { aSets += 1; }
          else if (set.teamBScore > set.teamAScore) { bSets += 1; }
        });
        if (aSets > bSets) {
          match.status = "completed";
          match.winnerId = match.teamAId;
          match.loserId = match.teamBId;
        } else if (bSets > aSets) {
          match.status = "completed";
          match.winnerId = match.teamBId;
          match.loserId = match.teamAId;
        }
      });
    });

    // Apply to app state
    state = newState;
    auditLog("Test tournament data loaded");
    saveState();
    renderAll();

    // Pre-select the first division in key dropdowns so every view is
    // immediately usable without the user having to pick a division manually.
    var firstDivId = state.divisions.length ? state.divisions[0].id : "";
    if (firstDivId) {
      if (ui.matchDivision)    { ui.matchDivision.value    = firstDivId; renderMatches(); }
      if (ui.bracketDivision)  { ui.bracketDivision.value  = firstDivId; renderBrackets(); }
      if (ui.standingsDivision){ ui.standingsDivision.value = firstDivId; renderStandings(); renderFinalResults(); }
    }
    var firstVenueId = state.venues.length ? state.venues[0].id : "";
    if (firstVenueId && ui.publicVenueFilter) {
      ui.publicVenueFilter.value = firstVenueId;
      renderPublicBoard();
    }

    // Navigate to dashboard to see the overview
    var dashBtn = ui.nav.querySelector("[data-view='dashboard']");
    if (dashBtn) { dashBtn.click(); }

    var completed = state.matches.filter(function (m) { return m.status === "completed"; }).length;
    window.alert(
      "Test tournament loaded!\n" +
      "\u2022 " + state.divisions.length + " divisions\n" +
      "\u2022 " + state.teams.length + " teams\n" +
      "\u2022 " + state.venues.length + " venues\n" +
      "\u2022 " + state.matches.length + " matches (" + completed + " completed)"
    );
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
    renderAdminSecurity();
    renderAuditLog();
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

  // ── Spec 15: Admin Lock & Audit Log ──────────────────────────────────────

  function applyAdminLockState() {
    document.body.classList.toggle("admin-locked", !adminUnlocked);
    if (ui.adminLockBtn) {
      ui.adminLockBtn.textContent = adminUnlocked ? "\uD83D\uDD12 Lock" : "\uD83D\uDD13 Unlock";
    }
  }

  function handleAdminLockBtn() {
    if (adminUnlocked) {
      // Lock: navigate to public view first
      adminUnlocked = false;
      applyAdminLockState();
      // Navigate to dashboard
      var dashboardBtn = ui.nav.querySelector("[data-view='dashboard']");
      if (dashboardBtn) { dashboardBtn.click(); }
    } else {
      // Unlock: check PIN
      var storedPin = localStorage.getItem(ADMIN_PIN_KEY);
      if (storedPin) {
        var entered = window.prompt("Enter admin PIN to unlock:");
        if (entered === null) { return; }
        if (entered !== storedPin) {
          var reset = window.confirm(
            "Incorrect PIN.\n\n" +
            "Forgot your PIN? Click OK to clear the PIN and unlock.\n" +
            "Click Cancel to try again."
          );
          if (!reset) { return; }
          localStorage.removeItem(ADMIN_PIN_KEY);
          auditLog("Admin PIN reset after forgotten PIN");
        }
      }
      adminUnlocked = true;
      applyAdminLockState();
      auditLog("Admin unlocked");
    }
  }

  function renderAdminSecurity() {
    if (!ui.adminSecurityCard) { return; }
    var storedPin = localStorage.getItem(ADMIN_PIN_KEY);

    if (!storedPin) {
      ui.adminSecurityCard.innerHTML =
        "<h3 style='margin:0 0 0.6rem'>\uD83D\uDD10 Admin Security</h3>" +
        "<p style='margin:0 0 0.75rem;font-size:0.9rem'>PIN lock is <strong>disabled</strong> \u2014 the Lock button can be unlocked by anyone.</p>" +
        "<div class='form-actions'>" +
          "<button type='button' id='pin-enable-btn' class='secondary'>Enable PIN Lock</button>" +
        "</div>";

      document.getElementById("pin-enable-btn").addEventListener("click", function () {
        var val = window.prompt("Set a 4-digit PIN to require on unlock:");
        if (val === null) { return; }
        val = val.trim();
        if (!/^\d{4}$/.test(val)) {
          window.alert("PIN must be exactly 4 digits (0\u20139).");
          return;
        }
        localStorage.setItem(ADMIN_PIN_KEY, val);
        auditLog("Admin PIN lock enabled");
        renderAdminSecurity();
      });
    } else {
      ui.adminSecurityCard.innerHTML =
        "<h3 style='margin:0 0 0.6rem'>\uD83D\uDD10 Admin Security</h3>" +
        "<p style='margin:0 0 0.75rem;font-size:0.9rem'>PIN lock is <strong>enabled</strong>.</p>" +
        "<form id='pin-form' class='form-grid' style='gap:0.5rem'>" +
          "<label style='max-width:200px'>Change PIN (4 digits)" +
            "<input type='password' id='pin-input' maxlength='4' pattern='[0-9]{4}' placeholder='1234' inputmode='numeric'>" +
          "</label>" +
          "<div class='form-actions'>" +
            "<button type='submit' id='pin-save-btn'>Save New PIN</button>" +
            "<button type='button' id='pin-disable-btn' class='secondary'>Disable PIN Lock</button>" +
          "</div>" +
        "</form>";

      document.getElementById("pin-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var val = document.getElementById("pin-input").value.trim();
        if (!/^\d{4}$/.test(val)) {
          window.alert("PIN must be exactly 4 digits (0\u20139).");
          return;
        }
        localStorage.setItem(ADMIN_PIN_KEY, val);
        auditLog("Admin PIN changed");
        renderAdminSecurity();
      });

      document.getElementById("pin-disable-btn").addEventListener("click", function () {
        if (window.confirm("Disable PIN lock? Anyone will be able to unlock admin.")) {
          localStorage.removeItem(ADMIN_PIN_KEY);
          auditLog("Admin PIN lock disabled");
          renderAdminSecurity();
        }
      });
    }
  }

  function auditLog(action) {
    if (!Array.isArray(state.auditLog)) { state.auditLog = []; }
    state.auditLog.unshift({ ts: new Date().toISOString(), action: action });
    if (state.auditLog.length > 100) { state.auditLog.length = 100; }
    saveState();
    renderAuditLog();
  }

  function renderAuditLog() {
    if (!ui.auditLogSection) { return; }
    var log = Array.isArray(state.auditLog) ? state.auditLog : [];
    if (!log.length) {
      ui.auditLogSection.innerHTML = "";
      return;
    }
    var rows = log.slice(0, 20).map(function (entry) {
      var ts = "";
      try { ts = new Date(entry.ts).toLocaleString(); } catch (e) { ts = entry.ts; }
      return "<tr><td style='white-space:nowrap;color:var(--muted);font-size:0.8rem'>" + escapeHtml(ts) + "</td>" +
        "<td>" + escapeHtml(entry.action) + "</td></tr>";
    }).join("");
    ui.auditLogSection.innerHTML =
      "<h3 style='margin:0 0 0.6rem'>\uD83D\uDCCB Audit Log</h3>" +
      "<div style='overflow-x:auto'><table><thead><tr><th>Time</th><th>Action</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>" +
      (log.length > 20 ? "<p style='font-size:0.8rem;color:var(--muted);margin:0.4rem 0 0'>" + (log.length - 20) + " older entries not shown.</p>" : "");
  }

  // ─────────────────────────────────────────────────────────────────────────

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
    renderPoolAssignmentBoard(divisionId);
    var bracketMatches = getBracketMatches(divisionId);
    if (!bracketMatches.length) {
      var earlyCoHtml = buildCrossoverPlacementHtml(divisionId);
      ui.bracketBoard.innerHTML = earlyCoHtml ||
        "<p>No bracket yet for " + escapeHtml(division ? division.name : "this division") +
        ". Generate a single-elimination bracket to begin.</p>";
      renderPrintMeta(ui.printMetaBrackets, "Bracket", division ? ("Division: " + division.name) : "");
      return;
    }

    var rounds = groupBracketRounds(bracketMatches);
    var integrityIssues = computeBracketIntegrityIssues(divisionId);
    var isDE = getLosersMatches(divisionId).length > 0;
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

      var title;
      if (isDE) {
        title = roundNumber === roundKeys.length ? "WB Final" :
          (roundNumber === roundKeys.length - 1 && roundKeys.length > 2 ? "WB Semifinal" :
            "WB Round " + roundNumber);
      } else {
        title = roundNumber === roundKeys.length ? "Final" :
          (roundNumber === roundKeys.length - 1 && roundKeys.length > 2 ? "Semifinal" :
            "Round " + roundNumber);
      }
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

    var consolHtml = "";
    var consolMatches = getConsolationMatches(divisionId);
    if (consolMatches.length) {
      var consolRounds = groupBracketRounds(consolMatches);
      var consolKeys = Object.keys(consolRounds).map(function (k) {
        return parseInt(k, 10);
      }).sort(function (a, b) { return a - b; });
      var totalConsolRounds = consolKeys.length;

      var consolSections = consolKeys.map(function (rn) {
        var cMatches = consolRounds[rn].slice().sort(function (a, b) { return a.indexInRound - b.indexInRound; });
        var cTitle = rn === totalConsolRounds
          ? "Consolation Final"
          : (rn === totalConsolRounds - 1 && totalConsolRounds > 2
            ? "Consolation Semifinal"
            : "Consolation Round " + rn);
        var cItems = cMatches.map(function (match) {
          var teamA = findTeam(match.teamAId);
          var teamB = findTeam(match.teamBId);
          var winner = findTeam(match.winnerId);
          return "<div class=\"bracket-match\">" +
            "<strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " + escapeHtml(teamB ? teamB.name : "TBD") + "</strong>" +
            "<div class=\"bracket-meta\">" +
            escapeHtml(match.status) +
            (winner ? (" | Winner: " + winner.name) : "") +
            (match.startTime ? (" | " + formatDateTime(match.startTime)) : "") +
            "</div></div>";
        }).join("");
        return "<section class=\"bracket-round\"><h3>" + escapeHtml(cTitle) + "</h3>" + cItems + "</section>";
      }).join("");

      consolHtml = "<h3 class=\"consolation-bracket-heading\">Consolation Bracket</h3>" +
        "<div class=\"bracket-grid\">" + consolSections + "</div>";
    }

    // ── Losers Bracket (Double Elimination) ─────────────────────────────
    var lbHtml = "";
    var lbMatches = getLosersMatches(divisionId);
    if (lbMatches.length) {
      var lbRounds = groupBracketRounds(lbMatches);
      var lbKeys = Object.keys(lbRounds).map(function (k) { return parseInt(k, 10); }).sort(function (a, b) { return a - b; });
      var totalLbRounds = lbKeys.length;

      var lbSections = lbKeys.map(function (rn) {
        var lbRMatches = lbRounds[rn].slice().sort(function (a, b) { return a.indexInRound - b.indexInRound; });
        var lbTitle = rn === totalLbRounds ? "LB Final" :
          (rn === totalLbRounds - 1 && totalLbRounds > 2 ? "LB Semifinal" : "LB Round " + rn);
        var items = lbRMatches.map(function (match) {
          var teamA = findTeam(match.teamAId);
          var teamB = findTeam(match.teamBId);
          var winner = findTeam(match.winnerId);
          return "<div class=\"bracket-match\">" +
            "<strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " + escapeHtml(teamB ? teamB.name : "TBD") + "</strong>" +
            "<div class=\"bracket-meta\">" + escapeHtml(match.status) +
            (winner ? " | Winner: " + winner.name : "") +
            (match.startTime ? " | " + formatDateTime(match.startTime) : "") +
            "</div></div>";
        }).join("");
        return "<section class=\"bracket-round\"><h3>" + escapeHtml(lbTitle) + "</h3>" + items + "</section>";
      }).join("");

      lbHtml = "<h3 class=\"losers-bracket-heading\">Losers Bracket</h3>" +
        "<div class=\"bracket-grid\">" + lbSections + "</div>";
    }

    // ── Grand Final ──────────────────────────────────────────────────────
    var gfHtml = "";
    var gfList = getGrandFinalMatches(divisionId);
    if (gfList.length) {
      var gf = gfList[0];
      var teamA = findTeam(gf.teamAId);
      var teamB = findTeam(gf.teamBId);
      var winner = findTeam(gf.winnerId);
      var gfMatchHtml = "<div class=\"bracket-match\">" +
        "<strong>" + escapeHtml(teamA ? teamA.name : "TBD") + " vs " + escapeHtml(teamB ? teamB.name : "TBD") + "</strong>" +
        "<div class=\"bracket-meta\">" + escapeHtml(gf.status) +
        (winner ? " | Winner: " + winner.name : "") +
        (gf.startTime ? " | " + formatDateTime(gf.startTime) : "") +
        "</div></div>";
      gfHtml = "<h3 class=\"grand-final-heading\">Grand Final</h3>" +
        "<div class=\"bracket-grid\"><section class=\"bracket-round\"><h3>Grand Final</h3>" +
        gfMatchHtml + "</section></div>" +
        (winner ? "<p class=\"grand-final-champion\">Champion: <strong>" + escapeHtml(winner.name) + "</strong></p>" : "");
    }

    var wbLabel = isDE ? "<h3 class=\"winners-bracket-heading\">Winners Bracket</h3>" : "";

    // ── Swiss Rounds ────────────────────────────────────────────────────
    var swissHtml = "";
    var swissMatches = getSwissMatches(divisionId);
    if (swissMatches.length) {
      var swissRoundGroups = groupBracketRounds(swissMatches);
      var swissRoundKeys = Object.keys(swissRoundGroups).map(Number).sort(function (a, b) { return a - b; });
      var lastSwissRound = swissRoundKeys[swissRoundKeys.length - 1];

      var swissSections = swissRoundKeys.map(function (rn) {
        var rMatches = swissRoundGroups[rn].slice().sort(function (a, b) { return a.indexInRound - b.indexInRound; });
        var items = rMatches.map(function (match) {
          var teamA = findTeam(match.teamAId);
          var teamB = findTeam(match.teamBId);
          var winner = findTeam(match.winnerId);
          return "<div class=\"bracket-match\">" +
            "<strong>" + escapeHtml(teamA ? teamA.name : "BYE") + " vs " + escapeHtml(teamB ? teamB.name : "BYE") + "</strong>" +
            "<div class=\"bracket-meta\">" + escapeHtml(match.status) +
            (winner ? " | Winner: " + winner.name : "") +
            "</div></div>";
        }).join("");
        return "<section class=\"bracket-round\"><h3>Round " + rn + "</h3>" + items + "</section>";
      }).join("");

      // Standing table from Swiss results
      var swissRows = computeSwissStandings(divisionId);
      var roundsComplete = swissRoundKeys.every(function (rn) {
        return swissRoundGroups[rn].every(function (m) {
          return m.status === "completed" || !m.teamBId; // bye counts as done
        });
      });
      var standingsRows = swissRows.map(function (row, i) {
        return "<tr><td>" + (i + 1) + "</td><td>" + escapeHtml(row.team.name) +
          "</td><td>" + row.wins + "-" + row.losses +
          "</td><td>" + row.buchholz + "</td></tr>";
      }).join("");
      var standingsTable = "<h4>Swiss Standings after Round " + lastSwissRound + "</h4>" +
        "<table class=\"swiss-standings-table\"><thead>" +
        "<tr><th>#</th><th>Team</th><th>W-L</th><th>Buchholz</th></tr>" +
        "</thead><tbody>" + standingsRows + "</tbody></table>";

      swissHtml = "<h3 class=\"swiss-bracket-heading\">Swiss System</h3>" +
        "<div class=\"bracket-grid\">" + swissSections + "</div>" +
        "<div class=\"swiss-standings\">" + standingsTable + "</div>";
    }

    ui.bracketBoard.innerHTML = "<p><strong>" + escapeHtml(division ? division.name : "Bracket") + "</strong></p>" +
      renderBracketIntegrity(integrityIssues, divisionId) +
      wbLabel +
      "<div class=\"bracket-grid\">" + roundHtml + "</div>" +
      lbHtml +
      gfHtml +
      consolHtml +
      swissHtml +
      buildCrossoverPlacementHtml(divisionId);
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
        loserId: match.loserId || null,
        poolId: match.poolId || null,
        workTeamId: match.workTeamId || null,
        locked: match.locked || false,
        forfeited: match.forfeited || false
      };
    }) : [];
    normalized.auditLog = Array.isArray(input.auditLog) ? input.auditLog : [];
    normalized.pools = Array.isArray(input.pools) ? input.pools.map(function (pool) {
      return {
        id: pool.id || createId("pool"),
        divisionId: pool.divisionId || null,
        name: pool.name || "Pool",
        teamIds: Array.isArray(pool.teamIds) ? pool.teamIds : []
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
      recomputePlacementProgression(divisionId);
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
    recomputeConsolationProgression(divisionId);
    recomputeLosersProgression(divisionId);
    recomputePlacementProgression(divisionId);
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