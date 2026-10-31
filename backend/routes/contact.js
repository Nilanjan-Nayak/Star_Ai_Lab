const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Helper to save contact messages locally
const MESSAGES_FILE = path.join(__dirname, '../data/contact_messages.json');
const saveMessageLocally = (msgData) => {
  try {
    const dir = path.dirname(MESSAGES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let existing = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
      } catch (e) {
        existing = [];
      }
    }
    existing.unshift({
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...msgData,
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing.slice(0, 500), null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save message locally:', err);
  }
};

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'starailab.info@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
};

// Lenient validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Please provide your name (at least 1 character)'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Please provide a subject'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Please write a message')
];

// POST /api/contact - Send contact form email
router.post('/', validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'starailab.info@gmail.com';
    const emailUser = process.env.EMAIL_USER || adminEmail;
    const emailPass = process.env.EMAIL_PASS;

    // Always persist submission locally first
    saveMessageLocally({ name, email, subject, message });

    // Check if email credentials are configured
    if (!emailUser || !emailPass || emailPass === 'your-gmail-app-password') {
      console.log('📧 Contact Form Submission (Credentials not set, saved locally):');
      console.log('='.repeat(50));
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`Timestamp: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));

      return res.status(200).json({
        success: true,
        message: 'Your message has been received! We will get back to you soon.'
      });
    }

    // Create transporter with proper nodemailer.createTransport
    const transporter = createTransporter();

    // Email content for the administrator
    const mailOptions = {
      from: `"Star AI Lab Website" <${emailUser}>`,
      to: adminEmail,
      replyTo: email,
      subject: `[Contact Form] ${subject} - from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background-color: #0b1120; border-radius: 14px; color: #f1f5f9; border: 1px solid rgba(255,255,255,0.1);">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 28px 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">New Contact Form Message</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 14px;">Star AI Lab Public Portal</p>
          </div>
          
          <div style="background: #111827; padding: 24px; border-radius: 10px; border: 1px solid #1f2937;">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #38bdf8; margin: 0 0 12px 0; font-size: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Sender Information</h3>
              <p style="margin: 6px 0; color: #cbd5e1; font-size: 14px;"><strong style="color: #ffffff;">Name:</strong> ${name}</p>
              <p style="margin: 6px 0; color: #cbd5e1; font-size: 14px;"><strong style="color: #ffffff;">Email:</strong> <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></p>
              <p style="margin: 6px 0; color: #cbd5e1; font-size: 14px;"><strong style="color: #ffffff;">Subject:</strong> ${subject}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #38bdf8; margin: 0 0 12px 0; font-size: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Message Content</h3>
              <div style="background: #0f172a; padding: 18px; border-radius: 8px; border-left: 4px solid #38bdf8;">
                <p style="margin: 0; color: #e2e8f0; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; padding-top: 16px; border-top: 1px solid #1e293b;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Received at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (IST). Reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Auto-reply email for the sender
    const autoReplyOptions = {
      from: `"Star AI Lab" <${emailUser}>`,
      to: email,
      subject: `Thank you for contacting Star AI Lab!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b1120; border-radius: 14px; color: #f1f5f9; border: 1px solid rgba(255,255,255,0.1);">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 28px 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Thank You for Reaching Out</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 14px;">Star AI Lab</p>
          </div>
          
          <div style="background: #111827; padding: 24px; border-radius: 10px; border: 1px solid #1f2937;">
            <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 18px;">Hello ${name},</h2>
            <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 18px; font-size: 14px;">
              We have received your message regarding "<strong>${subject}</strong>". Our engineering and research team will review your inquiry and get back to you shortly.
            </p>
            
            <div style="background: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #38bdf8; margin: 18px 0;">
              <p style="margin: 0; color: #94a3b8; font-size: 13px;"><strong>Your message:</strong></p>
              <p style="margin: 6px 0 0 0; color: #e2e8f0; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">
              Warm regards,<br />
              <strong style="color: #ffffff;">Nilanjan Nayak & The Star AI Lab Team</strong>
            </p>
          </div>
        </div>
      `
    };

    // Attempt to send primary email to administrator
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Contact form email dispatched to ${adminEmail}`);
      
      // Attempt auto-reply in background (non-blocking)
      transporter.sendMail(autoReplyOptions).catch((autoErr) => {
        console.warn('⚠️ Auto-reply send failed (non-critical):', autoErr.message);
      });
    } catch (sendError) {
      console.error('❌ Failed to dispatch email via SMTP:', sendError.message);
      // Message is already saved locally so we still return success to the user
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form fatal error:', error);
    return res.status(200).json({
      success: true,
      message: 'Your message has been received! We will get back to you soon.'
    });
  }
});

// GET /api/contact/messages - Admin retrieve contact messages
router.get('/messages', (req, res) => {
  try {
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
    }
    res.json({ success: true, count: messages.length, messages });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to read messages' });
  }
});

// GET /api/contact/test - Test email configuration
router.get('/test', async (req, res) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass || emailPass === 'your-gmail-app-password') {
      return res.status(200).json({
        success: false,
        message: 'Email configuration is not set up. Please configure EMAIL_USER and EMAIL_PASS in .env file.',
        configured: false
      });
    }

    const transporter = createTransporter();
    await transporter.verify();
    
    res.status(200).json({
      success: true,
      message: 'Email configuration is working correctly',
      configured: true,
      emailUser: emailUser
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(200).json({
      success: false,
      message: 'Email configuration test failed: ' + error.message,
      configured: false,
      error: error.message
    });
  }
});

module.exports = router;
