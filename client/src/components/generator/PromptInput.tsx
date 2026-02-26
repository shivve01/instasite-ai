import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    maxLength?: number;
}

export default function PromptInput({
    value,
    onChange,
    onSubmit,
    placeholder = 'Describe your dream website... e.g. "A modern portfolio for a photographer with gallery, about, and contact pages"',
    maxLength = 2000,
}: PromptInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (value.trim()) onSubmit();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-3xl mx-auto"
        >
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent-pink to-accent-cyan rounded-2xl opacity-30 group-hover:opacity-50 blur transition-opacity duration-500" />
                <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        rows={3}
                        className="w-full px-6 py-5 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none outline-none text-base leading-relaxed"
                    />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
                        <span className="text-xs text-[var(--text-secondary)]">
                            {value.length}/{maxLength} · Press Ctrl+Enter to submit
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onSubmit}
                            disabled={!value.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/30"
                        >
                            <Sparkles className="w-4 h-4" />
                            Generate
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
