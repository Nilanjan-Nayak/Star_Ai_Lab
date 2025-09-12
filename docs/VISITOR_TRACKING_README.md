# 🔍 Visitor Tracking System - Star AI Lab

A comprehensive real-time visitor tracking system that automatically collects visitor information through an elegant pop-up interface and stores data directly to Google Sheets.

## 🌟 Features

### ✅ **Automatic Visitor Detection**
- Detects new and returning visitors automatically
- Smart session management (24-hour configurable sessions)
- No server-side sessions required - uses localStorage

### ✅ **Professional Pop-up Interface**
- Elegant glassmorphism design matching Star AI Lab theme
- Form validation with user-friendly error messages
- Loading states and success animations
- Mobile-responsive design

### ✅ **Real-time Google Sheets Integration**
- Instant data synchronization to Google Sheets
- Automatic sheet creation and header setup
- Real-time visitor statistics
- Robust error handling with fallback options

### ✅ **Advanced Data Collection**
- **Email Address** - User provided
- **Username** - User provided  
- **IP Address** - Automatically detected
- **Timestamp** - ISO format with timezone
- **User Agent** - Browser and device information

### ✅ **Privacy & Security**
- User consent required before data collection
- Rate limiting (5 requests per minute per IP)
- Input validation and sanitization
- Transparent privacy disclosure

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │  Google Sheets  │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Visitor     │ │───▶│ │ Express API  │ │───▶│ │ Real-time   │ │
│ │ Pop-up      │ │    │ │ /visitors/*  │ │    │ │ Data Sync   │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Session     │ │    │ │ Google       │ │    │ │ Analytics   │ │
│ │ Management  │ │    │ │ Sheets API   │ │    │ │ Dashboard   │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Google Cloud Project with Sheets API enabled
- Google account for spreadsheet access

### 1. Install Dependencies

```bash
# Backend dependencies
cd server
npm install googleapis express-rate-limit

# Frontend dependencies (already included in Star AI Lab)
cd ../
npm install
```

### 2. Google Sheets Setup

Follow the detailed guide: [`server/GOOGLE_SHEETS_SETUP.md`](server/GOOGLE_SHEETS_SETUP.md)

**Quick Steps:**
1. Create Google Cloud Project
2. Enable Google Sheets API  
3. Create Service Account
4. Download credentials to `server/config/google-service-account.json`
5. Share your Google Sheet with the service account email
6. Update environment variables

### 3. Environment Configuration

Create `server/.env`:

```env
# Google Sheets API
GOOGLE_SHEETS_ENABLED=true
GOOGLE_SPREADSHEET_ID=1-IzQfk_TqY3TkppajVS6gR9DQcQ9fc_z92bl_Z4oHGg
GOOGLE_SHEET_NAME=Visitor_Tracking

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend API
cd server
npm run dev

# Terminal 2 - Frontend App  
cd ../
npm run dev
```

### 5. Test the System

1. Open http://localhost:5173
2. You should see the visitor tracking popup after 1 second
3. Fill out the form and submit
4. Check your Google Sheet for the new data row
5. Refresh the page - popup should not appear again (24-hour session)

---

## 📊 Google Sheet Structure

Your Google Sheet will automatically have these columns:

| Column | Description | Example |
|--------|-------------|---------|
| **Timestamp** | ISO timestamp of visit | `2024-01-15T14:30:00.000Z` |
| **IP Address** | Visitor's IP address | `192.168.1.1` |
| **Email** | User-provided email | `user@example.com` |
| **Username** | User-provided username | `John Doe` |
| **User Agent** | Browser/device info | `Mozilla/5.0 (Windows...)` |

### Sample Data
```
Timestamp                | IP Address  | Email              | Username   | User Agent
2024-01-15T14:30:00.000Z | 192.168.1.1 | john@example.com   | John Doe   | Mozilla/5.0...
2024-01-15T15:45:00.000Z | 192.168.1.2 | jane@company.com   | Jane Smith | Chrome/119...
2024-01-15T16:20:00.000Z | 192.168.1.3 | mike@startup.io    | Mike Chen  | Safari/17...
```

---

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api/visitors
```

### Endpoints

#### `POST /track`
Submit visitor data to Google Sheets

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "John Doe"
}
```

**Response:**
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

#### `GET /stats`
Get visitor statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVisitors": 150,
    "uniqueEmails": 120,
    "lastVisit": "2024-01-15T14:30:00.000Z"
  }
}
```

#### `GET /health`
Check Google Sheets service health

**Response:**
```json
{
  "success": true,
  "message": "Google Sheets service is healthy",
  "data": {
    "initialized": true,
    "totalVisitors": 150,
    "uniqueEmails": 120,
    "lastVisit": "2024-01-15T14:30:00.000Z"
  }
}
```

---

## ⚙️ Configuration Options

### Frontend Configuration

```typescript
// In useVisitorTracking hook
const config = {
  sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  apiEndpoint: 'http://localhost:5000/api/visitors/track'
};
```

### Session Management
- **Default Duration:** 24 hours
- **Storage:** Browser localStorage
- **Keys:**
  - `star_ai_lab_visitor_data` - Stores user registration data
  - `star_ai_lab_last_visit` - Tracks last visit timestamp

### Rate Limiting
- **Limit:** 5 requests per minute per IP address
- **Window:** 60 seconds
- **Response:** `429 Too Many Requests`

---

## 🎨 UI Components

### VisitorTracking Component
**Location:** `src/components/VisitorTracking.tsx`

**Features:**
- Glassmorphism design with animated backgrounds
- Form validation with real-time feedback
- Loading states and success animations
- Responsive design for all screen sizes
- Accessibility support (ARIA labels, keyboard navigation)

### VisitorTrackingDemo Component  
**Location:** `src/components/VisitorTrackingDemo.tsx`

**Features:**
- Real-time status display
- Manual popup trigger for testing
- Visitor data viewer
- Clear data functionality
- Technical documentation display

### useVisitorTracking Hook
**Location:** `src/hooks/useVisitorTracking.ts`

**Methods:**
```typescript
const {
  // State
  isPopupOpen,
  isLoading,
  error,
  
  // Actions
  submitVisitorData,
  closePopup,
  forceShowPopup,
  clearVisitorData,
  
  // Data
  getStoredVisitorData,
  isVisitorRegistered,
  
  // Utilities
  shouldShowPopup,
} = useVisitorTracking();
```

---

## 🔒 Privacy & Security

### Data Collection Transparency
- **Clear disclosure** in popup interface
- **User consent required** before any data collection
- **Privacy notice** explaining data usage
- **Secure transmission** over HTTPS (in production)

### Security Measures
- **Input validation** on both frontend and backend
- **Rate limiting** to prevent abuse
- **IP address sanitization** for privacy
- **Service account authentication** for Google Sheets
- **Environment variable protection** for sensitive data

### GDPR Compliance Considerations
- User consent mechanism implemented
- Data purpose clearly stated
- User has control over data submission
- Easy to implement data deletion on request

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Popup Not Appearing
**Symptoms:** Visitor popup doesn't show on page load

**Solutions:**
```bash
# Check browser console for errors
# Clear localStorage data
localStorage.clear()

# Force show popup for testing
// In browser console:
window.location.reload()
```

#### 2. Google Sheets Connection Failed
**Symptoms:** `503 Service Unavailable` on health check

**Solutions:**
```bash
# Check service account file exists
ls server/config/google-service-account.json

# Verify sheet permissions
# Make sure service account email has Editor access

# Test API endpoints
curl http://localhost:5000/api/visitors/health
```

#### 3. Data Not Appearing in Sheet
**Symptoms:** API returns success but no data in Google Sheets

**Solutions:**
- Verify spreadsheet ID in environment variables
- Check sheet name matches configuration
- Ensure service account has write permissions
- Check Google Cloud Console for API quotas

#### 4. Form Validation Errors
**Symptoms:** Cannot submit visitor form

**Solutions:**
- Check email format validity
- Ensure username is 2-50 characters
- Verify no special characters in username
- Check network connectivity

### Debug Commands

```bash
# Test Google Sheets connection
curl http://localhost:5000/api/visitors/health

# Submit test visitor data
curl -X POST http://localhost:5000/api/visitors/test

# Get visitor statistics  
curl http://localhost:5000/api/visitors/stats

# Check server logs
npm run dev # in server directory
```

---

## 📈 Analytics & Monitoring

### Real-time Metrics
Access your Google Sheet to monitor:
- **Total visitor count**
- **Unique email addresses** 
- **Visit patterns by timestamp**
- **Geographic distribution** (via IP analysis)
- **Device/browser statistics** (via User Agent)

### Google Sheets Features
- **Automatic sorting** by timestamp
- **Conditional formatting** for data visualization  
- **Charts and graphs** for trend analysis
- **Data export** to CSV/Excel
- **Sharing and collaboration** with team members

### Advanced Analytics
Enhance your Google Sheet with:
- **Pivot tables** for data summarization
- **Google Apps Script** for automation
- **Data Studio integration** for dashboards
- **Third-party tools** (Zapier, etc.) for workflow automation

---

## 🚀 Deployment Guide

### Production Environment Variables

```env
# Production Google Sheets Config
GOOGLE_SHEETS_ENABLED=true
GOOGLE_SPREADSHEET_ID=your-production-sheet-id
GOOGLE_SHEET_NAME=Production_Visitors

# Security
NODE_ENV=production
JWT_SECRET=your-production-secret

# URLs
FRONTEND_URL=https://your-domain.com
```

### Security Checklist
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting for production traffic
- [ ] Monitor Google API quotas and billing
- [ ] Implement proper error logging
- [ ] Set up backup/recovery procedures

### Scaling Considerations
- **API Rate Limits:** Google Sheets API has quotas
- **Database Alternative:** Consider MongoDB for high-volume sites
- **Caching:** Implement Redis for session management
- **Load Balancing:** Multiple server instances for high traffic

---

## 🛠️ Development Tools

### Testing the System

```bash
# 1. Clear all visitor data
localStorage.clear()

# 2. Reload page to trigger popup
window.location.reload()

# 3. Test API endpoints
npm run test:visitors  # If test script exists

# 4. Monitor real-time updates
# Open Google Sheet in another tab while testing
```

### Development Workflow

1. **Local Development**
   ```bash
   npm run dev        # Start frontend
   cd server && npm run dev  # Start backend
   ```

2. **Test Visitor Flow**
   - Clear localStorage
   - Reload page
   - Fill popup form
   - Verify Google Sheets data

3. **API Testing**
   ```bash
   # Health check
   curl http://localhost:5000/api/visitors/health
   
   # Manual data submission
   curl -X POST http://localhost:5000/api/visitors/track \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","username":"Test User"}'
   ```

---

## 📚 Additional Resources

### Documentation
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [React Hook Best Practices](https://react.dev/reference/react)

### Support Files
- [`server/GOOGLE_SHEETS_SETUP.md`](server/GOOGLE_SHEETS_SETUP.md) - Detailed Google Sheets setup
- [`server/services/googleSheets.js`](server/services/googleSheets.js) - Service implementation
- [`src/components/VisitorTracking.tsx`](src/components/VisitorTracking.tsx) - UI component
- [`src/hooks/useVisitorTracking.ts`](src/hooks/useVisitorTracking.ts) - React hook

---

## 🤝 Contributing

### Adding New Features
1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/visitor-analytics`
3. **Make changes** with proper testing
4. **Update documentation** as needed
5. **Submit pull request** with detailed description

### Reporting Issues
- Use GitHub Issues for bug reports
- Include browser/OS information
- Provide steps to reproduce
- Include relevant error messages

---

## 📄 License

This visitor tracking system is part of the Star AI Lab project and follows the same licensing terms.

---

## 🎉 Success! 

You now have a fully functional, real-time visitor tracking system integrated with Google Sheets! 

**Next Steps:**
1. Customize the popup design to match your brand
2. Add additional data collection fields if needed
3. Set up Google Sheets automation for notifications
4. Implement advanced analytics and reporting
5. Deploy to production with proper security measures

**Questions or Need Help?**
- Check the troubleshooting section above
- Review the Google Sheets setup guide
- Test all API endpoints for proper functionality
- Monitor Google Cloud Console for any issues

**Star AI Lab** - Professional Visitor Tracking Made Simple! 🚀✨
