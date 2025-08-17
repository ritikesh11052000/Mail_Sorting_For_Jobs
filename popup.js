// Popup functionality for Job Application Tracker
document.addEventListener('DOMContentLoaded', async () => {
  const authBtn = document.getElementById('authBtn');
  const loading = document.getElementById('loading');
  const summary = document.getElementById('summary');
  const error = document.getElementById('error');
  const openDashboardBtn = document.getElementById('openDashboard');

  // Check authentication status
  checkAuthStatus();

  // Event listeners
  authBtn.addEventListener('click', handleAuth);
  openDashboardBtn.addEventListener('click', openDashboard);

  async function checkAuthStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getAuthToken' });
      if (response && response.token) {
        // Already authenticated
        authBtn.style.display = 'none';
        await loadSummary();
      } else {
        // Not authenticated
        authBtn.style.display = 'block';
      }
    } catch (err) {
      showError('Failed to check authentication status');
    }
  }

  async function handleAuth() {
    try {
      authBtn.disabled = true;
      authBtn.textContent = 'Connecting...';
      
      const response = await chrome.runtime.sendMessage({ action: 'getAuthToken' });
      
      if (response && response.token) {
        authBtn.style.display = 'none';
        await loadSummary();
      } else if (response && response.error) {
        showError(response.error);
      }
    } catch (err) {
      showError('Authentication failed');
    } finally {
      authBtn.disabled = false;
      authBtn.textContent = 'Connect Gmail';
    }
  }

  async function loadSummary() {
    loading.classList.remove('hidden');
    
    try {
      // Load data from storage
      const result = await chrome.storage.local.get(['jobApplications']);
      const applications = result.jobApplications || [];
      
      // Update stats
      document.getElementById('totalApps').textContent = applications.length;
      document.getElementById('selectedApps').textContent = 
        applications.filter(app => app.status === 'selected').length;
      document.getElementById('interviewApps').textContent = 
        applications.filter(app => app.status === 'interview').length;
      
      // Update recent list
      const recentList = document.getElementById('recentList');
      const recentApps = applications.slice(0, 3);
      
      recentList.innerHTML = '';
      recentApps.forEach(app => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.innerHTML = `
          <div class="company">${app.company}</div>
          <div class="status">${app.title} - ${app.status}</div>
        `;
        recentList.appendChild(item);
      });
      
      summary.classList.remove('hidden');
    } catch (err) {
      showError('Failed to load summary');
    } finally {
      loading.classList.add('hidden');
    }
  }

  function openDashboard() {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  }

  function showError(message) {
    error.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
  }
});
