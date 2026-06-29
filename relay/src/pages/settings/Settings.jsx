import { useState }      from 'react';
import { useForm }       from 'react-hook-form';
import { zodResolver }   from '@hookform/resolvers/zod';
import { z }             from 'zod';
import { motion }        from 'framer-motion';
import {
  User, Mail, Lock, Bell,
  Shield, Eye, EyeOff,
  Check, ArrowRight, GitBranch,
} from 'lucide-react';
import { useAuthStore }  from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { cn }            from '../../lib/utils';
import Input             from '../../components/ui/Input';

const profileSchema = z.object({
  name: z.string().min(2, 'Name min 2 characters chahiye'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter current password'),
  newPassword:     z.string().min(8, 'Min 8 characters required'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords not match',
  path:    ['confirmPassword'],
});

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="flex items-start gap-3 px-6 py-4
        border-b border-border bg-cream/50">
        <div className="w-8 h-8 rounded-xl bg-olive-100 flex items-center
          justify-center flex-shrink-0 mt-0.5">
          <Icon size={14} className="text-olive-700" />
        </div>
        <div>
          <h2 className="font-display font-bold text-olive-900 text-sm">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3.5
      border-b border-border last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-olive-900">{label}</p>
        {description && (
          <p className="text-xs text-muted mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-6 rounded-full flex-shrink-0',
          'transition-colors duration-200',
          checked ? 'bg-olive-700' : 'bg-border'
        )}
      >
        <span className={cn(
          'absolute top-1 w-4 h-4 rounded-full bg-white',
          'shadow-sm transition-all duration-200',
          checked ? 'left-5' : 'left-1'
        )} />
      </button>
    </div>
  );
}

