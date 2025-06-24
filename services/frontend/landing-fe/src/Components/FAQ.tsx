import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const toggleFAQ = (index : number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <style>{`
        :root {
          --dark-background: #05060f;
          --body-normal: rgba(200,212,234,.78);
          --body-loud: #c7d3ea;
          --body-muted: #c7d3eaa3;
        }
        .faq-section {
          background: var(--dark-background);
          color: var(--body-normal);
          max-width: 900px;
          margin: 2rem auto 3rem auto;
          padding: 1.5rem 2rem;
          border-radius: 8px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          box-sizing: border-box;
          box-shadow: 0 0 10px rgba(199, 211, 234, 0.2);
          opacity: 0.9;
        }
        .faq-title {
          font-size: 1.8rem;
          color: var(--body-loud);
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 700;
        }
        .faq-item {
          border-bottom: 1px solid var(--body-muted);
          padding: 0.8rem 0;
          cursor: pointer;
          user-select: none;
        }
        .faq-question {
          font-weight: 600;
          color: var(--body-loud);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1rem;
          transition: color 0.2s ease;
        }
        .faq-question:hover {
          color: var(--body-normal);
        }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          color: var(--body-muted);
          font-size: 0.9rem;
          line-height: 1.5;
          transition: max-height 0.35s ease, padding 0.35s ease;
          padding: 0 0;
          margin-top: 0.5rem;
        }
        .faq-answer.open {
          max-height: 400px;
          padding: 0.5rem 0;
        }
        .arrow {
          font-size: 1.2rem;
          color: var(--body-normal);
          transition: transform 0.3s ease;
          user-select: none;
        }
        .arrow.open {
          transform: rotate(90deg);
        }
      `}</style>

      <section className="faq-section" aria-label="Frequently Asked Questions">
        <h2 className="faq-title">Frequently Asked Questions</h2>

        {faqs.map((faq, idx) => (
          <div
            className="faq-item"
            key={idx}
            onClick={() => toggleFAQ(idx)}
            role="button"
            aria-expanded={openIndex === idx}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleFAQ(idx);
            }}
          >
            <div className="faq-question">
              {faq.question}
              <span className={`arrow ${openIndex === idx ? "open" : ""}`}>
                ▶
              </span>
            </div>
            <div className={`faq-answer ${openIndex === idx ? "open" : ""}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default FAQ;
