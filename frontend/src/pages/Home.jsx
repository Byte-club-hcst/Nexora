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
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 1.5rem 5rem',
          background: 'linear-gradient(180deg, rgba(10, 33, 33, 0.9) 0%, rgba(7, 22, 22, 0.98) 100%)',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(45, 212, 191, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '880px' }}>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>
            <span className="eyebrow-dot" />
            <span>National Student Research Conference</span>
          </div>

          <h1 style={{ marginBottom: '1.25rem' }}>
            Transforming Ideas into Research at{' '}
            <span className="heading-gradient">NEXORA 2026</span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
              fontStyle: 'italic',
            }}
          >
            "Emerging Technologies and Interdisciplinary Innovations for a Sustainable Future"
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Register for Conference</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/submission" className="btn btn-secondary btn-lg">
              <span>Submit Abstract</span>
            </Link>
            <a
              href="/downloads/NEXORA_2026_Rulebook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              <BookOpen size={18} />
              <span>Rulebook (PDF)</span>
            </a>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid-3" style={{ textAlign: 'left' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div style={{ background: 'rgba(45, 212, 191, 0.15)', color: 'var(--accent-teal-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <Calendar size={28} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Conference Date</p>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>14 October 2026</h4>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <MapPin size={28} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Venue Location</p>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>APJ Abdul Kalam Auditorium</h4>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-success)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <Award size={28} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registration Fee</p>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>₹{config?.registrationFee || 100} / participant</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT THE EVENT ================= */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>About NEXORA</span>
            </div>
            <h2 style={{ marginBottom: '1.25rem' }}>
              Fostering Scholarly Inquiry & <span className="heading-gradient">Technical Innovation</span>
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              NEXORA 2026 is an academic research conference dedicated to providing undergraduate and postgraduate
              students a premier forum to explore, develop, and present high-impact solutions to contemporary technological challenges.
            </p>
            <p style={{ marginBottom: '1.75rem' }}>
              Unlike typical classroom competitions, NEXORA guides participants through structured scientific stages: initial abstract and poster screening by review committees, followed by final oral presentations before distinguished evaluation panels.
            </p>
            <Link to="/about" className="btn btn-outline">
              <span>Read Full Mission & Objectives</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card" style={{ border: '1px solid rgba(45, 212, 191, 0.25)', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cream)' }}>Key Highlights</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                'Peer-reviewed abstract & poster screening',
                'Comprehensive 5 research tracks covering modern computing & sustainability',
                'Constructive feedback from senior academic faculty and industry experts',
                'Certificate of Presentation and merit awards for outstanding research',
                'Selected high-scoring papers shortlisted for conference proceedings',
              ].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={18} color="var(--accent-teal-light)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '0.95rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= HOST INSTITUTION & CLUBS ================= */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Host Institution</span>
            </div>
            <h2>Hindustan College of <span className="heading-gradient">Science & Technology</span></h2>
            <p style={{ marginTop: '0.75rem' }}>
              A NAAC A+ accredited institution under the Sharda Group, Farah, Mathura. Established in 1996 among the first self-financed engineering colleges in North India, affiliated with AKTU Lucknow and approved by AICTE.
            </p>
          </div>

          <div className="grid-2">
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src="/images/byte-logo.png"
                  alt="Byte Club"
                  style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fff', padding: '4px' }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>BYTE CLUB</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal-light)', fontWeight: 600 }}>CSE Department Society</p>
                </div>
              </div>
              <p style={{ flex: 1, marginBottom: '1rem' }}>
                BYTE Club is the Computer Science & Engineering student society at HCST, committed to technical excellence, hackathons, open-source development, algorithmic problem-solving, and career preparedness.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-cream)', fontStyle: 'italic' }}>
                Faculty Coordinator: Mr. Gaurav Pandey
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src="/images/qubit-logo.jpeg"
                  alt="Qubit Society"
                  style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fff', padding: '4px' }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>QUBIT TECH SOCIETY</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal-light)', fontWeight: 600 }}>IT Department Society</p>
                </div>
              </div>
              <p style={{ flex: 1, marginBottom: '1rem' }}>
                QUBIT is the Information Technology Association at HCST, focused on practical IT competencies, cloud architectures, network defense, student workshops, and emerging technologies.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-cream)', fontStyle: 'italic' }}>
                Faculty Coordinator: Mr. Utkarsh Gupta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESEARCH TRACKS ================= */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>Research Domains</span>
          </div>
          <h2>Explore the 5 <span className="heading-gradient">Conference Tracks</span></h2>
          <p>
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
                <h3 style={{ margin: 0 }}>{track.title}</h3>
                <span className="badge badge-info">{track.badge}</span>
              </div>
              <p style={{ flex: 1 }}>{track.desc}</p>
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
              background: 'rgba(45, 212, 191, 0.05)',
            }}
          >
            <Sparkles size={32} color="var(--accent-teal-light)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Ready to Submit?</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Review full track specifications and sample topics.</p>
            <Link to="/tracks" className="btn btn-outline btn-sm">
              View All Tracks
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE & STAGES ================= */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Key Milestones</span>
            </div>
            <h2>Stages & <span className="heading-gradient">Timeline</span></h2>
            <p>Ensure your submission and registrations are finalized ahead of the respective deadlines.</p>
          </div>

          <div className="grid-4">
            <div className="card">
              <span className="badge badge-pending" style={{ marginBottom: '0.75rem' }}>Round 1</span>
              <h4>Abstract & Poster</h4>
              <p style={{ color: 'var(--accent-cream)', fontWeight: 600, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                {formatIST(config?.submissionDeadline || '2026-09-30T18:29:59.000Z')}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                All registered teams submit their 150-word abstract & research poster across their chosen track.
              </p>
            </div>

            <div className="card">
              <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Screening</span>
              <h4>Acceptance Notice</h4>
              <p style={{ color: 'var(--accent-cream)', fontWeight: 600, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                08 October 2026
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                Shortlisted participants receive acceptance emails and instructions for final presentations.
              </p>
            </div>

            <div className="card">
              <span className="badge badge-pending" style={{ marginBottom: '0.75rem' }}>Round 2</span>
              <h4>Paper Submission</h4>
              <p style={{ color: 'var(--accent-cream)', fontWeight: 600, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                12 October 2026
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                Shortlisted authors upload complete research papers ahead of the evaluation committee review.
              </p>
            </div>

            <div className="card" style={{ borderColor: 'var(--accent-teal)' }}>
              <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Final Day</span>
              <h4>Conference Day</h4>
              <p style={{ color: 'var(--accent-teal-light)', fontWeight: 600, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                14 October 2026
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                Live research presentations, keynote lectures, evaluation panels, and prize distributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP SECTION ================= */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>Honorable Mentors</span>
          </div>
          <h2>The People Behind <span className="heading-gradient">NEXORA 2026</span></h2>
          <p>
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
                  background: 'var(--bg-secondary)',
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
                    e.target.parentElement.innerHTML = `<span style="font-weight:700; color:var(--accent-teal-light); font-size:1.1rem">${leader.name.slice(0, 2)}</span>`;
                  }}
                />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', color: '#fff' }}>{leader.name}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-cream)' }}>{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="container" style={{ paddingBottom: '5rem' }}>
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 46, 46, 0.95) 0%, rgba(5, 25, 25, 0.95) 100%)',
            border: '1px solid var(--accent-teal)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>Be Part of NEXORA 2026</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Register your team today, submit your abstract before the deadline, and present your work to an esteemed academic audience.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Register Now →
            </Link>
            <Link to="/guidelines" className="btn btn-outline btn-lg">
              View Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
