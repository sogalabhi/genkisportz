(function () {
  function getPathParts() {
    return window.location.pathname.split("/").filter(Boolean);
  }

  function buildAppUrl(tournamentId, inviteToken) {
    var query = inviteToken ? "?invite=" + encodeURIComponent(inviteToken) : "";
    return "badmintonapp://tournament/" + encodeURIComponent(tournamentId) + query;
  }

  function setupTournamentPage() {
    var parts = getPathParts();
    // supports /tournament/<id> and rewrite fallback /tournament/
    var tournamentId = parts.length >= 2 ? parts[1] : "";
    if (!tournamentId) {
      var qsId = new URLSearchParams(window.location.search).get("id");
      tournamentId = qsId || "";
    }
    var inviteToken = new URLSearchParams(window.location.search).get("invite") || "";

    var tournamentEl = document.getElementById("tournamentId");
    var tokenEl = document.getElementById("inviteToken");
    var openBtn = document.getElementById("openInAppBtn");
    var copyBtn = document.getElementById("copyInviteBtn");
    var summary = document.getElementById("inviteSummary");

    if (tournamentEl) tournamentEl.textContent = tournamentId || "-";
    if (tokenEl) tokenEl.textContent = inviteToken || "-";
    if (summary && tournamentId) {
      summary.textContent =
        "Invite detected for tournament " + tournamentId + ". Open in app to continue.";
    }

    var appUrl = buildAppUrl(tournamentId, inviteToken);
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        window.location.href = appUrl;
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async function () {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.textContent = "Copied";
        } catch (_) {
          copyBtn.textContent = "Copy failed";
        }
      });
    }
  }

  if (window.location.pathname.indexOf("/tournament") === 0) {
    setupTournamentPage();
  }
})();

