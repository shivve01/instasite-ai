import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="relative p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors duration-200"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {isDark ? (
                    <Moon className="w-4 h-4 text-primary" />
                ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                )}
            </motion.div>
        </motion.button>
    );
}
