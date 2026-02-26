import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold gradient-text">InstaSite AI</span>
                        </Link>
                        <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
                            Describe your dream website and let AI build it for you. Get production-ready
                            code with modern design patterns, responsive layouts, and downloadable files.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Product</h4>
                        <ul className="space-y-2">
                            {['Builder', 'Templates', 'Pricing', 'Docs'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Company</h4>
                        <ul className="space-y-2">
                            {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-accent-pink fill-accent-pink" /> by InstaSite AI
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
