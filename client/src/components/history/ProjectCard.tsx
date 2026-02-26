import { motion } from 'framer-motion';
import { Clock, Calendar, Trash2, Eye, Download, RotateCcw, Code } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
    onView: () => void;
    onDelete: () => void;
    onDownload: () => void;
}

export default function ProjectCard({ project, onView, onDelete, onDownload }: ProjectCardProps) {
    const date = new Date(project.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
        >
            {/* Preview Header */}
            <div className="h-32 bg-gradient-to-br from-primary/20 via-accent-pink/10 to-accent-cyan/10 p-4 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="relative z-10 flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    <div>
                        <h3 className="font-semibold text-sm">{project.projectName}</h3>
                        <p className="text-xs text-[var(--text-secondary)]">
                            {project.metadata.totalFiles} files · {project.metadata.totalLines} lines
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {project.prompt}
                </p>

                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedTime}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                    <button
                        onClick={onView}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        View
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--surface-hover)] hover:bg-accent-cyan/10 hover:text-accent-cyan transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download
                    </button>
                    <div className="flex-1" />
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
