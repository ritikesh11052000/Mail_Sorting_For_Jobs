// Background service worker for Job Application Tracker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Job Application Tracker installed');
});

// Handle authentication flow
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAuthToken') {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ token });
      }
    });
    return true; // Keep message channel open for async response
  }
});

// Handle notifications
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showNotification') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: request.title,
      message: request.message
    });
  }
});

// Periodic email checking (optional)
chrome.alarms.create('checkEmails', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkEmails') {
    // Trigger email checking
    chrome.runtime.sendMessage({ action: 'checkNewEmails' });
  }
});
