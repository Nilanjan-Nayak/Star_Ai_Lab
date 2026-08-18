const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const adminStorage = require('../services/adminStorage');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
const DATASET_DIR = path.join(__dirname, '../data/face_dataset');

// Ensure dataset folder exists
if (!fs.existsSync(DATASET_DIR)) {
  fs.mkdirSync(DATASET_DIR, { recursive: true });
}

// Helper: Send OTP Email via Nodemailer
const sendOtpEmail = async (toEmail, otpCode) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.log('⚠️  EMAIL_USER and EMAIL_PASS not configured in .env. Skipping email dispatch.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

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

    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP Email successfully delivered to: ${toEmail}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to send OTP Email to ${toEmail}:`, err.message);
    return false;
  }
};

// Helper: Euclidean distance
const euclideanDistance = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length || arr1.length === 0) return Infinity;
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.pow(arr1[i] - arr2[i], 2);
  }
  return Math.sqrt(sum);
};

// Helper: Generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper: Check if vector is legacy OpenCV block-mean vector (all positive values between 0 and 0.25)
const isLegacyVector = (vec) => {
  if (!Array.isArray(vec) || vec.length === 0) return false;
  return vec.every(val => typeof val === 'number' && val >= 0 && val <= 0.25);
};

// ──────────────────────────────────────────────
// GET /api/admin-auth/capture-tool — Standalone Web Camera Dataset Capture Tool
// ──────────────────────────────────────────────
router.get('/capture-tool', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Star AI Lab — Admin Face Dataset Capture Tool</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/dist/face-api.js"></script>
      <style>
        body { background: #090d16; color: #e2e8f0; font-family: system-ui, sans-serif; }
      </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center p-6">
      <div class="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-xl">
        <h1 class="text-2xl font-bold text-cyan-400 mb-1">📸 Admin Face Dataset Capture Tool</h1>
        <p class="text-slate-400 text-sm mb-6">Capture multi-angle photos for your face authentication server</p>
        
        <div class="relative w-[500px] h-[375px] mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-black shadow-2xl mb-6">
          <video id="webcam" autoplay muted playsinline class="w-full h-full object-cover" style="transform: scaleX(-1);"></video>
          <canvas id="overlay" class="absolute inset-0 w-full h-full" style="transform: scaleX(-1);"></canvas>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div id="ovalGuide" class="w-60 h-72 border-2 border-cyan-400/50 rounded-[50%] transition-all"></div>
          </div>
          <div id="poseBanner" class="absolute top-4 left-4 right-4 bg-slate-950/80 border border-cyan-500/30 rounded-xl py-2 px-4 text-cyan-300 font-semibold text-sm">
            Pose 1/5: Look Straight (Front) — 5 photos
          </div>
        </div>

        <div id="statusText" class="text-cyan-300 font-medium mb-6">
          Camera active. Position your face in the frame.
        </div>

        <div class="flex justify-center gap-4">
          <button id="captureBtn" class="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition">
            📸 Capture Photo (Press SPACEBAR)
          </button>
        </div>
      </div>

      <script>
        const video = document.getElementById('webcam');
        const overlay = document.getElementById('overlay');
        const poseBanner = document.getElementById('poseBanner');
        const statusText = document.getElementById('statusText');
        const captureBtn = document.getElementById('captureBtn');

        const POSES = [
          { label: 'Front Face', count: 5 },
          { label: 'Turn Slightly Left', count: 4 },
          { label: 'Turn Slightly Right', count: 4 },
          { label: 'Tilt Slightly Up', count: 3 },
          { label: 'Tilt Slightly Down', count: 3 },
        ];

        let currentPose = 0;
        let poseCount = 0;
        let totalCount = 0;
        let descriptors = [];

        async function init() {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            video.srcObject = stream;
            
            statusText.innerText = "Loading face detection models...";
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

            statusText.innerText = "Ready! Press SPACEBAR or click Capture Photo.";
          } catch(err) {
            statusText.innerText = "❌ Camera Error: " + err.message;
          }
        }

        async function capturePhoto() {
          const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
          if(!detection) {
            statusText.innerText = "⚠️ Face not detected cleanly. Look at camera and try again.";
            return;
          }

          descriptors.push(Array.from(detection.descriptor));
          poseCount++;
          totalCount++;

          statusText.innerText = \`✓ Captured photo \${poseCount}/\${POSES[currentPose].count} for \${POSES[currentPose].label}\`;

          if (poseCount >= POSES[currentPose].count) {
            currentPose++;
            poseCount = 0;
          }

          if (currentPose < POSES.length) {
            poseBanner.innerText = \`Pose \${currentPose + 1}/5: \${POSES[currentPose].label} — Need \${POSES[currentPose].count - poseCount} photos\`;
          } else {
            poseBanner.innerText = "🎉 All Poses Captured! Saving Dataset...";
            statusText.innerText = "Saving trained facial vectors to server admin profile...";

            const res = await fetch('/api/admin-auth/verify-face', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ faceDescriptors: descriptors })
            });

            if(res.ok) {
              statusText.innerHTML = "<span class='text-green-400 text-lg font-bold'>✅ SUCCESS! Your face dataset is trained & saved to Admin Profile!</span>";
              captureBtn.disabled = true;
              captureBtn.innerText = "✓ Trained Successfully";
            }
          }
        }

        captureBtn.addEventListener('click', capturePhoto);
        window.addEventListener('keydown', (e) => { if(e.code === 'Space') capturePhoto(); });
        init();
      </script>
    </body>
    </html>
  `);
});

