import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Calendar, LogOut, Shield, Sparkles, Edit3, Clock,
  KeyRound, Check, X, Loader2, Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [confirmLogout, setConfirmLogout] = useState(false);

  // Edit Name state
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);

  // Change Password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully.');
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim().length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }
    try {
      setSavingName(true);
      const { data } = await authAPI.updateProfile({ name: newName.trim() });
      if (data.success) {
        updateUser(data.user);
        setEditingName(false);
        toast.success('Name updated successfully! 🎉');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update name.');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');

    if (newPwd.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match.');
      return;
    }

    try {
      setSavingPwd(true);
      const { data } = await authAPI.changePassword({
        currentPassword: currentPwd,
        newPassword: newPwd,
      });
      if (data.success) {
        toast.success('Password changed successfully! 🔒');
        setShowPasswordModal(false);
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      }
    } catch (err) {
      setPwdError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setSavingPwd(false);
    }
  };

  const infoRows = [
    { icon: User, label: 'Full Name', value: user?.name, color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
    { icon: Mail, label: 'Email Address', value: user?.email, color: '#d97706', bg: '#fff7ed', border: '#ffedd5' },
    { icon: Calendar, label: 'Member Since', value: formatDate(user?.createdAt), color: '#047857', bg: '#d1fae5', border: '#a7f3d0' },
    { icon: Shield, label: 'Account Type', value: 'Standard', color: '#c2410c', bg: '#ffedd5', border: '#fed7aa' },
  ];

  return (
    <div
      className="min-h-screen bg-[#fbf9f4] text-[#1c1917]"
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(217,119,6,0.06) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <Navbar />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1c1917]">Profile & Account</h1>
          <p className="text-stone-600 text-sm mt-1">Manage your account details and security.</p>
        </div>

        {/* ── Profile Hero Card ── */}
        <div
          className="relative rounded-3xl p-px overflow-hidden mb-5 animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, #fcd34d, #d97706, #b45309)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}
        >
          <div
            className="rounded-3xl p-6"
            style={{ background: '#fbf9f4', border: '1px solid #e7e0d3' }}
          >
            {/* Avatar + name row */}
            <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid #e7e0d3' }}>
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    boxShadow: '0 4px 16px rgba(217,119,6,0.3)',
                  }}
                >
                  <span className="text-3xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Online indicator */}
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ background: '#10b981', borderColor: '#ffffff', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {editingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-3 py-1.5 rounded-xl text-sm bg-white border border-[#e7e0d3] text-[#1c1917] focus:outline-none focus:border-amber-600"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={savingName}
                      className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center"
                    >
                      {savingName ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingName(false); setNewName(user?.name || ''); }}
                      className="w-8 h-8 rounded-lg bg-[#ede8dd] text-stone-600 flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#1c1917] leading-snug">{user?.name}</h2>
                    <button
                      onClick={() => { setEditingName(true); setNewName(user?.name || ''); }}
                      className="text-stone-500 hover:text-amber-700 transition-colors p-1"
                      title="Edit name"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
                <p className="text-stone-600 text-sm mt-0.5 truncate">{user?.email}</p>
                <div
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active Account
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-2">
              {infoRows.map(({ icon: Icon, label, value, color, bg, border }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                  style={{ background: '#ffffff', border: '1px solid #e7e0d3' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-[#1c1917] font-semibold mt-0.5 truncate">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Security / Password Card ── */}
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-in"
          style={{
            background: '#ffffff',
            border: '1px solid #e7e0d3',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Lock size={12} className="text-amber-600" /> Security
          </h3>

          {!showPasswordModal ? (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#1c1917] hover:text-[#000000] transition-all duration-200"
              style={{
                background: '#fbf9f4',
                border: '1px solid #e7e0d3',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: '#fef3c7', border: '1px solid #fde68a' }}
                >
                  <KeyRound size={14} className="text-amber-700" />
                </div>
                <span>Change Password</span>
              </div>
              <span className="text-xs text-amber-700 font-bold">Update →</span>
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
              {pwdError && (
                <div className="p-3 rounded-xl text-xs text-red-700 bg-red-50 border border-red-200">
                  {pwdError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white border border-[#e7e0d3] text-[#1c1917] focus:outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white border border-[#e7e0d3] text-[#1c1917] focus:outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white border border-[#e7e0d3] text-[#1c1917] focus:outline-none focus:border-amber-600"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingPwd}
                  className="btn-primary flex-1 py-2 text-xs"
                >
                  {savingPwd ? <><Loader2 size={13} className="animate-spin" /> Updating...</> : 'Save Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(false); setPwdError(''); }}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Account Actions Card ── */}
        <div
          className="rounded-2xl p-5 animate-fade-in"
          style={{
            background: '#ffffff',
            border: '1px solid #e7e0d3',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Clock size={11} /> Account Actions
          </h3>

          {!confirmLogout ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 hover:text-stone-900 transition-all duration-200"
              style={{
                background: '#fbf9f4',
                border: '1px solid #e7e0d3',
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
              >
                <LogOut size={14} className="text-red-700" />
              </div>
              Sign out of DocMind AI
            </button>
          ) : (
            <div
              className="p-4 rounded-xl animate-scale-in"
              style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <p className="text-sm text-red-900 font-semibold mb-3">Are you sure you want to sign out?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all bg-red-600 hover:bg-red-700"
                >
                  Yes, sign out
                </button>
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-stone-700 transition-all bg-white border border-[#e7e0d3]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Sparkles size={11} className="text-stone-400" />
          <p className="text-center text-xs text-stone-500 font-medium">
            DocMind AI · Powered by Gemini & MongoDB Atlas
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
