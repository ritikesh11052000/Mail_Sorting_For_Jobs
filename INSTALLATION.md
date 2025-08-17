# Job Application Tracker - Installation Guide

## Step 1: Load Extension in Chrome
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" button
5. Select the entire `/workspaces/Mail_Sorting_For_Jobs` folder
6. Extension will appear in your Chrome toolbar

## Step 2: Configure Gmail API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API" and click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Chrome extension" as application type
   - Copy your extension ID from chrome://extensions/
   - Add your extension ID to authorized origins
   - Download the credentials JSON
5. Update `manifest.json`:
   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
     "scopes": ["https://www.googleapis.com/auth/gmail.readonly"]
   }
   ```

## Step 3: First Use
1. Click the extension icon in Chrome toolbar
2. Click "Refresh" to start scanning
3. Grant Gmail permissions when prompted
4. View applications in popup or open full dashboard

## Verification Steps
1. Check extension icon appears in toolbar
2. Click icon - popup should show
3. Click "Open Dashboard" - dashboard should load
4. Click "Refresh" - should prompt for Gmail permissions
5. After granting permissions, emails should start scanning

## Troubleshooting
- **Extension not loading**: Check Developer mode is enabled
- **OAuth errors**: Verify client ID matches your extension ID
- **No emails found**: Ensure Gmail API is enabled in Google Cloud Console
- **Permission denied**: Check OAuth scopes in manifest.json
