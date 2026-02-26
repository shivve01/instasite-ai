import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Trash2, Plus } from 'lucide-react';
import ProjectCard from '../components/history/ProjectCard';
import Button from '../components/common/Button';
import { useStore } from '../store/useStore';
import { downloadAsZip } from '../utils/downloadZip';

export default function HistoryPage() {
    const navigate = useNavigate();
    const history = useStore((s) => s.history);
    const setCurrentProject = useStore((s) => s.setCurrentProject);
    const setSelectedFile = useStore((s) => s.setSelectedFile);
    const removeFromHistory = useStore((s) => s.removeFromHistory);
    const clearHistory = useStore((s) => s.clearHistory);
    const setGenerationStatus = useStore((s) => s.setGenerationStatus);

    const handleView = (project: typeof history[0]) => {
        setCurrentProject(project);
        setGenerationStatus('complete');
        if (project.files.length > 0) {
            setSelectedFile(project.files[0].path);
        }
        navigate('/results');
    };

    const handleDownload = (project: typeof history[0]) => {
        downloadAsZip(project.files, project.projectName);
    };

    if (history.length === 0) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="w-10 h-10 text-[var(--text-secondary)]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Projects Yet</h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-sm max-w-sm">
                        Your generated websites will appear here. Start by describing your dream website.
                    </p>
                    <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/')}>
                        Create Your First Website
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-2xl font-bold">My Projects</h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {history.length} website{history.length !== 1 ? 's' : ''} generated
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 className="w-3.5 h-3.5" />}
                            onClick={clearHistory}
                        >
                            Clear All
                        </Button>
                        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => navigate('/')}>
                            New Project
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {history.map((project, i) => (
                        <motion.div
                            key={project.projectId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <ProjectCard
                                project={project}
                                onView={() => handleView(project)}
                                onDelete={() => removeFromHistory(project.projectId)}
                                onDownload={() => handleDownload(project)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
