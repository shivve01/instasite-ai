import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import ConfigPanel from '../components/generator/ConfigPanel';
import { useStore } from '../store/useStore';
import { useGenerate } from '../hooks/useGenerate';

export default function ConfigPage() {
    const navigate = useNavigate();
    const config = useStore((s) => s.config);
    const setConfig = useStore((s) => s.setConfig);
    const generationStatus = useStore((s) => s.generationStatus);
    const { generate } = useGenerate();

    const handleGenerate = async () => {
        navigate('/generating');
        try {
            await generate(config);
            navigate('/results');
        } catch {
            // Error is handled in store
            navigate('/results');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to prompt
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left — Prompt Display */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="sticky top-24">
                            <h2 className="text-2xl font-bold mb-2">Configure Your Website</h2>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">
                                Fine-tune the output before we generate your code.
                            </p>

                            <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                        Your Prompt
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                                    {config.prompt || 'No prompt entered. Go back and describe your website.'}
                                </p>
                            </div>

                            {/* Quick summary */}
                            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                                    Generation Summary
                                </h4>
                                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                                    <div className="flex justify-between">
                                        <span>Pages</span>
                                        <span className="font-medium text-[var(--text-primary)]">{config.pages}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Color Scheme</span>
                                        <span className="font-medium text-[var(--text-primary)] capitalize">
                                            {config.colorScheme.replace('-', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Font Style</span>
                                        <span className="font-medium text-[var(--text-primary)] capitalize">
                                            {config.fontStyle}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tech Stack</span>
                                        <span className="font-medium text-[var(--text-primary)]">
                                            {config.outputStack.replace('-', ' + ').replace('vanilla', 'HTML/CSS/JS')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Features</span>
                                        <span className="font-medium text-[var(--text-primary)]">
                                            {config.features.length} selected
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Config Panel */}
                    <div className="lg:col-span-3">
                        <ConfigPanel
                            config={config}
                            onConfigChange={setConfig}
                            onGenerate={handleGenerate}
                            loading={generationStatus === 'generating'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
