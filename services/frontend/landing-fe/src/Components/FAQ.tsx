import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/component/luxe/ui/accordion";
import faqs from "../configs/faq.json";

export default function FAQ() {
  return (
    <div className="min-h-screen px-4 py-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h1>
        <div className="w-20 h-0.5 bg-white/80 mx-auto"></div>
      </div>

      {/* FAQ Accordion with Glassmorphism */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-white/20 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 shadow-lg"
          >
            <AccordionTrigger className="text-white text-left text-lg font-medium py-5 hover:bg-white/5 transition-all duration-300">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-200 pt-2 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Call to Action with Glassmorphism */}
      <div className="text-center mt-16">
        <p className="text-gray-300 mb-6 text-lg">
          Still have questions? We're here to help!
        </p>
        <button className="backdrop-blur-md bg-white/90 hover:bg-white text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/30">
          Contact Us
        </button>
      </div>
    </div>
  );
}