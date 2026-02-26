import { useCallback, useState } from 'react';
import { getProject } from '../services/api';
import { useStore } from '../store/useStore';

export function useProject() {
    const setCurrentProject = useStore((s) => s.setCurrentProject);
    const setSelectedFile = useStore((s) => s.setSelectedFile);
    const [loading, setLoading] = useState(false);

    const loadProject = useCallback(
        async (id: string) => {
            setLoading(true);
            try {
                const project = await getProject(id);
                setCurrentProject(project);
                if (project.files.length > 0) {
                    setSelectedFile(project.files[0].path);
                }
            } finally {
                setLoading(false);
            }
        },
        [setCurrentProject, setSelectedFile]
    );

    return { loadProject, loading };
}
