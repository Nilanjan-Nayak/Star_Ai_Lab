import React, { useEffect } from 'react';

const Ai_Demo = () => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    return (
        <>
            
            <section id="demo" className="bg-premium-deep relative overflow-hidden h-screen">
            {/* Premium Background Effects */}
            

            <div className="container relative h-full">
                <iframe src="https://content-magic-main.netlify.app/" width="100%"
                    height="100%"
                    className='border-none'
                    title="Embedded Web App"></iframe>
            </div>

            
        </section>
        </>
    );
};

export { Ai_Demo };
