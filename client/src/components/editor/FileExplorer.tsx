import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronDown,
    File,
    Folder,
    FolderOpen,
    FileCode,
    FileJson,
    FileText,
    FileType,
    Image,
} from 'lucide-react';
import type { GeneratedFile, FileTreeNode } from '../../types';

/**
 * Build a tree structure from flat file paths.
 */
function buildFileTree(files: GeneratedFile[]): FileTreeNode[] {
    const root: FileTreeNode[] = [];

    for (const file of files) {
        const parts = file.path.split('/');
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const name = parts[i];
            const isFile = i === parts.length - 1;
            const existing = current.find((n) => n.name === name);

            if (existing) {
                current = existing.children || [];
            } else {
                const node: FileTreeNode = {
                    name,
                    path: parts.slice(0, i + 1).join('/'),
                    type: isFile ? 'file' : 'folder',
                    language: isFile ? file.language : undefined,
                    children: isFile ? undefined : [],
                };
                current.push(node);
                if (!isFile) current = node.children!;
            }
        }
    }

    // Sort: folders first, then files, alphabetically
    const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
        return nodes
            .map((n) => ({
                ...n,
                children: n.children ? sortNodes(n.children) : undefined,
            }))
            .sort((a, b) => {
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
    };

    return sortNodes(root);
}

function getFileIcon(filename: string) {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'tsx':
        case 'ts':
        case 'jsx':
        case 'js':
            return <FileCode className="w-4 h-4 text-blue-400" />;
        case 'json':
            return <FileJson className="w-4 h-4 text-yellow-400" />;
        case 'css':
            return <FileType className="w-4 h-4 text-purple-400" />;
        case 'html':
            return <FileCode className="w-4 h-4 text-orange-400" />;
        case 'md':
            return <FileText className="w-4 h-4 text-gray-400" />;
        case 'svg':
        case 'png':
        case 'jpg':
            return <Image className="w-4 h-4 text-green-400" />;
        default:
            return <File className="w-4 h-4 text-[var(--text-secondary)]" />;
    }
}

interface TreeNodeProps {
    node: FileTreeNode;
    selectedFile: string | null;
    onSelect: (path: string) => void;
    depth: number;
}

function TreeNode({ node, selectedFile, onSelect, depth }: TreeNodeProps) {
    const [expanded, setExpanded] = useState(depth < 2);

    if (node.type === 'file') {
        const isSelected = selectedFile === node.path;
        return (
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(node.path)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded-lg transition-all duration-150 ${isSelected
                        ? 'bg-primary/15 text-primary font-medium'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                    }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
                {getFileIcon(node.name)}
                <span className="truncate">{node.name}</span>
            </motion.button>
        );
    }

    return (
        <div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
                {expanded ? (
                    <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {expanded ? (
                    <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                    <Folder className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className="truncate font-medium">{node.name}</span>
            </button>
            <AnimatePresence>
                {expanded && node.children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {node.children.map((child) => (
                            <TreeNode
                                key={child.path}
                                node={child}
                                selectedFile={selectedFile}
                                onSelect={onSelect}
                                depth={depth + 1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface FileExplorerProps {
    files: GeneratedFile[];
    selectedFile: string | null;
    onSelect: (path: string) => void;
}

export default function FileExplorer({ files, selectedFile, onSelect }: FileExplorerProps) {
    const tree = useMemo(() => buildFileTree(files), [files]);

    return (
        <div className="h-full overflow-y-auto py-2 px-1">
            <div className="px-3 py-2 mb-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Files ({files.length})
                </h3>
            </div>
            {tree.map((node) => (
                <TreeNode
                    key={node.path}
                    node={node}
                    selectedFile={selectedFile}
                    onSelect={onSelect}
                    depth={0}
                />
            ))}
        </div>
    );
}
