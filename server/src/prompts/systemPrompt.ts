import type { GenerateRequest } from '../types/index.js';

export function buildSystemPrompt(config: GenerateRequest): string {
  const {
    pages,
    colorScheme,
    fontStyle,
    features,
    outputStack,
  } = config;

  const featureList = features.length > 0 ? features.join(', ') : 'none specified';

  const stackMap: Record<string, string> = {
    'react-tailwind': 'React + TypeScript + Tailwind CSS',
    'nextjs-tailwind': 'Next.js + TypeScript + Tailwind CSS',
    'vanilla': 'HTML + CSS + JavaScript (vanilla, no frameworks)',
    'vue-tailwind': 'Vue 3 + TypeScript + Tailwind CSS',
  };

  const stack = stackMap[outputStack] || stackMap['react-tailwind'];

  return `You are an expert frontend developer. Generate a ${stack} website project based on the user's description.

CRITICAL OUTPUT RULES:
- Return ONLY valid JSON. No markdown, no code fences.
- Keep each file under 150 lines. Be concise but functional.
- Use inline Tailwind classes instead of custom CSS when possible.
- Do NOT use react-router-dom — use simple conditional rendering or hash-based navigation.
- No placeholder comments or "// TODO" — every file must be complete and functional.

JSON STRUCTURE:
{"projectName":"kebab-case-name","files":[{"path":"relative/path","content":"file content"}]}

GENERATE THESE FILES ONLY:
1. package.json — deps: react, react-dom, tailwindcss, vite, @vitejs/plugin-react, autoprefixer, postcss, typescript, @types/react, @types/react-dom
2. vite.config.ts — standard React + Vite config
3. tsconfig.json — standard config
4. tailwind.config.js — content paths, custom colors for ${colorScheme}
5. postcss.config.js — tailwind + autoprefixer
6. index.html — meta tags, title, font import (${fontStyle}), root div, script
7. src/main.tsx — React 18 createRoot
8. src/App.tsx — main component with ALL ${pages} pages inline using state-based navigation, Navbar, and Footer. Put ALL page content directly in this file.
9. src/index.css — @tailwind directives + minimal custom styles

TOTAL: 9 files. Keep it compact.

DESIGN: ${colorScheme} color scheme, ${fontStyle} font, modern clean UI with gradients, hover effects, responsive. Features: ${featureList}. Use https://placehold.co for images.`;
}
