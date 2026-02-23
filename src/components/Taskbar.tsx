import { motion, AnimatePresence } from 'framer-motion';
import { useWindowManager, type AppId } from '../windowManager';

const APPS: { id: AppId; icon: string; label: string }[] = [
  { id: 'home',         icon: '🖥️', label: 'Terminal' },
  { id: 'technologies', icon: '⚡',  label: 'Monitor' },
  { id: 'projects',     icon: '📁',  label: 'Files' },
  { id: 'contact',      icon: '✉️',  label: 'Mail' },
];

export default function Taskbar() {
  const { windows, openWindow, focusWindow, restoreWindow, activeId } = useWindowManager();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
        className="flex items-end gap-1 px-3 py-1.5 rounded-2xl bg-os-panel/70 backdrop-blur-2xl border border-os-border/40 shadow-xl"
      >
        {APPS.map(app => {
          const win = windows.find(w => w.id === app.id);
          const isOpen = !!win;
          const isActive = activeId === app.id;
          const isMinimized = win?.minimized;

          return (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.95 }}
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
                'relative flex flex-col items-center gap-0.5 w-14 py-1.5 rounded-xl transition-colors',
                isActive ? 'bg-os-green/[0.08]' : 'hover:bg-os-border/20',
              ].join(' ')}
            >
              <span className="text-2xl leading-none select-none">{app.icon}</span>
              <span className="text-[8px] font-mono text-os-dim truncate w-full text-center">
                {app.label}
              </span>

              {/* Open indicator dot */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={[
                      'absolute -bottom-0.5 w-1 h-1 rounded-full',
                      isActive ? 'bg-os-green' : 'bg-os-muted',
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
