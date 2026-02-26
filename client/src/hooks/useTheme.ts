import { useCallback } from 'react';
import { useStore } from '../store/useStore';

export function useTheme() {
    const theme = useStore((s) => s.theme);
    const toggleTheme = useStore((s) => s.toggleTheme);

    const isDark = theme === 'dark';

    const initTheme = useCallback(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return { theme, isDark, toggleTheme, initTheme };
}
