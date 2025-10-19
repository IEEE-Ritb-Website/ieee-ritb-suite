import { Card } from "@/components/ui/card"
import { CONFIG } from "@/configs/config"

export default function Sponsors() {
    return (
        <section id="sponsors" className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="scroll-reveal space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold">Our Sponsors</h2>
                    <p className="text-lg text-muted-foreground">Thanks to our amazing sponsors</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CONFIG.sponsors.map((sponsor, index) => (
                        <Card
                            key={index}
                            className="scroll-reveal p-8 bg-card border-border hover:border-accent/50 transition-all duration-300 flex flex-col items-center justify-center text-center group"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <div className="w-16 h-16 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center mb-3">
                                <span className="text-accent font-bold text-sm">{sponsor.name.slice(0, 2)}</span>
                            </div>
                            <h3 className="font-semibold">{sponsor.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{sponsor.tier}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
