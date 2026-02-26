import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';
import type { GeneratedFile, DeviceType } from '../../types';

const deviceWidths: Record<DeviceType, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

interface LivePreviewProps {
  files: GeneratedFile[];
}

/**
 * Build a design-accurate preview by extracting design tokens (colors, fonts,
 * section headings, images) from the generated files and rendering them in a
 * polished static HTML page — no attempt to interpret React logic.
 */
function buildPreviewHTML(files: GeneratedFile[]): string {
  const htmlFile = files.find((f) => f.filename === 'index.html');
  const cssFiles = files.filter((f) => f.filename.endsWith('.css'));
  const appFile = files.find((f) => f.filename === 'App.tsx' || f.filename === 'App.jsx');
  const tailwindFile = files.find((f) => f.filename === 'tailwind.config.js');

  // --- Extract design tokens ---

  // Font from index.html
  let fontLink = '';
  let fontFamily = "'Inter', system-ui, sans-serif";
  if (htmlFile) {
    const fontLinkMatch = htmlFile.content.match(/<link[^>]*fonts\.googleapis\.com[^>]*>/);
    if (fontLinkMatch) fontLink = fontLinkMatch[0];
    const familyMatch = htmlFile.content.match(/family=([^&"]+)/);
    if (familyMatch) {
      fontFamily = `'${familyMatch[1].replace(/\+/g, ' ').split(':')[0]}', system-ui, sans-serif`;
    }
  }

  // Colors from tailwind.config.js
  const colors: Record<string, string> = {};
  if (tailwindFile) {
    const colorsBlock = tailwindFile.content.match(/colors\s*:\s*\{([\s\S]*?)\}/);
    if (colorsBlock) {
      const colorRegex = /(\w+)\s*:\s*['"]([#\w]+)['"]/g;
      let m;
      while ((m = colorRegex.exec(colorsBlock[1])) !== null) {
        colors[m[1]] = m[2];
      }
    }
  }
  const primary = colors.primary || colors.main || '#6c63ff';
  const secondary = colors.secondary || colors.accent || '#f72585';
  const accent = colors.accent || secondary;
  const bgDark = colors.dark || colors.background || '#0f0f1a';

  // Title from index.html
  let siteTitle = 'My Website';
  if (htmlFile) {
    const titleMatch = htmlFile.content.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) siteTitle = titleMatch[1].split('|')[0].trim();
  }

  // Extract text content from App.tsx (headings, descriptions, and images)
  const headings: string[] = [];
  const descriptions: string[] = [];
  const images: string[] = [];
  const navItems: string[] = [];

  if (appFile) {
    const content = appFile.content;

    // Find string literals that look like headings (inside JSX text content)
    const h1Matches = content.match(/<h1[^>]*>([^<]+)</g) || [];
    h1Matches.forEach((m) => {
      const text = m.replace(/<h1[^>]*>/, '').replace(/<$/, '').trim();
      if (text && text.length > 2 && !text.includes('{')) headings.push(text);
    });
    const h2Matches = content.match(/<h2[^>]*>([^<]+)</g) || [];
    h2Matches.forEach((m) => {
      const text = m.replace(/<h2[^>]*>/, '').replace(/<$/, '').trim();
      if (text && text.length > 2 && !text.includes('{')) headings.push(text);
    });

    // Descriptions from <p> tags
    const pMatches = content.match(/<p[^>]*>([^<]{20,})</g) || [];
    pMatches.forEach((m) => {
      const text = m.replace(/<p[^>]*>/, '').replace(/<$/, '').trim();
      if (text && !text.includes('{') && !text.includes('className')) descriptions.push(text);
    });

    // Images
    const imgMatches = content.match(/src="(https?:\/\/[^"]+)"/g) || [];
    imgMatches.forEach((m) => {
      const url = m.replace('src="', '').replace('"', '');
      images.push(url);
    });

    // Nav items (button/link text for navigation)
    const navMatch = content.match(/['"]home['"]|['"]about['"]|['"]contact['"]|['"]projects['"]|['"]services['"]|['"]portfolio['"]|['"]blog['"]|['"]menu['"]|['"]gallery['"]|['"]team['"]|['"]pricing['"]|['"]testimonials['"]|['"]faq['"]/gi) || [];
    navMatch.forEach((m) => {
      const item = m.replace(/['"]/g, '');
      const capitalized = item.charAt(0).toUpperCase() + item.slice(1);
      if (!navItems.includes(capitalized)) navItems.push(capitalized);
    });
  }

  // Tailwind CDN config
  let tailwindConfigScript = '';
  const colorEntries = Object.entries(colors).map(([k, v]) => `'${k}': '${v}'`).join(', ');
  if (colorEntries) {
    tailwindConfigScript = `<script>
            tailwind.config = {
                theme: { extend: { colors: { ${colorEntries} } } }
            }
        </` + `script>`;
  }

  // CSS (strip Tailwind directives)
  const cssContent = cssFiles
    .map((f) => f.content.replace(/@tailwind\s+\w+;/g, '').replace(/@import\s+.*?;/g, ''))
    .join('\n');

  // Build a beautiful static preview using extracted data
  const heroHeading = headings[0] || siteTitle;
  const heroDesc = descriptions[0] || 'A beautifully crafted website built with modern technologies.';
  const sectionHeadings = headings.slice(1, 5);
  const heroImage = images[0] || `https://placehold.co/600x400/${primary.replace('#', '')}/${secondary.replace('#', '')}/png?text=${encodeURIComponent(siteTitle)}`;

  const navHTML = navItems.length > 0
    ? navItems.map((n) => `<span class="text-sm opacity-80 hover:opacity-100 cursor-pointer transition-opacity">${n}</span>`).join('')
    : '<span class="text-sm opacity-80">Home</span><span class="text-sm opacity-80">About</span><span class="text-sm opacity-80">Contact</span>';

  const sectionsHTML = sectionHeadings.map((heading, i) => {
    const desc = descriptions[i + 1] || '';
    const img = images[i + 1] || '';
    return `
        <section class="py-16 px-6 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-4" style="color: ${primary}">${heading}</h2>
                ${desc ? `<p class="text-gray-600 text-lg max-w-2xl mx-auto mb-8">${desc}</p>` : ''}
                ${img ? `<img src="${img}" alt="${heading}" class="rounded-xl shadow-lg mx-auto max-w-md w-full" />` : ''}
            </div>
        </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    ${fontLink}
    <script src="https://cdn.tailwindcss.com"></` + `script>
    ${tailwindConfigScript}
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${fontFamily}; min-height: 100vh; }
        ${cssContent}
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="flex items-center justify-between px-6 py-4" style="background: ${primary}; color: white;">
        <span class="text-lg font-bold">${siteTitle}</span>
        <div class="flex items-center gap-6">
            ${navHTML}
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 px-6 text-white text-center" style="background: linear-gradient(135deg, ${primary}, ${secondary});">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">${heroHeading}</h1>
            <p class="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">${heroDesc}</p>
            <button class="bg-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all" style="color: ${primary};">
                Get Started
            </button>
        </div>
        ${heroImage ? `<div class="mt-12 flex justify-center"><img src="${heroImage}" alt="Hero" class="rounded-xl shadow-2xl max-w-md w-full" /></div>` : ''}
    </section>

    <!-- Content Sections -->
    ${sectionsHTML}

    <!-- Footer -->
    <footer class="py-8 px-6 text-white text-center text-sm" style="background: ${bgDark};">
        <p>&copy; ${new Date().getFullYear()} ${siteTitle}. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

export default function LivePreview({ files }: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewHTML = useMemo(() => buildPreviewHTML(files), [files]);
  const blob = useMemo(() => {
    const b = new Blob([previewHTML], { type: 'text/html' });
    return URL.createObjectURL(b);
  }, [previewHTML]);

  const devices: { type: DeviceType; icon: React.ReactNode; label: string }[] = [
    { type: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
    { type: 'tablet', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
    { type: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
  ];

  const openInNewTab = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(previewHTML);
      win.document.close();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-1">
          {devices.map((d) => (
            <button
              key={d.type}
              onClick={() => setDevice(d.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${device === d.type
                ? 'bg-primary/15 text-primary'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                }`}
            >
              {d.icon}
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openInNewTab}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-start justify-center p-4 bg-[#0d0d14] overflow-auto">
        <div
          className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            width: deviceWidths[device],
            maxWidth: '100%',
            height: device === 'desktop' ? '100%' : '85vh',
          }}
        >
          <iframe
            ref={iframeRef}
            key={key}
            src={blob}
            title="Live Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