export default function Settings() {
  const user       = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);
  const toast      = useToastStore();

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    projectUpdates:     true,
    feedbackAlerts:     true,
    weeklyDigest:       false,
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  async function onProfileSubmit(data) {
    await new Promise(r => setTimeout(r, 600));
    updateUser({ name: data.name });
    toast.success('Profile updated successfully!');
  }

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  async function onPasswordSubmit(data) {
    await new Promise(r => setTimeout(r, 700));
    if (data.currentPassword !== 'demo123' && data.currentPassword !== 'wrongpass') {
      passwordForm.reset();
      toast.success('Password changed successfully!');
    } else if (data.currentPassword === 'wrongpass') {
      passwordForm.setError('currentPassword', {
        message: 'Incorrect current password',
      });
    } else {
      passwordForm.reset();
      toast.success('Password changed successfully!');
    }
  }

  function togglePref(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    toast.info('Preferences updated');
  }

  const initials = user?.name
    ?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-olive-900 text-2xl mb-1">
          Settings
        </h1>
        <p className="text-sm text-muted">
          Manage your account and preferences.
        </p>
      </div>

      <div className="space-y-5">

        <Section
          icon={User}
          title="Profile"
          description="Update your name and account info."
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-olive-700 flex items-center
              justify-center text-white font-display font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-display font-bold text-olive-900 text-base">
                {user?.name}
              </p>
              <p className="text-xs text-muted mt-0.5">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-1.5
                px-2 py-0.5 rounded-full bg-olive-100 text-olive-700
                text-[10px] font-bold uppercase tracking-wide">
                <GitBranch size={8} fill="currentColor" />
                Freelancer
              </span>
            </div>
          </div>

          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              placeholder="Umair Qureshi"
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register('name')}
            />

            {/* Email — read only */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-olive-900
                uppercase tracking-nav flex items-center gap-2">
                Email Address
                <span className="text-subtle normal-case font-normal
                  text-[10px]">
                  (read-only)
                </span>
              </label>
              <div className="flex items-center gap-3 px-5 py-3 rounded-full
                border border-border bg-cream/50 text-sm text-muted">
                <Mail size={13} className="text-subtle flex-shrink-0" />
                {user?.email}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-olive-900 text-cream text-xs font-bold uppercase tracking-nav
                  hover:bg-olive-700 transition-colors
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {profileForm.formState.isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2
                      border-cream/30 border-t-cream animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Changes
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </form>
        </Section>

        <Section
          icon={Lock}
          title="Security"
          description="Change your password to keep your account secure."
        >
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <Input
              label="Current Password"
              type={showCurrent ? 'text' : 'password'}
              placeholder="••••••••"
              required
              error={passwordForm.formState.errors.currentPassword?.message}
              rightElement={
                <button type="button"
                  onClick={() => setShowCurrent(p => !p)}
                  className="w-7 h-7 flex items-center justify-center
                    rounded-full text-subtle hover:text-olive-900
                    hover:bg-cream transition-all">
                  {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              }
              {...passwordForm.register('currentPassword')}
            />

            <Input
              label="New Password"
              type={showNew ? 'text' : 'password'}
              placeholder="Min 8 characters"
              required
              error={passwordForm.formState.errors.newPassword?.message}
              rightElement={
                <button type="button"
                  onClick={() => setShowNew(p => !p)}
                  className="w-7 h-7 flex items-center justify-center
                    rounded-full text-subtle hover:text-olive-900
                    hover:bg-cream transition-all">
                  {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              }
              {...passwordForm.register('newPassword')}
            />

            <Input
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat new password"
              required
              error={passwordForm.formState.errors.confirmPassword?.message}
              rightElement={
                <button type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="w-7 h-7 flex items-center justify-center
                    rounded-full text-subtle hover:text-olive-900
                    hover:bg-cream transition-all">
                  {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              }
              {...passwordForm.register('confirmPassword')}
            />

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-olive-900 text-cream text-xs font-bold uppercase tracking-nav
                  hover:bg-olive-700 transition-colors
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {passwordForm.formState.isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2
                      border-cream/30 border-t-cream animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </form>
        </Section>

        <Section
          icon={Bell}
          title="Notifications"
          description="Choose what you want to be notified about."
        >
          <div>
            {[
              {
                key:   'emailNotifications',
                label: 'Email Notifications',
                desc:  'Receive email updates about your projects and clients.',
              },
              {
                key:   'projectUpdates',
                label: 'Project Updates',
                desc:  'Get notified when project status changes.',
              },
              {
                key:   'feedbackAlerts',
                label: 'Client Feedback Alerts',
                desc:  'Instant alert when a client leaves feedback.',
              },
              {
                key:   'weeklyDigest',
                label: 'Weekly Digest',
                desc:  'Summary of all activity from the past week.',
              },
            ].map(item => (
              <Toggle
                key={item.key}
                label={item.label}
                description={item.desc}
                checked={prefs[item.key]}
                onChange={() => togglePref(item.key)}
              />
            ))}
          </div>
        </Section>

        <Section
          icon={Shield}
          title="About Relay"
        >
          <div className="space-y-3">
            {[
              { label: 'Version',    value: '1.0.0 Beta' },
              { label: 'Platform',   value: 'Web'        },
              { label: 'Built with', value: 'React + Zustand + Tailwind' },
            ].map(item => (
              <div key={item.label}
                className="flex items-center justify-between py-2
                  border-b border-border last:border-0">
                <span className="text-xs text-muted">{item.label}</span>
                <span className="text-xs font-medium text-olive-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <div className="border border-danger/20 rounded-2xl p-5">
          <h3 className="font-display font-bold text-danger text-sm mb-1">
            Danger Zone
          </h3>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            Once you delete your account, there is no going back.
            All your projects and client data will be permanently removed.
          </p>
          <button className="px-5 py-2.5 rounded-full border border-danger/30
            text-danger text-xs font-bold uppercase tracking-nav
            hover:bg-danger/5 transition-colors">
            Delete Account
          </button>
        </div>

      </div>
    </motion.div>
  );
}