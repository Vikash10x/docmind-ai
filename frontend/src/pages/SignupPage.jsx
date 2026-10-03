import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Loader2, AlertCircle, CheckCircle, Zap, Shield, FileText, MessageSquare } from 'lucide-react';
import { authAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '', general: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email.';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setLoading(true);
      const { data } = await authAPI.signup({
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      login(data.user, data.token);
      toast.success('Account created! Welcome to DocMind AI 🎉');
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to create account.' });
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: FileText, text: 'Upload unlimited PDFs' },
    { icon: MessageSquare, text: 'AI-powered Q&A on your docs' },
    { icon: Zap, text: 'Instant, accurate answers' },
    { icon: Shield, text: 'Secure & private always' },
  ];

  const InputField = ({ id, label, name, type = 'text', placeholder, rightEl }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-stone-600">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          className="input-field"
          style={errors[name] ? { borderColor: '#fca5a5' } : {}}
        />
        {rightEl}
      </div>
      {errors[name] && (
        <p className="text-xs flex items-center gap-1 mt-1 text-red-600">
          <AlertCircle size={11} /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative bg-[#fbf9f4] text-[#1c1917]"
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(217,119,6,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(180,83,9,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex gap-8 items-start">
        {/* ── Left — Perk List (desktop) ── */}
        <div className="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0 pt-12">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  boxShadow: '0 4px 16px rgba(217,119,6,0.3)',
                }}
              >
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-[#1c1917]">DocMind<span style={{ color: '#b45309' }}>AI</span></span>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-[#1c1917] leading-snug mb-3">
              Start for free,<br />
              <span style={{ background: 'linear-gradient(135deg, #1c1917 0%, #b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                chat smarter.
              </span>
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Join thousands of users who already use DocMind AI to understand their documents faster.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#fef3c7', border: '1px solid #fde68a' }}
                >
                  <Icon size={14} className="text-amber-700" />
                </div>
                <span className="text-sm font-medium text-stone-700">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <CheckCircle size={13} className="text-emerald-600" />
            <span className="text-xs text-stone-500 font-medium">No credit card required</span>
          </div>
        </div>

        {/* ── Right — Form ── */}
        <div className="flex-1">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 4px 16px rgba(217,119,6,0.3)' }}
            >
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#1c1917]">DocMind<span style={{ color: '#b45309' }}>AI</span></span>
          </div>

          <div
            className="rounded-3xl p-7"
            style={{
              background: '#ffffff',
              border: '1px solid #e7e0d3',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            }}
          >
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-[#1c1917] mb-1.5">Create your account</h1>
              <p className="text-stone-600 text-sm">Start chatting with your documents today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div
                  className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm animate-slide-down"
                  style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b' }}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {errors.general}
                </div>
              )}

              <InputField id="signup-name" label="Full name" name="name" placeholder="Jane Doe" />
              <InputField id="signup-email" label="Email address" name="email" type="email" placeholder="jane@example.com" />

              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="block text-sm font-semibold text-stone-600">Password</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field pr-11"
                    style={errors.password ? { borderColor: '#fca5a5' } : {}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs flex items-center gap-1 text-red-600">
                    <AlertCircle size={11} /> {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="signup-confirm" className="block text-sm font-semibold text-stone-600">Confirm password</label>
                <input
                  id="signup-confirm"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  style={errors.confirmPassword ? { borderColor: '#fca5a5' } : {}}
                />
                {errors.confirmPassword && (
                  <p className="text-xs flex items-center gap-1 text-red-600">
                    <AlertCircle size={11} /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-2 rounded-xl text-base"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Creating account...</>
                  : 'Create Account'
                }
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-stone-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold transition-colors"
                style={{ color: '#b45309' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#d97706'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#b45309'; }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
