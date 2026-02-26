import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenerationProgress from '../components/generator/GenerationProgress';
import { useStore } from '../store/useStore';

export default function GeneratingPage() {
    const navigate = useNavigate();
    const generationStatus = useStore((s) => s.generationStatus);
    const currentStep = useStore((s) => s.currentStep);

    useEffect(() => {
        if (generationStatus === 'complete') {
            navigate('/results');
        } else if (generationStatus === 'error') {
            navigate('/results');
        } else if (generationStatus === 'idle') {
            navigate('/');
        }
    }, [generationStatus, navigate]);

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            <GenerationProgress currentStep={currentStep} />
        </div>
    );
}
