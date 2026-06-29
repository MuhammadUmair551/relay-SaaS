import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, GitBranch, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import Input from '../../components/ui/Input';

const schema = z.object({
  email:    z.string().email('Enter valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [showPwd, setShowPwd]     = useState(false);
  const { login, authError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    clearError();

    await new Promise(r => setTimeout(r, 600));

    const success = login(data);
    if (success) navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-cream flex">

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="w-7 h-7 rounded-lg bg-olive-900 flex items-center justify-center
              group-hover:bg-olive-700 transition-colors">
              <GitBranch size={13} className="text-cream" fill="#F0EDE4" />
            </div>
            <span className="font-display font-bold text-olive-900 text-sm tracking-tight">
              Relay
            </span>
          </Link>

          <h1 className="font-display font-extrabold text-olive-900
            text-[2rem] leading-tight mb-1">
            Welcome back.
          </h1>
          <p className="text-sm text-muted mb-10">
            Sign in to manage your projects.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Enter a password"
              required
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="w-8 h-8 flex items-center justify-center
                    rounded-full text-subtle hover:text-olive-900
                    hover:bg-cream transition-all"
                >
                  {showPwd
                    ? <EyeOff size={14} />
                    : <Eye size={14} />
                  }
                </button>
              }
              {...register('password')}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  className="w-3.5 h-3.5 accent-olive-700 rounded cursor-pointer" />
                <span className="text-xs text-muted">Remember me</span>
              </label>
              <button type="button"
                className="text-xs text-olive-700 font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-2xl bg-danger/8
                  border border-danger/20 text-danger text-xs font-medium"
              >
                {authError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-olive-900 text-cream
                text-xs font-bold uppercase tracking-nav
                hover:bg-olive-700 active:scale-[0.99]
                transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2
                    border-cream/30 border-t-cream animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-subtle">or try demo</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={() => {
              login({ email: 'demo@relay.so', password: 'demo123' });
              navigate('/dashboard');
            }}
            className="w-full py-3 rounded-full border border-border bg-surface
              text-xs font-semibold text-olive-900
              hover:border-olive-300 hover:bg-cream
              transition-all duration-150"
          >
            Continue with Demo Account
          </button>

          <p className="text-center text-xs text-muted mt-8">
            No account?{' '}
            <Link to="/register"
              className="text-olive-700 font-bold hover:underline">
              Create one free 
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-panel items-center
        justify-center p-12 relative overflow-hidden">

        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}
              className="absolute w-px bg-white/50"
              style={{
                left:   `${(i + 1) * 12.5}%`,
                top:    0,
                bottom: 0,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-xs">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/8 border border-white/10 rounded-2xl p-5 mb-6 text-left"
          >
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-nav mb-3">
              Client View - Website Redesign
            </p>
            <div className="space-y-2.5 mb-4">
              {['Discovery', 'Wireframes', 'Design mockups'].map(m => (
                <div key={m} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-olive-500
                    flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white"
                        strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-xs text-white/70">{m}</span>
                </div>
              ))}
              {['Development', 'Final delivery'].map(m => (
                <div key={m} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-white/10
                    border border-white/20 flex-shrink-0" />
                  <span className="text-xs text-white/30">{m}</span>
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-olive-500 rounded-full" style={{ width: '68%' }} />
            </div>
            <p className="text-[10px] text-white/30 mt-1.5 text-right">68% complete</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display font-bold text-white text-xl leading-snug mb-2"
          >
            Your clients deserve clarity.
          </motion.p>
          <p className="text-xs text-white/40 leading-relaxed">
            One link. Full project visibility. No client accounts needed.
          </p>
        </div>
      </div>

    </div>
  );
}