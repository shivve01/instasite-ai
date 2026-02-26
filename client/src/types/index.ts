// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Generated File
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface GeneratedFile {
    path: string;
    filename: string;
    content: string;
    language: string;
}

export interface ProjectMetadata {
    totalFiles: number;
    totalLines: number;
    generatedAt: string;
}

export interface Project {
    projectId: string;
    projectName: string;
    prompt: string;
    config: GenerationConfig;
    files: GeneratedFile[];
    metadata: ProjectMetadata;
    createdAt: string;
}

export interface GenerationConfig {
    prompt: string;
    pages: number;
    colorScheme: string;
    fontStyle: string;
    features: string[];
    outputStack: string;
}

export type GenerationStatus = 'idle' | 'configuring' | 'generating' | 'complete' | 'error';

export interface GenerationStep {
    id: number;
    label: string;
    status: 'pending' | 'active' | 'complete';
}

export type ThemeMode = 'dark' | 'light';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface ColorPalette {
    name: string;
    colors: string[];
    value: string;
}

export interface TemplateCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    prompt: string;
}

export interface FontOption {
    label: string;
    value: string;
}

export interface FeatureOption {
    id: string;
    label: string;
    defaultChecked: boolean;
}

// File tree node for FileExplorer
export interface FileTreeNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FileTreeNode[];
    language?: string;
}
