import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/* ═══ Types ═══ */
export interface AppWindow {
  id: string;
  titleKey: string;   // i18n translation key
  icon: string;       // lucide icon name or emoji
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export type AppId = 'home' | 'technologies' | 'projects' | 'contact' | 'terminal';

interface WindowManagerContextType {
  windows: AppWindow[];
  openWindow: (id: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  restoreWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  activeId: string | null;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

/* ═══ Default window configs ═══ */
const APP_DEFAULTS: Record<AppId, Omit<AppWindow, 'z' | 'minimized' | 'maximized'>> = {
  home: {
    id: 'home',
    titleKey: 'win.terminal',
    icon: '🖥',
    x: 60, y: 40,
    width: 820, height: 520,
    minWidth: 400, minHeight: 300,
  },
  technologies: {
    id: 'technologies',
    titleKey: 'win.monitor',
    icon: '⚡',
    x: 120, y: 70,
    width: 780, height: 500,
    minWidth: 400, minHeight: 300,
  },
  projects: {
    id: 'projects',
    titleKey: 'win.files',
    icon: '📁',
    x: 180, y: 50,
    width: 800, height: 540,
    minWidth: 400, minHeight: 300,
  },
  contact: {
    id: 'contact',
    titleKey: 'win.mail',
    icon: '✉️',
    x: 100, y: 60,
    width: 820, height: 500,
    minWidth: 400, minHeight: 300,
  },
  terminal: {
    id: 'terminal',
    titleKey: 'win.terminalEmulator',
    icon: '💻',
    x: 140, y: 80,
    width: 700, height: 450,
    minWidth: 350, minHeight: 250,
  },
};

/* ═══ Provider ═══ */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [topZ, setTopZ] = useState(10);
  const [activeId, setActiveId] = useState<string | null>(null);

  const focusWindow = useCallback((id: string) => {
    setTopZ(z => {
      const newZ = z + 1;
      setWindows(ws => ws.map(w => w.id === id ? { ...w, z: newZ, minimized: false } : w));
      return newZ;
    });
    setActiveId(id);
  }, []);

  const openWindow = useCallback((appId: AppId) => {
    setWindows(ws => {
      const existing = ws.find(w => w.id === appId);
      if (existing) {
        // Already open — focus it
        const newZ = topZ + 1;
        setTopZ(newZ);
        setActiveId(appId);
        return ws.map(w => w.id === appId ? { ...w, z: newZ, minimized: false } : w);
      }
      // Open new
      const config = APP_DEFAULTS[appId];
      const newZ = topZ + 1;
      setTopZ(newZ);
      setActiveId(appId);
      return [...ws, { ...config, z: newZ, minimized: false, maximized: false }];
    });
  }, [topZ]);

  const closeWindow = useCallback((id: string) => {
    setWindows(ws => ws.filter(w => w.id !== id));
    setActiveId(prev => prev === id ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: true } : w));
    setActiveId(prev => prev === id ? null : prev);
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(ws => ws.map(w => {
      if (w.id !== id) return w;
      return { ...w, maximized: !w.maximized };
    }));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    focusWindow(id);
  }, [focusWindow]);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        toggleMaximize,
        restoreWindow,
        updatePosition,
        activeId,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}
