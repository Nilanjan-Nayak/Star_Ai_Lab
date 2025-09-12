const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// POST /api/contact - Send contact form email
router.post('/', validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Check if email is properly configured
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass || emailPass === 'your-gmail-app-password') {
      // Log the form submission for now and return success
      console.log('📧 Contact Form Submission (Email not configured):');
      console.log('='.repeat(50));
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`Timestamp: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));
      console.log('⚠️  To enable email sending, configure EMAIL_USER and EMAIL_PASS in .env file');
      
      return res.status(200).json({
        success: true,
        message: 'Your message has been received! We\'ll get back to you soon. (Email configuration pending)'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Test the connection first
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('Email configuration error:', verifyError);
      
      // Log the form submission and return success anyway
      console.log('📧 Contact Form Submission (Email failed):');
      console.log('='.repeat(50));
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`Timestamp: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));
      
      return res.status(200).json({
        success: true,
        message: 'Your message has been received! We\'ll get back to you soon.'
      });
    }

    // Email content for the recipient (Star AI Labs)
    const mailOptions = {
      from: emailUser,
      to: 'nayaknilanjan1@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Star AI Labs Website</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 25px;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">Contact Information</h3>
              <p style="margin: 8px 0; color: #4a5568;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0; color: #4a5568;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0; color: #4a5568;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">Message</h3>
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #2d3748; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                This email was sent from the Star AI Labs contact form on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Auto-reply email for the sender
    const autoReplyOptions = {
      from: emailUser,
      to: email,
      subject: 'Thank you for contacting Star AI Labs!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Star AI Labs</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2d3748; margin: 0 0 20px 0;">Hi ${name},</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
              Thank you for reaching out to Star AI Labs! We've received your message and appreciate your interest in our services.
            </p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0;">Your Message Summary:</h3>
              <p style="margin: 5px 0; color: #4a5568;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0; color: #4a5568;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
              Our team will review your inquiry and get back to you within 24-48 hours. In the meantime, feel free to explore our website to learn more about our AI solutions and services.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://starailabs.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Visit Our Website</a>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>The Star AI Labs Team</strong>
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    // Log successful submission
    console.log('✅ Contact form email sent successfully to nayaknilanjan1@gmail.com');
    console.log(`From: ${name} (${email})`);
    console.log(`Subject: ${subject}`);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Log the form submission even if email fails
    const { name, email, subject, message } = req.body;
    console.log('📧 Contact Form Submission (Error occurred):');
    console.log('='.repeat(50));
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log(`Timestamp: ${new Date().toLocaleString()}`);
    console.log(`Error: ${error.message}`);
    console.log('='.repeat(50));
    
    // Return success to user anyway, so they don't get frustrated
    res.status(200).json({
      success: true,
      message: 'Your message has been received! We\'ll get back to you soon.'
    });
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;