class GmailAPI {
  constructor() {
    this.CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
    this.API_KEY = 'YOUR_API_KEY';
    this.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
    this.token = null;
  }

  async authenticate() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: 'getAuthToken' }, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          this.token = response.token;
          resolve(response.token);
        }
      });
    });
  }

  async makeRequest(endpoint, method = 'GET') {
    if (!this.token) {
      await this.authenticate();
    }

    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`);
    }

    return response.json();
  }

  async getMessages(query = '', maxResults = 50) {
    const queryParams = new URLSearchParams({
      q: query || 'subject:(application OR interview OR selection OR job OR offer OR rejection)',
      maxResults: maxResults.toString()
    });

    return this.makeRequest(`messages?${queryParams}`);
  }

  async getMessage(messageId) {
    return this.makeRequest(`messages/${messageId}?format=full`);
  }

  async getMessageBody(message) {
    let body = '';
    
    if (message.payload.parts) {
      for (const part of message.payload.parts) {
        if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
          const data = part.body.data;
          if (data) {
            body = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
            break;
          }
        }
      }
    } else if (message.payload.body.data) {
      body = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }

    return body;
  }

  async getMessageHeaders(message) {
    const headers = {};
    message.payload.headers.forEach(header => {
      headers[header.name.toLowerCase()] = header.value;
    });
    return headers;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GmailAPI;
} else {
  window.GmailAPI = GmailAPI;
}
