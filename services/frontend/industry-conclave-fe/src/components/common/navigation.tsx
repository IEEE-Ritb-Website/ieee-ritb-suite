import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { CONFIG } from "@/configs/config"
import { Link } from "react-router"

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { label: "About", href: "#about" },
        { label: "Agenda", href: "#agenda" },
        { label: "Timeline", href: "#timeline" },
        { label: "FAQ", href: "#faq" },
        { label: "Contact", href: "#contact" },
    ]

    return (
        <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xs">IC</span>
                        </div>
                        <span className="font-semibold text-sm hidden sm:inline">{CONFIG.name}</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-border hover:bg-muted bg-transparent">
                            Timeline
                        </Button>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Register
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1 border-border bg-transparent">
                                Timeline
                            </Button>
                            <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                                Register
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
