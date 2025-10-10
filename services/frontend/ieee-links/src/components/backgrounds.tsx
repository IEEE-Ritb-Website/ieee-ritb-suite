
export function Backgrounds() {
    const stars = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
    }));

    return (
        <>
            {/* Starry Night Background */}
            <div className="absolute inset-0 z-0">
                {/* Deep space gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)",
                    }}
                />

                {/* Animated stars */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: Math.random() * 0.5 + 0.5,
                            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}

                {/* Nebula glow */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(59, 130, 246, 0.1), transparent 50%), radial-gradient(ellipse 50% 50% at 70% 60%, rgba(147, 197, 253, 0.08), transparent 50%)",
                    }}
                />
            </div>
            {/* Azure Depths */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 100%, transparent 40%, #010133 100%)",
                }}
            />
            {/* grid background */}
            <div
                className="absolute inset-0 z-0 opacity-5"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
                    backgroundSize: "20px 30px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                    maskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                }}
            />
        </>
    )
}
