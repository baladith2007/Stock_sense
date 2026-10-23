import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';

const privacy = {
  eyebrow: 'Privacy',
  title: 'Your shop data, handled with care.',
  intro:
    'StockSense exists to make running your shop calmer. That only works if you trust us with your numbers. This page explains what we collect, why, and what you can do about it.',
  sections: [
    {
      heading: 'What we collect',
      body: 'Your name, email and shop name when you create an account. Your item list, stock levels, bills you upload, wastage entries and order recommendations. Basic usage data such as which screens you open, so we can fix what is confusing.',
    },
    {
      heading: 'How we use it',
      body: 'To show your stock, calculate days of cover, prepare order recommendations and generate your reports. To provide support when you ask for it. To improve StockSense using aggregated, de-identified patterns.',
    },
    {
      heading: 'Bill photos',
      body: 'Photos you upload are processed to extract items, rates and quantities. The extracted data is saved to your account. Original images are deleted automatically after 30 days, or sooner if you delete them yourself.',
    },
    {
      heading: 'What we never do',
      body: 'We do not sell your data. We do not share your stock or sales information with advertisers. We only share data with service providers who help us run the app, under written confidentiality terms.',
    },
    {
      heading: 'Your choices',
      body: 'You can export your item list and wastage history at any time. You can delete your account and all associated data from Settings, or by emailing us. You can change cookie preferences whenever you like using the link at the bottom of this page.',
    },
    {
      heading: 'Contact',
      body: 'Questions about privacy? Write to privacy@stocksense.app. We reply within two working days.',
    },
  ],
};

const terms = {
  eyebrow: 'Terms',
  title: 'Simple terms for a simple tool.',
  intro:
    'These terms cover your use of StockSense. We have kept them short and readable. By creating an account, you agree to them.',
  sections: [
    {
      heading: 'The service',
      body: 'StockSense helps small shops track stock, record wastage and prepare order recommendations. New accounts include a three-month free trial. No card is required to start. After the trial, paid plans are billed monthly and you can cancel at any time.',
    },
    {
      heading: 'Your account',
      body: 'You are responsible for keeping your login details safe and for the accuracy of the information you enter. You must be authorised to manage the shop you register. One account per shop unless we agree otherwise.',
    },
    {
      heading: 'AI recommendations are guidance',
      body: 'Order quantities and days-of-cover estimates are suggestions based on your recorded sales and stock. They are not guarantees. You remain responsible for purchasing decisions, pricing and compliance with supplier terms.',
    },
    {
      heading: 'Acceptable use',
      body: 'Use StockSense for lawful shop management. Do not upload other people’s private information, attempt to disrupt the service, resell access, or reverse engineer the app. We may suspend accounts that put other users or the service at risk.',
    },
    {
      heading: 'Availability and liability',
      body: 'We work hard to keep StockSense available, but we cannot promise uninterrupted service. To the extent permitted by law, our liability is limited to the amount you paid us in the previous three months. Nothing here limits rights you have under applicable consumer law.',
    },
    {
      heading: 'Changes and contact',
      body: 'We may update these terms as the product evolves and will tell you about material changes in the app. Questions? Write to hello@stocksense.app.',
    },
  ],
};

export default function Legal() {
  const location = useLocation();
  const { setOpenPreferences } = useApp();
  const isTerms = location.pathname.includes('terms');
  const doc = isTerms ? terms : privacy;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link to="/" aria-label="StockSense home" className="inline-flex min-h-11 items-center rounded-input focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring">
            <Logo size="sm" />
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-input px-2 text-[13px] font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-12 sm:px-8 sm:py-16">
        <p className="eyebrow">{doc.eyebrow}</p>
        <h1 className="mt-2 font-display text-[30px] font-semibold leading-tight text-ink sm:text-[36px]">{doc.title}</h1>
        <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-muted">{doc.intro}</p>
        <p className="mt-4 text-caption text-muted">Effective {formatDate('2026-10-01', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="mt-10 space-y-8">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-[18px] font-semibold text-ink">{section.heading}</h2>
              <p className="mt-2 max-w-[65ch] text-[14px] leading-relaxed text-muted">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-card border border-line bg-surface p-5">
          <p className="text-[13px] text-muted">
            Read the other document:{' '}
            <Link to={isTerms ? '/privacy' : '/terms'} className="font-medium text-primary-ink hover:underline">
              {isTerms ? 'Privacy Policy' : 'Terms of Service'}
            </Link>
            .
          </p>
          <p className="mt-2 text-[13px] text-muted">
            Manage cookies:{' '}
            <button type="button" onClick={() => setOpenPreferences(true)} className="font-medium text-primary-ink hover:underline">
              Cookie preferences
            </button>
            .
          </p>
        </div>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-content flex-col gap-3 px-4 py-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} StockSense · Pune, India</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">
              Terms
            </Link>
            <Link to="/" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
