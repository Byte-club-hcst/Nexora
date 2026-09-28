import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'Who is eligible to participate in NEXORA 2026?',
      a: 'All undergraduate and postgraduate students enrolled in recognized universities and colleges (B.Tech, B.E., BCA, MCA, M.Tech, B.Sc, M.Sc, etc.) are eligible to participate and submit papers.',
    },
    {
      q: 'How many authors can be listed on a single research paper?',
      a: 'A submission can have between 1 and 4 authors. For each author, full name, college, course, branch, and year of study must be specified during online abstract submission.',
    },
    {
      q: 'What is the registration fee, and how do I pay?',
      a: 'The registration fee is ₹100 per person. After completing your online registration, navigate to the Payment page, scan the official UPI QR code with any UPI app (GPay, PhonePe, Paytm), and upload the payment confirmation screenshot. The admin team will verify your screenshot within 24 hours.',
    },
    {
      q: 'Can a team submit more than one paper?',
      a: 'Yes, a team or individual may submit papers across different tracks, provided each submission represents distinct, non-overlapping research work and separate registrations are completed.',
    },
    {
      q: 'What file formats are accepted for abstract and poster submissions?',
      a: 'Abstract documents must be uploaded strictly in PDF format (maximum size 10MB). Research posters may be uploaded in PDF, PNG, or JPEG format (maximum size 10MB). Payment screenshots must be JPEG or PNG only (maximum size 5MB).',
    },
    {
      q: 'Will all participants receive certificates?',
      a: 'Yes. All registered delegates who present their research papers on Conference Day will receive an official Certificate of Presentation. Winning teams in each track will receive Merit Certificates and Best Paper Awards.',
    },
    {
      q: 'Where will the conference take place?',
      a: 'NEXORA 2026 will take place in-person at the Dr. A.P.J. Abdul Kalam Auditorium, Hindustan College of Science & Technology, NH-19, Farah, Mathura, Uttar Pradesh.',
    },
    {
      q: 'What should I do if my payment proof is rejected?',
      a: 'If your payment screenshot is rejected (for example, if the transaction ID is blurry or unreadable), you can log in to your participant dashboard, view the admin feedback reason, and immediately upload a clearer screenshot.',
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Common Questions</span>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>
          Frequently Asked <span className="heading-gradient">Questions</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
          Everything you need to know about registrations, payment proofs, abstract formatting, and presentation requirements.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  cursor: 'pointer',
                  padding: '1.25rem 1.5rem',
                  borderColor: isOpen ? 'var(--accent-teal)' : 'var(--border)',
                  background: isOpen ? 'var(--bg-secondary)' : 'var(--bg-card)',
                }}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: isOpen ? 'var(--accent-teal)' : 'var(--text-primary)' }}>
                    {faq.q}
                  </h3>
                  <div style={{ color: 'var(--accent-teal)', flexShrink: 0 }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {isOpen && (
                  <p style={{ marginTop: '0.85rem', fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="card" style={{ textAlign: 'center', background: 'var(--accent-soft)', border: '1px solid var(--accent-teal)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Still have questions?</h3>
          <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>We're here to assist you with registration or academic queries.</p>
          <Link to="/contact" className="btn btn-outline btn-sm">
            Contact Coordinator Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
