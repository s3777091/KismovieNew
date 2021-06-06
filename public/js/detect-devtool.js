(function () {
  "use strict";

  const devtools = {
    isOpen: false,
    orientation: undefined,
  };

  const threshold = 160;

  const emitEvent = (isOpen, orientation) => {
    window.dispatchEvent(
      new CustomEvent("devtoolschange", {
        detail: {
          isOpen,
          orientation,
        },
      })
    );
  };

  const main = ({ emitEvents = true } = {}) => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? "vertical" : "horizontal";

    if (
      !(heightThreshold && widthThreshold) &&
      ((window.Firebug &&
        window.Firebug.chrome &&
        window.Firebug.chrome.isInitialized) ||
        widthThreshold ||
        heightThreshold)
    ) {
      if (
        (!devtools.isOpen || devtools.orientation !== orientation) &&
        emitEvents
      ) {
        emitEvent(true, orientation);
      }

      devtools.isOpen = true;
      devtools.orientation = orientation;
    } else {
      if (devtools.isOpen && emitEvents) {
        emitEvent(false, undefined);
      }

      devtools.isOpen = false;
      devtools.orientation = undefined;
    }
  };

  main({ emitEvents: false });
  setInterval(main, 500);

  if (typeof module !== "undefined" && module.exports) {
    module.exports = devtools;
  } else {
    window.devtools = devtools;
  }
})();

function detect() {
  var uagent = navigator.userAgent.toLowerCase();
  var mobile = false;
  var search_strings = [
    "iphone",
    "ipod",
    "ipad",
    "series60",
    "symbian",
    "android",
    "windows ce",
    "windows7phone",
    "w7p",
    "blackberry",
    "palm",
  ];
  for (i in search_strings) {
    if (uagent.search(search_strings[i]) > -1) mobile = true;
  }
  return mobile;
}
if (!detect()) {
// Check if it's open
if (window.devtools.isOpen) {
    window.location.href = "/";
  }
  // Get notified when it's opened/closed or orientation changes
  window.addEventListener("devtoolschange", (event) => {
    if (event.detail.isOpen) window.location.href = "/";
  });
}
