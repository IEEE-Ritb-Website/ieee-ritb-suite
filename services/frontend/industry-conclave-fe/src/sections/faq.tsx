import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { CONFIG } from "@/configs/config"

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="scroll-reveal space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold">Frequently Asked Questions</h2>
                    <p className="text-lg text-muted-foreground">Find answers to common questions</p>
                </div>

                <div className="space-y-3">
                    {CONFIG.faqs.map((faq, index) => (
                        <Card
                            key={index}
                            className="scroll-reveal border-border overflow-hidden"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-6 flex items-center justify-between hover:bg-card/50 transition-colors text-left"
                            >
                                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                                <ChevronDown
                                    size={20}
                                    className={`text-accent flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">{faq.answer}</div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
