import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Code, Download } from 'lucide-react';
import PromptInput from '../components/generator/PromptInput';
import TemplateCards from '../components/generator/TemplateCards';
import { useStore } from '../store/useStore';

export default function HomePage() {
    const navigate = useNavigate();
    const prompt = useStore((s) => s.prompt);
    const setPrompt = useStore((s) => s.setPrompt);
    const setConfig = useStore((s) => s.setConfig);

    const handleSubmit = () => {
        if (!prompt.trim()) return;
        setConfig({ prompt: prompt.trim() });
        navigate('/config');
    };

    const handleTemplateSelect = (templatePrompt: string) => {
        setPrompt(templatePrompt);
        setConfig({ prompt: templatePrompt });
        navigate('/config');
    };

    const features = [
        {
            icon: <Zap className="w-5 h-5" />,
            title: 'AI-Powered',
            desc: 'Advanced AI generates production-ready code in seconds',
        },
        {
            icon: <Code className="w-5 h-5" />,
            title: 'Full Projects',
            desc: 'Complete 3-5 page websites with routing and styling',
        },
        {
            icon: <Download className="w-5 h-5" />,
            title: 'Download & Deploy',
            desc: 'Get a ZIP file ready to npm install and deploy',
        },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero */}
            <section className="relative hero-gradient py-24 sm:py-32 px-4">
                {/* Floating orbs */}
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 right-[10%] w-64 h-64 bg-accent-pink/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary mb-6">
                            <Zap className="w-3.5 h-3.5" />
                            AI-Powered Website Builder
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                            Describe Your Dream Website.
                            <br />
                            <span className="gradient-text">We'll Build It.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                            Turn your ideas into production-ready websites with AI. Get complete code
                            with modern design, responsive layouts, and downloadable files — in seconds.
                        </p>
                    </motion.div>

                    <PromptInput
                        value={prompt}
                        onChange={setPrompt}
                        onSubmit={handleSubmit}
                    />

                    <TemplateCards onSelect={handleTemplateSelect} />
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 border-t border-[var(--border)]">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
