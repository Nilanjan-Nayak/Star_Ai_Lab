import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Shield, Loader2, CheckCircle, AlertCircle, Mail } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface OtpVerificationProps {
  email: string;
  onSuccess: (token: string, user: any) => void;
  onError: (message: string) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onSuccess, onError }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 min countdown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleInputChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last char only
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      submitOtp(newOtp.join(''));
    }
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      submitOtp(pasted);
    }
  }, []);

  const submitOtp = async (code: string) => {
    setStatus('verifying');
    setMessage('Verifying OTP...');

    try {
      const response = await fetch(`${API_BASE}/api/admin-auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: code })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('✅ Authentication successful!');

        // Store token
        localStorage.setItem('adminToken', data.token);

        setTimeout(() => {
          onSuccess(data.token, data.user);
        }, 800);
      } else {
        setStatus('error');
        setMessage(data.message || 'Invalid OTP');
        onError(data.message);

        // Reset for retry
        setTimeout(() => {
          setOtp(['', '', '', '', '', '']);
          setStatus('idle');
          setMessage('');
          inputRefs.current[0]?.focus();
        }, 2000);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setStatus('error');
      setMessage('Connection error');
      onError('Connection error');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2000);
    }
  };

  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setMessage('Sending new OTP code...');
    try {
      const response = await fetch(`${API_BASE}/api/admin-auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('idle');
        setMessage(`✅ ${data.message}`);
        setCountdown(300);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to resend OTP code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Email indicator */}
      <div className="flex items-center gap-3 px-5 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <Mail className="w-5 h-5 text-blue-400" />
        <span className="text-blue-300 text-sm font-medium">OTP sent to {email}</span>
      </div>

      {/* OTP Input */}
      <div className="flex gap-3" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleInputChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-white/5 backdrop-blur-sm outline-none transition-all duration-300 ${
              status === 'success' ? 'border-green-500/50 text-green-400' :
              status === 'error' ? 'border-red-500/50 text-red-400 animate-shake' :
              digit ? 'border-cyan-400/50 text-white' :
              'border-white/10 text-white/50'
            } focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]`}
            disabled={status === 'verifying' || status === 'success'}
          />
        ))}
      </div>

      {/* Status */}
      {message && (
        <div className={`flex items-center gap-2 text-sm font-medium ${
          status === 'success' ? 'text-green-400' :
          status === 'error' ? 'text-red-400' :
          status === 'verifying' ? 'text-yellow-400' :
          'text-blue-300/80'
        }`}>
          {status === 'verifying' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-4 h-4" />}
          {status === 'error' && <AlertCircle className="w-4 h-4" />}
          <span>{message}</span>
        </div>
      )}

      {/* Countdown & Resend button */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Shield className="w-3.5 h-3.5 text-cyan-400/70" />
          {countdown > 0
            ? <span>Code expires in {formatTime(countdown)}</span>
            : <span className="text-red-400/80">OTP code expired</span>
          }
        </div>
        <button
          onClick={handleResend}
          disabled={isResending || status === 'verifying' || status === 'success'}
          className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4 disabled:opacity-50 transition-all font-medium pt-1"
        >
          {isResending ? 'Resending OTP...' : 'Resend OTP to Email'}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
