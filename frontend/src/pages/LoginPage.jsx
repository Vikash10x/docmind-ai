import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Sparkles, Loader2, AlertCircle,
  ArrowRight, Zap, Shield, FileText,
  UserPlus, LogIn, Check, Mail, KeyRound, ArrowLeft,
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

/* ─── Keyframes ─────────────────────────────────────────── */
const STYLES = `
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(40px,-30px) scale(1.15);} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-30px,40px) scale(1.1);} }
  @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(20px,25px) scale(1.18);} }
  @keyframes orb4 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-40px,-20px) scale(1.12);} }

  @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
  @keyframes blink   { 0%,100%{opacity:1;} 50%{opacity:0;} }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.94) translateY(16px);} to{opacity:1;transform:scale(1) translateY(0);} }

  @keyframes floatA  { 0%,100%{transform:translateY(0) rotate(-3deg);} 50%{transform:translateY(-12px) rotate(-3deg);} }
  @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(4deg);}  50%{transform:translateY(-16px) rotate(4deg);} }
  @keyframes floatC  { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-9px) rotate(-1deg);} }

  @keyframes slideOutLeft  { from{opacity:1;transform:translateX(0) scale(1);}    to{opacity:0;transform:translateX(-28px) scale(.97);} }
  @keyframes slideInRight  { from{opacity:0;transform:translateX(28px) scale(.97);} to{opacity:1;transform:translateX(0) scale(1);} }
  @keyframes slideOutRight { from{opacity:1;transform:translateX(0) scale(1);}    to{opacity:0;transform:translateX(28px) scale(.97);} }
  @keyframes slideInLeft   { from{opacity:0;transform:translateX(-28px) scale(.97);} to{opacity:1;transform:translateX(0) scale(1);} }

  @keyframes beamSweep {
    0%  {transform:translateX(-100%) skewX(-12deg); opacity:0;}
    8%  {opacity:1;}
    92% {opacity:.6;}
    100%{transform:translateX(280%) skewX(-12deg); opacity:0;}
  }
  @keyframes scanLine { 0%{top:-3%;} 100%{top:103%;} }
  @keyframes gridDrift{ 0%{backgroundPosition:0 0;} 100%{backgroundPosition:48px 48px;} }

  @keyframes pulse    {
    0%  {box-shadow:0 0 0 0 rgba(236,72,153,.5);}
    70% {box-shadow:0 0 0 14px rgba(236,72,153,0);}
    100%{box-shadow:0 0 0 0 rgba(236,72,153,0);}
  }
  @keyframes orbit    { from{transform:rotate(0deg) translateX(24px) rotate(0deg);} to{transform:rotate(360deg) translateX(24px) rotate(-360deg);} }
  @keyframes rgbHue   { 0%{filter:hue-rotate(0deg);} 33%{filter:hue-rotate(40deg);} 66%{filter:hue-rotate(-20deg);} 100%{filter:hue-rotate(0deg);} }
  @keyframes borderSpin {
    0%  {background-position:0% 50%;}
    50% {background-position:100% 50%;}
    100%{background-position:0% 50%;}
  }
  @keyframes neonPulse {
    0%,100%{box-shadow:0 0 20px rgba(236,72,153,0.4),0 0 60px rgba(124,58,237,0.2);}
    50%    {box-shadow:0 0 40px rgba(236,72,153,0.7),0 0 100px rgba(124,58,237,0.4),0 0 160px rgba(6,182,212,0.15);}
  }

  .fx-enter-r { animation:slideInRight  .34s cubic-bezier(.22,1,.36,1) forwards; }
  .fx-enter-l { animation:slideInLeft   .34s cubic-bezier(.22,1,.36,1) forwards; }
  .fx-exit-l  { animation:slideOutLeft  .18s ease forwards; }
  .fx-exit-r  { animation:slideOutRight .18s ease forwards; }

  /* ── Responsive Layout ── */
  .lp-root       { min-height:100vh; display:flex; font-family:Inter,system-ui,sans-serif; overflow:hidden; position:relative; background:#06060a; }
  .lp-layout     { position:relative; z-index:3; display:flex; width:100%; min-height:100vh; }
  .lp-hero       { flex:1 1 50%; display:flex; flex-direction:column; justify-content:space-between; padding:48px 56px; min-width:0; }
  .lp-auth       { flex:1 1 50%; display:flex; align-items:center; justify-content:center; padding:40px 48px; position:relative; }
  .lp-float-card { display:block; }
  .lp-hero-desc  { font-size:16px; }
  .lp-h1         { font-size:clamp(38px,4.5vw,60px); }
  .lp-stats      { display:flex; gap:12px; margin-bottom:32px; }
  .lp-trust      { display:flex; }
  .lp-card-wrap  { width:100%; max-width:390px; position:relative; z-index:1; animation:scaleIn .65s ease .15s both; }

  /* Tablet (768px – 1199px) */
  @media (max-width:1199px) {
    .lp-layout  { flex-direction:column; align-items:center; }
    .lp-hero    { flex:none; width:100%; max-width:640px; padding:32px 32px 16px; justify-content:flex-start; gap:24px; }
    .lp-auth    { flex:none; width:100%; max-width:480px; padding:8px 32px 48px; }
    .lp-float-card { display:none; }
    .lp-h1      { font-size:clamp(30px,5vw,46px); }
    .lp-hero-desc { font-size:14px; margin-bottom:20px !important; }
    .lp-stats   { margin-bottom:20px; }
    .lp-trust   { display:flex; }
  }

  /* Mobile (< 768px) */
  @media (max-width:767px) {
    .lp-hero    { padding:24px 20px 12px; gap:16px; }
    .lp-auth    { padding:0 16px 36px; max-width:100%; }
    .lp-h1      { font-size:clamp(26px,7vw,36px); letter-spacing:-1.5px; }
    .lp-hero-desc { display:none; }
    .lp-stats   { gap:8px; margin-bottom:16px; }
    .lp-trust   { display:none; }
    .lp-float-card { display:none; }
    .lp-card-wrap { max-width:100%; }
  }
`;

