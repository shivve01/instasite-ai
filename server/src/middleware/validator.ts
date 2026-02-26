import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const generateSchema = z.object({
    prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(2000),
    pages: z.number().int().min(3).max(5).default(4),
    colorScheme: z.string().default('blue-purple'),
    fontStyle: z.string().default('modern'),
    features: z.array(z.string()).default(['responsive', 'darkMode', 'animations', 'seoMetaTags']),
    outputStack: z.string().default('react-tailwind'),
});

export const regenerateSchema = z.object({
    projectId: z.string().uuid(),
    modifiedPrompt: z.string().max(2000).optional(),
});

export function validate(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues.map((i) => ({
                    field: i.path.join('.'),
                    message: i.message,
                })),
            });
            return;
        }
        req.body = result.data;
        next();
    };
}
