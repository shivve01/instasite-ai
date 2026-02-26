import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ConfigPage from './pages/ConfigPage';
import GeneratingPage from './pages/GeneratingPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
    const { initTheme } = useTheme();

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/config" element={<ConfigPage />} />
                <Route path="/generating" element={<GeneratingPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/history" element={<HistoryPage />} />
            </Routes>
        </Layout>
    );
}
