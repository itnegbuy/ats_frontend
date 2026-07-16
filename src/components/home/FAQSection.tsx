'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'What paperwork comes with your parts?',
    answer:
      'Every part ships with AS9100 and AS9120 documentation, plus manufacturer certificates and material traceability. We share all of this with your quote, not after you have already paid.',
  },
  {
    question: 'How fast can you get me a quote?',
    answer:
      'Most requests get a response within 24 hours. If you have an unplanned outage, let us know and we will try to turn it around the same day.',
  },
  {
    question: 'Do you ship outside the US?',
    answer:
      'Yes, we ship to over 150 countries. We handle the export paperwork for turbine and control system components, including items with dual-use restrictions.',
  },
  {
    question: 'What is a CAGE code and why does it matter?',
    answer:
      'It is a unique ID for the manufacturer or supplier of a part, used in defense and government procurement. For turbine buyers, it confirms you are getting the part from the company that actually made it, not a lookalike from some unverified source.',
  },
  {
    question: 'How do you stop counterfeit parts?',
    answer:
      'Every part goes through inspection and documentation checks before it ships. If we cannot verify where a part came from, we do not stock it, no matter how badly someone needs it.',
  },
  {
    question: 'Can you find obsolete or discontinued parts?',
    answer:
      'That is actually where we do our best work. Legacy Mark V control cards, discontinued combustion hardware, older Speedtronic components. Our network of 1,200 suppliers means we can often find parts that other distributors have given up on.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-[#F8F9FF]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-brand" /> FAQ <span className="w-6 h-px bg-brand" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-text-muted">
              Straight answers about sourcing gas turbine parts. No fluff, no jargon.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#E8EDF2] overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-[#0A1628] text-sm sm:text-base pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#4F46E5] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <p className="px-6 pb-5 text-sm text-[#4A4A6A]/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
