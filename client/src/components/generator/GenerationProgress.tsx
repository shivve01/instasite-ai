import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';
import type { GenerationStep } from '../../types';

const steps: GenerationStep[] = [
    { id: 1, label: 'Understanding your requirements...', status: 'pending' },
    { id: 2, label: 'Designing page layouts...', status: 'pending' },
    { id: 3, label: 'Generating component code...', status: 'pending' },
    { id: 4, label: 'Adding styles and animations...', status: 'pending' },
    { id: 5, label: 'Finalizing your website...', status: 'pending' },
];

const funFacts = [
    '💡 Did you know? The first website was published in 1991 by Tim Berners-Lee.',
    '🚀 AI can generate in seconds what used to take days to build.',
    '🎨 Good design increases user trust by up to 75%.',
    '📱 Over 60% of web traffic comes from mobile devices.',
    '⚡ Page load speed directly affects conversion rates.',
    '🌍 There are over 1.9 billion websites on the internet.',
];

interface GenerationProgressProps {
    currentStep: number;
}

export default function GenerationProgress({ currentStep }: GenerationProgressProps) {
    const factIndex = Math.floor(Date.now() / 5000) % funFacts.length;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            {/* Animated Logo */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent-pink to-accent-cyan p-[2px] mb-10"
            >
                <div className="w-full h-full rounded-2xl bg-[var(--bg)] flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-pink"
                    />
                </div>
            </motion.div>

            {/* Steps */}
            <div className="w-full max-w-md space-y-4 mb-10">
                {steps.map((step) => {
                    const status: GenerationStep['status'] =
                        step.id < currentStep
                            ? 'complete'
                            : step.id === currentStep
                                ? 'active'
                                : 'pending';

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: step.id * 0.1 }}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${status === 'complete'
                                    ? 'bg-accent-cyan/10 border border-accent-cyan/20'
                                    : status === 'active'
                                        ? 'bg-primary/10 border border-primary/30'
                                        : 'bg-[var(--surface)] border border-[var(--border)] opacity-50'
                                }`}
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                {status === 'complete' ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center"
                                    >
                                        <Check className="w-4 h-4 text-accent-cyan" />
                                    </motion.div>
                                ) : status === 'active' ? (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[var(--border)] flex items-center justify-center">
                                        <Circle className="w-4 h-4 text-[var(--text-secondary)]" />
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-sm font-medium ${status === 'complete'
                                        ? 'text-accent-cyan'
                                        : status === 'active'
                                            ? 'text-primary'
                                            : 'text-[var(--text-secondary)]'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Fun fact */}
            <motion.p
                key={factIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-[var(--text-secondary)] text-center max-w-md"
            >
                {funFacts[factIndex]}
            </motion.p>
        </div>
    );
}
