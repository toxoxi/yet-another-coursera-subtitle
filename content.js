function createSubtitleElement() {
  // Find the video container
  const videoPlayerRow = document.querySelector("#video-player-row");
  if (!videoPlayerRow) {
    throw new Error("#video-player-row is not found");
  }

  // Create a new subtitle container
  const subtitleContainer = document.createElement("div");
  subtitleContainer.id = "yet-another-coursera-subtitle";
  videoPlayerRow.appendChild(subtitleContainer);

  // Sync the new subtitle container with the active subtitle
  const observer = new MutationObserver(() => {
    const activeSubtitle = document.querySelector(".rc-Phrase.active");
    if (activeSubtitle) {
      subtitleContainer.textContent = activeSubtitle.textContent;
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
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
}

// Initialize the subtitle element creation when the page is fully loaded
window.addEventListener("load", () => {
  waitForElement("#video-player-row", createSubtitleElement);
});
