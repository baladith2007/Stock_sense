import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input, PasswordInput } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { sleep } from '@/lib/utils';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Signup() {
  const { signIn, pushToast } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [shop, setShop] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = 'Enter your full name.';
    if (shop.trim().length < 2) nextErrors.shop = 'Enter your shop name.';
    if (!emailPattern.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (!terms) nextErrors.terms = 'Please accept the Terms and Privacy Policy to continue.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    await sleep(900);
    signIn({ name: name.trim(), shop: shop.trim(), email: email.trim() });
    setLoading(false);
    pushToast({ kind: 'success', title: 'Your shop is ready', description: 'Your dashboard is set up with demo stock. Upload a bill whenever you are ready.' });
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      panelTitle="Three months free. A calmer shelf by tonight."
      panelSub="Set up in four minutes. Upload one bill and StockSense builds your stock picture for you."
      bullets={[
        'Free for 3 months, no card needed',
        'Upload a bill — we do the typing',
        'Cancel anytime, keep your data',
      ]}
      accentStat={{ value: '1 photo', label: 'to update your entire stock list' }}
    >
      <div className="animate-fade-in">
        <p className="eyebrow">Start free</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight text-ink">Create your account</h1>
        <p className="mt-2 text-[14px] text-muted">Your shop, finally in focus. No card, no setup fee.</p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              autoComplete="name"
              placeholder="Aarav Sharma"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Shop name"
              autoComplete="organization"
              placeholder="Sharma General Store"
              value={shop}
              onChange={(event) => setShop(event.target.value)}
              error={errors.shop}
              required
            />
          </div>

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

          <PasswordInput
            label="Password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            hint="At least 8 characters."
            required
          />

          <div>
            <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(event) => setTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? 'terms-error' : undefined}
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-primary-ink underline underline-offset-2">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-primary-ink underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.terms && (
              <p id="terms-error" role="alert" className="mt-1 text-caption text-danger-ink">
                {errors.terms}
              </p>
            )}
          </div>

          <Button type="submit" fullWidth loading={loading} loadingLabel="Creating account">
            Start 3-month free trial
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-5 text-center text-[14px] text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-ink hover:underline">
            Log in
          </Link>
        </p>

        <div className="mt-7 flex items-center justify-center gap-2 text-[12px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          Free for 3 months · No card required
        </div>
      </div>
    </AuthLayout>
  );
}
