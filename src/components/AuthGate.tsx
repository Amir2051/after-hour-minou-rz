import React, { useEffect, useState } from 'react';
import { getFirebaseAuth } from '../auth/firebase';
import { LoaderCircle, LogOut, ShieldCheck } from 'lucide-react';

type AuthUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
};

export const AuthGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [authUnavailable, setAuthUnavailable] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const auth = getFirebaseAuth();
        // Do not subscribe to auth state until the requested persistence mode is ready.
        // This prevents the app from racing session restoration against persistence setup.
        await auth.setPersistence(window.firebase!.auth.Auth.Persistence.LOCAL);
        if (cancelled) return;

        unsubscribe = auth.onAuthStateChanged((nextUser: AuthUser | null) => {
          if (cancelled) return;
          setUser(nextUser);
          setLoading(false);
          setError('');
        }, (authError: any) => {
          if (cancelled) return;
          setError(authError?.message || 'Unable to restore your sign-in session.');
          setLoading(false);
        });
      } catch (authError: any) {
        if (cancelled) return;
        setAuthUnavailable(true);
        setError(authError?.message || 'Firebase Authentication is unavailable.');
        setLoading(false);
      }
    };

    void initializeAuth();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    setWorking(true);
    setError('');
    try {
      const auth = getFirebaseAuth();
      await auth.setPersistence(window.firebase!.auth.Auth.Persistence.LOCAL);
      const provider = new window.firebase!.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await auth.signInWithPopup(provider);
    } catch (authError: any) {
      const code = authError?.code || '';
      if (code === 'auth/popup-blocked') {
        setError('Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase. Add the AFTER HOURS Cloud Run domain under Authentication → Settings → Authorized domains.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled in this Firebase project yet.');
      } else if (code === 'auth/invalid-api-key') {
        setError('The Firebase web API key is invalid. Check the AFTER HOURS Firebase web app configuration.');
      } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError(authError?.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setWorking(false);
    }
  };

  const signOut = async () => {
    setWorking(true);
    setError('');
    try {
      await getFirebaseAuth().signOut();
    } catch (authError: any) {
      setError(authError?.message || 'Unable to sign out. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-violet-200"><LoaderCircle className="w-6 h-6 animate-spin mr-3" /> Preparing your AFTER HOURS session…</div>;
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 py-12">
        <section className="glass-panel-glow w-full max-w-md rounded-3xl p-7 sm:p-9 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/30 bg-violet-400/10 text-violet-200 shadow-lg shadow-violet-950/40">
            <span className="font-serif text-xl font-black">AH</span>
          </div>
          <p className="text-[11px] uppercase tracking-[.35em] text-violet-200/75">Two players. One private night.</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-wide text-white">AFTER HOURS</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">Sign in to enter your private game night.</p>
          <button
            type="button"
            onClick={signIn}
            disabled={working || authUnavailable}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-5 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {working ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.01 13.22l7.98 6.19C12.87 13.72 18.03 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.25 5.47-4.73 7.16l7.63 5.91c4.46-4.12 7.17-10.2 7.17-17.54Z"/><path fill="#FBBC05" d="M10.99 28.59A14.4 14.4 0 0 1 10.2 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.98 10.78l8.01-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.91l-7.63-5.91c-2.12 1.43-4.84 2.27-8.27 2.27-5.97 0-11.13-4.22-13.01-9.91l-8.01 6.19C6.49 43.12 14.62 48 24 48Z"/></svg>}
            Continue with Google
          </button>
          {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-left text-sm leading-5 text-rose-200">{error}</p>}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Secured by Firebase Authentication</div>
          <p className="mt-5 text-[11px] leading-5 text-slate-500">By continuing, you agree to use AFTER HOURS respectfully and honor each player's boundaries.</p>
          {authUnavailable && <button onClick={() => window.location.reload()} className="mt-4 text-sm text-violet-200 underline">Reload authentication</button>}
        </section>
      </main>
    );
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-violet-200/20 bg-[#101326]/95 py-1.5 pl-2 pr-2 shadow-xl backdrop-blur-xl">
        {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full" /> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-100">{(user.displayName || user.email || 'A').slice(0, 1).toUpperCase()}</span>}
        <span className="max-w-[130px] truncate text-xs text-slate-200">{user.displayName || user.email}</span>
        <button onClick={signOut} disabled={working} aria-label="Sign out" title="Sign out" className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"><LogOut className="h-4 w-4" /></button>
      </div>
      {error && <div role="alert" className="fixed bottom-20 right-4 z-[70] max-w-sm rounded-xl border border-rose-400/25 bg-[#241326] px-4 py-3 text-sm text-rose-100 shadow-xl">{error}</div>}
    </>
  );
};
