import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, Lock, ArrowRight, CheckCircle2, AlertCircle,
  Eye, EyeOff
} from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password);
      if (res.data.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setError(res.data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06060c',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Dynamic ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(236,72,153,0.15) 50%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
      }} />

      {/* Header Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          boxShadow: '0 0 20px rgba(124,58,237,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span>DocMind</span><span style={{ color: '#a78bfa' }}>AI</span>
          </div>
        </div>
      </div>

      {/* Card container */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '1.5px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg,#ec4899,#7c3aed,#06b6d4)',
        boxShadow: '0 0 50px rgba(124,58,237,0.25)',
      }}>
        <div style={{
          borderRadius: '23px',
          background: 'rgba(10,10,18,0.96)',
          backdropFilter: 'blur(30px)',
          padding: '36px 32px',
        }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#4ade80'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Password Reset!</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Your password has been changed successfully. Redirecting you to login...
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                }}
              >
                Sign In Now <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  color: '#c4b5fd'
                }}>
                  <Lock size={22} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>Set New Password</h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
                  Please enter your new strong password below.
                </p>
              </div>

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                  fontSize: '13px'
                }}>
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                  color: 'white',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                  marginTop: '6px',
                  transition: 'transform 0.2s',
                }}
              >
                {loading ? 'Updating Password...' : 'Reset Password'} <ArrowRight size={16} />
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '8px 0 0' }}>
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
                  Back to Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
