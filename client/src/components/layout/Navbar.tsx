import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, History, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';

const navLinks = [
    { to: '/', label: 'Builder' },
    { to: '/history', label: 'My Projects' },
];

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-shadow duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:inline">
                            InstaSite AI
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const active = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${active
                                            ? 'text-primary'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {link.label}
                                    {active && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-[var(--border)]"
                >
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {link.to === '/history' ? (
                                        <History className="w-4 h-4" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
