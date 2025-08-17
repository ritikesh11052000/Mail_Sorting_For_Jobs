// Chrome storage management module
class StorageManager {
  constructor() {
    this.storageKey = 'jobApplications';
  }

  async saveApplications(applications) {
    try {
      await chrome.storage.local.set({ [this.storageKey]: applications });
      return true;
    } catch (error) {
      console.error('Error saving applications:', error);
      return false;
    }
  }

  async loadApplications() {
    try {
      const result = await chrome.storage.local.get([this.storageKey]);
      return result[this.storageKey] || [];
    } catch (error) {
      console.error('Error loading applications:', error);
      return [];
    }
  }

  async addApplication(application) {
    const applications = await this.loadApplications();
    
    // Check for duplicates
    const exists = applications.some(app => 
      app.company === application.company && 
      app.title === application.title &&
      app.date === application.date
    );
    
    if (!exists) {
      applications.push(application);
      await this.saveApplications(applications);
    }
    
    return !exists;
  }

  async updateApplication(id, updates) {
    const applications = await this.loadApplications();
    const index = applications.findIndex(app => app.id === id);
    
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      await this.saveApplications(applications);
      return true;
    }
    
    return false;
  }

  async deleteApplication(id) {
    const applications = await this.loadApplications();
    const filtered = applications.filter(app => app.id !== id);
    
    if (filtered.length !== applications.length) {
      await this.saveApplications(filtered);
      return true;
    }
    
    return false;
  }

  async clearAll() {
    try {
      await chrome.storage.local.remove([this.storageKey]);
      return true;
    } catch (error) {
      console.error('Error clearing applications:', error);
      return false;
    }
  }

  async getStats() {
    const applications = await this.loadApplications();
    
    return {
      total: applications.length,
      selected: applications.filter(app => app.status === 'selected').length,
      interview: applications.filter(app => app.status === 'interview').length,
      applied: applications.filter(app => app.status === 'applied').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  }
}

// Export for use in other modules
window.StorageManager = StorageManager;
