import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../src/component/luxe/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "What is IEEE RIT?",
      answer:
        "IEEE RIT is the student branch of IEEE at Ramaiah Institute of Technology, dedicated to advancing technology and professional development.",
    },
    {
      question: "How can I join IEEE RIT?",
      answer:
        "You can join by filling out the membership form on our website or contacting the faculty advisor directly during the membership drive.",
    },
    {
      question: "What events does IEEE RIT organize?",
      answer:
        "We organize workshops, guest lectures, competitions, hackathons, and technical seminars throughout the year to help students grow their skills.",
    },
    {
      question: "Is IEEE membership open to all students?",
      answer:
        "Yes, IEEE membership is open to all students pursuing engineering, technology, or related fields.",
    },
    {
      question: "Are there any fees for joining IEEE RIT?",
      answer:
        "Yes, there is a nominal membership fee that covers IEEE national and international memberships along with local chapter activities.",
    },
    {
      question: "How can I stay updated with IEEE RIT events?",
      answer:
        "You can follow us on our social media channels or subscribe to our newsletter via the website.",
    },
    {
      question: "Can I volunteer for IEEE RIT activities?",
      answer:
        "Absolutely! We encourage active participation and volunteering in our events to build leadership and teamwork skills.",
    },
    {
      question: "Who can I contact for more information?",
      answer:
        "You can reach out to our faculty advisor or contact us through the email provided in the footer section.",
    },
  ];

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
