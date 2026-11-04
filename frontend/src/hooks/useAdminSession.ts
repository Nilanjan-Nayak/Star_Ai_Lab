import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Admin session handling.
 *
 *  - Token lives in sessionStorage (gone when the tab/browser closes) – NOT localStorage.
 *  - Token is re-verified with the server on load.
 *  - Auto sign-out after IDLE_LIMIT_MS without activity and after MAX_SESSION_MS in total.
 *  - A 60 s warning lets you stay signed in; a 401 from the API signs you out immediately.
 *
 * NOTE: this protects the *browser side*. What makes data truly private is the server refusing
 * every admin request without a valid token – see BACKEND_SECURITY.md.
 */

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const KEY = 'starAdminSession';

export const IDLE_LIMIT_MS = 15 * 60 * 1000; // sign out after 15 min without activity
export const MAX_SESSION_MS = 8 * 60 * 60 * 1000; // hard cap of 8 hours
export const WARN_BEFORE_MS = 60 * 1000; // warn 60 s before sign-out

export type EndReason = 'idle' | 'expired' | 'unauthorized' | 'manual' | null;
type Session = { token: string; user: any };
type Stored = Session & { startedAt: number };

export const useAdminSession = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [checking, setChecking] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [endedReason, setEndedReason] = useState<EndReason>(null);

    const startedAt = useRef(0);
    const lastActivity = useRef(Date.now());
    const tokenRef = useRef('');

    const logout = useCallback((reason: EndReason = 'manual') => {
        const token = tokenRef.current;
        tokenRef.current = '';
        sessionStorage.removeItem(KEY);
        localStorage.removeItem('adminToken'); // legacy key from older versions
        setSession(null);
        setSecondsLeft(0);
        setEndedReason(reason);
        // best effort: lets the server revoke the token (ignored if the route does not exist)
        if (token) fetch(`${API}/api/admin-auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => { });
    }, []);

    const login = useCallback((token: string, user: any) => {
        const now = Date.now();
        startedAt.current = now;
        lastActivity.current = now;
        tokenRef.current = token;
        sessionStorage.setItem(KEY, JSON.stringify({ token, user, startedAt: now } as Stored));
        localStorage.removeItem('adminToken');
        setEndedReason(null);
        setSession({ token, user });
    }, []);

    /** "Stay signed in" button */
    const extend = useCallback(() => {
        lastActivity.current = Date.now();
    }, []);

    /* restore + verify an existing tab session once */
    useEffect(() => {
        localStorage.removeItem('adminToken'); // never keep a long-lived admin token around
        let cancelled = false;
        (async () => {
            try {
                const raw = sessionStorage.getItem(KEY);
                if (!raw) return;
                const stored = JSON.parse(raw) as Stored;
                if (!stored.token || Date.now() - stored.startedAt > MAX_SESSION_MS) { sessionStorage.removeItem(KEY); return; }
                const res = await fetch(`${API}/api/admin-auth/status`, { headers: { Authorization: `Bearer ${stored.token}` } });
                if (!res.ok) throw new Error('invalid');
                const data = await res.json();
                if (cancelled) return;
                startedAt.current = stored.startedAt;
                lastActivity.current = Date.now();
                tokenRef.current = stored.token;
                setSession({ token: stored.token, user: data.user || stored.user });
            } catch {
                sessionStorage.removeItem(KEY);
            } finally {
                if (!cancelled) setChecking(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    /* activity tracking + countdown (only while signed in) */
    useEffect(() => {
        if (!session) return;
        const touch = () => {
            // once the warning is showing, only the explicit "Stay signed in" button counts
            if (Date.now() - lastActivity.current < IDLE_LIMIT_MS - WARN_BEFORE_MS) lastActivity.current = Date.now();
        };
        const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        let last = 0;
        const throttled = () => { const n = Date.now(); if (n - last > 1000) { last = n; touch(); } };
        events.forEach((e) => window.addEventListener(e, throttled, { passive: true }));

        const tick = setInterval(() => {
            const now = Date.now();
            const idleLeft = IDLE_LIMIT_MS - (now - lastActivity.current);
            const absLeft = MAX_SESSION_MS - (now - startedAt.current);
            const left = Math.min(idleLeft, absLeft);
            setSecondsLeft(Math.max(0, Math.ceil(left / 1000)));
            if (left <= 0) logout(absLeft <= 0 ? 'expired' : 'idle');
        }, 1000);

        return () => {
            events.forEach((e) => window.removeEventListener(e, throttled));
            clearInterval(tick);
        };
    }, [session, logout]);

    /* any 401 from our API = token is dead → sign out right away */
    useEffect(() => {
        if (!session) return;
        const original = window.fetch;
        window.fetch = async (...args: Parameters<typeof fetch>) => {
            const res = await original(...args);
            try {
                const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : String(args[0]);
                if (res.status === 401 && url.startsWith(API) && !url.includes('/api/admin-auth/')) logout('unauthorized');
            } catch { /* ignore */ }
            return res;
        };
        return () => { window.fetch = original; };
    }, [session, logout]);

    return {
        session,
        checking,
        secondsLeft,
        warning: !!session && secondsLeft > 0 && secondsLeft <= WARN_BEFORE_MS / 1000,
        endedReason,
        clearEndedReason: () => setEndedReason(null),
        login,
        logout,
        extend,
    };
};