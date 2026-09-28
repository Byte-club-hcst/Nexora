import React from 'react';
import { User, Award, Globe, Building } from 'lucide-react';

export default function Speakers() {
  const speakers = [
    {
      name: 'Dr. Rajiv Malhotra',
      role: 'Chief AI Research Scientist',
      org: 'Cognitive Computing Labs & Former IIT Professor',
      topic: 'Next-Generation Neural Paradigms & Explainable Generative AI',
      bio: 'Over 25 years of research leadership in deep learning, speech recognition, and ethical AI architectures with 80+ IEEE/ACM journal publications.',
    },
    {
      name: 'Dr. Ananya Sengupta',
      role: 'Director of Sustainable Cloud Architectures',
      org: 'CleanTech Systems India',
      topic: 'Green Data Centers: Zero-Carbon Cloud & Edge Infrastructure',
      bio: 'Leading innovations in carbon-negative computing frameworks, renewable energy orchestration in hyperscale server farms, and circular technology policy.',
    },
    {
      name: 'Prof. Sandeep Bansal',
      role: 'Senior Principal Cyber Architect',
      org: 'Center for Advanced Network Security',
      topic: 'Zero Trust Architectures for Critical National Infrastructure',
      bio: 'Advisor to national defense and banking systems on post-quantum encryption, blockchain identity governance, and automated incident resilience.',
    },
    {
      name: 'Dr. Meenakshi Raman',
      role: 'Head of Biomedical Technology & HCI',
      org: 'BioInnovate Healthcare Technologies',
      topic: 'Bridging Clinician Diagnostics and Machine Perception',
      bio: 'Pioneered AI-assisted point-of-care ultrasound diagnostic algorithms utilized across 150+ rural hospital clinics in South Asia.',
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Distinguished Guests</span>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>
          Keynote <span className="heading-gradient">Speakers</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
          NEXORA 2026 brings together esteemed researchers, industry pioneers, and academicians
          who will deliver inspirational keynote addresses and evaluate finalist submissions.
        </p>

        <div className="grid-2">
          {speakers.map((spk, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(45, 212, 191, 0.15)',
                    color: 'var(--accent-teal-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  {spk.name.replace(/^(Dr\.|Prof\.)\s*/, '').slice(0, 2)}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.2rem', color: '#fff' }}>{spk.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-teal-light)', fontWeight: 600 }}>{spk.role}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{spk.org}</p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-amber)', fontWeight: 700 }}>Keynote Lecture:</span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-bright)' }}>{spk.topic}</p>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1, margin: 0 }}>
                {spk.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
