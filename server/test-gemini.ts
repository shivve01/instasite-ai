import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';

async function test() {
    console.log('API Key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
    console.log('Model:', process.env.AI_MODEL || 'gemini-2.5-flash');

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const systemPrompt = `You are a frontend developer. Generate a simple React website.
Return a valid JSON object with this structure:
{
  "projectName": "my-portfolio",
  "files": [
    { "path": "src/App.tsx", "content": "file content here" }
  ]
}
Generate only 2 files: package.json and src/App.tsx. Keep the content SHORT.
Return ONLY the JSON object, no markdown.`;

    try {
        console.log('\nCalling Gemini API...');
        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL || 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: 'Create a simple hello world React app' }] }],
            config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: 4096,
                temperature: 0.7,
                responseMimeType: 'application/json',
            },
        });

        console.log('\n=== Response Info ===');
        console.log('Finish reason:', response.candidates?.[0]?.finishReason);
        console.log('Content parts:', response.candidates?.[0]?.content?.parts?.length);

        const text = response.text;
        console.log('Text length:', text?.length || 0);
        console.log('\n=== Raw Text (first 1000 chars) ===');
        console.log(text?.substring(0, 1000));

        // Save full response to file
        writeFileSync('gemini_raw_response.json', text || 'EMPTY');
        console.log('\nFull response saved to gemini_raw_response.json');

        // Try parsing
        if (text) {
            try {
                const parsed = JSON.parse(text);
                console.log('\n=== Parse SUCCESS ===');
                console.log('Project name:', parsed.projectName);
                console.log('Files:', parsed.files?.length);
                parsed.files?.forEach((f: any) => console.log('  -', f.path));
            } catch (e) {
                console.log('\n=== Parse FAILED ===');
                console.log('Error:', (e as Error).message);
            }
        }
    } catch (err) {
        console.error('\n=== API ERROR ===');
        console.error(err);
    }
}

test();
