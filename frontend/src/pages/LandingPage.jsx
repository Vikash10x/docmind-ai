import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Play, Zap, MessageSquare, Shield,
  FileText, UploadCloud, ChevronDown, Check, Clock, Settings,
  X, Send, Bot, User, MoreVertical, Lock, Cpu, Volume2, Mic,
  Layers, CheckCircle2, Star, Github, Globe, CornerDownLeft,
  LayoutDashboard, LogOut, Menu, HelpCircle, FolderOpen, ExternalLink,
  Sun, Moon, Palette
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import AuthModal from '../components/AuthModal';

const themeStyles = {
  dark: {
    bg: '#08090d',
    bgImage: `
      radial-gradient(ellipse 70% 45% at 50% -5%, rgba(56,189,248,0.08), transparent 70%),
      radial-gradient(ellipse 60% 40% at 15% 20%, rgba(99,102,241,0.07), transparent 65%),
      linear-gradient(180deg, #08090d 0%, #0b0d14 50%, #08090d 100%)
    `,
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    headingGrad: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 45%, #60a5fa 100%)',
    brandText: '#ffffff',
    brandAccent: '#38bdf8',
    pillBg: 'rgba(56,189,248,0.06)',
    pillBorder: 'rgba(56,189,248,0.2)',
    pillText: '#38bdf8',
    btnPrimaryBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    btnPrimaryShadow: '0 8px 24px rgba(37,99,235,0.35)',
    btnSecondaryBg: 'rgba(255,255,255,0.03)',
    btnSecondaryBorder: 'rgba(255,255,255,0.12)',
    btnSecondaryText: '#ffffff',
    switcherBg: 'rgba(255,255,255,0.06)',
    switcherBorder: 'rgba(255,255,255,0.12)',
    cardBg: 'rgba(255,255,255,0.02)',
    cardBorder: 'rgba(255,255,255,0.06)',
    mockupOuter: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(56,189,248,0.15) 50%, rgba(255,255,255,0.04) 100%)',
    mockupOuterBg: '#0c0f17',
    mockupHeaderBg: '#090c13',
    mockupGridBg: '#080a11',
    mockupSidebarBg: '#090c14',
    mockupDocBg: '#0a0d16',
    mockupChatBg: '#0b0e17',
    mockupUserBubble: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    mockupAiBubble: 'rgba(255,255,255,0.035)',
    mockupAiBubbleText: '#e2e8f0',
    sectionBorder: 'rgba(255,255,255,0.05)',
    footerText: 'rgba(255,255,255,0.4)',
    menuBg: '#0d111a',
  },
  beige: {
    bg: '#fbf9f4',
    bgImage: `
      radial-gradient(ellipse 70% 45% at 50% -5%, rgba(217,119,6,0.08), transparent 70%),
      radial-gradient(ellipse 60% 40% at 15% 20%, rgba(180,83,9,0.06), transparent 65%),
      linear-gradient(180deg, #fbf9f4 0%, #f4f0e6 50%, #fbf9f4 100%)
    `,
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    headingGrad: 'linear-gradient(135deg, #1c1917 0%, #44403c 45%, #b45309 100%)',
    brandText: '#1c1917',
    brandAccent: '#d97706',
    pillBg: 'rgba(217,119,6,0.09)',
    pillBorder: 'rgba(217,119,6,0.25)',
    pillText: '#b45309',
    btnPrimaryBg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    btnPrimaryShadow: '0 8px 24px rgba(217,119,6,0.25)',
    btnSecondaryBg: 'rgba(0,0,0,0.03)',
    btnSecondaryBorder: 'rgba(0,0,0,0.12)',
    btnSecondaryText: '#1c1917',
    switcherBg: '#ede8dd',
    switcherBorder: 'rgba(0,0,0,0.1)',
    cardBg: '#ffffff',
    cardBorder: 'rgba(0,0,0,0.08)',
    mockupOuter: 'linear-gradient(135deg, rgba(217,119,6,0.2) 0%, rgba(180,83,9,0.15) 50%, rgba(0,0,0,0.06) 100%)',
    mockupOuterBg: '#ffffff',
    mockupHeaderBg: '#f4f0e6',
    mockupGridBg: '#fbf9f4',
    mockupSidebarBg: '#f1ede4',
    mockupDocBg: '#f4f0e6',
    mockupChatBg: '#fbf9f4',
    mockupUserBubble: 'linear-gradient(135deg, #d97706, #b45309)',
    mockupAiBubble: '#ede8dd',
    mockupAiBubbleText: '#292524',
    sectionBorder: 'rgba(0,0,0,0.08)',
    footerText: '#78716c',
    menuBg: '#ffffff',
  },
  white: {
    bg: '#ffffff',
    bgImage: `
      radial-gradient(ellipse 70% 45% at 50% -5%, rgba(37,99,235,0.06), transparent 70%),
      radial-gradient(ellipse 60% 40% at 85% 30%, rgba(56,189,248,0.05), transparent 65%),
      linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)
    `,
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    headingGrad: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)',
    brandText: '#0f172a',
    brandAccent: '#2563eb',
    pillBg: 'rgba(37,99,235,0.08)',
    pillBorder: 'rgba(37,99,235,0.22)',
    pillText: '#2563eb',
    btnPrimaryBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    btnPrimaryShadow: '0 8px 24px rgba(37,99,235,0.25)',
    btnSecondaryBg: 'rgba(0,0,0,0.03)',
    btnSecondaryBorder: 'rgba(0,0,0,0.12)',
    btnSecondaryText: '#0f172a',
    switcherBg: '#f1f5f9',
    switcherBorder: 'rgba(0,0,0,0.1)',
    cardBg: '#ffffff',
    cardBorder: 'rgba(0,0,0,0.08)',
    mockupOuter: 'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(56,189,248,0.12) 50%, rgba(0,0,0,0.05) 100%)',
    mockupOuterBg: '#ffffff',
    mockupHeaderBg: '#f8fafc',
    mockupGridBg: '#ffffff',
    mockupSidebarBg: '#f1f5f9',
    mockupDocBg: '#f8fafc',
    mockupChatBg: '#ffffff',
    mockupUserBubble: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    mockupAiBubble: '#f1f5f9',
    mockupAiBubbleText: '#1e293b',
    sectionBorder: 'rgba(0,0,0,0.07)',
    footerText: '#64748b',
    menuBg: '#ffffff',
  }
};

