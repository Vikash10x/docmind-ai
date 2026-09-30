import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Sparkles, Loader2, AlertCircle,
  ArrowRight, Shield, UserPlus, LogIn, Check, Mail, KeyRound, ArrowLeft, X, Zap
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

/* ─── Google SVG Icon ───────────────────────────────────── */
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function AuthInput({ id, name, type = 'text', placeholder, value, onChange, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id} name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange} required autoComplete={name}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: `11px ${rightEl ? '42px' : '14px'} 11px 14px`,
          borderRadius: '12px', fontSize: '13.5px', fontFamily: 'inherit',
          background: focused ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.04)',
          border: focused ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(255,255,255,0.09)',
          color: 'white', outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
          transition: 'all .2s',
        }}
      />
      {rightEl}
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [lf, setLf] = useState({ email: '', password: '' });
  const [sf, setSf] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [ffEmail, setFfEmail] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [ldL, setLdL] = useState(false);
  const [ldS, setLdS] = useState(false);
  const [ldF, setLdF] = useState(false);
  const [errL, setErrL] = useState('');
  const [errS, setErrS] = useState({});
  const [errF, setErrF] = useState('');
  const [succF, setSuccF] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrL('');
    setErrS({});
    setErrF('');
    setSuccF('');
  }, [initialMode, isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!lf.email || !lf.password) { setErrL('Please fill in all fields.'); return; }
    try {
      setLdL(true);
      const { data } = await authAPI.signin(lf);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 🎉`);
      onClose();
      navigate('/dashboard');
    } catch (err) { setErrL(err.response?.data?.error || 'Sign in failed.'); }
    finally { setLdL(false); }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        const { data } = await authAPI.googleSignIn({
          userInfo,
          accessToken: tokenResponse.access_token,
        });

        login(data.user, data.token);
        toast.success(`Signed in with Google! Welcome, ${data.user.name} 🎉`);
        onClose();
        navigate('/dashboard');
      } catch (err) {
        console.error('Google Auth error:', err);
        toast.error(err.response?.data?.error || 'Google Sign-In failed.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-In was cancelled or failed.');
      setGoogleLoading(false);
    },
  });

  const validate = () => {
    const e = {};
    if (!sf.name.trim() || sf.name.trim().length < 2) e.name = 'Min. 2 characters.';
    if (!/^\S+@\S+\.\S+$/.test(sf.email)) e.email = 'Invalid email.';
    if (sf.password.length < 6) e.password = 'Min. 6 characters.';
    if (sf.password !== sf.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrS(errs); return; }
    try {
      setLdS(true);
      const { data } = await authAPI.signup({ name: sf.name.trim(), email: sf.email.toLowerCase().trim(), password: sf.password });
      login(data.user, data.token);
      toast.success('Account created! Welcome 🎉');
      onClose();
      navigate('/dashboard');
    } catch (err) { setErrS({ general: err.response?.data?.error || 'Failed to create account.' }); }
    finally { setLdS(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!ffEmail) { setErrF('Please enter your email address.'); return; }
    try {
      setLdF(true);
      setErrF('');
      setSuccF('');
      const { data } = await authAPI.forgotPassword(ffEmail);
      setSuccF(data.message || 'Reset link sent! Please check your inbox.');
      toast.success('Reset email sent! 📬');
    } catch (err) {
      setErrF(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLdF(false);
    }
  };

  const GoogleButton = ({ text }) => (
    <button
      type="button"
      onClick={() => loginWithGoogle()}
      disabled={googleLoading}
      style={{
        width: '100%',
        padding: '11px 16px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#ffffff',
        fontSize: '13.5px',
        fontWeight: 600,
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: googleLoading ? 'not-allowed' : 'pointer',
        transition: 'all .2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
      onMouseEnter={e => {
        if (!googleLoading) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.transform = '';
      }}
    >
      {googleLoading ? (
        <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <GoogleIcon size={14} />
        </div>
      )}
      <span>{text}</span>
    </button>
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5,7,12,0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          borderRadius: '26px',
          padding: '1.5px',
          background: 'linear-gradient(135deg, #6366f1, #c084fc, #38bdf8, #6366f1)',
          backgroundSize: '300% 300%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 50px rgba(99,102,241,0.25)',
          position: 'relative',
        }}
      >
        <div style={{
          borderRadius: '25px',
          background: '#090d16',
          overflow: 'hidden',
          padding: '28px 28px 24px',
          position: 'relative',
        }}>
          {/* Mode switch tabs */}
          {mode !== 'forgot' ? (
            <div style={{ display: 'flex', borderRadius: '13px', padding: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '22px' }}>
              {[
                { key: 'login', label: 'Sign In', icon: LogIn },
                { key: 'signup', label: 'Sign Up', icon: UserPlus },
              ].map(({ key, label, icon: Icon }) => {
                const active = mode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setMode(key); setErrL(''); setErrS({}); }}
                    style={{
                      flex: 1, padding: '9px 8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                      color: active ? 'white' : 'rgba(255,255,255,0.4)',
                      boxShadow: active ? '0 4px 14px rgba(79,70,229,0.4)' : 'none',
                      transition: 'all .2s ease',
                    }}
                  >
                    <Icon size={13} /> {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '6px 12px', color: 'rgba(255,255,255,0.7)',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginBottom: '18px',
              }}
            >
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          )}

          {/* Form container */}
          {mode === 'login' ? (
            /* ─── Sign In Form ─── */
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div style={{ textAlign: 'center', marginBottom: '2px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', margin: '0 0 4px' }}>Welcome back</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Sign in to your DocMind AI account</p>
              </div>

              {errL && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '12.5px' }}>
                  <AlertCircle size={13} />{errL}
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '5px' }}>Email address</label>
                <AuthInput id="m-email" name="email" type="email" placeholder="you@example.com" value={lf.email} onChange={e => setLf(p => ({ ...p, email: e.target.value }))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Password</label>
                  <button type="button" onClick={() => setMode('forgot')} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '11.5px', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <AuthInput
                  id="m-pwd" name="password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={lf.password} onChange={e => setLf(p => ({ ...p, password: e.target.value }))}
                  rightEl={
                    <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </div>

              <button
                type="submit"
                disabled={ldL}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px', marginTop: '4px',
                  fontSize: '14px', fontWeight: 700, color: 'white', border: 'none',
                  cursor: ldL ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 6px 20px rgba(79,70,229,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {ldL ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><LogIn size={15} /> Sign In</>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <GoogleButton text="Continue with Google" />

              <p style={{ textAlign: 'center', fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
                No account?{' '}
                <button type="button" onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer', fontSize: '12.5px' }}>
                  Create one free →
                </button>
              </p>
            </form>
          ) : mode === 'signup' ? (
            /* ─── Sign Up Form ─── */
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              <div style={{ textAlign: 'center', marginBottom: '2px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', margin: '0 0 4px' }}>Create account</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Start chatting with your documents</p>
              </div>

              {errS.general && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '12.5px' }}>
                  <AlertCircle size={13} />{errS.general}
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '4px' }}>Full name</label>
                <AuthInput id="s-name" name="name" type="text" placeholder="Jane Doe" value={sf.name} onChange={e => { setSf(p => ({ ...p, name: e.target.value })); setErrS(p => ({ ...p, name: '' })); }} />
                {errS.name && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '3px' }}>{errS.name}</p>}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '4px' }}>Email address</label>
                <AuthInput id="s-email" name="email" type="email" placeholder="jane@example.com" value={sf.email} onChange={e => { setSf(p => ({ ...p, email: e.target.value })); setErrS(p => ({ ...p, email: '' })); }} />
                {errS.email && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '3px' }}>{errS.email}</p>}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '4px' }}>Password</label>
                <AuthInput id="s-pwd" name="password" type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters" value={sf.password} onChange={e => { setSf(p => ({ ...p, password: e.target.value })); setErrS(p => ({ ...p, password: '' })); }}
                  rightEl={
                    <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                {errS.password && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '3px' }}>{errS.password}</p>}
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '4px' }}>Confirm password</label>
                <AuthInput id="s-cpwd" name="confirmPassword" type="password" placeholder="Repeat password" value={sf.confirmPassword} onChange={e => { setSf(p => ({ ...p, confirmPassword: e.target.value })); setErrS(p => ({ ...p, confirmPassword: '' })); }} />
                {errS.confirmPassword && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '3px' }}>{errS.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={ldS}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px', marginTop: '4px',
                  fontSize: '14px', fontWeight: 700, color: 'white', border: 'none',
                  cursor: ldS ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 6px 20px rgba(79,70,229,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {ldS ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><UserPlus size={15} /> Create Account</>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <GoogleButton text="Sign up with Google" />

              <p style={{ textAlign: 'center', fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
                Have an account?{' '}
                <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer', fontSize: '12.5px' }}>
                  Sign in →
                </button>
              </p>
            </form>
          ) : (
            /* ─── Forgot Password Form ─── */
            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ textAlign: 'center', marginBottom: '2px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', margin: '0 0 4px' }}>Forgot password?</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
                  Enter your email and we'll send you a password reset link.
                </p>
              </div>

              {errF && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '12.5px' }}>
                  <AlertCircle size={13} />{errF}
                </div>
              )}

              {succF && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 12px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', fontSize: '12.5px' }}>
                  <Check size={14} />{succF}
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '5px' }}>Registered Email</label>
                <AuthInput id="f-email" name="email" type="email" placeholder="you@example.com" value={ffEmail} onChange={e => setFfEmail(e.target.value)} />
              </div>

              <button
                type="submit"
                disabled={ldF}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px', marginTop: '4px',
                  fontSize: '14px', fontWeight: 700, color: 'white', border: 'none',
                  cursor: ldF ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 6px 20px rgba(79,70,229,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {ldF ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><Mail size={15} /> Send Reset Link</>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
