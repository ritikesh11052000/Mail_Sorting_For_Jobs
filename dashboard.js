// Dashboard functionality for Job Application Tracker
document.addEventListener('DOMContentLoaded', async () => {
  const refreshBtn = document.getElementById('refreshBtn');
  const loading = document.getElementById('loading');
  const jobList = document.getElementById('jobList');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  let allApplications = [];
  let currentFilter = 'all';

  // Event listeners
  refreshBtn.addEventListener('click', loadApplications);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderApplications();
    });
  });

  // Initial load
  await loadApplications();

  async function loadApplications() {
    loading.classList.remove('hidden');
    jobList.innerHTML = '';
    
    try {
      // Check authentication
      const authResponse = await chrome.runtime.sendMessage({ action: 'getAuthToken' });
      if (!authResponse || authResponse.error) {
        showError('Please authenticate with Gmail first');
        return;
      }

      // Load from storage or fetch new
      const result = await chrome.storage.local.get(['jobApplications']);
      allApplications = result.jobApplications || [];
      
      if (allApplications.length === 0) {
        // Fetch new applications
        allApplications = await fetchJobApplications(authResponse.token);
        await chrome.storage.local.set({ jobApplications: allApplications });
      }
      
      renderApplications();
    } catch (err) {
      showError('Failed to load applications');
    } finally {
      loading.classList.add('hidden');
    }
  }

  function renderApplications() {
    jobList.innerHTML = '';
    
    let filteredApps = allApplications;
    if (currentFilter !== 'all') {
      filteredApps = allApplications.filter(app => app.status === currentFilter);
    }

    if (filteredApps.length === 0) {
      jobList.innerHTML = '<p style="text-align: center; color: #666;">No applications found</p>';
      return;
    }

    filteredApps.forEach(app => {
      const card = createJobCard(app);
      jobList.appendChild(card);
    });
  }

  function createJobCard(app) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    const statusClass = `status-${app.status}`;
    const statusText = {
      'selected': 'Selected',
      'interview': 'Interview',
      'applied': 'Applied'
    }[app.status] || app.status;

    card.innerHTML = `
      <div class="job-info">
        <h3>${app.company}</h3>
        <p>${app.title}</p>
        <p style="font-size: 12px; color: #999;">${new Date(app.date).toLocaleDateString()}</p>
      </div>
      <div class="job-status ${statusClass}">${statusText}</div>
    `;
    
    return card;
  }

  async function fetchJobApplications(token) {
    // This would integrate with Gmail API
    // For now, return mock data
    return [
      {
        company: 'Google',
        title: 'Software Engineer',
        status: 'selected',
        date: '2024-01-15'
      },
      {
        company: 'Microsoft',
        title: 'Frontend Developer',
        status: 'interview',
        date: '2024-01-14'
      },
      {
        company: 'Amazon',
        title: 'Backend Engineer',
        status: 'applied',
        date: '2024-01-13'
      }
    ];
  }

  function showError(message) {
    const error = document.getElementById('error');
    error.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
  }
});
