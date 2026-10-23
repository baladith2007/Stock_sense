import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider, defaultUser, useApp } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ToastViewport } from '@/components/ui/Toast';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { Logo } from '@/components/ui/Logo';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Upload = lazy(() => import('@/pages/Upload'));
const Items = lazy(() => import('@/pages/Items'));
const Wastage = lazy(() => import('@/pages/Wastage'));
const AIReport = lazy(() => import('@/pages/AIReport'));
const Legal = lazy(() => import('@/pages/Legal'));
const Design = lazy(() => import('@/pages/Design'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const titles: Record<string, string> = {
  '/': 'StockSense — smart stock for small shops',
  '/login': 'Log in · StockSense',
  '/signup': 'Create your account · StockSense',
  '/demo': 'Dashboard · StockSense',
  '/dashboard': 'Dashboard · StockSense',
  '/upload': 'Upload a bill · StockSense',
  '/items': 'Items · StockSense',
  '/wastage': 'Wastage · StockSense',
  '/report': 'AI report · StockSense',
  '/design': 'Design system · StockSense',
  '/privacy': 'Privacy · StockSense',
  '/terms': 'Terms · StockSense',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = titles[pathname] ?? 'Page not found · StockSense';
  }, [pathname]);
  return null;
}

function BootFallback() {
  return (
    <div className="min-h-screen bg-bg px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-content">
        <Logo size="sm" />
        <div className="mt-10">
          <PageSkeleton />
        </div>
      </div>
    </div>
  );
}

function ProtectedShell() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}

function DemoEntry() {
  const { user, signIn } = useApp();
  useEffect(() => {
    if (!user) signIn(defaultUser);
  }, [user, signIn]);
  if (!user) return <BootFallback />;
  return <Navigate to="/dashboard" replace />;
}

function PublicRoutes() {
  return (
    <Suspense fallback={<BootFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/demo" element={<DemoEntry />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/design" element={<Design />} />
        <Route element={<ProtectedShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/items" element={<Items />} />
          <Route path="/wastage" element={<Wastage />} />
          <Route path="/report" element={<AIReport />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <PublicRoutes />
        <CookieBanner />
        <ToastViewport />
      </AppProvider>
    </BrowserRouter>
  );
}
