import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeViewerProps {
    code: string;
    language: string;
    filename: string;
}

const languageMap: Record<string, string> = {
    typescript: 'typescript',
    typescriptreact: 'tsx',
    javascript: 'javascript',
    javascriptreact: 'jsx',
    css: 'css',
    html: 'html',
    json: 'json',
    markdown: 'markdown',
    xml: 'xml',
    yaml: 'yaml',
    plaintext: 'text',
};

export default function CodeViewer({ code, language, filename }: CodeViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lineCount = code.split('\n').length;
    const sizeKB = (new TextEncoder().encode(code).length / 1024).toFixed(1);
    const lang = languageMap[language] || 'text';

    return (
        <div className="h-full flex flex-col bg-[var(--code-bg)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{filename}</span>
                    <span className="text-xs text-[var(--text-secondary)] px-2 py-0.5 bg-[var(--surface-hover)] rounded-md">
                        {lang}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-secondary)]">
                        {lineCount} lines · {sizeKB} KB
                    </span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--surface-hover)] hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-accent-cyan" />
                                <span className="text-accent-cyan">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Code */}
            <div className="flex-1 overflow-auto">
                <SyntaxHighlighter
                    language={lang}
                    style={oneDark}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                        margin: 0,
                        padding: '16px',
                        background: 'transparent',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        minHeight: '100%',
                    }}
                    lineNumberStyle={{
                        minWidth: '3em',
                        paddingRight: '1em',
                        color: 'rgba(160, 160, 176, 0.4)',
                        userSelect: 'none',
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
