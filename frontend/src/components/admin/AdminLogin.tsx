import React, { useState, useCallback } from 'react';
import { X, ShieldCheck, Fingerprint, KeyRound, Sparkles } from 'lucide-react';
import FaceVerification from './FaceVerification';
import OtpVerification from './OtpVerification';

interface AdminLoginProps {
  isVisible: boolean;
  onClose: () => void;
  onAuthenticated: (token: string, user: any) => void;
}

type AuthStep = 'face' | 'otp' | 'authenticated';

const AdminLogin: React.FC<AdminLoginProps> = ({ isVisible, onClose, onAuthenticated }) => {
  const [step, setStep] = useState<AuthStep>('face');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleFaceSuccess = useCallback((maskedEmail: string, _firstTimeSetup?: boolean) => {
    setEmail(maskedEmail);
    setStep('otp');
    setError('');
  }, []);

  const handleFaceError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleOtpSuccess = useCallback((token: string, user: any) => {
    setStep('authenticated');
    setTimeout(() => {
      onAuthenticated(token, user);
    }, 1000);
  }, [onAuthenticated]);

  const handleOtpError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleClose = useCallback(() => {
    setStep('face');
    setEmail('');
    setError('');
    onClose();
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fadeIn"
        onClick={handleClose}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-slideUp">
        {/* Outer glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/15 via-cyan-400/10 to-blue-600/15 rounded-[2rem] blur-2xl" />

        <div className="relative bg-gradient-to-br from-slate-900/95 via-[#0a1628]/95 to-slate-900/95 rounded-3xl border border-blue-500/20 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
          {/* Top gradient bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 mb-4">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {step === 'face' && 'Admin Verification'}
                {step === 'otp' && 'Enter OTP Code'}
                {step === 'authenticated' && 'Access Granted'}
              </h2>
              <p className="text-blue-300/60 text-sm">
                {step === 'face' && 'Verify your identity to access the admin panel'}
                {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                {step === 'authenticated' && 'Redirecting to admin dashboard...'}
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                step === 'face' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                <Fingerprint className="w-4 h-4" />
                Face
              </div>
              <div className={`w-8 h-[2px] ${step !== 'face' ? 'bg-cyan-400/40' : 'bg-white/10'}`} />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                step === 'otp' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                step === 'authenticated' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-white/5 text-white/30 border border-white/5'
              }`}>
                <KeyRound className="w-4 h-4" />
                OTP
              </div>
              <div className={`w-8 h-[2px] ${step === 'authenticated' ? 'bg-cyan-400/40' : 'bg-white/10'}`} />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                step === 'authenticated' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-white/5 text-white/30 border border-white/5'
              }`}>
                <Sparkles className="w-4 h-4" />
                Access
              </div>
            </div>

            {/* Step content */}
            <div className="min-h-[320px] flex items-center justify-center">
              {step === 'face' && (
                <FaceVerification
                  onSuccess={handleFaceSuccess}
                  onError={handleFaceError}
                />
              )}

              {step === 'otp' && (
                <OtpVerification
                  email={email}
                  onSuccess={handleOtpSuccess}
                  onError={handleOtpError}
                />
              )}

              {step === 'authenticated' && (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20">
                    <ShieldCheck className="w-10 h-10 text-green-400 animate-pulse" />
                  </div>
                  <p className="text-green-400 font-semibold text-lg">Authentication Complete</p>
                  <p className="text-white/40 text-sm">Loading admin dashboard...</p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && step !== 'authenticated' && (
              <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
          <div className="px-8 py-4 text-center">
            <p className="text-[10px] text-white/15 uppercase tracking-[4px]">
              Star AI Lab • Secure Admin Access
            </p>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
