import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  seedItems,
  seedWastage,
  type Item,
  type WastageEntry,
  type WastageReason,
} from '@/lib/data';
import { useLocalStorage } from '@/lib/hooks';
import { uid } from '@/lib/utils';

export type ToastKind = 'success' | 'warning' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
  action?: ToastAction;
}

interface User {
  name: string;
  email: string;
  shop: string;
}

interface AppContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
  items: Item[];
  updateItem: (id: string, patch: Partial<Item>) => void;
  addItems: (items: Item[]) => void;
  removeItem: (id: string) => void;
  wastage: WastageEntry[];
  addWastage: (entry: { itemId: string; quantity: number; reason: WastageReason; note?: string }) => void;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
  consent: 'all' | 'essential' | null;
  setConsent: (value: 'all' | 'essential') => void;
  openPreferences: boolean;
  setOpenPreferences: (value: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultUser: User = {
  name: 'Aarav Sharma',
  email: 'demo@stocksense.app',
  shop: 'Sharma General Store',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('ss.theme', 'light');
  const [user, setUser] = useLocalStorage<User | null>('ss.user', null);
  const [items, setItems] = useLocalStorage<Item[]>('ss.items', seedItems);
  const [wastage, setWastage] = useLocalStorage<WastageEntry[]>('ss.wastage', seedWastage);
  const [consent, setConsentState] = useLocalStorage<'all' | 'essential' | null>('ss.consent', null);
  const [openPreferences, setOpenPreferences] = useLocalStorage('ss.cookiePrefsOpen', false);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('ss.sidebarCollapsed', false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = uid('toast');
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      timers.current[id] = setTimeout(() => dismissToast(id), toast.action ? 6000 : 4000);
      return id;
    },
    [dismissToast],
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<Item>) => {
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    },
    [setItems],
  );

  const addItems = useCallback(
    (newItems: Item[]) => {
      setItems((current) => [...newItems, ...current]);
    },
    [setItems],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id));
    },
    [setItems],
  );

  const addWastage = useCallback(
    (entry: { itemId: string; quantity: number; reason: WastageReason; note?: string }) => {
      const item = items.find((candidate) => candidate.id === entry.itemId);
      if (!item) return;
      const record: WastageEntry = {
        id: uid('wst'),
        itemId: entry.itemId,
        itemName: item.name,
        quantity: entry.quantity,
        reason: entry.reason,
        value: Math.round(entry.quantity * item.costPerUnit),
        date: new Date().toISOString().slice(0, 10),
        note: entry.note,
      };
      setWastage((current) => [record, ...current]);
      setItems((current) =>
        current.map((candidate) =>
          candidate.id === entry.itemId
            ? { ...candidate, stockAvailable: Math.max(0, candidate.stockAvailable - entry.quantity) }
            : candidate,
        ),
      );
    },
    [items, setItems, setWastage],
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const signIn = useCallback((nextUser: User) => setUser(nextUser), [setUser]);
  const signOut = useCallback(() => setUser(null), [setUser]);

  const setConsent = useCallback(
    (value: 'all' | 'essential') => {
      setConsentState(value);
      setOpenPreferences(false);
    },
    [setConsentState, setOpenPreferences],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      toggleTheme,
      user,
      signIn,
      signOut,
      items,
      updateItem,
      addItems,
      removeItem,
      wastage,
      addWastage,
      toasts,
      pushToast,
      dismissToast,
      consent,
      setConsent,
      openPreferences,
      setOpenPreferences,
      sidebarCollapsed,
      setSidebarCollapsed,
    }),
    [
      theme,
      toggleTheme,
      user,
      signIn,
      signOut,
      items,
      updateItem,
      addItems,
      removeItem,
      wastage,
      addWastage,
      toasts,
      pushToast,
      dismissToast,
      consent,
      setConsent,
      openPreferences,
      setOpenPreferences,
      sidebarCollapsed,
      setSidebarCollapsed,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

export { defaultUser };
export type { User };
