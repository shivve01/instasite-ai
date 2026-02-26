import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className={`${sizeMap[size]} rounded-full border-2 border-[var(--border)] border-t-primary`}
            />
        </div>
    );
}
