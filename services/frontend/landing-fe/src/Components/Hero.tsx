import React from 'react';
import AnimatedLogo from './AnimatedLogo';


const Hero: React.FC = () => {
    return (
        <div className='h-screen relative'>
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(
                            circle at center,
                            rgba(59, 130, 246, 0.05) 0%,
                            rgba(0, 0, 0, 0.0) 20%
                        )
                    `,
                }}
            />
            <AnimatedLogo className='h-full w-full' />
        </div>
    )
}
export default Hero 