// ──────────────────────────────────────────────
// POST /api/admin-auth/verify-face — Face verification / multi-angle dataset enrollment
// ──────────────────────────────────────────────
router.post('/verify-face', async (req, res) => {
  try {
    const { faceDescriptor, faceDescriptors, isRegistration } = req.body;

    const adminWrapper = await adminStorage.getSuperAdmin();
    const admin = adminWrapper.admin;
    const maskedEmail = admin.email ? admin.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'admin@starailabs.com';

    // BULK MULTI-ANGLE ENROLLMENT: If array of descriptors is provided
    if (Array.isArray(faceDescriptors) && faceDescriptors.length > 0) {
      console.log(`📸 Saving dataset: Registering ${faceDescriptors.length} trained facial vectors...`);

      await adminWrapper.save({
        faceDescriptor: faceDescriptors[0],
        faceDescriptors: faceDescriptors,
        otpAttempts: (admin.otpAttempts || 0) + 1,
        lastOtpRequest: new Date()
      });

      const otpCode = generateOtp();
      await adminStorage.saveOtp(admin.email, otpCode);
      await sendOtpEmail(admin.email, otpCode);

      console.log(`\n========================================`);
      console.log(`🔑 DEV / TRAINED DATASET ADMIN OTP: [ ${otpCode} ]`);
      console.log(`========================================\n`);

      return res.json({
        message: 'All dataset face vectors trained and saved successfully! OTP sent to your email.',
        firstTimeSetup: true,
        email: maskedEmail
      });
    }

    // SINGLE DESCRIPTOR VERIFICATION
    if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length < 64) {
      return res.status(400).json({ message: 'Valid face descriptor vector is required' });
    }

    let enrolledDescriptors = [];
    if (Array.isArray(admin.faceDescriptors) && admin.faceDescriptors.length > 0) {
      enrolledDescriptors = admin.faceDescriptors;
    } else if (Array.isArray(admin.faceDescriptor) && admin.faceDescriptor.length > 0) {
      enrolledDescriptors = [admin.faceDescriptor];
    }

    // Filter out legacy non-neural vectors if present
    const validNeuralDescriptors = enrolledDescriptors.filter(vec => !isLegacyVector(vec));

    // FIRST-TIME SETUP / AUTO-RECOVER LEGACY PROFILE:
    // If no valid neural vectors exist, save the live face vector as the master descriptor!
    if (validNeuralDescriptors.length === 0 || isRegistration) {
      console.log('📸 Enrolling Master Face Vector from Live Neural Scan...');
      
      const newDescriptors = [faceDescriptor];
      await adminWrapper.save({
        faceDescriptor,
        faceDescriptors: newDescriptors,
        otpAttempts: (admin.otpAttempts || 0) + 1,
        lastOtpRequest: new Date()
      });

      const otpCode = generateOtp();
      await adminStorage.saveOtp(admin.email, otpCode);
      await sendOtpEmail(admin.email, otpCode);

      console.log(`\n========================================`);
      console.log(`🔑 DEV / MASTER FACE VECTOR ENROLLED OTP: [ ${otpCode} ]`);
      console.log(`========================================\n`);

      return res.json({
        message: 'Master face vector enrolled! OTP sent to your email.',
        firstTimeSetup: true,
        email: maskedEmail
      });
    }

    // MULTI-ANGLE MATCHING: Calculate minimum distance to all enrolled neural angle vectors
    const threshold = parseFloat(process.env.FACE_MATCH_THRESHOLD || '0.6');
    let minDistance = Infinity;

    for (const storedVector of validNeuralDescriptors) {
      const dist = euclideanDistance(faceDescriptor, storedVector);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }

    console.log(`👤 Best match distance against master face profile: ${minDistance.toFixed(4)} (Threshold: ${threshold})`);

    // If match is successful (< 0.6)
    if (minDistance <= threshold) {
      // Auto-enrich profile with new angle sample if under 10 samples
      if (minDistance > 0.15 && validNeuralDescriptors.length < 10) {
        validNeuralDescriptors.push(faceDescriptor);
        await adminWrapper.save({
          faceDescriptors: validNeuralDescriptors
        });
        console.log(`✨ Multi-angle auto-enrichment: Saved new face angle sample (${validNeuralDescriptors.length} samples total)`);
      }

      // Generate OTP
      const otpCode = generateOtp();
      await adminStorage.saveOtp(admin.email, otpCode);
      await sendOtpEmail(admin.email, otpCode);

      console.log(`\n========================================`);
      console.log(`🔑 DEV / VERIFIED ADMIN OTP: [ ${otpCode} ]`);
      console.log(`========================================\n`);

      return res.json({
        message: 'Face verified successfully! OTP sent to your email.',
        email: maskedEmail
      });
    }

    // If match failed (> 0.6)
    await adminWrapper.save({
      otpAttempts: (admin.otpAttempts || 0) + 1,
      lastOtpRequest: new Date()
    });

    res.status(401).json({
      message: 'Face verification failed. Only authorized admin face is permitted.',
      distance: minDistance.toFixed(4)
    });
  } catch (error) {
    console.error('Face verification error:', error);
    res.status(500).json({ message: 'Error processing face verification: ' + error.message });
  }
});

