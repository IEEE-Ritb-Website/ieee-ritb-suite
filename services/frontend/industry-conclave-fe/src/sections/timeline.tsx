import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CONFIG } from "@/configs/config"

export default function Timeline() {
    const [activeDay, setActiveDay] = useState(1)

    const day1Events = CONFIG.timeline.day1;

    const day2Events = CONFIG.timeline.day2;

    const events = activeDay === 1 ? day1Events : day2Events

    return (
        <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="scroll-reveal space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold">Timeline</h2>
                    <p className="text-lg text-muted-foreground">Event schedule for both days</p>
                </div>

                {/* Day tabs */}
                <div className="flex gap-4 mb-12">
                    <Button
                        onClick={() => setActiveDay(1)}
                        variant={activeDay === 1 ? "default" : "outline"}
                        className="px-6 py-2"
                    >
                        Day 1
                    </Button>
                    <Button
                        onClick={() => setActiveDay(2)}
                        variant={activeDay === 2 ? "default" : "outline"}
                        className="px-6 py-2"
                    >
                        Day 2
                    </Button>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-transparent opacity-30" />

                    {/* Timeline items */}
                    <div className="space-y-8">
                        {events.map((event, index) => (
                            <div key={index} className="scroll-reveal relative pl-24">
                                {/* Timeline dot */}
                                <div className="absolute left-0 top-2 w-16 h-16 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-accent rounded-full border-4 border-background" />
                                </div>

                                {/* Content card */}
                                <div className="bg-card/50 border border-border rounded-lg p-6 hover:bg-card/80 transition-colors">
                                    <p className="text-sm font-semibold text-accent mb-2">{event.time}</p>
                                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                    <p className="text-muted-foreground">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
