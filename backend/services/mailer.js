const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const adminEmail = process.env.ADMIN_EMAIL || emailUser || 'starailab.info@gmail.com';

let transporter = null;

if (emailUser && emailPass && emailUser !== 'your-email@gmail.com') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
}

// Track recent alerts to prevent flooding
const recentAlerts = new Map(); // key: ip + threatType, value: timestamp

/**
 * Send Security Alert Email when malicious activity is detected
 */
const sendSecurityAlertEmail = async ({
  ip,
  threatType,
  url,
  method = 'GET',
  payload = '',
  userAgent = 'Unknown',
  referrer = 'Direct',
  location = 'Unknown'
}) => {
  if (!transporter) {
    console.log('⚠️  Nodemailer not configured. Cannot send security alert email.');
    return false;
  }

  // Throttle: Max 1 email per 3 minutes per IP + threatType
  const throttleKey = `${ip}:${threatType}`;
  const now = Date.now();
  const lastSent = recentAlerts.get(throttleKey);
  if (lastSent && now - lastSent < 3 * 60 * 1000) {
    console.log(`⏱️ Security alert email throttled for ${throttleKey} (sent ${Math.round((now - lastSent) / 1000)}s ago)`);
    return false;
  }
  recentAlerts.set(throttleKey, now);

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const mailOptions = {
    from: `"Star AI Lab Security Shield" <${emailUser}>`,
    to: adminEmail,
    subject: `🚨 [SECURITY ALERT] ${threatType} detected from IP ${ip}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #090d16; color: #f1f5f9; border-radius: 16px; padding: 28px; border: 1px solid rgba(239, 68, 68, 0.4); box-shadow: 0 10px 30px rgba(239, 68, 68, 0.15);">
        
        <!-- Header -->
        <div style="border-bottom: 1px solid rgba(239, 68, 68, 0.2); padding-bottom: 18px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h1 style="color: #ef4444; margin: 0 0 6px 0; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              🛡️ STAR AI LAB SECURITY SHIELD
            </h1>
            <p style="color: #94a3b8; margin: 0; font-size: 13px;">Real-Time Intrusion & Threat Detection Notice</p>
          </div>
        </div>

        <!-- Banner Alert -->
        <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;">
          <div style="font-size: 14px; font-weight: 600; color: #f87171; margin-bottom: 4px;">
            ⚠️ Threat Blocked: <span style="text-transform: uppercase;">${threatType}</span>
          </div>
          <div style="font-size: 12px; color: #cbd5e1;">
            A malicious request was intercepted and immediately rejected with <strong>403 Forbidden</strong>.
          </div>
        </div>

        <!-- Details Grid -->
        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 22px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 9px 0; color: #64748b; width: 140px; font-weight: 500;">Attacker IP</td>
              <td style="padding: 9px 0; color: #f8fafc; font-family: monospace; font-weight: 700; color: #38bdf8;">${ip}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 9px 0; color: #64748b; font-weight: 500;">Server / Origin</td>
              <td style="padding: 9px 0; color: #e2e8f0;">${referrer || 'Direct / Unknown'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 9px 0; color: #64748b; font-weight: 500;">Target Route</td>
              <td style="padding: 9px 0; color: #fbbf24; font-family: monospace;">${method} ${url}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 9px 0; color: #64748b; font-weight: 500;">Location</td>
              <td style="padding: 9px 0; color: #e2e8f0;">${location}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 9px 0; color: #64748b; font-weight: 500;">Detected Time</td>
              <td style="padding: 9px 0; color: #e2e8f0;">${timestamp} (IST)</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #64748b; font-weight: 500;">User-Agent</td>
              <td style="padding: 9px 0; color: #94a3b8; font-size: 11px; word-break: break-all;">${userAgent}</td>
            </tr>
          </table>
        </div>

        <!-- Malicious Payload Snippet -->
        ${payload ? `
        <div style="margin-bottom: 22px;">
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
            Intercepted Malicious Payload / Parameters:
          </div>
          <div style="background: #020617; border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: #fca5a5; word-break: break-all; max-height: 140px; overflow-y: auto;">
            ${String(payload).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
        </div>
        ` : ''}

        <!-- Action Section -->
        <div style="text-align: center; margin-top: 26px; padding-top: 18px; border-top: 1px solid #1e293b;">
          <a href="http://localhost:5173/admin" style="display: inline-block; background: linear-gradient(135deg, #ef4444, #b91c1c); color: #ffffff; text-decoration: none; padding: 11px 26px; border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;">
            Open Star AI Lab Security Radar →
          </a>
          <p style="margin: 12px 0 0 0; font-size: 11px; color: #64748b;">
            This is an automated security broadcast from Star AI Lab Cyber Defense.
          </p>
        </div>

      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`🚨 Security alert email successfully dispatched to ${adminEmail} (MsgID: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error('❌ Failed to send security alert email:', err.message);
    return false;
  }
};

/**
 * Send OTP Email for face/admin auth
 */
const sendOtpEmail = async (toEmail, otpCode) => {
  if (!transporter) {
    console.log('⚠️  EMAIL_USER and EMAIL_PASS not configured. Skipping OTP dispatch.');
    return false;
  }

  const mailOptions = {
    from: `"Star AI Lab Security" <${emailUser}>`,
    to: toEmail,
    subject: `🔐 Star AI Lab — Admin Verification OTP: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; padding: 32px; border: 1px solid #1e293b;">
        <h2 style="color: #38bdf8; margin-top: 0; text-align: center; font-size: 22px;">Star AI Lab Security</h2>
        <p style="color: #94a3b8; text-align: center; margin-bottom: 24px; font-size: 14px;">Admin Face Verification Successful</p>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 8px 0;">Your 6-Digit One-Time Password (OTP)</p>
          <span style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otpCode}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.5; margin: 0;">
          This OTP code is valid for <strong>5 minutes</strong>.<br>Enter this code in the admin verification modal to complete your login.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email successfully dispatched to ${toEmail}`);
    return true;
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err.message);
    return false;
  }
};

module.exports = {
  sendSecurityAlertEmail,
  sendOtpEmail
};

