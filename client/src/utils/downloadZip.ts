import type { GeneratedFile } from '../types';

/**
 * Download project as a ZIP file.
 * Uses the server-side /api/download/:id endpoint which streams
 * a proper binary ZIP using archiver with correct HTTP headers.
 */
export async function downloadAsZip(
    files: GeneratedFile[],
    projectName: string = 'my-website',
    projectId?: string
): Promise<void> {
    const filename = `${projectName}.zip`;

    // Use server-side endpoint for proper binary ZIP
    if (projectId) {
        try {
            const apiBase = 'http://localhost:3001/api';
            const response = await fetch(`${apiBase}/download/${projectId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const blob = await response.blob();

            // Trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 5000);
            return;
        } catch (err) {
            console.error('Server download failed:', err);
        }
    }

    // Fallback: download all files as plain text
    const allContent = files
        .map((f) => `// ========== ${f.path} ==========\n${f.content}`)
        .join('\n\n');
    const blob = new Blob([allContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-all-files.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 5000);
}
