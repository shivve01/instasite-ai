import type { DeviceType } from '../../types';
import { ReactNode } from 'react';

interface DeviceFrameProps {
    device: DeviceType;
    children: ReactNode;
}

const frames: Record<DeviceType, { width: string; padding: string; borderRadius: string }> = {
    desktop: { width: '100%', padding: '0', borderRadius: '8px' },
    tablet: { width: '768px', padding: '16px', borderRadius: '24px' },
    mobile: { width: '375px', padding: '12px', borderRadius: '32px' },
};

export default function DeviceFrame({ device, children }: DeviceFrameProps) {
    const frame = frames[device];

    if (device === 'desktop') {
        return <div className="w-full h-full">{children}</div>;
    }

    return (
        <div
            className="mx-auto bg-gray-800 shadow-2xl"
            style={{
                width: frame.width,
                maxWidth: '100%',
                padding: frame.padding,
                borderRadius: frame.borderRadius,
            }}
        >
            {/* Notch / Camera */}
            {device === 'mobile' && (
                <div className="flex justify-center mb-2">
                    <div className="w-20 h-5 bg-gray-900 rounded-full" />
                </div>
            )}
            {device === 'tablet' && (
                <div className="flex justify-center mb-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full" />
                </div>
            )}
            <div className="bg-white rounded-lg overflow-hidden" style={{ borderRadius: '8px' }}>
                {children}
            </div>
            {/* Home indicator */}
            {device === 'mobile' && (
                <div className="flex justify-center mt-2">
                    <div className="w-28 h-1 bg-gray-600 rounded-full" />
                </div>
            )}
        </div>
    );
}
