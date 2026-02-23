import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Folder, Grid, List, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n";

const projectKeys = [
  {
    nameKey: 'project.ecommerce.name' as const,
    descKey: 'project.ecommerce.desc' as const,
    image: "/1.png",
    type: "Web",
    size: "24.6 MB",
    modified: "Jan 15, 2025",
    tech: ["React", "Node.js", "PostgreSQL"],
  },
  {
    nameKey: 'project.health.name' as const,
    descKey: 'project.health.desc' as const,
    image: "/2.png",
    type: "Mobile",
    size: "18.2 MB",
    modified: "Feb 8, 2025",
    tech: ["Flutter", "Firebase", "ML"],
  },
  {
    nameKey: 'project.corporate.name' as const,
    descKey: 'project.corporate.desc' as const,
    image: "/5.png",
    type: "Web",
    size: "31.4 MB",
    modified: "Dec 20, 2024",
    tech: ["React", "Python", "AWS"],
  },
  {
    nameKey: 'project.financial.name' as const,
    descKey: 'project.financial.desc' as const,
    image: "/4.png",
    type: "Web",
    size: "22.1 MB",
    modified: "Nov 5, 2024",
    tech: ["React", "D3.js", "Node.js"],
  },
];

export default function Projects() {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const sidebarItems = [
    { label: t('projects.home'), active: false },
    { label: t('projects.projects'), active: true },
    { label: t('projects.recent'), active: false },
    { label: t('projects.favorites'), active: false },
  ];

  return (
    <section id="projects" className="px-3 md:px-6 py-3">
      <div className="os-window max-w-5xl mx-auto">
        {/* Title bar */}
        <div className="os-titlebar">
          <div className="os-dots">
            <div className="os-dot close" />
            <div className="os-dot minimize" />
            <div className="os-dot maximize" />
          </div>
          <div className="os-title">
            {t('projects.title')}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-os-border bg-os-titlebar/30">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-os-muted hover:text-os-text cursor-pointer transition-colors">home</span>
            <ChevronRight size={10} className="text-os-dim" />
            <span className="text-os-muted hover:text-os-text cursor-pointer transition-colors">andsoft</span>
            <ChevronRight size={10} className="text-os-dim" />
            <span className="text-os-text">projects</span>
          </div>

          {/* View toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'text-os-green bg-os-green/10' : 'text-os-dim hover:text-os-muted'}`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'text-os-green bg-os-green/10' : 'text-os-dim hover:text-os-muted'}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        <div className="flex min-h-[400px]">
          {/* Sidebar */}
          <div className="hidden md:block w-44 border-r border-os-border/50 py-3 px-2 bg-os-bg/30 flex-shrink-0">
            {sidebarItems.map(item => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                  item.active
                    ? 'text-os-green bg-os-green/5'
                    : 'text-os-muted hover:text-os-text hover:bg-white/[0.02]'
                }`}
              >
                <Folder size={13} />
                {item.label}
              </div>
            ))}
            <div className="mt-6 px-3">
              <div className="text-[9px] font-mono text-os-dim tracking-wider uppercase mb-2">{t('projects.storage')}</div>
              <div className="os-progress">
                <div className="os-progress-fill bg-os-cyan" style={{ width: '64%' }} />
              </div>
              <div className="text-[9px] font-mono text-os-dim mt-1">128 GB / 200 GB</div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectKeys.map((project, i) => (
                  <motion.div
                    key={project.nameKey}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" as const }}
                    onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                    className={`file-card p-3 ${
                      selectedIdx === i ? 'bg-os-green/[0.06] !border-os-green/20' : ''
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video rounded-md bg-os-bg overflow-hidden mb-3 border border-os-border/30">
                      <img
                        src={project.image}
                        alt={t(project.nameKey)}
                        className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2">
                      <Folder size={16} className="text-os-cyan mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-os-text truncate">{t(project.nameKey)}</h3>
                        <p className="text-[11px] text-os-muted mt-0.5 line-clamp-2">{t(project.descKey)}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.tech.map(te => (
                            <span key={te} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-os-border/30 text-os-dim">
                              {te}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-mono text-[9px] text-os-dim">{project.size}</span>
                          <span className="font-mono text-[9px] text-os-dim">{project.modified}</span>
                          <a href="#" className="font-mono text-[9px] text-os-cyan hover:text-os-green transition-colors flex items-center gap-1">
                            {t('projects.open')} <ExternalLink size={8} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {/* List header */}
                <div className="grid grid-cols-[1fr_80px_100px_80px] gap-2 px-3 py-1.5 text-[10px] font-mono text-os-dim tracking-wider uppercase border-b border-os-border/30">
                  <div>{t('projects.name')}</div>
                  <div>{t('projects.type')}</div>
                  <div>{t('projects.modified')}</div>
                  <div>{t('projects.size')}</div>
                </div>
                {projectKeys.map((project, i) => (
                  <motion.div
                    key={project.nameKey}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                    className={`grid grid-cols-[1fr_80px_100px_80px] gap-2 items-center px-3 py-2.5 rounded cursor-pointer transition-colors text-[11px] font-mono ${
                      selectedIdx === i
                        ? 'bg-os-green/[0.06] text-os-text'
                        : 'text-os-muted hover:bg-os-border/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder size={14} className="text-os-cyan flex-shrink-0" />
                      <span className="truncate">{t(project.nameKey)}</span>
                    </div>
                    <div>{project.type}</div>
                    <div className="text-os-dim">{project.modified}</div>
                    <div className="text-os-dim">{project.size}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 md:px-6 py-2 border-t border-os-border bg-os-titlebar/30 flex items-center justify-between font-mono text-[10px] text-os-dim">
          <span>{projectKeys.length} {t('projects.items')} · {selectedIdx !== null ? t('projects.selected') : t('projects.noneSelected')}</span>
          <span>{t('projects.free')}: 72 GB</span>
        </div>
      </div>
    </section>
  );
}
