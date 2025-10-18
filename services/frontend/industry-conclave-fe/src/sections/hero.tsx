import { Button } from "@/components/ui/button"
import { CONFIG } from "@/configs/config"
import { ChevronDown } from "lucide-react"

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="space-y-6 animate-fade-in-up">
                    <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                        <span className="text-accent text-sm font-medium">{CONFIG.eventDetails.dates} • {CONFIG.eventDetails.location}</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                        {CONFIG.name}{" "}
                        <span className="text-accent">2025</span>
                    </h1>

                    {/* <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                        The 5th edition of India's premier Free and Open Source Software conference. Join the community celebrating
                        innovation, collaboration, and the power of open source.
                    </p> */}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base">
                            Register Now
                        </Button>
                        <Button size="lg" variant="outline" className="border-border hover:bg-muted text-base bg-transparent">
                            View Timeline
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent">1000+</div>
                            <div className="text-xs text-muted-foreground">Attendees</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent">10+</div>
                            <div className="text-xs text-muted-foreground">Speakers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent">2</div>
                            <div className="text-xs text-muted-foreground">Days</div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="text-accent" size={32} />
            </div>
        </section>
    )
}
