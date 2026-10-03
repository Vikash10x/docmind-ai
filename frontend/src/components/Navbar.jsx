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
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(244,240,230,0.95)',
        borderBottom: '1px solid #e7e0d3',
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
              className="text-[17px] font-extrabold leading-none tracking-tight text-[#1c1917]"
            >
              DocMind
            </span>
            <span
              className="text-[17px] font-extrabold leading-none tracking-tight ml-1"
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-stone-600 hover:text-stone-900 transition-all duration-200"
              style={{}}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                e.currentTarget.style.color = '#1c1917';
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
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#b45309',
            }}
          >
            <Zap size={11} className="text-amber-600" />
            Gemini Powered
          </div>

          {/* User chip */}
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
            style={{
              background: '#ffffff',
              border: '1px solid #e7e0d3',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                boxShadow: '0 2px 6px rgba(217,119,6,0.3)',
              }}
            >
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-[#1c1917] text-sm font-semibold">{user?.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-stone-500 hover:text-red-600 transition-all duration-200"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* ── Mobile Menu Button ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-stone-600 hover:text-stone-900 transition-colors"
          style={{ background: menuOpen ? 'rgba(0,0,0,0.06)' : '#ffffff', border: '1px solid #e7e0d3' }}
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 space-y-1 animate-slide-down bg-[#ffffff]"
          style={{ borderTop: '1px solid #e7e0d3' }}
        >
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:text-stone-900 transition-all duration-200"
              style={{}}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
            >
              <Icon size={15} className="text-stone-500" /> {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 w-full transition-all duration-200"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
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
