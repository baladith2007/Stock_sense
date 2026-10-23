import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input, PasswordInput } from '@/components/ui/Input';
import { useApp, defaultUser } from '@/context/AppContext';
import { sleep } from '@/lib/utils';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const { signIn, pushToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!emailPattern.test(email.trim())) nextErrors.email = 'That email does not look right.';
    if (!password) nextErrors.password = 'Enter your password.';
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    await sleep(700);
    const name = email.trim().toLowerCase() === defaultUser.email ? defaultUser.name : email.split('@')[0].replace(/[._-]/g, ' ');
    signIn({
      name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      email: email.trim(),
      shop: 'Sharma General Store',
    });
    setLoading(false);
    pushToast({ kind: 'success', title: 'Welcome back', description: 'Your stock priorities are up to date.' });
    navigate('/dashboard');
  };

  const useDemo = () => {
    setEmail(defaultUser.email);
    setPassword('demo1234');
    setErrors({});
  };

  return (
    <AuthLayout
      panelTitle="Know what to order before you run out."
      panelSub="StockSense keeps the numbers, so you can keep the shop. Log in to see today's priorities."
      bullets={[
        'Every item, with days of stock left',
        'Wastage tracked in rupees, not guesswork',
        'One clear order list, generated for you',
      ]}
      accentStat={{ value: '2 days', label: 'average warning before a top seller runs out' }}
    >
      <div className="animate-fade-in">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight text-ink">Log in to StockSense</h1>
        <p className="mt-2 text-[14px] text-muted">See today&apos;s priorities and keep your shelf moving.</p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@shop.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            required
          />

          <div>
            <PasswordInput
              label="Password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
              required
            />
            <div className="mt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[13px] text-muted">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-line accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                Keep me signed in
              </label>
              <button
                type="button"
                onClick={() => pushToast({ kind: 'info', title: 'Password reset', description: 'Password reset is not available in this demo.' })}
                className="inline-flex min-h-11 items-center rounded text-[13px] font-medium text-primary-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading} loadingLabel="Logging in">
            Log in
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-5 text-center text-[14px] text-muted">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-primary-ink hover:underline">
            Sign up for a free trial
          </Link>
        </p>

        <div className="mt-7 rounded-card border border-line bg-surface-soft p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-ink">Looking around?</p>
              <p className="mt-0.5 text-caption text-muted-strong">
                Demo login: {defaultUser.email} · demo1234
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={useDemo}>
              Use demo
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-muted">
          By continuing you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2 hover:text-ink">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
