import { motion } from 'framer-motion';
import {
    User,
    ShoppingCart,
    Rocket,
    UtensilsCrossed,
    FileText,
    LayoutDashboard,
} from 'lucide-react';
import type { TemplateCard } from '../../types';

const templates: TemplateCard[] = [
    {
        id: 'portfolio',
        title: 'Portfolio Website',
        description: 'Showcase your work with a stunning gallery, about page, and contact form.',
        icon: 'user',
        prompt:
            'Create a modern portfolio website for a creative professional with a hero section, project gallery with filtering, about page with skills section, and a contact page with form.',
    },
    {
        id: 'ecommerce',
        title: 'E-commerce Store',
        description: 'A product showcase with categories, cart UI, and checkout design.',
        icon: 'cart',
        prompt:
            'Build a modern e-commerce store with a hero banner, featured products grid, product categories, individual product page layout, shopping cart sidebar, and a contact page.',
    },
    {
        id: 'saas',
        title: 'SaaS Landing Page',
        description: 'Convert visitors with features, pricing tables, and testimonials.',
        icon: 'rocket',
        prompt:
            'Create a SaaS landing page with an attention-grabbing hero, feature highlights with icons, pricing table with 3 tiers, testimonials carousel, FAQ section, and a CTA footer.',
    },
    {
        id: 'restaurant',
        title: 'Restaurant Website',
        description: 'Display your menu, hours, location, and reservation form.',
        icon: 'utensils',
        prompt:
            'Build a restaurant website with a beautiful hero image, menu section organized by category, about the chef section, gallery of dishes, reservation form, and location map placeholder.',
    },
    {
        id: 'blog',
        title: 'Blog / News Site',
        description: 'A clean reading experience with article cards and categories.',
        icon: 'file',
        prompt:
            'Create a blog/news website with a featured article hero, article grid with thumbnails, category filtering sidebar, individual article page layout, author bio section, and newsletter signup.',
    },
    {
        id: 'dashboard',
        title: 'Dashboard / Admin Panel',
        description: 'Data-rich interface with charts, tables, and navigation sidebar.',
        icon: 'dashboard',
        prompt:
            'Build an admin dashboard with a sidebar navigation, top stats cards, charts/graphs section, data table with sorting, user profile page, and settings page.',
    },
];

const iconMap: Record<string, React.ReactNode> = {
    user: <User className="w-6 h-6" />,
    cart: <ShoppingCart className="w-6 h-6" />,
    rocket: <Rocket className="w-6 h-6" />,
    utensils: <UtensilsCrossed className="w-6 h-6" />,
    file: <FileText className="w-6 h-6" />,
    dashboard: <LayoutDashboard className="w-6 h-6" />,
};

interface TemplateCardsProps {
    onSelect: (prompt: string) => void;
}

export default function TemplateCards({ onSelect }: TemplateCardsProps) {
    return (
        <div className="w-full max-w-5xl mx-auto mt-12">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-6">
                Or start with a template
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((t, i) => (
                    <motion.button
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(t.prompt)}
                        className="group p-5 text-left bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                            {iconMap[t.icon]}
                        </div>
                        <h4 className="font-semibold text-sm mb-1 text-[var(--text-primary)]">{t.title}</h4>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.description}</p>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
