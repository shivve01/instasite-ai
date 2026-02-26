import { motion } from 'framer-motion';
import { Palette, Type, Layers, Settings2, Wand2 } from 'lucide-react';
import Button from '../common/Button';
import type { GenerationConfig, ColorPalette, FontOption, FeatureOption } from '../../types';

const colorPalettes: ColorPalette[] = [
    { name: 'Blue Purple', colors: ['#6c63ff', '#8b83ff', '#a78bfa'], value: 'blue-purple' },
    { name: 'Sunset', colors: ['#f72585', '#ff6b6b', '#ffa502'], value: 'sunset' },
    { name: 'Ocean', colors: ['#0077b6', '#00b4d8', '#90e0ef'], value: 'ocean' },
    { name: 'Forest', colors: ['#2d6a4f', '#40916c', '#95d5b2'], value: 'forest' },
    { name: 'Midnight', colors: ['#1a1a2e', '#16213e', '#0f3460'], value: 'midnight' },
    { name: 'Rose Gold', colors: ['#b76e79', '#e8c4c8', '#f4e4e6'], value: 'rose-gold' },
];

const fontOptions: FontOption[] = [
    { label: 'Modern', value: 'modern' },
    { label: 'Classic', value: 'classic' },
    { label: 'Playful', value: 'playful' },
    { label: 'Minimal', value: 'minimal' },
];

const featureOptions: FeatureOption[] = [
    { id: 'responsive', label: 'Responsive Design', defaultChecked: true },
    { id: 'darkMode', label: 'Dark Mode', defaultChecked: true },
    { id: 'animations', label: 'Animations', defaultChecked: true },
    { id: 'contactForm', label: 'Contact Form', defaultChecked: false },
    { id: 'imagePlaceholders', label: 'Image Placeholders', defaultChecked: false },
    { id: 'seoMetaTags', label: 'SEO Meta Tags', defaultChecked: true },
];

const stackOptions = [
    { label: 'React + Tailwind', value: 'react-tailwind' },
    { label: 'Next.js + Tailwind', value: 'nextjs-tailwind' },
    { label: 'HTML + CSS + JS', value: 'vanilla' },
    { label: 'Vue + Tailwind', value: 'vue-tailwind' },
];

interface ConfigPanelProps {
    config: GenerationConfig;
    onConfigChange: (partial: Partial<GenerationConfig>) => void;
    onGenerate: () => void;
    loading?: boolean;
}

export default function ConfigPanel({ config, onConfigChange, onGenerate, loading }: ConfigPanelProps) {
    const toggleFeature = (featureId: string) => {
        const features = config.features.includes(featureId)
            ? config.features.filter((f) => f !== featureId)
            : [...config.features, featureId];
        onConfigChange({ features });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            {/* Page Count */}
            <section>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Layers className="w-4 h-4 text-primary" />
                    Number of Pages: <span className="text-primary">{config.pages}</span>
                </label>
                <input
                    type="range"
                    min={3}
                    max={5}
                    value={config.pages}
                    onChange={(e) => onConfigChange({ pages: Number(e.target.value) })}
                    className="w-full accent-primary h-2 rounded-lg appearance-none bg-[var(--border)] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                    <span>3 pages</span>
                    <span>5 pages</span>
                </div>
            </section>

            {/* Color Scheme */}
            <section>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Palette className="w-4 h-4 text-primary" />
                    Color Scheme
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {colorPalettes.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => onConfigChange({ colorScheme: p.value })}
                            className={`p-3 rounded-xl border transition-all duration-200 ${config.colorScheme === p.value
                                    ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                                    : 'border-[var(--border)] hover:border-primary/30'
                                }`}
                        >
                            <div className="flex gap-1 mb-2">
                                {p.colors.map((c) => (
                                    <div
                                        key={c}
                                        className="w-5 h-5 rounded-full"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-medium">{p.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Font Style */}
            <section>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Type className="w-4 h-4 text-primary" />
                    Font Style
                </label>
                <div className="flex flex-wrap gap-2">
                    {fontOptions.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => onConfigChange({ fontStyle: f.value })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${config.fontStyle === f.value
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-[var(--surface)] border border-[var(--border)] hover:border-primary/30 text-[var(--text-secondary)]'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Settings2 className="w-4 h-4 text-primary" />
                    Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {featureOptions.map((f) => (
                        <label
                            key={f.id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${config.features.includes(f.id)
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'bg-[var(--surface)] border border-[var(--border)] hover:border-primary/20'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={config.features.includes(f.id)}
                                onChange={() => toggleFeature(f.id)}
                                className="w-4 h-4 accent-primary rounded"
                            />
                            <span className="text-sm">{f.label}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Output Stack */}
            <section>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Layers className="w-4 h-4 text-primary" />
                    Output Tech Stack
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {stackOptions.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => onConfigChange({ outputStack: s.value })}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${config.outputStack === s.value
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-[var(--surface)] border border-[var(--border)] hover:border-primary/30 text-[var(--text-secondary)]'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Generate Button */}
            <Button
                onClick={onGenerate}
                loading={loading}
                icon={<Wand2 className="w-4 h-4" />}
                size="lg"
                className="w-full"
            >
                Generate Now
            </Button>
        </motion.div>
    );
}
