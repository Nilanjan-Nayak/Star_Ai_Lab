# Google Sheets API Setup for Visitor Tracking

This guide will help you set up Google Sheets API integration for real-time visitor tracking in your Star AI Lab application.

## 🚀 Quick Setup Overview

1. **Create Google Cloud Project**
2. **Enable Google Sheets API**
3. **Create Service Account**
4. **Download Credentials**
5. **Share Google Sheet with Service Account**
6. **Configure Application**

---

## 📋 Detailed Setup Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your project ID for later use

### Step 2: Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

### Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in the details:
   - **Service account name**: `star-ai-lab-visitor-tracking`
   - **Service account ID**: `star-ai-lab-tracking`
   - **Description**: `Service account for visitor tracking in Star AI Lab`
4. Click **Create and Continue**
5. Skip role assignment (click **Continue**)
6. Skip user access (click **Done**)

### Step 4: Download Service Account Key

1. In the **Credentials** page, find your service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create New Key**
5. Choose **JSON** format
6. Download the file

### Step 5: Configure Service Account File

1. Rename the downloaded file to `google-service-account.json`
2. Move it to `server/config/google-service-account.json`
3. The file should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "star-ai-lab-tracking@your-project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Step 6: Share Google Sheet with Service Account

1. Open your Google Sheet: [Your Visitor Tracking Sheet](https://docs.google.com/spreadsheets/d/1-IzQfk_TqY3TkppajVS6gR9DQcQ9fc_z92bl_Z4oHGg/edit)
2. Click **Share** button (top right)
3. Add the service account email (from the JSON file, `client_email` field)
4. Give it **Editor** permissions
5. Uncheck "Notify people" (since it's a service account)
6. Click **Share**

### Step 7: Test the Integration

1. Start your server: `npm run dev`
2. Test the health endpoint: `GET http://localhost:5000/api/visitors/health`
3. You should see: `{"success": true, "message": "Google Sheets service is healthy"}`

---

## 🔧 Configuration Files

### Environment Variables (`.env`)

```env
# Google Sheets API
GOOGLE_SHEETS_ENABLED=true
GOOGLE_SPREADSHEET_ID=1-IzQfk_TqY3TkppajVS6gR9DQcQ9fc_z92bl_Z4oHGg
GOOGLE_SHEET_NAME=Visitor_Tracking
```

### Directory Structure

```
server/
├── config/
│   └── google-service-account.json  # Service account credentials
├── services/
│   └── googleSheets.js             # Google Sheets service
└── routes/
    └── visitors.js                 # Visitor tracking API
```

---

## 🧪 Testing the Setup

### Test Endpoints

1. **Health Check**
   ```bash
   GET http://localhost:5000/api/visitors/health
   ```

2. **Submit Test Visitor Data**
   ```bash
   POST http://localhost:5000/api/visitors/test
   ```

3. **Get Visitor Statistics**
   ```bash
   GET http://localhost:5000/api/visitors/stats
   ```

### Expected Sheet Structure

The service will automatically create headers in your Google Sheet:

| Timestamp | IP Address | Email | Username | User Agent |
|-----------|------------|-------|----------|------------|
| 2024-01-01T12:00:00Z | 192.168.1.1 | user@example.com | John Doe | Mozilla/5.0... |

---

## 🔒 Security Best Practices

### Production Deployment

1. **Use Environment Variables** (not files) for service account credentials:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   GOOGLE_PROJECT_ID=your-project-id
   ```

2. **Restrict API Access**:
   - In Google Cloud Console, go to **APIs & Services** → **Credentials**
   - Edit your service account key
   - Add IP restrictions if possible

3. **Monitor Usage**:
   - Check Google Cloud Console for API usage
   - Set up billing alerts
   - Monitor for unusual activity

### File Permissions

```bash
# Secure the service account file
chmod 600 server/config/google-service-account.json
```

### .gitignore

Make sure your `.gitignore` includes:
```
# Google Sheets API
server/config/google-service-account.json
.env
```

---

## 📊 Data Structure

### Visitor Data Collected

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "ipAddress": "192.168.1.1",
  "email": "user@example.com",
  "username": "John Doe",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
}
```

### API Response Format

```json
{
  "success": true,
  "message": "Visitor tracked successfully",
  "data": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "rowsAdded": 1
  }
}
```

---

## 🚨 Troubleshooting

### Common Issues

1. **"Service account file not found"**
   - Ensure file is at `server/config/google-service-account.json`
   - Check file permissions

2. **"Permission denied"**
   - Make sure you shared the sheet with the service account email
   - Verify the service account has Editor permissions

3. **"API not enabled"**
   - Enable Google Sheets API in Google Cloud Console
   - Wait a few minutes for activation

4. **"Invalid credentials"**
   - Re-download the service account key
   - Ensure JSON format is valid

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages.

### Test Commands

```bash
# Test Google Sheets connection
curl http://localhost:5000/api/visitors/health

# Submit test data
curl -X POST http://localhost:5000/api/visitors/test

# Check visitor stats
curl http://localhost:5000/api/visitors/stats
```

---

## 📈 Monitoring & Analytics

### Google Cloud Monitoring

1. Go to **Monitoring** in Google Cloud Console
2. Create custom dashboards for:
   - API request count
   - Error rates
   - Response times

### Application Logs

The service logs all activities:
- ✅ Successful operations
- ❌ Errors with details
- 📊 Performance metrics

---

## 🆘 Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify Google Cloud Console for API quotas and errors
3. Test the endpoints manually using tools like Postman
4. Ensure your Google Sheet permissions are correctly set

For additional help, contact the Star AI Lab development team.

---

**Star AI Lab** - Real-time Visitor Tracking with Google Sheets Integration 🚀
