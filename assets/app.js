(function () {
  function isInvitePage(pathname) {
    return pathname.indexOf("/tournament") === 0;
  }

  function getPathParts() {
    return window.location.pathname.split("/").filter(Boolean);
  }

  function buildAppUrl(tournamentId, inviteToken) {
    var query = inviteToken ? "?invite=" + encodeURIComponent(inviteToken) : "";
    return "badmintonapp://tournament/" + encodeURIComponent(tournamentId || "") + query;
  }

  function openApp(appUrl) {
    // Different mobile browsers allow different deep-link launch mechanisms.
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appUrl;
    document.body.appendChild(iframe);

    setTimeout(function () {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      window.location.href = appUrl;
    }, 250);
  }

  function tryOpenApp(appUrl, inviteToken) {
    if (!inviteToken) return;
    // Attempt once on page load so invite links deep-link immediately.
    setTimeout(function () {
      openApp(appUrl);
    }, 100);
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
    tryOpenApp(appUrl, inviteToken);

    if (openBtn) {
      openBtn.addEventListener("click", function () {
        openApp(appUrl);
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

  if (isInvitePage(window.location.pathname)) {
    setupTournamentPage();
  }
})();

