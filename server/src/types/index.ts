export interface GenerateRequest {
    prompt: string;
    pages: number;
    colorScheme: string;
    fontStyle: string;
    features: string[];
    outputStack: string;
}

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
    config: GenerateRequest;
    files: GeneratedFile[];
    metadata: ProjectMetadata;
    createdAt: string;
}

export interface RegenerateRequest {
    projectId: string;
    modifiedPrompt?: string;
}
