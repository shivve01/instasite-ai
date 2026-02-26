import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import type { GenerateRequest, GeneratedFile } from '../types/index.js';

function detectLanguage(filepath: string): string {
    const ext = filepath.split('.').pop()?.toLowerCase() || '';
    const map: Record<string, string> = {
        ts: 'typescript', tsx: 'typescriptreact',
        js: 'javascript', jsx: 'javascriptreact',
        css: 'css', html: 'html', json: 'json',
        md: 'markdown', svg: 'xml', yml: 'yaml', yaml: 'yaml',
    };
    return map[ext] || 'plaintext';
}

function getFilename(filepath: string): string {
    return filepath.split('/').pop() || filepath;
}

function parseAIOutput(raw: string): { projectName: string; files: GeneratedFile[] } {
    // Strip markdown fences if present
    let cleaned = raw.trim();
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
        cleaned = fenceMatch[1].trim();
    }

    // Try direct parse first
    try {
        const data = JSON.parse(cleaned);
        if (data.files && Array.isArray(data.files)) {
            const files: GeneratedFile[] = data.files
                .filter((f: any) => f && f.path && f.content)
                .map((f: { path: string; content: string }) => ({
                    path: f.path,
                    filename: getFilename(f.path),
                    content: f.content,
                    language: detectLanguage(f.path),
                }));
            return { projectName: data.projectName || 'my-website', files };
        }
    } catch {
        console.warn('Direct JSON parse failed, attempting regex-based recovery...');
    }

    // Regex-based recovery: extract complete file objects from truncated JSON
    const projectNameMatch = cleaned.match(/"projectName"\s*:\s*"([^"]+)"/);
    const projectName = projectNameMatch ? projectNameMatch[1] : 'my-website';

    const files: GeneratedFile[] = [];

    // Find all complete {"path": "...", "content": "..."} objects
    const pathRegex = /"path"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let pathMatch;

    while ((pathMatch = pathRegex.exec(cleaned)) !== null) {
        const pathValue = pathMatch[1];
        const afterPath = cleaned.substring(pathMatch.index + pathMatch[0].length);

        // Look for the "content" field after this path
        const contentStart = afterPath.match(/"content"\s*:\s*"/);
        if (!contentStart || contentStart.index === undefined) continue;

        const contentStartIdx = pathMatch.index + pathMatch[0].length + contentStart.index + contentStart[0].length;

        // Find the end of the content string value (handle escaped quotes)
        let contentEnd = -1;
        let i = contentStartIdx;
        while (i < cleaned.length) {
            if (cleaned[i] === '\\') {
                i += 2; // skip escaped char
                continue;
            }
            if (cleaned[i] === '"') {
                contentEnd = i;
                break;
            }
            i++;
        }

        if (contentEnd === -1) {
            // This content string was truncated — skip it
            console.log(`  Skipping truncated file: ${pathValue}`);
            continue;
        }

        const contentRaw = cleaned.substring(contentStartIdx, contentEnd);
        // Unescape JSON string
        let content: string;
        try {
            content = JSON.parse(`"${contentRaw}"`);
        } catch {
            content = contentRaw
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
        }

        files.push({
            path: pathValue,
            filename: getFilename(pathValue),
            content,
            language: detectLanguage(pathValue),
        });
    }

    if (files.length === 0) {
        throw new Error('AI response could not be parsed. The response may have been empty or in an unexpected format.');
    }

    console.log(`Recovery extracted ${files.length} complete files from truncated response.`);
    return { projectName, files };
}

export async function generateWithOpenAI(config: GenerateRequest): Promise<{ projectName: string; files: GeneratedFile[] }> {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const systemPrompt = buildSystemPrompt(config);

    const completion = await client.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o',
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || '16000', 10),
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: config.prompt },
        ],
        response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content in OpenAI response');

    return parseAIOutput(content);
}

export async function generateWithAnthropic(config: GenerateRequest): Promise<{ projectName: string; files: GeneratedFile[] }> {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const systemPrompt = buildSystemPrompt(config);

    const message = await client.messages.create({
        model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || '16000', 10),
        system: systemPrompt,
        messages: [{ role: 'user', content: config.prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') throw new Error('No text in Anthropic response');

    return parseAIOutput(textBlock.text);
}

export async function generateWithGemini(config: GenerateRequest): Promise<{ projectName: string; files: GeneratedFile[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const systemPrompt = buildSystemPrompt(config);

    // Retry up to 3 times on transient errors
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`Gemini generation attempt ${attempt}/3...`);
            const response = await ai.models.generateContent({
                model: process.env.AI_MODEL || 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: config.prompt }],
                    },
                ],
                config: {
                    systemInstruction: systemPrompt,
                    maxOutputTokens: 65536,
                    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
                    responseMimeType: 'application/json',
                },
            });

            const content = response.text;
            console.log(`Gemini response length: ${content?.length || 0} chars`);
            console.log(`Gemini response preview: ${content?.substring(0, 500)}`);
            console.log(`Gemini finish reason: ${response.candidates?.[0]?.finishReason}`);
            if (!content) throw new Error('No content in Gemini response');

            return parseAIOutput(content);
        } catch (err: unknown) {
            lastError = err;
            const isRetryable = err instanceof Error &&
                (err.message.includes('503') || err.message.includes('UNAVAILABLE') || err.message.includes('high demand'));
            if (isRetryable && attempt < 3) {
                const delay = attempt * 5000;
                console.log(`  Retryable error, waiting ${delay / 1000}s before retry...`);
                await new Promise((r) => setTimeout(r, delay));
                continue;
            }
            throw err;
        }
    }
    throw lastError;
}

export async function generateWebsite(config: GenerateRequest) {
    const provider = process.env.AI_PROVIDER || 'openai';
    if (provider === 'anthropic') {
        return generateWithAnthropic(config);
    }
    if (provider === 'gemini') {
        return generateWithGemini(config);
    }
    return generateWithOpenAI(config);
}
