import React from 'react';
import { Award, Target, BookOpen, HeartHandshake, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>About the Conference & Institution</span>
        </div>
        <h1 style={{ marginBottom: '1.5rem' }}>
          About <span className="heading-gradient">NEXORA 2026</span>
        </h1>

        <div className="card" style={{ marginBottom: '2.5rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-cream)', marginBottom: '1rem' }}>
            Transforming Undergraduate & Postgraduate Ideas into Research
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            <strong>NEXORA – Emerging Technology and Interdisciplinary Innovation Conference 2026</strong> is
            a research-focused academic conference organized to provide students with a structured, prestigious
            platform to explore, develop, and present innovative research in emerging technologies and interdisciplinary domains.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            In an era where technology touches every sphere of human existence, students are encouraged to move beyond
            conventional classroom memorization and engage in genuine scientific research, critical problem analysis,
            rigorous methodology design, and articulate technical communication.
          </p>
          <p>
            Through our two-round structure—comprising an initial abstract and poster peer-screening followed by oral research paper defense—NEXORA cultivates academic integrity, peer feedback, and future-ready problem solvers.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(45, 212, 191, 0.15)', color: 'var(--accent-teal-light)' }}>
                <Target size={24} />
              </div>
              <h3 style={{ margin: 0 }}>Our Mission</h3>
            </div>
            <p>
              To democratize scientific research for engineering and science students, offering guidance from senior faculty, exposure to rigorous evaluation metrics, and fostering interdisciplinary solutions that address sustainable development goals.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                <Award size={24} />
              </div>
              <h3 style={{ margin: 0 }}>Our Vision</h3>
            </div>
            <p>
              To position HCST as a distinguished regional hub for student innovation, scholarly publications, intellectual property generation, and creative collaboration between departments and universities.
            </p>
          </div>
        </div>

        {/* Host Institution Profile */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>
            Host Institution: Hindustan College of Science & Technology
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Hindustan College of Science and Technology (HCST) was founded in 1996 under the aegis of the Sharda Group of Institutions (SGI). It stands prominently amongst the first self-financed technical institutions in North India, holding prestigious <strong>NAAC A+ Accreditation</strong>.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow, and approved by the All India Council for Technical Education (AICTE), New Delhi, HCST offers premier undergraduate and postgraduate programs across computer science, information technology, electronics, mechanical, and civil engineering.
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-cream)' }}>
              Campus Address: Agra-Delhi Highway, NH-19, Farah, Mathura, Uttar Pradesh - 281122
            </p>
          </div>
        </div>

        {/* Organizing Technical Societies */}
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.25rem' }}>
            Co-Organizing Student Societies
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--accent-teal-light)', marginBottom: '0.35rem' }}>BYTE CLUB (Department of CSE)</h3>
              <p style={{ fontSize: '0.95rem' }}>
                The premier Computer Science student society at HCST. BYTE provides year-round workshops in modern web frameworks, AI, competitive coding hackathons, mock tech interviews, and hands-on developer projects. Under the guidance of Mr. Gaurav Pandey, Faculty Coordinator.
              </p>
            </div>

            <div>
              <h3 style={{ color: 'var(--accent-amber)', marginBottom: '0.35rem' }}>QUBIT TECH SOCIETY (Department of IT)</h3>
              <p style={{ fontSize: '0.95rem' }}>
                The Information Technology Association of HCST. QUBIT focuses on applied cloud computing, cybersecurity awareness, IoT prototyping, network architecture, and data engineering. Under the guidance of Mr. Utkarsh Gupta, Faculty Coordinator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
