// Content script for Gmail integration
(function() {
  'use strict';

  // Monitor Gmail for new job-related emails
  let observer;
  let lastCheckTime = Date.now();

  function init() {
    // Start observing Gmail changes
    observeGmail();
    
    // Check for new emails periodically
    setInterval(checkForNewEmails, 300000); // 5 minutes
  }

  function observeGmail() {
    const targetNode = document.body;
    
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Check for new email elements
              checkForNewEmailElements(node);
            }
          });
        }
      });
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }

  function checkForNewEmailElements(element) {
    // Look for email list items or new email indicators
    const emailElements = element.querySelectorAll('[data-thread-id], .zA');
    
    emailElements.forEach(emailEl => {
      const threadId = emailEl.getAttribute('data-thread-id');
      if (threadId) {
        // Process new email
        processEmailElement(emailEl);
      }
    });
  }

  function processEmailElement(emailEl) {
    const subjectEl = emailEl.querySelector('[data-legacy-thread-id] span');
    const senderEl = emailEl.querySelector('.yW span');
    
    if (subjectEl && senderEl) {
      const subject = subjectEl.textContent;
      const sender = senderEl.textContent;
      
      // Check if this is a job-related email
      if (isJobRelated(subject, sender)) {
        // Notify extension
        chrome.runtime.sendMessage({
          action: 'newJobEmail',
          data: {
            subject,
            sender,
            timestamp: Date.now()
          }
        });
      }
    }
  }

  function isJobRelated(subject, sender) {
    const jobKeywords = [
      'job', 'position', 'role', 'career', 'opportunity', 'application',
      'interview', 'hiring', 'recruitment', 'selected', 'rejected', 'offer'
    ];
    
    const subjectLower = subject.toLowerCase();
    const senderLower = sender.toLowerCase();
    
    return jobKeywords.some(keyword => 
      subjectLower.includes(keyword) || senderLower.includes(keyword)
    );
  }

  function checkForNewEmails() {
    // This would integrate with Gmail API to check for new emails
    chrome.runtime.sendMessage({ action: 'checkNewEmails' });
  }

  // Initialize when Gmail loads
  if (window.location.hostname === 'mail.google.com') {
    init();
  }
})();
