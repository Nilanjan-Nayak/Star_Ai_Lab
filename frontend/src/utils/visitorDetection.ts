// Enhanced visitor detection utilities

export interface VisitorDetectionOptions {
  sessionDuration: number; // milliseconds
  forceShowOnNewSession: boolean;
  detectIncognito: boolean;
  trackBrowserFingerprint: boolean;
}

export interface VisitorSession {
  id: string;
  browserFingerprint: string;
  isIncognito: boolean;
  deviceType: string;
  createdAt: string;
  lastActive: string;
}

export class VisitorDetection {
  private options: VisitorDetectionOptions;
  private sessionKey = 'star_ai_lab_session';
  private fingerprintKey = 'star_ai_lab_fingerprint';

  constructor(options: Partial<VisitorDetectionOptions> = {}) {
    this.options = {
      sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
      forceShowOnNewSession: true,
      detectIncognito: true,
      trackBrowserFingerprint: true,
      ...options,
    };
  }

  // Generate browser fingerprint for visitor identification
  generateBrowserFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
      }

      const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvas: canvas.toDataURL(),
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints || 0,
      };

      return btoa(JSON.stringify(fingerprint)).substring(0, 32);
    } catch (error) {
      console.warn('Could not generate browser fingerprint:', error);
      return `fallback_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
  }

  // Detect if browser is in incognito/private mode
  async detectIncognito(): Promise<boolean> {
    try {
      // Method 1: Storage quota check
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota && estimate.quota < 120000000) {
          return true; // Likely incognito
        }
      }

      // Method 2: IndexedDB availability check
      return new Promise((resolve) => {
        try {
          const db = indexedDB.open('test');
          db.onerror = () => resolve(true); // Incognito mode
          db.onsuccess = () => {
            db.result.close();
            resolve(false); // Normal mode
          };
        } catch {
          resolve(true); // Incognito mode
        }
      });
    } catch {
      return false; // Assume normal mode on error
    }
  }

  // Get device type
  getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipod|blackberry|iemobile/i.test(userAgent)) {
      return 'mobile';
    } else if (/ipad|tablet|silk/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // Check if this is a new visitor session
  async isNewVisitorSession(): Promise<{
    isNew: boolean;
    reason: string;
    session: VisitorSession | null;
  }> {
    try {
      // Check for existing session
      const existingSession = sessionStorage.getItem(this.sessionKey);
      const browserFingerprint = this.generateBrowserFingerprint();
      const isIncognito = this.options.detectIncognito ? await this.detectIncognito() : false;

      // No session storage = new session
      if (!existingSession) {
        return {
          isNew: true,
          reason: 'No active session found',
          session: null,
        };
      }

      let parsedSession: VisitorSession;
      try {
        parsedSession = JSON.parse(existingSession);
      } catch {
        return {
          isNew: true,
          reason: 'Corrupted session data',
          session: null,
        };
      }

      // Check session expiry
      const sessionAge = Date.now() - new Date(parsedSession.createdAt).getTime();
      if (sessionAge > this.options.sessionDuration) {
        return {
          isNew: true,
          reason: 'Session expired',
          session: parsedSession,
        };
      }

      // Check browser fingerprint change (different device/browser)
      if (this.options.trackBrowserFingerprint && 
          parsedSession.browserFingerprint !== browserFingerprint) {
        return {
          isNew: true,
          reason: 'Different browser/device detected',
          session: parsedSession,
        };
      }

      // Force show on incognito if option is enabled
      if (isIncognito && this.options.forceShowOnNewSession) {
        return {
          isNew: true,
          reason: 'Incognito/private mode detected',
          session: parsedSession,
        };
      }

      // Existing valid session
      return {
        isNew: false,
        reason: 'Valid existing session',
        session: parsedSession,
      };

    } catch (error) {
      console.error('Error checking visitor session:', error);
      return {
        isNew: true,
        reason: 'Error checking session',
        session: null,
      };
    }
  }

  // Create new visitor session
  async createSession(): Promise<VisitorSession> {
    const session: VisitorSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      browserFingerprint: this.generateBrowserFingerprint(),
      isIncognito: this.options.detectIncognito ? await this.detectIncognito() : false,
      deviceType: this.getDeviceType(),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    // Store in session storage
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    
    // Store fingerprint in local storage for cross-session tracking
    if (this.options.trackBrowserFingerprint) {
      localStorage.setItem(this.fingerprintKey, session.browserFingerprint);
    }

    console.log('🆕 New visitor session created:', {
      id: session.id.substring(0, 16) + '...',
      device: session.deviceType,
      incognito: session.isIncognito,
    });

    return session;
  }

  // Update session activity
  updateSessionActivity(): void {
    try {
      const existingSession = sessionStorage.getItem(this.sessionKey);
      if (existingSession) {
        const session: VisitorSession = JSON.parse(existingSession);
        session.lastActive = new Date().toISOString();
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      }
    } catch (error) {
      console.warn('Could not update session activity:', error);
    }
  }

  // Get comprehensive visitor info for logging
  async getVisitorInfo(): Promise<{
    fingerprint: string;
    deviceType: string;
    isIncognito: boolean;
    sessionId: string | null;
    userAgent: string;
    language: string;
    timezone: string;
    screenResolution: string;
  }> {
    const session = sessionStorage.getItem(this.sessionKey);
    let sessionId = null;
    
    if (session) {
      try {
        sessionId = JSON.parse(session).id;
      } catch {
        // Ignore parsing errors
      }
    }

    return {
      fingerprint: this.generateBrowserFingerprint(),
      deviceType: this.getDeviceType(),
      isIncognito: this.options.detectIncognito ? await this.detectIncognito() : false,
      sessionId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
    };
  }

  // Clear all session data
  clearSession(): void {
    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.fingerprintKey);
    console.log('🗑️ Visitor session cleared');
  }
}

// Default instance
export const visitorDetection = new VisitorDetection();

// Helper function for quick new visitor check
export const shouldShowVisitorPopup = async (options?: Partial<VisitorDetectionOptions>): Promise<{
  shouldShow: boolean;
  reason: string;
}> => {
  const detector = new VisitorDetection(options);
  const { isNew, reason } = await detector.isNewVisitorSession();
  
  if (isNew) {
    await detector.createSession();
  } else {
    detector.updateSessionActivity();
  }

  return {
    shouldShow: isNew,
    reason,
  };
};
