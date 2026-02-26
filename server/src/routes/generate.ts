import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import archiver from 'archiver';
import { generateWebsite } from '../services/aiService.js';
import { validate, generateSchema, regenerateSchema } from '../middleware/validator.js';
import type { Project, GenerateRequest } from '../types/index.js';

const router = Router();

// In-memory store (production would use a database)
const projects = new Map<string, Project>();

// POST /api/generate
router.post('/generate', validate(generateSchema), async (req: Request, res: Response) => {
    try {
        const config = req.body as GenerateRequest;
        const { projectName, files } = await generateWebsite(config);

        const totalLines = files.reduce((acc, f) => acc + f.content.split('\n').length, 0);

        const project: Project = {
            projectId: uuidv4(),
            projectName,
            prompt: config.prompt,
            config,
            files,
            metadata: {
                totalFiles: files.length,
                totalLines,
                generatedAt: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
        };

        projects.set(project.projectId, project);

        res.json(project);
    } catch (err: unknown) {
        console.error('Generation error:', err);
        const message = err instanceof Error ? err.message : 'Generation failed';
        res.status(500).json({ error: message });
    }
});

// POST /api/regenerate
router.post('/regenerate', validate(regenerateSchema), async (req: Request, res: Response) => {
    try {
        const { projectId, modifiedPrompt } = req.body;
        const existing = projects.get(projectId);

        if (!existing) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        const config: GenerateRequest = {
            ...existing.config,
            prompt: modifiedPrompt || existing.prompt,
        };

        const { projectName, files } = await generateWebsite(config);
        const totalLines = files.reduce((acc, f) => acc + f.content.split('\n').length, 0);

        const project: Project = {
            projectId: uuidv4(),
            projectName,
            prompt: config.prompt,
            config,
            files,
            metadata: {
                totalFiles: files.length,
                totalLines,
                generatedAt: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
        };

        projects.set(project.projectId, project);

        res.json(project);
    } catch (err: unknown) {
        console.error('Regeneration error:', err);
        const message = err instanceof Error ? err.message : 'Regeneration failed';
        res.status(500).json({ error: message });
    }
});

// GET /api/projects
router.get('/projects', (_req: Request, res: Response) => {
    const list = Array.from(projects.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
});

// GET /api/projects/:id
router.get('/projects/:id', (req: Request, res: Response) => {
    const project = projects.get(req.params.id);
    if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
    }
    res.json(project);
});

// POST /api/download/:id — Stream a real ZIP file using archiver
router.post('/download/:id', async (req: Request, res: Response) => {
    const project = projects.get(req.params.id);
    if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
    }

    // Set proper headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.attachment(`${project.projectName}.zip`);

    // Create ZIP archive with max compression
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Pipe archive data to the response
    archive.pipe(res);

    // Add each file to the archive with proper folder structure
    for (const file of project.files) {
        archive.append(file.content, { name: `${project.projectName}/${file.path}` });
    }

    // Finalize the archive (triggers stream end)
    await archive.finalize();
});

export default router;

