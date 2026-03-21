(function () {
  function isInvitePage(pathname) {
    return (
      pathname.indexOf("/tournament") === 0 ||
      pathname.indexOf("/team") === 0 ||
      pathname.indexOf("/friendly") === 0
    );
  }

  function getPathParts() {
    return window.location.pathname.split("/").filter(Boolean);
  }

  function buildAppUrl(targetType, targetId, inviteCode) {
    var query = inviteCode ? "?invite=" + encodeURIComponent(inviteCode) : "";
    return "badmintonapp://" + targetType + "/" + encodeURIComponent(targetId || "") + query;
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

  function tryOpenApp(appUrl, inviteCode) {
    if (!inviteCode) return;
    // Attempt once on page load so invite links deep-link immediately.
    setTimeout(function () {
      openApp(appUrl);
    }, 100);
  }

  function setupInvitePage() {
    var parts = getPathParts();
    // supports /{type}/<id> and rewrite fallback /{type}/
    var targetType = parts.length >= 1 ? parts[0] : "";
    var targetId = parts.length >= 2 ? parts[1] : "";
    if (!targetId) {
      var qsId = new URLSearchParams(window.location.search).get("id");
      targetId = qsId || "";
    }
    var inviteCode = (
      new URLSearchParams(window.location.search).get("invite") || ""
    ).trim();

    var idEl = document.getElementById("targetId");
    var codeEl = document.getElementById("inviteCode");
    var openBtn = document.getElementById("openInAppBtn");
    var copyBtn = document.getElementById("copyInviteBtn");
    var summary = document.getElementById("inviteSummary");

    if (idEl) idEl.textContent = targetId || "-";
    if (codeEl) codeEl.textContent = inviteCode || "-";
    if (summary && targetId) {
      summary.textContent =
        "Invite detected for " + targetType + " " + targetId + ". Open in app to continue.";
    }

    var appUrl = buildAppUrl(targetType, targetId, inviteCode);
    tryOpenApp(appUrl, inviteCode);

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
    setupInvitePage();
  }
})();

