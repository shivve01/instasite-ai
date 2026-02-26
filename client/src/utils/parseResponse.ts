import type { GeneratedFile } from '../types';

interface AIResponse {
    projectName?: string;
    files?: Array<{
        path: string;
        content: string;
    }>;
}

/**
 * Detect programming language from file extension.
 */
function detectLanguage(filepath: string): string {
    const ext = filepath.split('.').pop()?.toLowerCase() || '';
    const map: Record<string, string> = {
        ts: 'typescript',
        tsx: 'typescriptreact',
        js: 'javascript',
        jsx: 'javascriptreact',
        css: 'css',
        html: 'html',
        json: 'json',
        md: 'markdown',
        svg: 'xml',
        yml: 'yaml',
        yaml: 'yaml',
    };
    return map[ext] || 'plaintext';
}

/**
 * Extract filename from a path.
 */
function getFilename(filepath: string): string {
    return filepath.split('/').pop() || filepath;
}

/**
 * Parse and validate the AI-generated response into GeneratedFile[].
 */
export function parseAIResponse(raw: unknown): {
    projectName: string;
    files: GeneratedFile[];
} {
    let data: AIResponse;

    if (typeof raw === 'string') {
        // Try to extract JSON from markdown code fences
        const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
        const toParse = jsonMatch ? jsonMatch[1] : raw;
        data = JSON.parse(toParse);
    } else {
        data = raw as AIResponse;
    }

    if (!data.files || !Array.isArray(data.files)) {
        throw new Error('Invalid AI response: missing "files" array');
    }

    const files: GeneratedFile[] = data.files.map((f) => ({
        path: f.path,
        filename: getFilename(f.path),
        content: f.content,
        language: detectLanguage(f.path),
    }));

    return {
        projectName: data.projectName || 'my-website',
        files,
    };
}
