// Background service worker for Brief Me extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    // Store meeting data for popup access
    chrome.storage.local.set({
      currentMeetingData: request.meetingData,
    });

    // Open popup (this will be handled by the extension action)
    chrome.action.openPopup();
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.url?.includes('calendar.google.com')) {
    // Inject content script if not already injected
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      files: ['content.js'],
    });
  }
});

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Brief Me extension installed');
});
