import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { showToast } from '../components/Toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      showToast('Message received! Our team will get back to you shortly.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Get in Touch</span>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>
          Contact <span className="heading-gradient">Conference Desk</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
          Have questions regarding submissions, payments, or travel to HCST Mathura? Reach out to our student coordination team.
        </p>

        <div className="grid-2" style={{ gap: '2.5rem' }}>
          {/* Contact Details Column */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--accent-cream)', marginBottom: '1rem' }}>Student Coordinators</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Akshita Mathur</h4>
                  <p style={{ margin: '0.1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lead Student Coordinator (BYTE Club)</p>
                  <a href="tel:+917055002687" style={{ color: 'var(--accent-teal-light)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} /> +91 70550 02687
                  </a>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Kunal Rathore</h4>
                  <p style={{ margin: '0.1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Technical Head (BYTE Club)</p>
                  <a href="tel:+917505708793" style={{ color: 'var(--accent-teal-light)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} /> +91 75057 08793
                  </a>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Vinarm Verma</h4>
                  <p style={{ margin: '0.1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Operations & Event Lead (QUBIT Club)</p>
                  <a href="tel:+919045661289" style={{ color: 'var(--accent-teal-light)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} /> +91 90456 61289
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: 'var(--accent-cream)', marginBottom: '1rem' }}>Official Channels</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} color="var(--accent-teal-light)" />
                  <a href="mailto:nexora2026@hcst.edu.in">nexora2026@hcst.edu.in</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageCircle size={18} color="#25D366" />
                  <a href="https://chat.whatsapp.com/DOvk1L6D1wv0YS2XccPfWv" target="_blank" rel="noopener noreferrer">
                    Join Official WhatsApp Community
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={18} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Dr. APJ Abdul Kalam Auditorium, HCST Campus, NH-19, Farah, Mathura (U.P.) - 281122</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form Column */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Send Us a Message</h3>
            {sent && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--status-success)', color: 'var(--status-success)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Query regarding Track 1 submission"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message <span className="required">*</span></label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Describe your query in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" variant="primary" loading={submitting} style={{ width: '100%' }}>
                <Send size={16} />
                <span>Send Message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
