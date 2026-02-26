import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Download,
    Copy,
    RotateCcw,
    PenLine,
    Share2,
    Check,
    AlertTriangle,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';
import FileExplorer from '../components/editor/FileExplorer';
import CodeViewer from '../components/editor/CodeViewer';
import LivePreview from '../components/editor/LivePreview';
import Button from '../components/common/Button';
import { useStore } from '../store/useStore';
import { downloadAsZip } from '../utils/downloadZip';

export default function ResultsPage() {
    const navigate = useNavigate();
    const currentProject = useStore((s) => s.currentProject);
    const selectedFile = useStore((s) => s.selectedFile);
    const setSelectedFile = useStore((s) => s.setSelectedFile);
    const error = useStore((s) => s.error);
    const generationStatus = useStore((s) => s.generationStatus);
    const [copiedAll, setCopiedAll] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const activeFile = useMemo(
        () => currentProject?.files.find((f) => f.path === selectedFile),
        [currentProject, selectedFile]
    );

    // Error state
    if (generationStatus === 'error' || error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Generation Failed</h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-sm">
                        {error || 'Something went wrong while generating your website. Please try again.'}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Button variant="secondary" onClick={() => navigate('/config')}>
                            Edit Config
                        </Button>
                        <Button onClick={() => navigate('/')}>Try Again</Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // No project yet
    if (!currentProject) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-bold mb-2">No Project Generated</h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-sm">
                        Start by describing your website idea to generate code.
                    </p>
                    <Button onClick={() => navigate('/')}>Go to Builder</Button>
                </motion.div>
            </div>
        );
    }

    const handleDownload = () => {
        downloadAsZip(currentProject.files, currentProject.projectName, currentProject.projectId);
    };

    const handleCopyAll = async () => {
        const allCode = currentProject.files
            .map((f) => `// === ${f.path} ===\n${f.content}`)
            .join('\n\n');
        await navigator.clipboard.writeText(allCode);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold hidden sm:block">{currentProject.projectName}</h2>
                    <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
                        {currentProject.metadata.totalFiles} files · {currentProject.metadata.totalLines} lines
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="secondary" icon={<PenLine className="w-3.5 h-3.5" />} onClick={() => navigate('/config')}>
                        Edit Prompt
                    </Button>
                    <Button size="sm" variant="secondary" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => navigate('/config')}>
                        Regenerate
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        icon={copiedAll ? <Check className="w-3.5 h-3.5 text-accent-cyan" /> : <Copy className="w-3.5 h-3.5" />}
                        onClick={handleCopyAll}
                    >
                        {copiedAll ? 'Copied!' : 'Copy All'}
                    </Button>
                    <Button size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={handleDownload}>
                        Download ZIP
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* File Explorer Sidebar */}
                {sidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="w-[260px] flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)] overflow-hidden"
                    >
                        <FileExplorer
                            files={currentProject.files}
                            selectedFile={selectedFile}
                            onSelect={setSelectedFile}
                        />
                    </motion.div>
                )}

                {/* Code Editor */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center gap-1 px-2 py-1 border-b border-[var(--border)] bg-[var(--surface)]">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                        >
                            {sidebarOpen ? (
                                <PanelLeftClose className="w-4 h-4" />
                            ) : (
                                <PanelLeftOpen className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${!showPreview ? 'bg-primary/10 text-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                }`}
                        >
                            Code
                        </button>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${showPreview ? 'bg-primary/10 text-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                }`}
                        >
                            Preview
                        </button>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Code */}
                        <div className={`${showPreview ? 'w-1/2 hidden lg:block' : 'w-full'} overflow-hidden`}>
                            {activeFile ? (
                                <CodeViewer
                                    code={activeFile.content}
                                    language={activeFile.language}
                                    filename={activeFile.filename}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-[var(--text-secondary)] text-sm">
                                    Select a file from the explorer
                                </div>
                            )}
                        </div>

                        {/* Preview */}
                        {showPreview && (
                            <div className={`${showPreview ? 'w-full lg:w-1/2' : 'hidden'} border-l border-[var(--border)]`}>
                                <LivePreview files={currentProject.files} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
