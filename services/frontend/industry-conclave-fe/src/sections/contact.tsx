import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CONFIG } from "@/configs/config"
import { Mail, MapPin, User } from "lucide-react"

export default function Contact() {
    return (
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
            <div className="max-w-6xl mx-auto">
                <div className="scroll-reveal space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold">Get In Touch</h2>
                    <p className="text-lg text-muted-foreground">Have questions? We'd love to hear from you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="scroll-reveal space-y-6">
                        <Card className="p-6 bg-background border-border">
                            <div className="flex gap-4">
                                <Mail className="text-accent flex-shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold mb-1">Email</h3>
                                    <p className="text-muted-foreground">{CONFIG.profile.email}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-background border-border">
                            <div className="flex gap-4">
                                <MapPin className="text-accent flex-shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold mb-1">Location</h3>
                                    <p className="text-muted-foreground">{CONFIG.eventDetails.location}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-background border-border">
                            <div className="flex gap-4">
                                <User className="text-accent flex-shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold mb-1">Coordinators</h3>
                                    {CONFIG.eventDetails.coordinators.map((coordinator, index) => (
                                        <p key={index} className="text-muted-foreground">
                                            {coordinator.name}: {coordinator.phone}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card className="scroll-reveal p-8 bg-background border-border">
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent transition-colors resize-none"
                                    placeholder="Your message..."
                                />
                            </div>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Send Message</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </section>
    )
}
