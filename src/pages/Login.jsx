import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HandHeart, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email ? email.trim() : '';
    try {
      const res = await login(cleanEmail, password);
      const user = res.data;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ORGANIZATION') {
        navigate('/organization/dashboard');
      } else {
        navigate('/volunteer/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <HandHeart className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">
            Volunteer<span className="text-primary">Match</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-200">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-slate-800 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-slate-800 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Viva Demo */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Instant Demo Accounts (Viva Testing):
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoLogin('ananya@example.com')}
                className="p-2 text-left bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 rounded-xl text-primary font-semibold transition-colors"
              >
                <div>Volunteer: Ananya</div>
                <div className="text-[10px] text-slate-500 font-normal">ananya@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('contact@abcfoundation.org')}
                className="p-2 text-left bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-xl text-emerald-800 font-semibold transition-colors"
              >
                <div>Org: ABC Foundation</div>
                <div className="text-[10px] text-slate-500 font-normal">contact@abcfoundation.org</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Default password for all demo accounts: <strong className="text-slate-600 font-mono">password123</strong>
            </p>
          </div>

          <div className="mt-5 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-primary-hover">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
