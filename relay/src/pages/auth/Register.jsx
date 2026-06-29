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
  name: z.string()
    .min(2, 'Name must contain atleast 2 characters'),

  email: z.string()
    .email('Enter valid email address'),

  password: z.string()
    .min(8, 'Password must contain atleast 8 characters'),

  confirmPassword: z.string(),
}).refine(
  data => data.password === data.confirmPassword,
  { message: 'Passwords not match', path: ['confirmPassword'] }
);

// Password strength calculate karo
function getStrength(password) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-danger', w: '25%' };
  if (score === 2) return { label: 'Fair', color: 'bg-warning', w: '50%' };
  if (score === 3) return { label: 'Good', color: 'bg-olive-500', w: '75%' };
  return { label: 'Strong', color: 'bg-success', w: '100%' };
}

export default function Register() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdValue, setPwdValue] = useState('');

  const { register: registerUser, authError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  // Password field watch — strength ke liye
  const watchedPwd = watch('password', '');

  async function onSubmit(data) {
    clearError();
    await new Promise(r => setTimeout(r, 700));
    const success = registerUser(data);
    if (success) navigate('/dashboard');
  }

  const strength = getStrength(watchedPwd);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
          <div className="w-7 h-7 rounded-lg bg-olive-900 flex items-center justify-center
            group-hover:bg-olive-700 transition-colors">
            <GitBranch size={13} className="text-cream" fill="#F0EDE4" />
          </div>
          <span className="font-display font-bold text-olive-900 text-sm">Relay</span>
        </Link>

        <h1 className="font-display font-extrabold text-olive-900
          text-[2rem] leading-tight mb-1">
          Start free.
        </h1>
        <p className="text-sm text-muted mb-8">
          Create your account. No credit card needed.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <Input
            label="Full name"
            type="text"
            placeholder="Enter name"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password + strength */}
          <div className="flex flex-col gap-1.5">
            <Input
              label="Password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Min 8 characters"
              required
              error={errors.password?.message}
              helperText={!errors.password ? 'Min 8 chars, include numbers & symbols' : undefined}
              rightElement={
                <button type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="w-8 h-8 flex items-center justify-center rounded-full
                    text-subtle hover:text-olive-900 hover:bg-cream transition-all">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
              {...register('password')}
            />

            {/* Strength bar */}
            {watchedPwd && strength && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-1"
              >
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: strength.w }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-full ${strength.color}`}
                  />
                </div>
                <p className={`text-[10px] font-semibold mt-1
                  ${strength.label === 'Weak' ? 'text-danger' : ''}
                  ${strength.label === 'Fair' ? 'text-warning' : ''}
                  ${strength.label === 'Good' ? 'text-olive-500' : ''}
                  ${strength.label === 'Strong' ? 'text-success' : ''}
                `}>
                  {strength.label} password
                </p>
              </motion.div>
            )}
          </div>

          <Input
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat password"
            required
            error={errors.confirmPassword?.message}
            rightElement={
              <button type="button"
                onClick={() => setShowConfirm(p => !p)}
                className="w-8 h-8 flex items-center justify-center rounded-full
                  text-subtle hover:text-olive-900 hover:bg-cream transition-all">
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
            {...register('confirmPassword')}
          />

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input type="checkbox" required
              className="mt-0.5 w-3.5 h-3.5 accent-olive-700 flex-shrink-0" />
            <span className="text-xs text-muted leading-relaxed">
              I agree to the{' '}
              <span className="text-olive-700 font-semibold">Terms of Service</span>
              {' '}and{' '}
              <span className="text-olive-700 font-semibold">Privacy Policy</span>
            </span>
          </label>

          {/* Server error */}
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
              flex items-center justify-center gap-2 mt-1"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2
                  border-cream/30 border-t-cream animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-olive-700 font-bold hover:underline">
            Sign in →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}