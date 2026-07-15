'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'What certifications do your gas turbine parts carry?',
    answer:
      'Every part ships with AS9100 and AS9120-backed documentation, plus manufacturer certificates of conformance and material traceability where applicable — provided upfront with your quote, not after you\'ve already paid.',
  },
  {
    question: 'How fast can I get a quote?',
    answer:
      'Most requests get a response within 24 hours. For an unplanned outage, we prioritize same-day turnaround wherever we can.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, to 150+ countries. We handle the export documentation that comes with shipping turbine and control system components, including anything with dual-use restrictions.',
  },
  {
    question: 'What is a CAGE code and why is it important?',
    answer:
      'It\'s a unique identifier for the manufacturer or supplier of a part, used heavily in defense and government procurement. For turbine buyers, it matters because it confirms you\'re getting the part from the entity that actually made or certified it — not a lookalike from an unverified source.',
  },
  {
    question: 'How do you ensure parts are counterfeit-free?',
    answer:
      'Every part goes through inspection and documentation checks before it ships. If we can\'t verify where a part came from, we don\'t carry it — even if it\'s in high demand.',
  },
  {
    question: 'Can you source hard-to-find or obsolete turbine parts?',
    answer:
      'This is honestly where we\'re strongest. Legacy Mark V control cards, discontinued combustion hardware, older Speedtronic components — our network of 1,200+ manufacturers and distributors means we\'re often able to find what other suppliers have stopped trying to.',
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
              Straight answers about sourcing gas turbine parts — no fluff, no jargon.
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
