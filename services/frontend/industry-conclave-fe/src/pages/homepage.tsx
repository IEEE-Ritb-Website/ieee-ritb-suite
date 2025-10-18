import AnimatedBackground from "@/components/animated-background";
import Footer from "@/components/common/footer";
import Navigation from "@/components/common/navigation"
import About from "@/sections/about";
import Agenda from "@/sections/agenda";
import Contact from "@/sections/contact";
import CTA from "@/sections/cta";
import FAQ from "@/sections/faq";
import Hero from "@/sections/hero";
import Sponsors from "@/sections/sponsors";
import Timeline from "@/sections/timeline";

export function Homepage() {
    return (
        <main className="min-h-screen bg-background">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
                    backgroundSize: "30px 50px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                    maskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                }}
            />
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 10%, transparent 40%, #6366f1 100%)",
                }}
            />
            <Navigation />
            <AnimatedBackground />
            <Hero />
            <About />
            <Agenda />
            <Sponsors />
            <Timeline />
            <FAQ />
            <Contact />
            <CTA />
            <Footer />
        </main>
    )
}