/* ─── Geometric Modern Neural Node Logo SVG ─────────────────────────────── */
export function BrainLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Container Badge */}
      <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#neural_badge_grad)" stroke="#fde68a" strokeWidth="1.2" />
      
      {/* Interconnected Neural Network Nodes */}
      <line x1="12" y1="12" x2="24" y2="12" stroke="url(#neural_line_grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="18" y2="24" stroke="url(#neural_line_grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="12" x2="18" y2="24" stroke="url(#neural_line_grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="12" x2="18" y2="24" stroke="url(#neural_line_grad)" strokeWidth="1.8" strokeDasharray="2 2" />

      {/* Nodes */}
      <circle cx="12" cy="12" r="3" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="24" cy="12" r="3" fill="#b45309" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="18" cy="24" r="3.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="2" fill="#ffffff" />

      <defs>
        <linearGradient id="neural_badge_grad" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef3c7" />
          <stop offset="1" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="neural_line_grad" x1="12" y1="12" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d97706" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function LandingPage({ defaultAuthOpen = false, defaultAuthMode = 'login' }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Chat');
  const [inputVal, setInputVal] = useState('');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(defaultAuthOpen);
  const [authModalMode, setAuthModalMode] = useState(defaultAuthMode);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const userDropdownRef = useRef(null);

  const t = themeStyles.beige;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultAuthOpen) {
      setAuthModalOpen(true);
      setAuthModalMode(defaultAuthMode);
    }
  }, [defaultAuthOpen, defaultAuthMode]);

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
    if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
      navigate('/', { replace: true });
    }
  };

  const openAuth = (mode = 'login') => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
      setMobileMenuOpen(false);
    }
  };

  const handleUserLogout = () => {
    logout();
    setUserDropdownOpen(false);
    toast.success('Signed out successfully');
  };

  // Mockup dynamic chat messages state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'What is the main objective of this project?',
      time: '10:24 AM',
    },
    {
      id: 2,
      sender: 'ai',
      text: 'The main objective of this project is to develop a scalable and user-friendly platform that improves team collaboration and automates key workflows, reducing manual effort and increasing productivity.',
      time: '10:24 AM',
    },
    {
      id: 3,
      sender: 'user',
      text: 'What are the key deliverables mentioned in the document?',
      time: '10:27 AM',
    },
    {
      id: 4,
      sender: 'ai',
      text: 'The key deliverables include:\n1. Web application (MVP)\n2. Admin dashboard\n3. API integrations\n4. Documentation and user guides',
      time: '10:27 AM',
    },
  ]);

  const handleCTA = () => {
    openAuth('signup');
  };

  const handleMockupSend = () => {
    if (!inputVal.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    const query = inputVal;
    setInputVal('');

    // Simulate smart AI response in mockup
    setTimeout(() => {
      let aiText = `Based on Project_Proposal.pdf (Pages 2-4), "${query}" relates to the platform's core architecture and Gemini-powered vector RAG index.`;
      if (query.toLowerCase().includes('cost') || query.toLowerCase().includes('budget') || query.toLowerCase().includes('price')) {
        aiText = 'According to section 4.2 of the proposal, the estimated project budget is allocated across cloud infrastructure (35%), API resources (25%), and frontend/backend engineering (40%).';
      } else if (query.toLowerCase().includes('timeline') || query.toLowerCase().includes('deadline') || query.toLowerCase().includes('duration')) {
        aiText = 'The proposal outlines a 6-month development roadmap divided into 3 major milestones: Alpha MVP (Month 2), Beta Release (Month 4), and Full Production Rollout (Month 6).';
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleFileUploadMockup = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!user) {
        toast('Redirecting to upload your PDF...', { icon: '📄' });
        navigate('/login');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: t.bg,
      backgroundImage: t.bgImage,
      color: t.textPrimary,
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'visible',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUploadMockup}
        accept=".pdf"
        style={{ display: 'none' }}
      />

      {/* ─── Ambient Bottom Left Glow Curve ──────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        left: '-5%',
        width: '50%',
        height: '40%',
        background: 'radial-gradient(ellipse, rgba(217,119,6,0.12) 0%, rgba(245,242,233,0.3) 50%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR (COMPREHENSIVE PROFESSIONAL SAAS HEADER)
          ═══════════════════════════════════════════════════════════ */}
      <header className="landing-header" style={{
        position: 'relative',
        zIndex: 40,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BrainLogo size={32} />
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{ color: t.brandText }}>DocMind</span>
            <span style={{
              marginLeft: '4px',
              color: t.brandAccent,
            }}>AI</span>
          </div>
        </div>

        {/* Right Header Actions (Auth / Dashboard Buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              {/* Dashboard Shortcut Button */}
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 18px',
                  borderRadius: '11px',
                  background: t.btnPrimaryBg,
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  boxShadow: t.btnPrimaryShadow,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>

              {/* User Avatar Menu Anchor */}
              <div ref={userDropdownRef} style={{ position: 'relative' }}>
                <div
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 10px 5px 6px',
                    borderRadius: '999px',
                    background: t.btnSecondaryBg,
                    border: `1px solid ${t.btnSecondaryBorder}`,
                    cursor: 'pointer',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: 'white',
                  }}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hidden sm:inline">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={13} color={t.textSecondary} />
                </div>

                {/* User Floating Profile Menu */}
                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: '0',
                    width: '230px',
                    borderRadius: '16px',
                    background: t.menuBg,
                    border: `1px solid ${t.cardBorder}`,
                    padding: '8px',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 50,
                  }}>
                    <div style={{ padding: '8px 12px 10px', borderBottom: `1px solid ${t.cardBorder}` }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: t.textPrimary }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                    </div>

                    <div style={{ padding: '6px 0' }}>
                      <div
                        onClick={() => { setUserDropdownOpen(false); navigate('/dashboard'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: t.textPrimary, cursor: 'pointer', transition: 'background .15s' }}
                      >
                        <LayoutDashboard size={14} color="#3b82f6" />
                        My Documents
                      </div>
                      <div
                        onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: t.textPrimary, cursor: 'pointer', transition: 'background .15s' }}
                      >
                        <Settings size={14} color="#38bdf8" />
                        Account Settings
                      </div>
                    </div>

                    <div style={{ borderTop: `1px solid ${t.cardBorder}`, paddingTop: '4px' }}>
                      <div
                        onClick={handleUserLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: '#f87171', cursor: 'pointer', transition: 'background .15s' }}
                      >
                        <LogOut size={14} />
                        Sign Out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Secondary Sign In Button */}
              <button
                onClick={() => openAuth('login')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: t.btnSecondaryBg,
                  border: `1px solid ${t.btnSecondaryBorder}`,
                  color: t.btnSecondaryText,
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
              >
                Sign In
              </button>

              {/* Primary Get Started Button */}
              <button
                onClick={() => openAuth('signup')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: t.btnPrimaryBg,
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  boxShadow: t.btnPrimaryShadow,
                }}
              >
                Get Started
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: t.btnSecondaryBg,
              border: `1px solid ${t.btnSecondaryBorder}`,
              color: t.textPrimary,
              cursor: 'pointer',
              marginLeft: '4px',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '24px',
            right: '24px',
            borderRadius: '18px',
            background: t.menuBg,
            border: `1px solid ${t.cardBorder}`,
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            zIndex: 50,
          }}>
            <div
              onClick={() => { setMobileMenuOpen(false); scrollToSection('features'); }}
              style={{ fontSize: '15px', fontWeight: 600, color: t.textPrimary, cursor: 'pointer', padding: '8px 0' }}
            >
              Features
            </div>
            <div
              onClick={() => { setMobileMenuOpen(false); scrollToSection('security'); }}
              style={{ fontSize: '15px', fontWeight: 600, color: t.textPrimary, cursor: 'pointer', padding: '8px 0' }}
            >
              Security
            </div>
            <div
              onClick={() => { setMobileMenuOpen(false); scrollToSection('pricing'); }}
              style={{ fontSize: '15px', fontWeight: 600, color: t.textPrimary, cursor: 'pointer', padding: '8px 0' }}
            >
              Pricing
            </div>

            <div style={{ borderTop: `1px solid ${t.cardBorder}`, paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: t.btnPrimaryBg,
                    border: 'none',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openAuth('login')}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      background: t.btnSecondaryBg,
                      border: `1px solid ${t.btnSecondaryBorder}`,
                      color: t.textPrimary,
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      background: t.btnPrimaryBg,
                      border: 'none',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO MAIN (EXACT IMAGE REPLICA)
          ═══════════════════════════════════════════════════════════ */}
      <main className="landing-main-container" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px 48px 80px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 1fr) minmax(540px, 1.25fr)',
          gap: '48px',
          alignItems: 'center',
        }} className="landing-hero-grid">

          {/* ─── LEFT COLUMN: Headlines & CTAs ───────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              width: 'fit-content',
              padding: '5px 12px',
              borderRadius: '999px',
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              color: t.pillText,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              <FileText size={12} color={t.pillText} /> Document Intelligence Platform
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 4vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-1.5px',
              margin: '0 0 20px 0',
            }}>
              <span style={{ color: t.textPrimary, display: 'block' }}>Instant insights from</span>
              <span style={{
                display: 'inline-block',
                background: t.headingGrad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                your PDF documents.
              </span>
            </h1>

            {/* Subheading */}
            <p style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: t.textSecondary,
              maxWidth: '480px',
              margin: '0 0 32px 0',
              fontWeight: 400,
            }}>
              Upload a PDF, ask questions, and get accurate answers grounded directly in your document with exact page citations.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '54px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handleCTA}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '13px',
                  background: t.btnPrimaryBg,
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: t.btnPrimaryShadow,
                  transition: 'all .25s ease',
                }}
              >
                Get Started Free <ArrowRight size={17} />
              </button>

              <button
                onClick={() => setDemoModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 24px',
                  borderRadius: '13px',
                  background: t.btnSecondaryBg,
                  border: `1px solid ${t.btnSecondaryBorder}`,
                  color: t.btnSecondaryText,
                  fontSize: '14.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Play size={10} fill={t.btnSecondaryText} style={{ marginLeft: '1px' }} />
                </div>
                See how it works
              </button>
            </div>

            {/* 3 Value Props */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '18px',
              paddingTop: '20px',
            }} className="landing-value-props">
              {/* Feature 1 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Zap size={16} color={t.brandAccent} />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: t.textPrimary }}>Upload PDFs</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary, lineHeight: 1.45 }}>
                  Support for multiple file types and sizes
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MessageSquare size={16} color={t.brandAccent} />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: t.textPrimary }}>Ask Anything</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary, lineHeight: 1.45 }}>
                  Get accurate answers from your documents
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Shield size={16} color={t.brandAccent} />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: t.textPrimary }}>Your Data Stays Private</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary, lineHeight: 1.45 }}>
                  Secure & encrypted at every step
                </p>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: Exact Interactive Mockup Card ──────── */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            padding: '1px',
            background: t.mockupOuter,
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              borderRadius: '23px',
              backgroundColor: t.mockupOuterBg,
              border: `1px solid ${t.cardBorder}`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>

              {/* Mockup Top Brand Header */}
              <div style={{
                padding: '14px 20px',
                borderBottom: `1px solid ${t.cardBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: t.mockupHeaderBg,
              }}>
                <BrainLogo size={22} />
                <span style={{ fontSize: '14px', fontWeight: 800, color: t.brandText }}>DocMind</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: t.brandAccent, marginLeft: '-6px' }}>AI</span>
              </div>

              {/* Mockup 3-Pane Body */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '110px 220px 1fr',
                minHeight: '490px',
                backgroundColor: t.mockupGridBg,
              }} className="mockup-grid">

                {/* 1. Left Mini Sidebar */}
                <div style={{
                  padding: '16px 10px',
                  borderRight: `1px solid ${t.cardBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  backgroundColor: t.mockupSidebarBg,
                }}>
                  {[
                    { name: 'Chat', icon: MessageSquare },
                    { name: 'Documents', icon: FileText },
                    { name: 'History', icon: Clock },
                    { name: 'Settings', icon: Settings },
                  ].map(({ name, icon: Icon }) => {
                    const active = activeTab === name;
                    return (
                      <div
                        key={name}
                        onClick={() => {
                          setActiveTab(name);
                          if (name === 'Documents' || name === 'History' || name === 'Settings') {
                            handleCTA();
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: active ? 700 : 500,
                          color: active ? t.textPrimary : t.textSecondary,
                          background: active ? t.pillBg : 'transparent',
                          cursor: 'pointer',
                          transition: 'all .15s ease',
                        }}
                      >
                        <Icon size={13} color={active ? t.brandAccent : 'currentColor'} />
                        {name}
                      </div>
                    );
                  })}
                </div>

                {/* 2. Middle Document Panel */}
                <div style={{
                  padding: '14px 12px',
                  borderRight: `1px solid ${t.cardBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: t.mockupDocBg,
                }}>
                  {/* Top Selected File Pill */}
                  <div
                    onClick={handleCTA}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      background: t.cardBg,
                      border: `1px solid ${t.cardBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FileText size={14} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Project_Proposal.pdf
                      </div>
                      <div style={{ fontSize: '9px', color: t.textSecondary }}>24 pages • 2.4 MB</div>
                    </div>
                    <MoreVertical size={13} color={t.textSecondary} />
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `1.5px dashed ${t.cardBorder}`,
                      borderRadius: '12px',
                      padding: '16px 8px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: t.cardBg,
                      cursor: 'pointer',
                      transition: 'all .2s',
                    }}
                  >
                    <UploadCloud size={18} color={t.textSecondary} style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '10.5px', fontWeight: 600, color: t.textPrimary }}>Drag & drop PDF here</div>
                    <div style={{ fontSize: '9px', color: t.textSecondary, marginTop: '2px' }}>or click to upload</div>
                  </div>

                  {/* Uploaded Document Section */}
                  <div>
                    <div style={{ fontSize: '10px', color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '6px' }}>
                      Uploaded Document
                    </div>

                    <div style={{
                      padding: '7px 8px',
                      borderRadius: '8px',
                      background: t.cardBg,
                      border: `1px solid ${t.cardBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={10} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: t.textPrimary }}>Project_Proposal.pdf</div>
                          <div style={{ fontSize: '8px', color: t.textSecondary }}>24 pages</div>
                        </div>
                      </div>
                      <X size={11} color={t.textSecondary} />
                    </div>

                    {/* PDF Paper Mockup */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 10px',
                      color: '#1e293b',
                      fontSize: '8px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      position: 'relative',
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                        Project Proposal
                      </div>
                      <div style={{ fontSize: '7.5px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                        Executive Summary
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '3px', width: '100%' }} />
                          <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '3px', width: '90%' }} />
                          <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '3px', width: '95%' }} />
                          <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '3px', width: '80%' }} />
                        </div>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                          flexShrink: 0,
                        }} />
                      </div>
                      <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '3px', width: '95%' }} />
                      <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '3px', width: '70%' }} />

                      <div style={{
                        position: 'absolute',
                        right: '-6px',
                        top: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}>
                        {[1, 2, 3].map(p => (
                          <div key={p} style={{
                            width: '16px',
                            height: '20px',
                            background: p === 1 ? '#cbd5e1' : '#e2e8f0',
                            borderRadius: '2px',
                            border: '1px solid #94a3b8',
                            fontSize: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569',
                            fontWeight: 700,
                          }}>
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Right Chat Conversation Area */}
                <div style={{
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: t.mockupChatBg,
                }}>
                  {/* Chat Top Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '10px',
                    borderBottom: `1px solid ${t.cardBorder}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.pillBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={10} color={t.brandAccent} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: t.textPrimary }}>Chat with your document</span>
                    </div>
                    <div
                      onClick={handleCTA}
                      style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.btnSecondaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <User size={11} color={t.textSecondary} />
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div
                    className="no-scrollbar"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '12px 0',
                      maxHeight: '340px',
                      overflowY: 'auto',
                    }}
                  >
                    {messages.map((m) => (
                      m.sender === 'user' ? (
                        <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                          <div style={{
                            padding: '8px 12px',
                            borderRadius: '12px 12px 2px 12px',
                            background: t.mockupUserBubble,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 500,
                          }}>
                            {m.text}
                          </div>
                          <div style={{ fontSize: '8.5px', color: t.textSecondary, textAlign: 'right', marginTop: '3px' }}>{m.time}</div>
                        </div>
                      ) : (
                        <div key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '92%', display: 'flex', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.pillBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            <Bot size={11} color={t.brandAccent} />
                          </div>
                          <div>
                            <div style={{
                              padding: '9px 12px',
                              borderRadius: '2px 12px 12px 12px',
                              background: t.mockupAiBubble,
                              border: `1px solid ${t.cardBorder}`,
                              color: t.mockupAiBubbleText,
                              fontSize: '10.5px',
                              lineHeight: 1.45,
                              whiteSpace: 'pre-line',
                            }}>
                              {m.text}
                            </div>
                            <div style={{ fontSize: '8.5px', color: t.textSecondary, marginTop: '3px' }}>{m.time}</div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '10px',
                      background: t.btnSecondaryBg,
                      border: `1px solid ${t.btnSecondaryBorder}`,
                      padding: '4px 6px 4px 12px',
                      gap: '8px',
                    }}>
                      <input
                        type="text"
                        placeholder="Ask a question about your document..."
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleMockupSend();
                        }}
                        style={{
                          flex: 1,
                          background: 'none',
                          border: 'none',
                          outline: 'none',
                          color: t.textPrimary,
                          fontSize: '11px',
                          fontFamily: 'inherit',
                        }}
                      />
                      <button
                        onClick={handleMockupSend}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: t.brandAccent,
                          border: 'none',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>
                    <div style={{ fontSize: '8.5px', color: t.textSecondary, textAlign: 'center', marginTop: '6px' }}>
                      Answers are based only on your uploaded document.
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: FEATURES SHOWCASE
          ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="landing-section" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '80px 48px',
        borderTop: `1px solid ${t.sectionBorder}`,
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: t.pillBg,
            border: `1px solid ${t.pillBorder}`,
            color: t.pillText,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            <Sparkles size={12} color={t.pillText} /> Powerful AI Features
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.8px', color: t.textPrimary, margin: '0 0 12px' }}>
            Built for working with complex documents
          </h2>
          <p style={{ fontSize: '15px', color: t.textSecondary, lineHeight: 1.6, margin: 0 }}>
            Powered by retrieval-augmented generation to deliver verified responses with full source transparency.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {[
            {
              icon: UploadCloud,
              title: 'PDF Upload & Processing',
              desc: 'Extract text, partition pages, and chunk documents automatically upon upload.',
              color: t.brandAccent,
            },
            {
              icon: Cpu,
              title: 'Semantic Vector Search',
              desc: 'Indexes chunks with high-dimensional vector embeddings for precise context retrieval.',
              color: '#d97706',
            },
            {
              icon: MessageSquare,
              title: 'AI Document Chat',
              desc: 'Ask questions in natural language and receive contextually aware answers generated by Google Gemini.',
              color: '#b45309',
            },
            {
              icon: FileText,
              title: 'Page & Source Citations',
              desc: 'Every AI response highlights exact page numbers and snippet excerpts used to form the answer.',
              color: '#78716c',
            },
            {
              icon: Mic,
              title: 'Voice Input & Text-to-Speech',
              desc: 'Speak questions aloud via speech recognition and listen to generated AI responses.',
              color: '#d97706',
            },
            {
              icon: Layers,
              title: 'Multi-Document Workspace',
              desc: 'Organize, search, filter, and manage multiple PDFs in a clean dashboard interface.',
              color: '#b45309',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              style={{
                padding: '24px',
                borderRadius: '16px',
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all .2s ease',
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Icon size={18} color="#b45309" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.textPrimary, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontSize: '13.5px', color: t.textSecondary, lineHeight: 1.55, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: SECURITY
          ═══════════════════════════════════════════════════════════ */}
      <section id="security" className="landing-section" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '60px 48px 80px',
      }}>
        <div style={{
          padding: '40px',
          borderRadius: '24px',
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.brandAccent, fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              <Shield size={16} color={t.brandAccent} /> Privacy-First Architecture
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: t.textPrimary, margin: '0 0 14px' }}>
              Your documents stay private, encrypted & secure
            </h2>
            <p style={{ fontSize: '14.5px', color: t.textSecondary, lineHeight: 1.6, margin: '0 0 24px' }}>
              We never train public AI models on your private documents. All embeddings and chats belong solely to your user account.
            </p>
            <button
              onClick={handleCTA}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: t.btnPrimaryBg,
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: t.btnPrimaryShadow,
              }}
            >
              Start Chatting Securely →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              'Zero data-leakage between accounts',
              'Google Gemini 1.5 Flash API with SSL encryption',
              'Instant document deletion with all vector traces removed',
              'JWT authenticated session management',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: t.textPrimary }}>
                <CheckCircle2 size={18} color="#10b981" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: PRICING
          ═══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="landing-section" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '60px 48px 100px',
        borderTop: `1px solid ${t.sectionBorder}`,
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: t.textPrimary, margin: '0 0 10px' }}>
            Free During Public Beta
          </h2>
          <p style={{ fontSize: '15px', color: t.textSecondary, margin: 0 }}>
            DocMind AI is currently free while in public beta. No credit card required.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          maxWidth: '820px',
          margin: '0 auto',
        }}>
          {/* Free Tier */}
          <div style={{
            padding: '36px',
            borderRadius: '20px',
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>Free Plan</div>
              <div style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '20px' }}>Perfect for students & individuals</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: t.textPrimary, marginBottom: '24px' }}>$0 <span style={{ fontSize: '14px', fontWeight: 500, color: t.textSecondary }}>/ forever</span></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {['Unlimited document chats', '10MB PDF upload limit', 'Google Gemini 1.5 Flash responses', 'Voice input & Text-to-Speech', 'Exact page citations'].map(itemText => (
                  <div key={itemText} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: t.textPrimary }}>
                    <Check size={16} color={t.brandAccent} /> {itemText}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCTA}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: t.btnSecondaryBg,
                border: `1px solid ${t.btnSecondaryBorder}`,
                color: t.btnSecondaryText,
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div style={{
            padding: '36px',
            borderRadius: '20px',
            background: t.cardBg,
            border: `1.5px solid ${t.pillBorder}`,
            boxShadow: '0 12px 36px rgba(217,119,6,0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: t.brandAccent,
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}>
              Beta Special
            </div>

            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>Pro AI</div>
              <div style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '20px' }}>For researchers & power users</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: t.textPrimary, marginBottom: '24px' }}>Free <span style={{ fontSize: '14px', fontWeight: 500, color: t.textSecondary }}>during Public Beta</span></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {['All Free Plan features', 'Highest priority Gemini inference', 'Unlimited PDF uploads', 'Full Chat History export', 'Multi-file parallel index'].map(itemText => (
                  <div key={itemText} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: t.textPrimary }}>
                    <Check size={16} color={t.brandAccent} /> {itemText}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCTA}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: t.btnPrimaryBg,
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: t.btnPrimaryShadow,
              }}
            >
              Unlock Pro Access →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${t.sectionBorder}`,
        padding: '40px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: t.footerText,
        fontSize: '13px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainLogo size={20} />
          <span style={{ color: t.brandText, fontWeight: 700 }}>DocMind AI</span>
          <span>© 2026. Built with Google Gemini & RAG.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span onClick={() => scrollToSection('features')} style={{ cursor: 'pointer' }}>Features</span>
          <span onClick={() => scrollToSection('security')} style={{ cursor: 'pointer' }}>Security</span>
          <span onClick={() => scrollToSection('pricing')} style={{ cursor: 'pointer' }}>Pricing</span>
          <span onClick={handleCTA} style={{ color: t.brandAccent, fontWeight: 600, cursor: 'pointer' }}>Launch App →</span>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════
          DEMO MODAL (FOR "SEE HOW IT WORKS")
          ═══════════════════════════════════════════════════════════ */}
      {demoModalOpen && (
        <div
          onClick={() => setDemoModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(28,25,23,0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              borderRadius: '24px',
              background: '#fbf9f4',
              border: '1px solid #e7e0d3',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setDemoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f4f0e6',
                border: '1px solid #e7e0d3',
                color: '#1c1917',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <BrainLogo size={28} />
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1c1917' }}>How DocMind AI Works</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: '24px 0' }}>
              {[
                { step: '1', title: 'Upload your PDF', desc: 'Drag & drop any document, contract, research paper, or textbook.' },
                { step: '2', title: 'Vector Embeddings Index', desc: 'DocMind extracts text and creates high-dimensional vector representations with Google Gemini.' },
                { step: '3', title: 'Context-Aware AI Answers', desc: 'Ask anything via text or voice. DocMind retrieves relevant paragraphs with exact page citations.' },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '12px',
                    flexShrink: 0,
                  }}>
                    {step}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>{title}</div>
                    <div style={{ fontSize: '12.5px', color: '#57534e', marginTop: '2px' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setDemoModalOpen(false);
                openAuth('signup');
              }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                border: 'none',
                color: 'white',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(217,119,6,0.3)',
              }}
            >
              Try It Now For Free →
            </button>
          </div>
        </div>
      )}

      {/* ─── Auth Popup Modal ─── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialMode={authModalMode}
      />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1080px) {
          .landing-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 768px) {
          .landing-nav-links {
            display: none !important;
          }
          .landing-value-props {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .mockup-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
