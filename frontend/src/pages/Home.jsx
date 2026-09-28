import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Award, BookOpen, Layers, Users, CheckCircle, Sparkles } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function Home() {
  const { config, formatIST } = useEvent();

  const leaders = [
    { name: 'Shri P.K. Gupta', role: 'Chairman, Sharda Group', photo: '/images/leaders/pkgupta.jpg' },
    { name: 'Shri Y.K. Gupta', role: 'Vice Chairman, Sharda Group', photo: '/images/leaders/ykgupta.jpg' },
    { name: 'Prof. Vinod Kumar Sharma', role: 'Executive Vice President', photo: '/images/leaders/vksharma.jpg' },
    { name: 'Dr. R.S. Pavithra', role: 'Director, HCST', photo: '/images/leaders/drrspavitra.png' },
    { name: 'Prof. M.S. Gaur', role: 'Dean R&D', photo: '/images/leaders/gaursir.png' },
    { name: 'Dr. Shankar Thawkar', role: 'Head of Department, CSE', photo: '/images/leaders/Shankarsirhod.png' },
    { name: 'Mrs. Deepti Mittal', role: 'Head of Department, IT', photo: '/images/leaders/Deeptimam.png' },
    { name: 'Mr. Gaurav Pandey', role: 'Faculty Coordinator, Byte Club', photo: '/images/leaders/gauravsir.jpeg' },
    { name: 'Mr. Utkarsh Gupta', role: 'Faculty Coordinator, Qubit Club', photo: '/images/leaders/utkarshsir.jpeg' },
  ];

  return (
    <div className="animate-fade-in">
      {/* ================= HERO SECTION (Classic Dark Teal Banner from original design) ================= */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 5.5rem',
          background: 'radial-gradient(circle at 30% 20%, var(--dark-teal-2) 0%, var(--dark-teal) 75%)',
          color: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2.5rem',
          }}
        >
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            <p
              className="eyebrow"
              style={{
                color: 'var(--accent-cream)',
                fontSize: '0.9rem',
                letterSpacing: '0.08em',
                marginBottom: '0.5rem',
              }}
            >
              Welcome to
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                color: '#ffffff',
                margin: '0 0 0.75rem',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ color: 'var(--accent-teal-light)' }}>NEXORA</span>{' '}
              <span style={{ fontWeight: 400 }}>2026</span>
            </h1>

            <p
              style={{
                color: 'var(--accent-cream)',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '0 0 1rem',
              }}
            >
              Emerging Technology & Interdisciplinary Innovation Student Conference
            </p>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#C3DEDC',
                maxWidth: '540px',
                margin: '0 0 2rem',
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}
            >
              "Emerging Technologies and Interdisciplinary Innovations for a Sustainable Future"
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link
                to="/register"
                className="btn"
                style={{
                  background: 'var(--accent-cream)',
                  color: 'var(--dark-teal)',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  border: 'none',
                }}
              >
                <span>Register Now →</span>
              </Link>
              <Link
                to="/submission"
                className="btn btn-outline"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  color: '#ffffff',
                }}
              >
                <span>Submit Abstract</span>
              </Link>
              <a
                href="/downloads/NEXORA_2026_Rulebook.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginLeft: '0.5rem',
                }}
              >
                <BookOpen size={16} /> View Rulebook
              </a>
            </div>
          </div>

          {/* Hero Decorative SVG Graphic from original starter */}
          <div
            style={{
              flex: '0 0 300px',
              width: '300px',
              height: '300px',
              opacity: 0.85,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <circle cx="150" cy="150" r="90" fill="none" stroke="#24B1B1" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="#FFE2AF" strokeWidth="1.5" />
              <line x1="150" y1="150" x2="230" y2="90" stroke="#24B1B1" strokeWidth="1.5" />
              <line x1="150" y1="150" x2="70" y2="80" stroke="#24B1B1" strokeWidth="1.5" />
              <line x1="150" y1="150" x2="220" y2="230" stroke="#FFE2AF" strokeWidth="1.5" />
              <line x1="150" y1="150" x2="60" y2="220" stroke="#24B1B1" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="8" fill="#FFE2AF" />
              <circle cx="230" cy="90" r="6" fill="#24B1B1" />
              <circle cx="70" cy="80" r="5" fill="#24B1B1" />
              <circle cx="220" cy="230" r="6" fill="#FFE2AF" />
              <circle cx="60" cy="220" r="5" fill="#24B1B1" />
            </svg>
          </div>
        </div>
      </section>

      {/* ================= ABOUT THE EVENT ================= */}
      <section className="container" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <p className="eyebrow">About Us</p>
          <h2 style={{ fontSize: '2.4rem', margin: '0.5rem 0 1.25rem' }}>
            Transforming <span className="heading-accent">Ideas into Research</span>
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            NEXORA – Emerging Technology and Interdisciplinary Innovation Conference 2026 is an academic research conference
            organized to provide undergraduate and postgraduate students with a premier platform to explore, develop, and present
            cutting-edge solutions across emerging technological domains.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            The conference encourages students to go beyond standard coursework through peer-reviewed research, scientific rigor,
            and presentation before eminent academic panels.
          </p>
        </div>

        {/* 3 Quick Info Metric Cards */}
        <div className="grid-3" style={{ marginBottom: '3.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
            <div style={{ background: 'var(--accent-soft)', color: 'var(--accent-teal)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <Calendar size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                Conference Day
              </p>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>14 Oct 2026</h4>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
            <div style={{ background: 'var(--status-pending-bg)', color: 'var(--accent-amber)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                Venue
              </p>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.15rem', color: 'var(--text-primary)' }}>APJ Abdul Kalam Auditorium</h4>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
            <div style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <Award size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                Registration Fee
              </p>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                ₹{config?.registrationFee || 100} / participant
              </h4>
            </div>
          </div>
        </div>

        {/* Highlights List Card */}
        <div className="card" style={{ border: '1px solid var(--border)', padding: '2.25rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--dark-teal)' }}>Conference Highlights</h3>
          <div className="grid-2">
            {[
              'Structured scientific stages: Abstract & Poster screening followed by oral defense',
              'Five multidisciplinary tracks encompassing modern computing and sustainability',
              'Detailed constructive critique from experienced academicians and research supervisors',
              'Official Certificates of Presentation and Merit Awards for top research works',
              'Selected high-scoring research papers recommended for proceedings publication',
              'Networking forum connecting promising student innovators across regional institutions',
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOST INSTITUTION & CLUBS ================= */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4.5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <p className="eyebrow">Host Institution</p>
            <h2 style={{ fontSize: '2.2rem', margin: '0.4rem 0 0.8rem' }}>
              Hindustan College of <span className="heading-accent">Science & Technology</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              A NAAC A+ accredited institution under the Sharda Group, Farah, Mathura. Established in 1996 among the first
              self-financed engineering colleges in North India, affiliated with AKTU Lucknow and approved by AICTE.
            </p>
          </div>

          <div className="grid-2">
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src="/images/byte-logo.png"
                  alt="Byte Club"
                  style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fff', border: '1px solid var(--border)', padding: '4px' }}
                />
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>BYTE CLUB</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600 }}>CSE Department Society</p>
                </div>
              </div>
              <p style={{ flex: 1, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                BYTE Club is the Computer Science & Engineering student society at HCST, committed to technical excellence,
                coding bootcamps, open-source development, and research mentorship.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600, fontStyle: 'italic', margin: 0 }}>
                Faculty Coordinator: Mr. Gaurav Pandey
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src="/images/qubit-logo.jpeg"
                  alt="Qubit Society"
                  style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fff', border: '1px solid var(--border)', padding: '4px' }}
                />
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>QUBIT TECH SOCIETY</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600 }}>IT Department Society</p>
                </div>
              </div>
              <p style={{ flex: 1, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                QUBIT is the Information Technology Association at HCST, driving practical IT competencies, cloud architectures,
                student research symposiums, and cybersecurity literacy.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600, fontStyle: 'italic', margin: 0 }}>
                Faculty Coordinator: Mr. Utkarsh Gupta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESEARCH TRACKS ================= */}
      <section className="container" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <p className="eyebrow">Research Domains</p>
          <h2 style={{ fontSize: '2.2rem', margin: '0.4rem 0 0.8rem' }}>
            Explore the 5 <span className="heading-accent">Conference Tracks</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Select from our multidisciplinary conference tracks designed to welcome both specialized and cross-domain student research papers.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          {[
            {
              title: 'AI / ML',
              desc: 'Deep learning, NLP, computer vision, generative models, robotics vision, and trustworthy AI.',
              badge: 'Track 1',
            },
            {
              title: 'Data Science',
              desc: 'Big data systems, predictive statistical analytics, visual analytics, and privacy engineering.',
              badge: 'Track 2',
            },
            {
              title: 'Emerging Tech',
              desc: 'IoT architectures, edge cloud systems, cybersecurity, quantum computing, AR/VR, and robotics.',
              badge: 'Track 3',
            },
            {
              title: 'Sustainable Tech',
              desc: 'Green computing, smart grids, renewable energy automation, circular tech, and climate technologies.',
              badge: 'Track 4',
            },
            {
              title: 'Interdisciplinary Innovation',
              desc: 'Digital healthcare, EdTech, AgriTech systems, HCI, and socio-economic technology deployments.',
              badge: 'Track 5',
            },
          ].map((track, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{track.title}</h3>
                <span className="badge badge-info">{track.badge}</span>
              </div>
              <p style={{ flex: 1, color: 'var(--text-secondary)' }}>{track.desc}</p>
            </div>
          ))}

          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              border: '2px dashed var(--accent-teal)',
              background: 'var(--accent-soft)',
            }}
          >
            <Sparkles size={32} color="var(--accent-teal)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Detailed Guidelines</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              Check full scope, formatting instructions, and rules.
            </p>
            <Link to="/tracks" className="btn btn-outline btn-sm">
              View All Tracks
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE & STAGES ================= */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4.5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <p className="eyebrow">Key Milestones</p>
            <h2 style={{ fontSize: '2.2rem', margin: '0.4rem 0 0.8rem' }}>
              Stages & <span className="heading-accent">Timeline</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Ensure your submissions and registrations are finalized ahead of the respective deadlines.
            </p>
          </div>

          <div className="grid-4">
            <div className="card">
              <span className="badge badge-pending" style={{ marginBottom: '0.75rem' }}>Round 1</span>
              <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>Abstract & Poster</h4>
              <p style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                {formatIST(config?.submissionDeadline || '2026-09-30T18:29:59.000Z')}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                All registered teams submit their 150-word abstract & research poster across their chosen track.
              </p>
            </div>

            <div className="card">
              <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Screening</span>
              <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>Acceptance Notice</h4>
              <p style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                08 October 2026
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Shortlisted participants receive acceptance emails and instructions for final presentations.
              </p>
            </div>

            <div className="card">
              <span className="badge badge-pending" style={{ marginBottom: '0.75rem' }}>Round 2</span>
              <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>Paper Submission</h4>
              <p style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                12 October 2026
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Shortlisted authors upload complete research papers ahead of the evaluation committee review.
              </p>
            </div>

            <div className="card" style={{ borderColor: 'var(--accent-teal)' }}>
              <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Final Day</span>
              <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>Conference Day</h4>
              <p style={{ color: 'var(--accent-teal)', fontWeight: 700, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                14 October 2026
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Live research presentations, keynote lectures, evaluation panels, and prize distributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP SECTION ================= */}
      <section className="container" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <p className="eyebrow">Honorable Mentors</p>
          <h2 style={{ fontSize: '2.2rem', margin: '0.4rem 0 0.8rem' }}>
            The People Behind <span className="heading-accent">NEXORA 2026</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Guided by visionary leadership committed to nurturing scientific curiosity and academic excellence.
          </p>
        </div>

        <div className="grid-3">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2px solid var(--accent-teal)',
                  background: 'var(--accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={leader.photo}
                  alt={leader.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span style="font-weight:700; color:var(--accent-teal); font-size:1.1rem">${leader.name.slice(0, 2)}</span>`;
                  }}
                />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {leader.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 500 }}>
                  {leader.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="container" style={{ paddingBottom: '4.5rem' }}>
        <div
          className="card"
          style={{
            background: 'var(--dark-teal)',
            color: '#ffffff',
            border: 'none',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Be Part of NEXORA 2026</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem', color: '#C3DEDC' }}>
            Register your team today, submit your abstract before the deadline, and present your work to an esteemed academic audience.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-primary btn-lg"
              style={{
                background: 'var(--accent-cream)',
                color: 'var(--dark-teal) !important',
                border: 'none',
                fontWeight: 700,
              }}
            >
              Register Now →
            </Link>
            <Link
              to="/guidelines"
              className="btn btn-outline btn-lg"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
              }}
            >
              View Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
