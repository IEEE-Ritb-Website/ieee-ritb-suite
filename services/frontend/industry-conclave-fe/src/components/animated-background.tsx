import { useEffect, useState } from "react"

export default function AnimatedBackground() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_scrollY, setScrollY] = useState(0)
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)

            // Reveal elements on scroll
            const reveals = document.querySelectorAll(".scroll-reveal")
            reveals.forEach((element) => {
                const windowHeight = window.innerHeight
                const elementTop = element.getBoundingClientRect().top
                const elementVisible = 150

                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add("visible")
                }
            })
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="hidden md:block absolute inset-0">
            <svg
                className="absolute w-full h-auto"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
            // style={{
            //     transform: `translateY(${scrollY * 0.3}px)`,
            // }}
            >
                {/* Network nodes - computers */}
                <g className="text-accent opacity-20">
                    {/* Top left computer */}
                    <circle cx="130" cy="160" r="3" fill="currentColor" />

                    {/* Top right computer */}
                    <circle cx="1070" cy="180" r="3" fill="currentColor" />

                    {/* Bottom left server */}
                    <circle cx="105" cy="730" r="3" fill="currentColor" />

                    {/* Bottom right server */}
                    <circle cx="1055" cy="730" r="3" fill="currentColor" />

                    {/* Center hub */}
                    <circle cx="580" cy="262" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="580" cy="262" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                </g>

                {/* Network connections - animated lines */}
                <g className="text-accent opacity-15" strokeWidth="1.5" stroke="currentColor" fill="none">
                    {/* Lines from computers to center */}
                    <line
                        x1="130"
                        y1="160"
                        x2="580"
                        y2="262"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        style={{ animation: "dash-animation 4s ease-in-out infinite" }}
                    />
                    <line
                        x1="1070"
                        y1="180"
                        x2="580"
                        y2="262"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        style={{ animation: "dash-animation 4s ease-in-out infinite 0.5s" }}
                    />
                    <line
                        x1="105"
                        y1="730"
                        x2="580"
                        y2="262"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        style={{ animation: "dash-animation 4s ease-in-out infinite 1s" }}
                    />
                    <line
                        x1="1055"
                        y1="730"
                        x2="580"
                        y2="262"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        style={{ animation: "dash-animation 4s ease-in-out infinite 1.5s" }}
                    />
                </g>

                {/* Pulsing data points */}
                <g className="text-accent opacity-30">
                    <circle
                        cx="580"
                        cy="262"
                        r="5"
                        fill="currentColor"
                        style={{ animation: "pulse-ring 2s ease-out infinite 1.2s" }}
                    />
                </g>

                {/* Floating data packets */}
                <g className="text-accent opacity-20">
                    <circle cx="300" cy="250" r="3" fill="currentColor" style={{ animation: "float 6s ease-in-out infinite" }} />
                    <circle
                        cx="900"
                        cy="300"
                        r="3"
                        fill="currentColor"
                        style={{ animation: "float 7s ease-in-out infinite 1s" }}
                    />
                    <circle
                        cx="400"
                        cy="550"
                        r="3"
                        fill="currentColor"
                        style={{ animation: "float 8s ease-in-out infinite 2s" }}
                    />
                    <circle
                        cx="800"
                        cy="600"
                        r="3"
                        fill="currentColor"
                        style={{ animation: "float 6.5s ease-in-out infinite 1.5s" }}
                    />
                </g>
            </svg>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-40" />
        </div>
    )
}