/* ─── Typing hook ───────────────────────────────────────── */
function useTyping(words, speed = 85) {
  const [display, setDisplay] = useState('');
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[wi];
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(word.slice(0, ci + 1));
        if (ci + 1 === word.length) setTimeout(() => setDel(true), 1800);
        else setCi(c => c + 1);
      } else {
        setDisplay(word.slice(0, ci - 1));
        if (ci - 1 === 0) { setDel(false); setWi(w => (w + 1) % words.length); setCi(0); }
        else setCi(c => c - 1);
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed]);
  return display;
}

/* ─── Floating Doc Card ─────────────────────────────────── */
function DocCard({ title, pages, pct, anim, style, accent = '#7c3aed', accentEnd = '#a78bfa', className = '' }) {
  return (
    <div className={className} style={{
      position: 'absolute', width: '160px',
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${accent}40`,
      borderRadius: '16px', padding: '14px',
      backdropFilter: 'blur(20px)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${accent}15, 0 0 20px ${accent}20`,
      animation: anim,
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: `linear-gradient(135deg,${accent},${accentEnd})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${accent}50` }}>
          <FileText size={13} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{pages} pages</div>
        </div>
      </div>
      <div style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${accent},${accentEnd})`, borderRadius: '99px' }} />
      </div>
      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 600, marginTop: '7px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Check size={10} /> Ready to chat
      </div>
    </div>
  );
}

/* ─── Input ─────────────────────────────────────────────── */
function AuthInput({ id, name, type = 'text', placeholder, value, onChange, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id} name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange} required autoComplete={name}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: `12px ${rightEl ? '44px' : '14px'} 12px 14px`,
          borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit',
          background: focused ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.04)',
          border: focused ? '1.5px solid rgba(139,92,246,0.6)' : '1.5px solid rgba(255,255,255,0.09)',
          color: 'white', outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
          transition: 'all .2s',
        }}
      />
      {rightEl}
    </div>
  );
}

function FieldErr({ msg }) {
  return msg ? (
    <p style={{ fontSize: '12px', color: '#f87171', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
      <AlertCircle size={11} /> {msg}
    </p>
  ) : null;
}

/* ═══════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════ */
export default function LoginPage({ defaultMode = 'login' }) {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [mode, setMode] = useState(defaultMode); // 'login' | 'signup' | 'forgot'
  const [animCls, setAnimCls] = useState('');
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (defaultMode && defaultMode !== mode) {
      setMode(defaultMode);
    }
  }, [defaultMode]);

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

  const typed = useTyping(['your PDFs.', 'your contracts.', 'your research.', 'your reports.', 'your notes.']);

  const switchMode = (next) => {
    if (next === mode) return;
    const exit = next === 'signup' ? 'fx-exit-l' : 'fx-exit-r';
    const enter = next === 'signup' ? 'fx-enter-r' : 'fx-enter-l';
    setAnimCls(exit); setShow(false);
    setTimeout(() => {
      setMode(next);
      setShow(true);
      setAnimCls(enter);
      setErrL('');
      setErrS({});
      setErrF('');
      setSuccF('');
      setShowPwd(false);
    }, 190);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!lf.email || !lf.password) { setErrL('Please fill in all fields.'); return; }
    try {
      setLdL(true);
      const { data } = await authAPI.signin(lf);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) { setErrL(err.response?.data?.error || 'Sign in failed.'); }
    finally { setLdL(false); }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        // Fetch user profile info from Google
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        // Send to backend
        const { data } = await authAPI.googleSignIn({
          userInfo,
          accessToken: tokenResponse.access_token,
        });

        login(data.user, data.token);
        toast.success(`Signed in with Google! Welcome, ${data.user.name} 🎉`);
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

  const GoogleButton = ({ text }) => (
    <button
      type="button"
      onClick={() => loginWithGoogle()}
      disabled={googleLoading}
      style={{
        width: '100%',
        padding: '11px 16px',
        borderRadius: '13px',
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
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.35), 0 0 12px rgba(255,255,255,0.05)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)';
      }}
    >
      {googleLoading ? (
        <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          flexShrink: 0
        }}>
          <GoogleIcon size={15} />
        </div>
      )}
      <span>{text}</span>
    </button>
  );

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
      navigate('/dashboard');
    } catch (err) { setErrS({ general: err.response?.data?.error || 'Failed to create account.' }); }
    finally { setLdS(false); }
  };

  /* Eye toggle */
  const EyeBtn = () => (
    <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color .2s' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}>
      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  /* Submit button */
  const SubmitBtn = ({ loading, label, icon: Icon }) => (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '13px', borderRadius: '14px', marginTop: '6px',
      fontSize: '14px', fontWeight: 700, color: 'white', border: 'none',
      cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
      background: 'linear-gradient(135deg,#7c3aed 0%,#6d28d9 50%,#5b21b6 100%)',
      boxShadow: loading ? 'none' : '0 0 0 1px rgba(139,92,246,0.3), 0 6px 24px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
      transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      opacity: loading ? .65 : 1,
    }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.5), 0 10px 36px rgba(109,40,217,0.55), inset 0 1px 0 rgba(255,255,255,0.15)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.3), 0 6px 24px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.12)'; }}
    >
      {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Please wait...</> : <><Icon size={16} /> {label}</>}
    </button>
  );

  /* Switch link */
  const SwitchLink = ({ onClick, children }) => (
    <button type="button" onClick={onClick} style={{ fontWeight: 700, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', transition: 'color .2s' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#a78bfa'; }}>
      {children}
    </button>
  );

  const stats = [{ val: '10s', label: 'Avg index time' }, { val: '99%', label: 'Accuracy' }, { val: '∞', label: 'Documents' }];
  const features = [
    { icon: FileText, label: 'Smart PDF Parsing' },
    { icon: Shield, label: 'Private & Secure' },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="lp-root">

        {/* ── Animated grid ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px)', backgroundSize: '48px 48px', animation: 'gridDrift 10s linear infinite' }} />

        {/* ── Aurora orbs — multi-color ── */}
        {/* Purple */}
        <div style={{ position: 'absolute', top: '-18%', left: '-12%', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.5),transparent 70%)', filter: 'blur(80px)', animation: 'orb1 16s ease-in-out infinite', zIndex: 0 }} />
        {/* Magenta / Pink */}
        <div style={{ position: 'absolute', bottom: '-15%', right: '-8%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.35),transparent 70%)', filter: 'blur(90px)', animation: 'orb2 20s ease-in-out infinite', zIndex: 0 }} />
        {/* Cyan */}
        <div style={{ position: 'absolute', top: '40%', right: '25%', width: '30%', height: '30%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.2),transparent 70%)', filter: 'blur(70px)', animation: 'orb3 13s ease-in-out infinite', zIndex: 0 }} />
        {/* Indigo accent */}
        <div style={{ position: 'absolute', top: '60%', left: '20%', width: '22%', height: '22%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)', filter: 'blur(50px)', animation: 'orb4 11s ease-in-out 2s infinite', zIndex: 0 }} />

        {/* ── Beam sweep — iridescent ── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '120px', background: 'linear-gradient(90deg,transparent,rgba(236,72,153,0.05),rgba(124,58,237,0.08),rgba(6,182,212,0.05),transparent)', animation: 'beamSweep 7s ease-in-out 3s infinite' }} />
        </div>

        {/* ── Scan line — colorful ── */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: '1.5px', zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(90deg,transparent,rgba(236,72,153,0.6),rgba(167,139,250,0.8),rgba(6,182,212,0.6),transparent)', boxShadow: '0 0 12px rgba(236,72,153,0.4),0 0 24px rgba(124,58,237,0.3)', animation: 'scanLine 9s linear 1s infinite' }} />

        {/* ════ LAYOUT ════ */}
        <div className="lp-layout">

          {/* ══ LEFT — Hero ══ */}
          <div className="lp-hero">

            {/* Logo — exact same as Navbar */}
            <div style={{ animation: 'fadeUp .5s ease forwards', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', width: '44px', height: '44px' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '7px', height: '7px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa', marginTop: '-3.5px', marginLeft: '-3.5px', animation: 'orbit 2.5s linear infinite' }} />
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 24px rgba(124,58,237,0.5),inset 0 1px 0 rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'rgbHue 5s ease-in-out infinite' }}>
                  <Sparkles size={19} color="white" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px' }}>
                  <span style={{ color: 'white' }}>DocMind</span><span style={{ color: '#a78bfa' }}>AI</span>
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '2px' }}>by Vikash</div>
              </div>
              {/* Gemini badge — same as navbar */}
              <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', fontSize: '11px', fontWeight: 600, color: '#c4b5fd' }}>
                <Zap size={10} color="#a78bfa" /> Gemini Powered
              </div>
            </div>

            {/* Hero */}
            <div style={{ animation: 'fadeUp .65s ease .12s both', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '40px', paddingBottom: '28px' }}>
              <h1 className="lp-h1" style={{ fontWeight: 900, lineHeight: 1.06, letterSpacing: '-2.5px', color: 'white', margin: '0 0 20px' }}>
                Chat with<br />
                <span style={{ backgroundImage: 'linear-gradient(135deg,#f9a8d4 0%,#ec4899 20%,#a78bfa 45%,#7c3aed 65%,#06b6d4 85%,#a78bfa 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 3s linear infinite' }}>
                  {typed || '\u00A0'}
                  <span style={{ animation: 'blink 1s step-end infinite', WebkitTextFillColor: '#ec4899' }}>|</span>
                </span>
              </h1>

              <p className="lp-hero-desc" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '420px', margin: '0 0 36px', fontWeight: 400 }}>
                Upload any PDF and instantly unlock AI-powered conversations grounded in your document content.
              </p>

              {/* Stats — colorful cards */}
              <div className="lp-stats">
                {[
                  { val: '10s', label: 'Avg index time', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.25)', glow: 'rgba(124,58,237,0.3)' },
                  { val: '99%', label: 'Accuracy', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.25)', glow: 'rgba(236,72,153,0.3)' },
                  { val: '\u221e', label: 'Documents', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', glow: 'rgba(6,182,212,0.3)' },
                ].map(({ val, label, color, bg, border, glow }, i) => (
                  <div key={label} style={{
                    padding: '16px 22px', borderRadius: '16px', textAlign: 'center',
                    background: bg, border: `1px solid ${border}`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 4px 20px ${glow}`,
                    animation: `fadeUp .6s ease ${.25 + i * .1}s both`,
                    transition: 'all .25s', flex: 1,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${glow}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 20px ${glow}`; }}
                  >
                    <div style={{ fontSize: '26px', fontWeight: 900, color, letterSpacing: '-1px', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Feature pills — 2 only */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: 500,
                    cursor: 'default', transition: 'all .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.color = '#c4b5fd'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
                    <Icon size={13} /> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom — minimal trust line */}
            <div className="lp-trust" style={{ animation: 'fadeUp .7s ease .3s both', alignItems: 'center', gap: '20px' }}>
              {[{ icon: Shield, text: 'SSL Encrypted' }, { icon: Check, text: 'Free to use' }].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
                  <Icon size={12} color="#a78bfa" />{text}
                </div>
              ))}
            </div>
          </div>

          {/* ══ RIGHT — Auth card ══ */}
          <div className="lp-auth">



            {/* Floating card — hidden on mobile/tablet via CSS */}
            <DocCard title="Contract PDF" pages="12" pct={82} anim="floatA 4.5s ease-in-out infinite" accent="#7c3aed" accentEnd="#a78bfa" style={{ position: 'absolute', left: '16px', top: '148px', zIndex: 2 }} className="lp-float-card" />

            {/* ─── AUTH CARD ─── */}
            <div className="lp-card-wrap">
              {/* Iridescent neon border */}
              <div style={{
                padding: '1.5px', borderRadius: '26px',
                background: 'linear-gradient(135deg,#ec4899,#7c3aed,#06b6d4,#a78bfa,#ec4899)',
                backgroundSize: '300% 300%',
                animation: 'borderSpin 4s linear infinite',
                boxShadow: '0 0 40px rgba(236,72,153,0.3), 0 0 80px rgba(124,58,237,0.2), 0 0 120px rgba(6,182,212,0.1)',
              }}>
                {/* Card inner — same bg as dashboard */}
                <div style={{ borderRadius: '25px', background: 'rgba(9,9,15,0.97)', backdropFilter: 'blur(40px)', overflow: 'hidden', position: 'relative' }}>

                  {/* Inner scan line */}
                  <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.4),transparent)', animation: 'scanLine 6s linear infinite' }} />

                  <div style={{ padding: '30px 30px 26px' }}>

                    {/* Mode tabs or Forgot header */}
                    {mode !== 'forgot' ? (
                      <div style={{ display: 'flex', borderRadius: '14px', padding: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '26px' }}>
                        {[{ key: 'login', label: 'Sign In', icon: LogIn }, { key: 'signup', label: 'Sign Up', icon: UserPlus }].map(({ key, label, icon: Icon }) => {
                          const active = mode === key;
                          return (
                            <button key={key} type="button" onClick={() => switchMode(key)} style={{
                              flex: 1, padding: '10px 8px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                              fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                              transition: 'all .25s cubic-bezier(.22,1,.36,1)',
                              background: active ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'transparent',
                              color: active ? 'white' : 'rgba(255,255,255,0.35)',
                              boxShadow: active ? '0 4px 16px rgba(109,40,217,0.45),inset 0 1px 0 rgba(255,255,255,0.12)' : 'none',
                            }}>
                              <Icon size={13} />{label}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px', padding: '6px 12px', color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          <ArrowLeft size={13} /> Back to Sign In
                        </button>
                      </div>
                    )}

                    {/* Form content */}
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <div className={animCls} style={{ willChange: 'transform,opacity' }}>
                        {show && (
                          mode === 'login' ? (
                            /* ── LOGIN FORM ── */
                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              {/* Icon */}
                              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                                <div style={{ width: '58px', height: '58px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 0 0 rgba(139,92,246,0.5)', animation: 'pulse 2.5s ease-in-out infinite, rgbHue 5s ease-in-out infinite' }}>
                                  <LogIn size={23} color="white" />
                                </div>
                              </div>
                              <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                                <h2 style={{ fontSize: '21px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '4px' }}>Welcome back</h2>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)' }}>Sign in to your DocMind AI account</p>
                              </div>

                              {errL && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px' }}>
                                  <AlertCircle size={13} />{errL}
                                </div>
                              )}

                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>Email address</label>
                                <AuthInput id="l-email" name="email" type="email" placeholder="you@example.com" value={lf.email} onChange={e => setLf(p => ({ ...p, email: e.target.value }))} />
                              </div>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3px' }}>Password</label>
                                  <button
                                    type="button"
                                    onClick={() => switchMode('forgot')}
                                    style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '12px', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                                  >
                                    Forgot password?
                                  </button>
                                </div>
                                <AuthInput id="l-pwd" name="password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={lf.password} onChange={e => setLf(p => ({ ...p, password: e.target.value }))} rightEl={<EyeBtn />} />
                              </div>

                              <SubmitBtn loading={ldL} label="Sign In" icon={ArrowRight} />

                              {/* Google Sign In Divider */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>or continue with</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                              </div>

                              <div style={{ width: '100%' }}>
                                <GoogleButton text="Continue with Google" />
                              </div>

                              <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>
                                No account? <SwitchLink onClick={() => switchMode('signup')}>Create one free →</SwitchLink>
                              </p>
                            </form>
                          ) : mode === 'signup' ? (
                            /* ── SIGNUP FORM ── */
                            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                                <div style={{ width: '58px', height: '58px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#5b21b6,#7c3aed)', boxShadow: '0 0 0 0 rgba(139,92,246,0.5)', animation: 'pulse 2.5s ease-in-out infinite, rgbHue 5s ease-in-out infinite' }}>
                                  <UserPlus size={23} color="white" />
                                </div>
                              </div>
                              <div style={{ textAlign: 'center', marginBottom: '2px' }}>
                                <h2 style={{ fontSize: '21px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '4px' }}>Create account</h2>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)' }}>Start chatting with your docs today</p>
                              </div>

                              {errS.general && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px' }}>
                                  <AlertCircle size={13} />{errS.general}
                                </div>
                              )}

                              {[
                                { id: 's-name', name: 'name', type: 'text', label: 'Full name', ph: 'Jane Doe', key: 'name' },
                                { id: 's-email', name: 'email', type: 'email', label: 'Email address', ph: 'jane@example.com', key: 'email' },
                              ].map(({ id, name, type, label, ph, key }) => (
                                <div key={id}>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', letterSpacing: '0.3px' }}>{label}</label>
                                  <AuthInput id={id} name={name} type={type} placeholder={ph} value={sf[key]} onChange={e => { setSf(p => ({ ...p, [key]: e.target.value })); setErrS(p => ({ ...p, [key]: '' })); }} />
                                  <FieldErr msg={errS[key]} />
                                </div>
                              ))}

                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', letterSpacing: '0.3px' }}>Password</label>
                                <AuthInput id="s-pwd" name="password" type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters" value={sf.password} onChange={e => { setSf(p => ({ ...p, password: e.target.value })); setErrS(p => ({ ...p, password: '' })); }} rightEl={<EyeBtn />} />
                                <FieldErr msg={errS.password} />
                              </div>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', letterSpacing: '0.3px' }}>Confirm password</label>
                                <AuthInput id="s-confirm" name="confirmPassword" type="password" placeholder="Repeat password" value={sf.confirmPassword} onChange={e => { setSf(p => ({ ...p, confirmPassword: e.target.value })); setErrS(p => ({ ...p, confirmPassword: '' })); }} />
                                <FieldErr msg={errS.confirmPassword} />
                              </div>

                              <SubmitBtn loading={ldS} label="Create Account" icon={UserPlus} />

                              {/* Google Sign In Divider */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>or</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                              </div>

                              <div style={{ width: '100%' }}>
                                <GoogleButton text="Sign up with Google" />
                              </div>

                              <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>
                                Have an account? <SwitchLink onClick={() => switchMode('login')}>Sign in →</SwitchLink>
                              </p>
                            </form>
                          ) : (
                            /* ── FORGOT PASSWORD FORM ── */
                            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                                <div style={{ width: '58px', height: '58px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#ec4899,#7c3aed)', boxShadow: '0 0 20px rgba(236,72,153,0.4)', animation: 'pulse 2.5s ease-in-out infinite' }}>
                                  <KeyRound size={23} color="white" />
                                </div>
                              </div>
                              <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                                <h2 style={{ fontSize: '21px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '4px' }}>Forgot password?</h2>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>
                                  Enter your email and we'll send you a link to reset your password.
                                </p>
                              </div>

                              {errF && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px' }}>
                                  <AlertCircle size={13} />{errF}
                                </div>
                              )}

                              {succF && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', fontSize: '13px' }}>
                                  <Check size={14} />{succF}
                                </div>
                              )}

                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>Registered Email</label>
                                <AuthInput id="f-email" name="email" type="email" placeholder="you@example.com" value={ffEmail} onChange={e => setFfEmail(e.target.value)} />
                              </div>

                              <SubmitBtn loading={ldF} label="Send Reset Link" icon={Mail} />

                              <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                                Remembered your password? <SwitchLink onClick={() => switchMode('login')}>Sign in →</SwitchLink>
                              </p>
                            </form>
                          )
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Trust strip */}
                  <div style={{ padding: '13px 30px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    {[{ icon: Shield, text: 'SSL Encrypted' }, { icon: Check, text: 'No spam' }, { icon: Zap, text: 'Free forever' }].map(({ icon: Icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
                        <Icon size={11} color="#a78bfa" />{text}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
