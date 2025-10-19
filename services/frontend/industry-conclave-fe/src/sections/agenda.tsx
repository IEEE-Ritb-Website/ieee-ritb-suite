import { Card } from "@/components/ui/card"
import { CONFIG } from "@/configs/config"

export default function Agenda() {
    return (
        <section id="agenda" className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
                    WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />
            <div className="max-w-6xl mx-auto">
                <div className="scroll-reveal space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold">Agenda</h2>
                    <p className="text-lg text-muted-foreground">Diverse topics and sessions across two days</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CONFIG.agenda.map((item, index) => (
                        <Card
                            key={index}
                            className="scroll-reveal p-6 bg-background border-border hover:border-accent/50 transition-all duration-300 group cursor-pointer"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                                    <span className="text-accent text-sm font-bold">{index + 1}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
