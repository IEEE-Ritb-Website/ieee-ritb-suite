import { Button } from "@/components/ui/button"

export default function CTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="scroll-reveal bg-card relative border border-border rounded-lg p-12 sm:p-16 text-center overflow-hidden object-contain">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), transparent",
                        }}
                    />
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Join?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join us for an unforgettable experience filled with learning, networking, and inspiration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Register Now
                        </Button>
                        <Button size="lg" variant="outline" className="border-border hover:bg-muted bg-transparent">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
