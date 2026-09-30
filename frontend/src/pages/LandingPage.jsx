import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Play, Zap, MessageSquare, Shield,
  FileText, UploadCloud, ChevronDown, Check, Clock, Settings,
  X, Send, Bot, User, MoreVertical, Lock, Cpu, Volume2, Mic,
  Layers, CheckCircle2, Star, Github, Globe, CornerDownLeft,
  LayoutDashboard, LogOut, Menu, HelpCircle, FolderOpen, ExternalLink
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import AuthModal from '../components/AuthModal';

/* ─── Neural Brain Logo SVG ─────────────────────────────── */
export function BrainLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path
        d="M16 4C11.5817 4 8 7.58172 8 12C8 13.3103 8.31494 14.5471 8.87326 15.6387C6.01026 16.9248 4 19.7428 4 23.0001C4 27.4184 7.58172 31.0001 12 31.0001C13.0645 31.0001 14.0792 30.7918 15.0062 30.4137C15.3262 30.5843 15.6888 30.6801 16.0714 30.6801C16.454 30.6801 16.8166 30.5843 17.1366 30.4137C18.0636 30.7918 19.0783 31.0001 20.1428 31.0001C24.5611 31.0001 28.1428 27.4184 28.1428 23.0001C28.1428 19.7428 26.1325 16.9248 23.2695 15.6387C23.8278 14.5471 24.1428 13.3103 24.1428 12C24.1428 7.58172 20.5611 4 16.1428 4H16Z"
        fill="url(#brain_glow_grad)"
        fillOpacity="0.25"
      />
      <path
        d="M12 7C9.23858 7 7 9.23858 7 12C7 13.078 7.34149 14.0762 7.92212 14.8931C6.15582 15.9329 5 17.8488 5 20.0001C5 23.3138 7.68629 26.0001 11 26.0001C11.6934 26.0001 12.3551 25.8824 12.9697 25.6664M20 7C22.7614 7 25 9.23858 25 12C25 13.078 24.6585 14.0762 24.0779 14.8931C25.8442 15.9329 27 17.8488 27 20.0001C27 23.3138 24.3137 26.0001 21 26.0001C20.3066 26.0001 19.6449 25.8824 19.0303 25.6664"
        stroke="url(#brain_stroke_grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 5V27M12 11H14.5C15.3284 11 16 11.6716 16 12.5C16 13.3284 15.3284 14 14.5 14H12M20 11H17.5C16.6716 11 16 11.6716 16 12.5C16 13.3284 16.6716 14 17.5 14H20M11 19H13.5C14.8807 19 16 17.8807 16 16.5C16 15.1193 14.8807 14 13.5 14M21 19H18.5C17.1193 19 16 17.8807 16 16.5C16 15.1193 17.1193 14 18.5 14M12.5 23H14C15.1046 23 16 22.1046 16 21M19.5 23H18C16.8954 23 16 22.1046 16 21"
        stroke="url(#brain_stroke_grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="brain_stroke_grad" x1="5" y1="5" x2="27" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="brain_glow_grad" x1="4" y1="4" x2="28" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
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
      backgroundColor: '#07090e',
      backgroundImage: `
        radial-gradient(ellipse 60% 40% at 20% -10%, rgba(99,102,241,0.15), transparent 70%),
        radial-gradient(ellipse 50% 35% at 85% 30%, rgba(56,189,248,0.08), transparent 60%),
        radial-gradient(ellipse 60% 50% at 5% 95%, rgba(67,56,202,0.22), transparent 70%),
        linear-gradient(180deg, #07090e 0%, #080b12 50%, #06080d 100%)
      `,
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'visible',
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
        bottom: '-10%',
        left: '-10%',
        width: '55%',
        height: '45%',
        background: 'radial-gradient(ellipse, rgba(79,70,229,0.25) 0%, rgba(30,27,75,0.4) 45%, transparent 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR (COMPREHENSIVE PROFESSIONAL SAAS HEADER)
          ═══════════════════════════════════════════════════════════ */}
      <header style={{
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
            <span style={{ color: '#ffffff' }}>DocMind</span>
            <span style={{
              marginLeft: '4px',
              background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AI</span>
          </div>
        </div>

        {/* Right Auth Action (Dual Sign In + Get Started or User Menu) */}
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
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
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
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: 'white',
                  }}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'white', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hidden sm:inline">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={13} color="rgba(255,255,255,0.6)" />
                </div>

                {/* User Floating Profile Menu */}
                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: '0',
                    width: '230px',
                    borderRadius: '16px',
                    background: '#0d111a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 50,
                  }}>
                    <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                    </div>

                    <div style={{ padding: '6px 0' }}>
                      <div
                        onClick={() => { setUserDropdownOpen(false); navigate('/dashboard'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', transition: 'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LayoutDashboard size={14} color="#818cf8" />
                        My Documents
                      </div>
                      <div
                        onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', transition: 'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Settings size={14} color="#38bdf8" />
                        Account Settings
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '4px' }}>
                      <div
                        onClick={handleUserLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: '#f87171', cursor: 'pointer', transition: 'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
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
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)';
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
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
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
            background: '#0c0f18',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            zIndex: 50,
          }}>
            <div
              onClick={() => { setMobileMenuOpen(false); scrollToSection('features'); }}
              style={{ fontSize: '15px', fontWeight: 600, color: 'white', cursor: 'pointer', padding: '8px 0' }}
            >
              Features
            </div>
            <div
              onClick={() => { setMobileMenuOpen(false); scrollToSection('security'); }}
              style={{ fontSize: '15px', fontWeight: 600, color: 'white', cursor: 'pointer', padding: '8px 0' }}
            >
              Security
            </div>
            <div
              onClick={() => { setMobileMenuOpen(false); scrollToSection('pricing'); }}
              style={{ fontSize: '15px', fontWeight: 600, color: 'white', cursor: 'pointer', padding: '8px 0' }}
            >
              Pricing
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
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
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'white',
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
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
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
      <main style={{
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
              width: 'fit-content',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a5b4fc',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '28px',
              boxShadow: '0 0 16px rgba(99,102,241,0.15)',
            }}>
              AI PDF CHAT
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(42px, 4.8vw, 64px)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-2px',
              margin: '0 0 24px 0',
            }}>
              <span style={{ color: '#ffffff', display: 'block' }}>Chat with</span>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 35%, #38bdf8 85%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                your documents.
              </span>
            </h1>

            {/* Subheading */}
            <p style={{
              fontSize: '16.5px',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.62)',
              maxWidth: '480px',
              margin: '0 0 36px 0',
              fontWeight: 400,
            }}>
              Upload your PDFs and ask questions. DocMind AI reads your documents and gives you accurate, context-aware <span style={{ color: '#e2e8f0', fontWeight: 600 }}>answers</span> — instantly.
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
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(79,70,229,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all .25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(79,70,229,0.6), inset 0 1px 0 rgba(255,255,255,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.45), inset 0 1px 0 rgba(255,255,255,0.2)';
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
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Play size={10} fill="white" style={{ marginLeft: '1px' }} />
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
                  <Zap size={16} color="#818cf8" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f1f5f9' }}>Upload PDFs</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.45 }}>
                  Support for multiple file types and sizes
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MessageSquare size={16} color="#818cf8" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f1f5f9' }}>Ask Anything</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.45 }}>
                  Get accurate answers from your documents
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Shield size={16} color="#818cf8" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f1f5f9' }}>Your Data Stays Private</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.45 }}>
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
            background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(56,189,248,0.2), rgba(255,255,255,0.06))',
            boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 50px rgba(99,102,241,0.15)',
          }}>
            <div style={{
              borderRadius: '23px',
              backgroundColor: '#0a0d16',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>

              {/* Mockup Top Brand Header */}
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <BrainLogo size={22} />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>DocMind</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#818cf8', marginLeft: '-6px' }}>AI</span>
              </div>

              {/* Mockup 3-Pane Body */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '110px 220px 1fr',
                minHeight: '490px',
                backgroundColor: '#080a10',
              }} className="mockup-grid">

                {/* 1. Left Mini Sidebar */}
                <div style={{
                  padding: '16px 10px',
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
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
                          color: active ? '#ffffff' : 'rgba(255,255,255,0.4)',
                          background: active ? 'rgba(99,102,241,0.22)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all .15s ease',
                        }}
                      >
                        <Icon size={13} color={active ? '#818cf8' : 'currentColor'} />
                        {name}
                      </div>
                    );
                  })}
                </div>

                {/* 2. Middle Document Panel */}
                <div style={{
                  padding: '14px 12px',
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: '#07090e',
                }}>
                  {/* Top Selected File Pill */}
                  <div
                    onClick={handleCTA}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
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
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Project_Proposal.pdf
                      </div>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>24 pages • 2.4 MB</div>
                    </div>
                    <MoreVertical size={13} color="rgba(255,255,255,0.3)" />
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '1.5px dashed rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      padding: '16px 8px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      transition: 'all .2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                      e.currentTarget.style.background = 'rgba(99,102,241,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                    }}
                  >
                    <UploadCloud size={18} color="rgba(255,255,255,0.5)" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Drag & drop PDF here</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>or click to upload</div>
                  </div>

                  {/* Uploaded Document Section */}
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '6px' }}>
                      Uploaded Document
                    </div>

                    <div style={{
                      padding: '7px 8px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
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
                          <div style={{ fontSize: '10px', fontWeight: 600, color: 'white' }}>Project_Proposal.pdf</div>
                          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)' }}>24 pages</div>
                        </div>
                      </div>
                      <X size={11} color="rgba(255,255,255,0.4)" />
                    </div>

                    {/* PDF Paper Mockup */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 10px',
                      color: '#1e293b',
                      fontSize: '8px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
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
                        {/* Little Building Thumbnail */}
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

                      {/* Right Mini Page Tabs inside PDF */}
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
                  backgroundColor: '#090c14',
                }}>
                  {/* Chat Top Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '10px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={10} color="#818cf8" />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>Chat with your document</span>
                    </div>
                    <div
                      onClick={handleCTA}
                      style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <User size={11} color="rgba(255,255,255,0.7)" />
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
                            background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: 500,
                          }}>
                            {m.text}
                          </div>
                          <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.3)', textAlign: 'right', marginTop: '3px' }}>{m.time}</div>
                        </div>
                      ) : (
                        <div key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '92%', display: 'flex', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            <Bot size={11} color="#818cf8" />
                          </div>
                          <div>
                            <div style={{
                              padding: '9px 12px',
                              borderRadius: '2px 12px 12px 12px',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              color: '#e2e8f0',
                              fontSize: '10.5px',
                              lineHeight: 1.45,
                              whiteSpace: 'pre-line',
                            }}>
                              {m.text}
                            </div>
                            <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>{m.time}</div>
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
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
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
                          color: 'white',
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
                          background: '#4f46e5',
                          border: 'none',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>
                    <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '6px' }}>
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
      <section id="features" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '80px 48px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#a5b4fc',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            <Sparkles size={12} /> Powerful AI Features
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-1px', color: 'white', margin: '0 0 16px' }}>
            Everything you need to talk to your documents
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
            Powered by Google Gemini 1.5 Flash and high-dimensional semantic text embeddings.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {[
            {
              icon: Cpu,
              title: 'Gemini Vector RAG',
              desc: 'Chunks your PDFs into vector representations with cosine similarity search for exact match retrieval.',
              color: '#818cf8',
            },
            {
              icon: Mic,
              title: 'Voice Input & Audio TTS',
              desc: 'Speak naturally to your documents and listen to AI answers in audio mode with text-to-speech.',
              color: '#38bdf8',
            },
            {
              icon: FileText,
              title: 'Page & Source Citations',
              desc: 'Every AI answer is verified with exact page numbers and matched chunk citations from your PDF.',
              color: '#c084fc',
            },
            {
              icon: Shield,
              title: '1-Click Google OAuth',
              desc: 'Sign in effortlessly using your Google account with encrypted JWT session management.',
              color: '#34d399',
            },
            {
              icon: Layers,
              title: 'Multi-Document Workspace',
              desc: 'Upload multiple PDFs, switch between research papers and contracts, and manage them cleanly.',
              color: '#f472b6',
            },
            {
              icon: Lock,
              title: 'Enterprise-Grade Security',
              desc: 'Your files and vector indices are isolated and protected with strict authentication & encryption.',
              color: '#fbbf24',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              style={{
                padding: '28px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all .25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = '';
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: `${color}15`,
                border: `1px solid ${color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: '0 0 10px' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: SECURITY
          ═══════════════════════════════════════════════════════════ */}
      <section id="security" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '60px 48px 80px',
      }}>
        <div style={{
          padding: '40px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.04) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              <Shield size={16} /> Privacy-First Architecture
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', margin: '0 0 14px' }}>
              Your documents stay private, encrypted & secure
            </h2>
            <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '0 0 24px' }}>
              We never train public AI models on your private documents. All embeddings and chats belong solely to your user account.
            </p>
            <button
              onClick={handleCTA}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
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
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                <CheckCircle2 size={18} color="#34d399" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: PRICING
          ═══════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '60px 48px 100px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', margin: '0 0 12px' }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Start chatting with your PDFs right away. No hidden fees.
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
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Free Plan</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Perfect for students & individuals</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: 'white', marginBottom: '24px' }}>$0 <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>/ forever</span></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {['Unlimited document chats', '10MB PDF upload limit', 'Google Gemini 1.5 Flash responses', 'Voice input & Text-to-Speech', 'Exact page citations'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'rgba(255,255,255,0.75)' }}>
                    <Check size={16} color="#818cf8" /> {t}
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
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
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
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1.5px solid rgba(99,102,241,0.45)',
            boxShadow: '0 12px 36px rgba(99,102,241,0.2)',
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
              background: '#4f46e5',
              color: 'white',
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}>
              Beta Special
            </div>

            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Pro AI</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>For researchers & power users</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: 'white', marginBottom: '24px' }}>Free <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>during Public Beta</span></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {['All Free Plan features', 'Highest priority Gemini inference', 'Unlimited PDF uploads', 'Full Chat History export', 'Multi-file parallel index'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'rgba(255,255,255,0.9)' }}>
                    <Check size={16} color="#38bdf8" /> {t}
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
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
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
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '13px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainLogo size={20} />
          <span style={{ color: 'white', fontWeight: 700 }}>DocMind AI</span>
          <span>© 2026. Built with Google Gemini & RAG.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span onClick={() => scrollToSection('features')} style={{ cursor: 'pointer' }}>Features</span>
          <span onClick={() => scrollToSection('security')} style={{ cursor: 'pointer' }}>Security</span>
          <span onClick={() => scrollToSection('pricing')} style={{ cursor: 'pointer' }}>Pricing</span>
          <span onClick={handleCTA} style={{ color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}>Launch App →</span>
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
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
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
              background: '#0c0f18',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '32px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setDemoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'white',
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
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>How DocMind AI Works</div>
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
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
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
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{title}</div>
                    <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{desc}</div>
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
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: 'white',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer',
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
