import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    // Hide footer on results page for full-height editor
    const hideFooter = location.pathname === '/results';

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg)]">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            {!hideFooter && <Footer />}
        </div>
    );
}
