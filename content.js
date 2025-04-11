// Executes only the last call during consecutive calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function createSubtitleElement() {
  // Get the video container
  const videoPlayerRow = document.querySelector("#video-player-row");
  const existingSubtitleContainer = document.querySelector(
    "#yet-another-coursera-subtitle"
  );
  if (!videoPlayerRow || existingSubtitleContainer) {
    return;
  }

  // Create and add a new subtitle container
  const subtitleContainer = document.createElement("div");
  subtitleContainer.id = "yet-another-coursera-subtitle";
  videoPlayerRow.appendChild(subtitleContainer);

  // Debounce the update process
  // Shorten the delay to 25ms for near real-time updates
  const updateSubtitle = debounce(() => {
    const activeSubtitle = document.querySelector(".rc-Phrase.active");
    if (activeSubtitle) {
      subtitleContainer.textContent = activeSubtitle.textContent;
    }
  }, 25);

  // Create a MutationObserver
  // Add characterData: true to also monitor character data changes
  const observer = new MutationObserver(updateSubtitle);

  // Set the observation target to the entire document.body (to avoid missing changes)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

function waitForElement(selector, callback) {
  const observer = new MutationObserver((mutations, me) => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      me.disconnect(); // Stop observing
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 5000); // Stop observing after 5 seconds
}

// Initialize the subtitle container after the page loads
window.addEventListener("load", () => {
  waitForElement("#video-player-row", createSubtitleElement);
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "YACS_createSubtitleElement") {
    createSubtitleElement();
  }
});

// Detect URL changes (for SPA support) with debounce
let lastUrl = location.href;
const handleUrlChange = debounce(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    waitForElement("#video-player-row", createSubtitleElement);
  }
}, 200);

new MutationObserver(() => {
  handleUrlChange();
}).observe(document, { subtree: true, childList: true });
