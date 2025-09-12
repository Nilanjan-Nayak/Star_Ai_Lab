import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface VisitorTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; username: string }) => Promise<void>;
}

const VisitorTracking: React.FC<VisitorTrackingProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; username?: string }>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setUsername('');
      setErrors({});
      setSubmitStatus('idle');
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { email?: string; username?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    } else if (username.trim().length > 50) {
      newErrors.username = 'Username must be less than 50 characters';
    } else if (!/^[a-zA-Z0-9_\s]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and spaces';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit({
        email: email.trim().toLowerCase(),
        username: username.trim(),
      });
      
      setSubmitStatus('success');
      
      // Close popup after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting visitor data:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-auto">
        {/* Modal Container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl border border-blue-500/20 shadow-2xl backdrop-blur-xl">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-blue-500/5 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
            aria-label="Close popup"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <img src="../img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png" alt="" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Star AI Lab!
              </h2>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                Help us personalize your experience by sharing a few details. 
                Your information is secure and used only to enhance our services.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="visitor-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="visitor-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="visitor-username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username / Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="visitor-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.username 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500'
                    }`}
                    placeholder="Your name or username"
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-300 leading-relaxed">
                    <strong>Privacy Protection:</strong> We collect basic visit information (IP, timestamp) 
                    to improve our services. Your data is securely stored and never shared with third parties.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  submitStatus === 'success'
                    ? 'bg-green-600 text-white cursor-default'
                    : submitStatus === 'error'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : isSubmitting
                    ? 'bg-blue-600/50 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Welcome! Redirecting...
                  </>
                ) : submitStatus === 'error' ? (
                  'Try Again'
                ) : (
                  'Continue to Star AI Lab'
                )}
              </button>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="text-center">
                  <p className="text-sm text-red-400">
                    Something went wrong. Please try again or contact support.
                  </p>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our data collection for service improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorTracking;
