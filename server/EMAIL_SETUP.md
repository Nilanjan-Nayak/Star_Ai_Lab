# Email Setup Instructions

## Gmail Configuration for Contact Form

To enable the contact form to send emails to `nayaknilanjan1@gmail.com`, you need to configure Gmail App Passwords.

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" → "2-Step Verification"
3. Follow the instructions to enable 2FA if not already enabled

### Step 2: Generate App Password
1. Go to Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" → "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Enter "Star AI Labs Contact Form" as the device name
5. Copy the generated 16-character app password

### Step 3: Update Environment Variables
1. Open the `.env` file in the server directory
2. Replace `your-gmail-app-password` with the app password you generated:
   ```
   EMAIL_USER=nayaknilanjan1@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Step 4: Test the Configuration
1. Start the server: `npm run dev`
2. Test the email configuration: `GET http://localhost:5000/api/contact/test`
3. If successful, you should see: `{"success": true, "message": "Email configuration is working correctly"}`

## Email Features

### Contact Form Submission
- **Endpoint**: `POST /api/contact`
- **Recipient**: nayaknilanjan1@gmail.com
- **Auto-reply**: Sent to the form submitter
- **Validation**: Name, email, subject, and message validation
- **Rate limiting**: Consider adding rate limiting for production

### Email Templates
- **Notification Email**: Beautifully formatted HTML email sent to nayaknilanjan1@gmail.com
- **Auto-reply Email**: Professional thank you email sent to the form submitter
- **Responsive Design**: Emails look great on all devices

### Security Features
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Environment variable protection

## Troubleshooting

### Common Issues
1. **"Invalid login"**: Check that 2FA is enabled and app password is correct
2. **"Connection timeout"**: Check internet connection and Gmail service status
3. **"Authentication failed"**: Verify the EMAIL_USER and EMAIL_PASS in .env file

### Testing
- Use the test endpoint: `GET /api/contact/test`
- Check server logs for detailed error messages
- Verify .env file is properly loaded

## Production Considerations
1. Use environment variables for sensitive data
2. Implement rate limiting to prevent spam
3. Add email queue for better performance
4. Consider using a dedicated email service (SendGrid, Mailgun, etc.)
5. Add email logging and monitoring