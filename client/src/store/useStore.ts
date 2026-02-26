import { create } from 'zustand';
import type { Project, GenerationConfig, GenerationStatus, ThemeMode } from '../types';

interface AppState {
    // Theme
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;

    // Current generation
    prompt: string;
    setPrompt: (prompt: string) => void;
    config: GenerationConfig;
    setConfig: (config: Partial<GenerationConfig>) => void;
    resetConfig: () => void;

    // Generation status
    generationStatus: GenerationStatus;
    setGenerationStatus: (status: GenerationStatus) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;

    // Current project (result)
    currentProject: Project | null;
    setCurrentProject: (project: Project | null) => void;
    selectedFile: string | null;
    setSelectedFile: (path: string | null) => void;

    // History
    history: Project[];
    addToHistory: (project: Project) => void;
    removeFromHistory: (projectId: string) => void;
    clearHistory: () => void;

    // Error
    error: string | null;
    setError: (error: string | null) => void;
}

const defaultConfig: GenerationConfig = {
    prompt: '',
    pages: 4,
    colorScheme: 'blue-purple',
    fontStyle: 'modern',
    features: ['responsive', 'darkMode', 'animations', 'seoMetaTags'],
    outputStack: 'react-tailwind',
};

export const useStore = create<AppState>((set) => ({
    // Theme
    theme: 'dark',
    setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
    },
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.classList.toggle('dark', next === 'dark');
            return { theme: next };
        }),

    // Prompt
    prompt: '',
    setPrompt: (prompt) => set({ prompt }),

    // Config
    config: defaultConfig,
    setConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
    resetConfig: () => set({ config: defaultConfig }),

    // Generation
    generationStatus: 'idle',
    setGenerationStatus: (generationStatus) => set({ generationStatus }),
    currentStep: 0,
    setCurrentStep: (currentStep) => set({ currentStep }),

    // Project
    currentProject: null,
    setCurrentProject: (currentProject) => set({ currentProject }),
    selectedFile: null,
    setSelectedFile: (selectedFile) => set({ selectedFile }),

    // History
    history: JSON.parse(localStorage.getItem('instasite-history') || '[]'),
    addToHistory: (project) =>
        set((state) => {
            const history = [project, ...state.history.filter((p) => p.projectId !== project.projectId)].slice(0, 50);
            localStorage.setItem('instasite-history', JSON.stringify(history));
            return { history };
        }),
    removeFromHistory: (projectId) =>
        set((state) => {
            const history = state.history.filter((p) => p.projectId !== projectId);
            localStorage.setItem('instasite-history', JSON.stringify(history));
            return { history };
        }),
    clearHistory: () => {
        localStorage.removeItem('instasite-history');
        set({ history: [] });
    },

    // Error
    error: null,
    setError: (error) => set({ error }),
}));
