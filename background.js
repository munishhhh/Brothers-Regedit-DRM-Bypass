chrome.runtime.onInstalled.addListener(() => {
    // Enable action by default for all sites
    if (chrome.action && chrome.action.enable) {
        chrome.action.enable();
    }
});
