import { useState } from 'react';
import { Cookie } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from './Button';
import { Modal } from './Modal';
import { Toggle } from './Input';

export function CookieBanner() {
  const { consent, setConsent, openPreferences, setOpenPreferences } = useApp();
  const [analytics, setAnalytics] = useState(true);
  const [personalisation, setPersonalisation] = useState(false);

  const showBanner = consent === null && !openPreferences;

  const savePreferences = () => {
    setConsent(analytics || personalisation ? 'all' : 'essential');
  };

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[60] animate-rise-in border-t border-line bg-surface p-4 shadow-float sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[380px] sm:rounded-card sm:border"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
              <Cookie size={16} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-ink">A few cookies, no crumbs</p>
              <p className="mt-0.5 text-caption leading-relaxed text-muted">
                We use essential cookies to run StockSense and optional ones to improve it. You choose.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setConsent('all')}>
              Accept all
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setConsent('essential')}>
              Reject non-essential
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpenPreferences(true)}>
              Preferences
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
        title="Cookie preferences"
        description="Essential cookies keep your stock data and login working. Everything else is optional."
        size="sm"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setOpenPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={savePreferences}>Save preferences</Button>
          </div>
        }
      >
        <div className="divide-y divide-line">
          <Toggle checked disabled onChange={() => undefined} label="Essential" description="Login, security and your saved stock. Always on." />
          <Toggle
            checked={analytics}
            onChange={setAnalytics}
            label="Analytics"
            description="Anonymous usage data that helps us improve the app."
          />
          <Toggle
            checked={personalisation}
            onChange={setPersonalisation}
            label="Personalisation"
            description="Remembers your preferred views and report settings."
          />
        </div>
      </Modal>
    </>
  );
}
