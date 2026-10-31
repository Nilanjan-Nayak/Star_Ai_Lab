import { useEffect, useState } from 'react';

const Ai_Demo = () => {
    const [loaded, setLoaded] = useState(false);

    // Lock page scroll while the demo is open, then restore whatever it was before.
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    return (
        <section id="ai-demo" className="bg-premium-deep relative h-screen overflow-hidden">
            {/* Loader – fades out once the embedded app is ready */}
            <div
                className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#02040a] transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'
                    }`}
                role="status"
                aria-live="polite"
            >
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />
                    <div className="absolute inset-2 animate-ping rounded-full bg-cyan-400/20" />
                </div>
                <p className="text-sm text-blue-200/70">Launching Content Magic…</p>
            </div>

            <div className="container relative h-full">
                <iframe
                    src="https://content-magic-main.netlify.app/"
                    width="100%"
                    height="100%"
                    className="border-none"
                    title="Content Magic – embedded web app"
                    onLoad={() => setLoaded(true)}
                />
            </div>
        </section>
    );
};

export { Ai_Demo };