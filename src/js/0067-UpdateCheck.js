// "A new version is ready, tap to update" (item 52). Only on the website / installed home-screen app (http or https), never in the
// desktop app or a file opened from disk. The website publishes build.json (written by tools/build.js next to the game) with the
// build date of the copy it serves. This page knows its own build date (BUILD_INFO.date). If the website's copy is newer, a bar
// appears; tapping it fetches the new copy past every cache and reloads. Careers are saved after every action, so nothing is lost.
(function () {
  if (!/^https?:$/.test(location.protocol) || typeof BUILD_INFO === "undefined") return;
  var last = 0,
    dismissed = !1,
    me = Date.parse(BUILD_INFO.date);
  function bar(show) {
    var b = document.getElementById("update-bar");
    if (!show) return void (b && b.remove());
    if (b) return;
    b = document.createElement("div");
    b.id = "update-bar";
    b.setAttribute("role", "status");
    var t = document.createElement("button");
    t.type = "button";
    t.className = "update-go";
    t.textContent = "A new version is ready, tap to update";
    t.onclick = function () {
      t.textContent = "Updating…";
      // pull the new page past the browser cache (and into the offline copy), then reload it
      fetch(location.pathname + location.search, { cache: "reload" })
        .catch(function () {})
        .then(function () {
          location.reload();
        });
    };
    var x = document.createElement("button");
    x.type = "button";
    x.className = "update-later";
    x.setAttribute("aria-label", "Not now");
    x.textContent = "×";
    x.onclick = function () {
      dismissed = !0;
      bar(!1);
    };
    b.append(t, x);
    document.body.appendChild(b);
  }
  function check(force) {
    if (dismissed || (!force && Date.now() - last < 5 * 60 * 1000)) return;
    last = Date.now();
    fetch("build.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (j) {
        if (j && Date.parse(j.date) > me + 60000) bar(!0);
      })
      .catch(function () {});
  }
  setTimeout(function () {
    check(!0);
  }, 4000);
  document.addEventListener("visibilitychange", function () {
    document.visibilityState === "visible" && check(!1);
  });
  setInterval(function () {
    check(!1);
  }, 30 * 60 * 1000);
  window.__updateCheck = check;
})();
