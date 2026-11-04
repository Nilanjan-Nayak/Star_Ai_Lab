import React from 'react';
import { Lock, Clock, LogOut } from 'lucide-react';

interface Props {
    secondsLeft: number;
    warning: boolean;
    onExtend: () => void;
    onLogout: () => void;
    children: React.ReactNode;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Wraps the admin panel: shows the live session timer and a "still there?" dialog before auto sign-out. */
const AdminSessionGuard: React.FC<Props> = ({ secondsLeft, warning, onExtend, onLogout, children }) => (
    <>
        {children}

        {/* session pill (above the panel, bottom-right) */}
        <div
            className={`fixed bottom-4 right-4 z-[10000] flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-xl transition-colors ${warning ? 'border-amber-400/50 bg-amber-500/15 text-amber-200' : 'border-white/10 bg-slate-900/80 text-slate-400'
                }`}
            title="Your admin session ends automatically when you are inactive"
        >
            <Lock className="h-3 w-3" />
            <span>Secure session</span>
            <span className="font-mono text-slate-300">{fmt(secondsLeft)}</span>
        </div>

        {warning && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="session-warning">
                <div className="w-full max-w-sm rounded-2xl border border-amber-400/30 bg-slate-900 p-6 text-center shadow-2xl">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10">
                        <Clock className="h-6 w-6 text-amber-300" />
                    </div>
                    <h3 id="session-warning" className="text-lg font-bold text-white">Still there?</h3>
                    <p className="mt-2 text-sm text-slate-400">
                        For your security you will be signed out in <span className="font-mono font-semibold text-amber-300">{secondsLeft}s</span>.
                    </p>
                    <div className="mt-5 flex gap-3">
                        <button onClick={onLogout} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/10">
                            <LogOut className="h-4 w-4" /> Sign out
                        </button>
                        <button autoFocus onClick={onExtend} className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                            Stay signed in
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
);

export default AdminSessionGuard;