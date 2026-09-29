import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LayoutDashboard, User, LogOut, Menu, X, Zap } from 'lucide-react';
import useAuth from '../hooks/useAuth';

import { BrainLogo } from '../pages/LandingPage';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(7,9,14,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <BrainLogo size={28} />
          <div className="flex items-center">
            <span
              className="text-[17px] font-extrabold leading-none tracking-tight text-white"
            >
              DocMind
            </span>
            <span
              className="text-[17px] font-extrabold leading-none tracking-tight ml-1"
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-all duration-200"
              style={{}}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = '';
              }}
            >
              <Icon size={14} className="opacity-70" />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Right Side ── */}
        <div className="hidden md:flex items-center gap-2">
          {/* AI Badge */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              color: '#c4b5fd',
            }}
          >
            <Zap size={11} className="text-violet-400" />
            Gemini Powered
          </div>

          {/* User chip */}
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: '0 0 8px rgba(124,58,237,0.4)',
              }}
            >
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-zinc-300 text-sm font-medium">{user?.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 transition-all duration-200"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* ── Mobile Menu Button ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors"
          style={{ background: menuOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 space-y-1 animate-slide-down"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-zinc-300 hover:text-white transition-all duration-200"
              style={{}}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
            >
              <Icon size={15} className="text-zinc-500" /> {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 w-full transition-all duration-200"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
