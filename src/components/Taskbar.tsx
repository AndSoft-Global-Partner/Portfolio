import { motion, AnimatePresence } from 'framer-motion';
import { useWindowManager, type AppId } from '../windowManager';
import { useTheme } from '../useTheme';
import { Monitor, Zap, FolderOpen, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AppConfig {
  id: AppId;
  icon: LucideIcon;
  label: string;
  dark:  { hover: string; active: string; glow: string; indicator: string };
  light: { hover: string; active: string; glow: string; indicator: string };
}

const APPS: AppConfig[] = [
  {
    id: 'home', icon: Monitor, label: 'Terminal',
    dark:  { hover: 'hover:text-emerald-400 hover:bg-emerald-500/10', active: 'text-emerald-400 bg-emerald-500/10', glow: '0 0 14px rgba(52,211,153,0.25)', indicator: 'bg-emerald-400' },
    light: { hover: 'hover:text-emerald-600 hover:bg-emerald-100/60', active: 'text-emerald-700 bg-emerald-100/80', glow: '0 0 12px rgba(5,150,105,0.25)', indicator: 'bg-emerald-500' },
  },
  {
    id: 'technologies', icon: Zap, label: 'Monitor',
    dark:  { hover: 'hover:text-amber-400 hover:bg-amber-500/10', active: 'text-amber-400 bg-amber-500/10', glow: '0 0 14px rgba(251,191,36,0.25)', indicator: 'bg-amber-400' },
    light: { hover: 'hover:text-amber-600 hover:bg-amber-100/60', active: 'text-amber-700 bg-amber-100/80', glow: '0 0 12px rgba(217,119,6,0.25)', indicator: 'bg-amber-500' },
  },
  {
    id: 'projects', icon: FolderOpen, label: 'Files',
    dark:  { hover: 'hover:text-violet-400 hover:bg-violet-500/10', active: 'text-violet-400 bg-violet-500/10', glow: '0 0 14px rgba(167,139,250,0.25)', indicator: 'bg-violet-400' },
    light: { hover: 'hover:text-violet-600 hover:bg-violet-100/60', active: 'text-violet-700 bg-violet-100/80', glow: '0 0 12px rgba(109,40,217,0.25)', indicator: 'bg-violet-500' },
  },
  {
    id: 'contact', icon: Mail, label: 'Mail',
    dark:  { hover: 'hover:text-rose-400 hover:bg-rose-500/10', active: 'text-rose-400 bg-rose-500/10', glow: '0 0 14px rgba(251,113,133,0.25)', indicator: 'bg-rose-400' },
    light: { hover: 'hover:text-rose-600 hover:bg-rose-100/60', active: 'text-rose-700 bg-rose-100/80', glow: '0 0 12px rgba(225,29,72,0.25)', indicator: 'bg-rose-500' },
  },
];

export default function Taskbar() {
  const { windows, openWindow, focusWindow, restoreWindow, activeId } = useWindowManager();
  const { isDark } = useTheme();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 28 }}
        className={[
          'flex items-center gap-1 px-2.5 py-2 rounded-2xl backdrop-blur-xl border',
          isDark
            ? 'bg-black/60 border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-white/90 border-gray-200/80 shadow-[0_2px_20px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)]',
        ].join(' ')}
      >
        {APPS.map(app => {
          const win = windows.find(w => w.id === app.id);
          const isOpen = !!win;
          const isActive = activeId === app.id;
          const isMinimized = win?.minimized;
          const Icon = app.icon;
          const colors = isDark ? app.dark : app.light;

          return (
            <motion.button
              key={app.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              onClick={() => {
                if (!isOpen) {
                  openWindow(app.id);
                } else if (isMinimized) {
                  restoreWindow(app.id);
                } else {
                  focusWindow(app.id);
                }
              }}
              style={isActive ? { boxShadow: colors.glow } : undefined}
              className={[
                'relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                isActive
                  ? colors.active
                  : `${isDark ? 'text-neutral-500' : 'text-neutral-500'} ${colors.hover}`,
              ].join(' ')}
              title={app.label}
            >
              <Icon size={18} strokeWidth={1.8} />

              {/* Active/open indicator */}
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={[
                      'absolute -bottom-0.5 w-4 h-0.5 rounded-full',
                      isActive ? colors.indicator : isDark ? 'bg-neutral-600' : 'bg-neutral-300',
                    ].join(' ')}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
