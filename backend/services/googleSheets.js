const { google } = require('googleapis');
const path = require('path');

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = '1-IzQfk_TqY3TkppajVS6gR9DQcQ9fc_z92bl_Z4oHGg';
    this.sheetName = 'Visitor_Tracking'; // You can change this sheet name
    this.initialized = false;
  }

  async initialize() {
    try {
      // For development, we'll use service account key file
      // In production, you should use environment variables
      const keyFilePath = path.join(__dirname, '../config/google-service-account.json');
      
      // Check if service account file exists
      const fs = require('fs');
      if (!fs.existsSync(keyFilePath)) {
        console.warn('Google Service Account file not found. Creating placeholder...');
        this.createServiceAccountPlaceholder(keyFilePath);
        throw new Error('Please configure Google Service Account credentials');
      }

      // Check if the file has real credentials
      const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      if (credentials.project_id === 'your-project-id' || credentials.private_key.includes('YOUR_PRIVATE_KEY_HERE')) {
        console.warn('Google Service Account credentials are placeholder values. Please configure real credentials.');
        throw new Error('Please configure real Google Service Account credentials');
      }

      const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      
      // Test the connection and ensure headers exist
      await this.ensureSheetHeaders();
      this.initialized = true;
      
      console.log('✅ Google Sheets API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets API:', error.message);
      this.initialized = false;
      return false;
    }
  }

  createServiceAccountPlaceholder(filePath) {
    const fs = require('fs');
    const configDir = path.dirname(filePath);
    
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const placeholder = {
      "type": "service_account",
      "project_id": "your-project-id",
      "private_key_id": "your-private-key-id",
      "private_key": "-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n",
      "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
      "client_id": "your-client-id",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"
    };

    fs.writeFileSync(filePath, JSON.stringify(placeholder, null, 2));
  }

  async ensureSheetHeaders() {
    try {
      // Check if the sheet exists and has headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A1:E1`,
      });

      const headers = ['Timestamp', 'IP Address', 'Email', 'Username', 'User Agent'];
      
      if (!response.data.values || response.data.values.length === 0) {
        // Add headers if they don't exist
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${this.sheetName}!A1:E1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers],
          },
        });
        console.log('📝 Added headers to Google Sheet');
      }
    } catch (error) {
      if (error.code === 400 && error.message.includes('Unable to parse range')) {
        // Sheet doesn't exist, create it
        await this.createSheet();
        await this.ensureSheetHeaders(); // Retry after creating
      } else {
        throw error;
      }
    }
  }

  async createSheet() {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: this.sheetName,
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 10,
                  },
                },
              },
            },
          ],
        },
      });
      console.log(`📄 Created new sheet: ${this.sheetName}`);
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }
  }

  async addVisitorRecord(visitorData) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('Google Sheets API not available');
      }
    }

    try {
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        visitorData.ipAddress || 'Unknown',
        visitorData.email || '',
        visitorData.username || '',
        visitorData.userAgent || ''
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:E`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [row],
        },
      });

      console.log(`✅ Visitor record added to Google Sheets: ${visitorData.email}`);
      return {
        success: true,
        rowsAdded: response.data.updates.updatedRows,
        timestamp,
      };
    } catch (error) {
      console.error('❌ Error adding visitor record to Google Sheets:', error);
      throw new Error(`Failed to add visitor record: ${error.message}`);
    }
  }

  async getVisitorStats() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:E`,
      });

      const rows = response.data.values || [];
      const dataRows = rows.slice(1); // Exclude header row

      return {
        totalVisitors: dataRows.length,
        uniqueEmails: new Set(dataRows.map(row => row[2])).size,
        lastVisit: dataRows.length > 0 ? dataRows[dataRows.length - 1][0] : null,
      };
    } catch (error) {
      console.error('Error getting visitor stats:', error);
      return { totalVisitors: 0, uniqueEmails: 0, lastVisit: null };
    }
  }

  isInitialized() {
    return this.initialized;
  }
}

module.exports = new GoogleSheetsService();
