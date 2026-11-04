import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface FaceVerificationProps {
  onSuccess: (email: string, firstTimeSetup?: boolean, pendingToken?: string) => void;
  onError: (message: string) => void;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ onSuccess, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'scanning' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Initializing camera...');
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const attempts = useRef(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  // Load face-api.js from CDN
  useEffect(() => {
    const loadFaceApi = async () => {
      if ((window as any).faceapi) {
        setFaceApiLoaded(true);
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/dist/face-api.js';
        script.async = true;
        script.onload = async () => {
          const faceapi = (window as any).faceapi;
          const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/';

          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          ]);

          setFaceApiLoaded(true);
        };
        script.onerror = () => {
          setMessage('Failed to load face detection models. Check your internet connection.');
          setStatus('error');
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error('Failed to load face-api.js:', err);
        setStatus('error');
        setMessage('Failed to load face detection library');
      }
    };

    loadFaceApi();
  }, []);

  // Start / Restart Camera with robust stream initialization
  const startCamera = useCallback(async () => {
    setStatus('loading');
    setMessage('Accessing camera...');

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    try {
      // Use ideal constraints for maximum camera compatibility
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;

        video.onloadedmetadata = async () => {
          try {
            await video.play();
          } catch (playErr) {
            console.error('Video play error:', playErr);
          }
        };
      }

      setStatus('ready');
      setMessage('Position your face in the frame and click "Verify My Face"');
    } catch (err: any) {
      console.error('Camera error:', err);
      setStatus('error');
      setMessage('Camera access denied or busy. Please close other camera apps and refresh page.');
    }
  }, [stream]);

  useEffect(() => {
    if (faceApiLoaded) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      (videoRef.current?.srcObject as MediaStream | null)?.getTracks().forEach(t => t.stop());
    };
  }, [faceApiLoaded]);

  // Face Verification handler
  const handleVerify = useCallback(async () => {
    if (!videoRef.current || !faceApiLoaded) return;
    if (Date.now() < lockedUntil) {
      setMessage(`Too many attempts. Try again in ${Math.ceil((lockedUntil - Date.now()) / 1000)}s.`);
      return;
    }
    attempts.current += 1;
    if (attempts.current >= 5) { attempts.current = 0; setLockedUntil(Date.now() + 60_000); }

    setStatus('scanning');
    setMessage('Scanning face landmarks against your trained dataset...');

    try {
      const faceapi = (window as any).faceapi;
      const video = videoRef.current;

      if (video.readyState < 2) {
        setStatus('ready');
        setMessage('Camera video stream loading, please wait a second...');
        return;
      }

      // Try detection with flexible threshold (0.25)
      let detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.25 }))
        .withFaceLandmarks(true)
        .withFaceDescriptor();

      if (!detection) {
        setStatus('ready');
        setMessage('No face detected. Please ensure good lighting and look directly at the camera.');
        return;
      }

      // Draw face landmarks on canvas overlay
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const displaySize = { width: video.videoWidth || 640, height: video.videoHeight || 480 };
        faceapi.matchDimensions(canvas, displaySize);
        const resized = faceapi.resizeResults(detection, displaySize);
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);
      }

      const descriptor = Array.from(detection.descriptor) as number[];

      setMessage('Matching against trained face dataset on server...');

      const response = await fetch(`${API_BASE}/api/admin-auth/verify-face`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceDescriptor: descriptor })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || '✅ Face verified! OTP sent to your registered email.');

        if (stream) stream.getTracks().forEach(track => track.stop());
        onSuccess(data.email, false, data.pendingToken);
      } else {
        setStatus('error');
        setMessage(data.message || 'Face verification failed');
        onError(data.message);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setStatus('error');
      const errMsg = err?.message === 'Failed to fetch'
        ? 'Backend server not responding. Please make sure backend is running on port 5000.'
        : (err?.message || 'Error processing face verification');
      setMessage(errMsg);
      onError(errMsg);
    }
  }, [faceApiLoaded, stream, onSuccess, onError, lockedUntil]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Camera Feed Container */}
      <div className="relative aspect-[4/3] w-full max-w-[420px] rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-black/90 shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onCanPlay={(e) => e.currentTarget.play().catch(() => { })}
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Face Oval Frame Guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-52 h-64 border-2 rounded-[50%] transition-all duration-500 ${status === 'scanning' ? 'border-yellow-400/80 animate-pulse' :
              status === 'success' ? 'border-green-400/90' :
                status === 'error' ? 'border-red-400/90' :
                  'border-cyan-400/40'
            }`} />
        </div>

        {/* Loading overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Message bar */}
      <div className={`flex items-center gap-2 text-sm font-medium text-center px-4 ${status === 'success' ? 'text-green-400' :
          status === 'error' ? 'text-red-400' :
            status === 'scanning' ? 'text-yellow-400' :
              'text-blue-300/90'
        }`}>
        {status === 'scanning' && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === 'success' && <CheckCircle className="w-4 h-4" />}
        {status === 'error' && <AlertCircle className="w-4 h-4" />}
        {status === 'ready' && <Camera className="w-4 h-4" />}
        <span>{message}</span>
      </div>

      {/* Primary Action Button */}
      {status === 'ready' && (
        <button
          onClick={handleVerify}
          className="w-full max-w-sm py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 shadow-[0_8px_24px_rgba(59,130,246,0.4)] active:scale-95 flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Verify My Face
        </button>
      )}

      {/* Try Again / Re-request Camera button */}
      {status === 'error' && (
        <button
          onClick={startCamera}
          className="px-6 py-2.5 bg-blue-600/30 border border-blue-500/40 text-cyan-300 font-medium rounded-xl hover:bg-blue-600/50 transition-all flex items-center gap-2 text-sm shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again / Re-open Camera
        </button>
      )}
    </div>
  );
};

export default FaceVerification;