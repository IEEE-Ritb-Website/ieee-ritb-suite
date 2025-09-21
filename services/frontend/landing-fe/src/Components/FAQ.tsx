import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../src/component/luxe/ui/accordion";

import faqs from "../configs/faq.json";

export default function FAQ() {
  
  return (
    <div className="min-h-screen bg-black px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-800"
            >
              <AccordionTrigger className="text-white text-left text-lg font-medium py-4 hover:bg-gray-900/30 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pb-4 px-1 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">
            Still have questions? We're here to help!
          </p>
          <button className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