// ──────────────────────────────────────────────
// POST /api/admin-auth/verify-otp — Verify OTP and issue JWT
// ──────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp || otp.length !== 6) {
      return res.status(400).json({ message: 'Valid 6-digit OTP is required' });
    }

    const adminWrapper = await adminStorage.getSuperAdmin();
    const admin = adminWrapper.admin;

    const isValid = await adminStorage.verifyOtpCode(admin.email, otp);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid or expired OTP code' });
    }

    // Issue 8-hour admin JWT token
    const token = jwt.sign(
      {
        userId: admin._id || admin.id || 'super-admin-001',
        email: admin.email,
        role: 'admin',
        isSuperAdmin: true
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: admin._id || admin.id,
        username: admin.username,
        email: admin.email,
        role: 'admin',
        isSuperAdmin: true,
        hasFaceRegistered: true
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Error verifying OTP: ' + error.message });
  }
});

// ──────────────────────────────────────────────
// GET /api/admin-auth/status — Check admin authentication status
// ──────────────────────────────────────────────
router.get('/status', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ authenticated: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    if (decoded.role === 'admin' && decoded.isSuperAdmin) {
      const adminWrapper = await adminStorage.getSuperAdmin();
      return res.json({
        authenticated: true,
        user: {
          id: adminWrapper.admin._id || adminWrapper.admin.id,
          username: adminWrapper.admin.username,
          email: adminWrapper.admin.email,
          role: 'admin',
          isSuperAdmin: true,
          hasFaceRegistered: true
        }
      });
    }
    res.status(401).json({ authenticated: false });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

// ──────────────────────────────────────────────
// POST /api/admin-auth/resend-otp — Resend OTP code to admin email
// ──────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
  try {
    const adminWrapper = await adminStorage.getSuperAdmin();
    const admin = adminWrapper.admin;

    const otpCode = generateOtp();
    await adminStorage.saveOtp(admin.email, otpCode);
    const sent = await sendOtpEmail(admin.email, otpCode);

    console.log(`\n========================================`);
    console.log(`🔑 DEV / RESENT ADMIN OTP: [ ${otpCode} ]`);
    console.log(`========================================\n`);

    if (sent) {
      res.json({ message: `New OTP code sent to ${admin.email}` });
    } else {
      res.json({ message: `New OTP code generated: [ ${otpCode} ] (Console log)` });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Error resending OTP: ' + error.message });
  }
});

module.exports = router;
