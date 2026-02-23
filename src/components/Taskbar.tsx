import { motion, AnimatePresence } from 'framer-motion';
import { useWindowManager, type AppId } from '../windowManager';
import { Monitor, Zap, FolderOpen, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const APPS: { id: AppId; icon: LucideIcon; label: string }[] = [
  { id: 'home',         icon: Monitor,    label: 'Terminal' },
  { id: 'technologies', icon: Zap,        label: 'Monitor' },
  { id: 'projects',     icon: FolderOpen, label: 'Files' },
  { id: 'contact',      icon: Mail,       label: 'Mail' },
];

export default function Taskbar() {
  const { windows, openWindow, focusWindow, restoreWindow, activeId } = useWindowManager();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 28 }}
        className="flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-os-panel/60 backdrop-blur-xl border border-os-border/30"
      >
        {APPS.map(app => {
          const win = windows.find(w => w.id === app.id);
          const isOpen = !!win;
          const isActive = activeId === app.id;
          const isMinimized = win?.minimized;
          const Icon = app.icon;

          return (
            <motion.button
              key={app.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                if (!isOpen) {
                  openWindow(app.id);
                } else if (isMinimized) {
                  restoreWindow(app.id);
                } else {
                  focusWindow(app.id);
                }
              }}
              className={[
                'relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200',
                isActive ? 'bg-os-green/10 text-os-green' : 'text-os-muted hover:text-os-text hover:bg-os-border/15',
              ].join(' ')}
              title={app.label}
            >
              <Icon size={18} strokeWidth={1.8} />

              {/* Active/open indicator */}
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={[
                      'absolute bottom-0.5 w-1 h-1 rounded-full',
                      isActive ? 'bg-os-green' : 'bg-os-muted/60',
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
