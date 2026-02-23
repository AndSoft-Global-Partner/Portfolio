import { useEffect } from 'react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { useWindowManager, type AppWindow } from '../windowManager';
import { useI18n } from '../useI18n';
import type { TranslationKey } from '../i18nConfig';
import type { ReactNode } from 'react';

interface Props {
  win: AppWindow;
  children: ReactNode;
}

export default function OSWindow({ win, children }: Props) {
  const {
    focusWindow, closeWindow, minimizeWindow,
    toggleMaximize, updatePosition, activeId,
  } = useWindowManager();
  const { t } = useI18n();

  const dragControls = useDragControls();
  const isActive = activeId === win.id;

  /* Position via motion values — lets framer‑motion drag update smoothly */
  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);

  /* Sync position when window state changes externally */
  useEffect(() => {
    if (win.maximized) {
      x.set(0);
      y.set(0);
    } else {
      x.set(win.x);
      y.set(win.y);
    }
  }, [win.maximized, win.x, win.y, x, y]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        width: win.maximized ? '100%' : win.width,
        height: win.maximized ? '100%' : win.height,
      }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(4px)', transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      style={{
        position: 'absolute',
        x: win.maximized ? 0 : x,
        y: win.maximized ? 0 : y,
        zIndex: win.z,
        pointerEvents: 'auto',
      }}
      drag={!win.maximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={() => updatePosition(win.id, x.get(), y.get())}
      onPointerDown={() => focusWindow(win.id)}
      className={[
        'flex flex-col os-window',
        win.maximized ? '!rounded-none' : '',
        isActive
          ? 'ring-1 ring-os-green/20 shadow-2xl'
          : 'opacity-[0.82] shadow-lg',
      ].join(' ')}
    >
      {/* ── Title bar (drag handle) ── */}
      <div
        className="os-titlebar cursor-grab active:cursor-grabbing flex-shrink-0"
        onPointerDown={e => { if (!win.maximized) dragControls.start(e); }}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="os-dots">
          <button
            className="os-dot close"
            onClick={e => { e.stopPropagation(); closeWindow(win.id); }}
          />
          <button
            className="os-dot minimize"
            onClick={e => { e.stopPropagation(); minimizeWindow(win.id); }}
          />
          <button
            className="os-dot maximize"
            onClick={e => { e.stopPropagation(); toggleMaximize(win.id); }}
          />
        </div>
        <span className="os-title truncate">{t(win.titleKey as TranslationKey)}</span>
        {/* Invisible spacer to center the title */}
        <div className="os-dots invisible" aria-hidden>
          <span className="os-dot" /><span className="os-dot" /><span className="os-dot" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto min-h-0">
        {children}
      </div>
    </motion.div>
  );
}
