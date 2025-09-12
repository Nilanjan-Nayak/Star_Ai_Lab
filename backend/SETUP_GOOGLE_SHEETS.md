# 🚀 Quick Setup Guide - Google Sheets API for Visitor Tracking

You're seeing the "Try Again" error because the Google Sheets API is not configured yet. Here's a **5-minute setup** to fix this:

## 🔥 **Quick Fix - Option 1: Complete Setup**

### Step 1: Create Google Cloud Project (2 minutes)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Click **APIs & Services** → **Library**
4. Search for **"Google Sheets API"** and click **Enable**

### Step 2: Create Service Account (2 minutes)
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Name: `star-ai-lab-visitor-tracking`
4. Click **Create and Continue** → **Continue** → **Done**

### Step 3: Download Credentials (1 minute)
1. Click on your new service account email
2. Go to **Keys** tab
3. Click **Add Key** → **Create New Key** → **JSON**
4. **Download the file**
5. **Replace** `server/config/google-service-account.json` with the downloaded file

### Step 4: Share Your Google Sheet
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1-IzQfk_TqY3TkppajVS6gR9DQcQ9fc_z92bl_Z4oHGg/edit
2. Click **Share** (top right)
3. Add the service account email (from step 2, looks like: `star-ai-lab-visitor-tracking@your-project.iam.gserviceaccount.com`)
4. Give **Editor** permissions
5. **Uncheck** "Notify people"
6. Click **Share**

### Step 5: Test
1. Restart your server: `npm run dev`
2. Test: http://localhost:5000/api/visitors/health
3. Should show: `"success": true`

---

## 🎯 **Quick Fix - Option 2: Demo Mode (1 minute)**

If you want to test the popup without Google Sheets setup, temporarily disable it:

**Edit `server/.env`:**
```env
# Comment out Google Sheets settings
# GOOGLE_SHEETS_ENABLED=true
# GOOGLE_SPREADSHEET_ID=1-IzQfk_TqY3TkppajVS6gR9DQcQ9fc_z92bl_Z4oHGg
# GOOGLE_SHEET_NAME=Visitor_Tracking
```

**Restart server:**
```bash
npm run dev
```

The popup will now work in **demo mode** (data won't be saved to Google Sheets but popup will function).

---

## 🐛 **Troubleshooting the "Try Again" Error**

**Error Symptoms:**
- Popup shows "Try Again" button
- Red error message: "Something went wrong"

**Causes & Solutions:**

### 1. **Server Not Running**
```bash
# Check if server is running
curl http://localhost:5000/api/health

# If not running, start it:
cd server
npm run dev
```

### 2. **Google Sheets Not Configured**
```bash
# Test Google Sheets health
curl http://localhost:5000/api/visitors/health

# Should return success: true
# If not, follow Option 1 above
```

### 3. **Port Mismatch**
Check your frontend is connecting to the right port:
- Frontend usually runs on: `http://localhost:5173`
- Backend should run on: `http://localhost:5000`

### 4. **CORS Issues**
Make sure `server/.env` has:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 🧪 **Test Commands**

```bash
# 1. Test server health
curl http://localhost:5000/api/health

# 2. Test Google Sheets health  
curl http://localhost:5000/api/visitors/health

# 3. Test visitor tracking
curl -X POST http://localhost:5000/api/visitors/track \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"Test User"}'

# 4. Manual popup test
# Open browser console and run:
localStorage.clear(); window.location.reload();
```

---

## 🎉 **Expected Results After Setup**

### ✅ Working Popup:
- Popup appears on new visit
- Form submits successfully  
- Shows "Welcome! Redirecting..." message
- Data appears in your Google Sheet

### ✅ Google Sheet Data:
| Timestamp | IP Address | Email | Username | User Agent |
|-----------|------------|-------|----------|------------|
| 2024-01-15T14:30:00Z | 127.0.0.1 | your@email.com | Your Name | Chrome/119... |

### ✅ API Responses:
```json
{
  "success": true,
  "message": "Visitor tracked successfully",
  "data": {
    "timestamp": "2024-01-15T14:30:00.000Z",
    "rowsAdded": 1
  }
}
```

---

## 🆘 **Still Having Issues?**

**Check these logs:**

1. **Browser Console** (F12) - Look for network errors
2. **Server Console** - Look for Google Sheets errors  
3. **Network Tab** - Check if API calls are reaching server

**Common Error Messages & Fixes:**

- `"Service account file not found"` → Follow Option 1, Step 3
- `"Permission denied"` → Follow Option 1, Step 4  
- `"Unable to connect"` → Server not running, restart with `npm run dev`
- `"Validation failed"` → Check email format and username length

**Need More Help?**
- Check the full guide: `server/GOOGLE_SHEETS_SETUP.md`
- Review API documentation in `VISITOR_TRACKING_README.md`
- Test endpoints manually with Postman or curl

---

## 🚀 **Success Checklist**

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled  
- [ ] Service account created and downloaded
- [ ] Google Sheet shared with service account
- [ ] Service account file at `server/config/google-service-account.json`
- [ ] Environment variables configured in `server/.env`
- [ ] Server restarted with `npm run dev`
- [ ] Health endpoint returns success: `curl http://localhost:5000/api/visitors/health`
- [ ] Popup works and submits data successfully
- [ ] Data appears in Google Sheet

**You're all set! The visitor tracking should now work perfectly! 🎉**
