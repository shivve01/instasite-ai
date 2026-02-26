import { useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';
import { generateWebsite } from '../services/api';
import type { GenerationConfig } from '../types';

export function useGenerate() {
    const setGenerationStatus = useStore((s) => s.setGenerationStatus);
    const setCurrentProject = useStore((s) => s.setCurrentProject);
    const setCurrentStep = useStore((s) => s.setCurrentStep);
    const setError = useStore((s) => s.setError);
    const addToHistory = useStore((s) => s.addToHistory);
    const abortRef = useRef<AbortController | null>(null);

    const generate = useCallback(
        async (config: GenerationConfig) => {
            abortRef.current?.abort();
            const abort = new AbortController();
            abortRef.current = abort;

            try {
                setError(null);
                setGenerationStatus('generating');
                setCurrentStep(0);

                // Simulate progress steps while waiting
                const stepTimers: ReturnType<typeof setTimeout>[] = [];
                for (let i = 1; i <= 4; i++) {
                    stepTimers.push(
                        setTimeout(() => {
                            if (!abort.signal.aborted) setCurrentStep(i);
                        }, i * 3000)
                    );
                }

                const project = await generateWebsite(config);

                stepTimers.forEach(clearTimeout);
                setCurrentStep(5);
                setCurrentProject(project);
                addToHistory(project);
                setGenerationStatus('complete');

                return project;
            } catch (err: unknown) {
                if (abort.signal.aborted) return;
                const message =
                    err instanceof Error ? err.message : 'Generation failed. Please try again.';
                setError(message);
                setGenerationStatus('error');
                throw err;
            }
        },
        [setGenerationStatus, setCurrentProject, setCurrentStep, setError, addToHistory]
    );

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setGenerationStatus('idle');
        setCurrentStep(0);
    }, [setGenerationStatus, setCurrentStep]);

    return { generate, cancel };
}
