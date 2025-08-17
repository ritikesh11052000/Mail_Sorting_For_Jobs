# Job Application Tracker - Setup Guide

## Quick Start

### 1. Install Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this folder

### 2. Configure Gmail API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Gmail API
3. Create OAuth credentials (Chrome extension type)
4. Copy client ID to `manifest.json`:
   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
     "scopes": ["https://www.googleapis.com/auth/gmail.readonly"]
   }
   ```

### 3. Get Started
1. Click extension icon
2. Click "Refresh" to scan emails
3. Grant Gmail permissions
4. View applications in dashboard

## File Structure
```
├── manifest.json     # Extension config
├── background.js     # Service worker
├── popup.html        # Extension popup
├── popup.js          # Popup logic
├── dashboard.html    # Full dashboard
├── dashboard.js      # Dashboard logic
├── gmail-api.js      # Gmail integration
├── email-parser.js   # Email classification
├── storage.js        # Data management
├── styles.css        # Styling
├── content.js        # Gmail monitoring
├── icons/            # Extension icons
└── README.md         # Documentation
```

## Usage
- **Popup**: Quick stats & recent applications
- **Dashboard**: Full management interface
- **Auto-scan**: Checks for new emails hourly
- **Export**: Backup data as JSON

## Features
✅ Gmail OAuth2 integration  
✅ Email classification (selected/interview/applied)  
✅ Rejection email filtering  
✅ Company & job title extraction  
✅ Local data storage  
✅ Export functionality  
✅ Responsive design  
✅ Real-time notifications  

## Troubleshooting
- **Auth issues**: Check client ID in manifest
- **No data**: Ensure Gmail permissions granted
- **Extension errors**: Check Chrome DevTools console
