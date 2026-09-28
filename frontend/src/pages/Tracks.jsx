import React from 'react';
import { Link } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { Cpu, Database, Rocket, Leaf, GitMerge, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

export default function Tracks() {
  const { tracks } = useEvent();

  const trackIcons = {
    'AI/ML': Cpu,
    'Data Science': Database,
    'Emerging Tech': Rocket,
    'Sustainable Tech': Leaf,
    'Interdisciplinary Innovation': GitMerge,
  };

  const defaultTracks = [
    {
      id: 'AI/ML',
      name: 'Track 1: Artificial Intelligence & Machine Learning',
      description: 'Covers advances in fundamental and applied learning architectures, generative systems, sensory perception, and human-aligned intelligence.',
      topics: [
        'Deep Neural Network Architectures',
        'Large Language Models & Prompt Engineering',
        'Computer Vision & Object Detection',
        'Natural Language Understanding & Generation',
        'Explainable, Trustworthy & Responsible AI',
        'Reinforcement Learning & Multi-Agent Robotics',
      ],
    },
    {
      id: 'Data Science',
      name: 'Track 2: Data Science & Big Data Analytics',
      description: 'Focuses on scalable data pipelines, predictive statistical modeling, data governance, visual storytelling, and high-performance querying.',
      topics: [
        'Predictive Analytics & Statistical Inference',
        'Big Data Frameworks (Hadoop, Spark, Flink)',
        'Data Visualization & Visual Analytics',
        'Data Privacy & Federated Learning Paradigms',
        'Financial & Econometric Data Modeling',
        'Business Intelligence & Customer Analytics',
      ],
    },
    {
      id: 'Emerging Tech',
      name: 'Track 3: Emerging Technologies & Modern Computing',
      description: 'Explores transformative computing paradigms that redefine connectivity, decentralization, infrastructure, and human-machine immersion.',
      topics: [
        'Internet of Things (IoT) & Smart Sensors',
        'Cloud, Fog, & Ultra-Low Latency Edge Computing',
        'Blockchain, Smart Contracts & Distributed Ledgers',
        'Cybersecurity, Threat Intelligence & Cryptography',
        'Augmented, Virtual & Mixed Reality (AR/VR/XR)',
        'Autonomous Systems, Drones & Industrial Robotics',
      ],
    },
    {
      id: 'Sustainable Tech',
      name: 'Track 4: Sustainable & Green Technologies',
      description: 'Investigates technological solutions engineering a climate-resilient future, clean energy distribution, and waste-reduction cycles.',
      topics: [
        'Green Computing & Energy-Efficient Hardware',
        'Smart Grid & Renewable Energy Management',
        'Smart Cities & Urban Environmental Sensing',
        'Precision Agriculture & Water Resource Tech',
        'Electronic Waste Recycling & Circular Economy',
        'Carbon Footprint Auditing & Climate Modeling',
      ],
    },
    {
      id: 'Interdisciplinary Innovation',
      name: 'Track 5: Interdisciplinary Innovation',
      description: 'Welcomes cross-domain explorations where technology elevates public health, inclusive education, social empowerment, and humanities.',
      topics: [
        'Biomedical Informatics & Telehealth Platforms',
        'Educational Technology & Intelligent Tutoring',
        'Human-Computer Interaction (HCI) & Accessibility',
        'AgriTech Solutions for Smallholder Farmers',
        'Social Innovation & Civic Governance Platforms',
        'Technology Policy, Digital Ethics & Copyright Law',
      ],
    },
  ];

  const displayTracks = tracks && tracks.length > 0 ? tracks : defaultTracks;

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Research Domains</span>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>
          Conference <span className="heading-gradient">Tracks</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
          Authors are invited to submit original, unpublished research papers across one of our five tracks.
          Every track is evaluated by an expert sub-committee in the relevant technical domain.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {displayTracks.map((track, idx) => {
            const Icon = trackIcons[track.shortName || track.id] || Cpu;
            return (
              <div key={track.id || idx} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(45, 212, 191, 0.15)', color: 'var(--accent-teal-light)' }}>
                      <Icon size={26} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{track.name || track.id}</h2>
                      <span className="badge badge-info" style={{ marginTop: '0.25rem' }}>{track.shortName || track.id}</span>
                    </div>
                  </div>

                  <Link to={`/submission?track=${encodeURIComponent(track.shortName || track.id)}`} className="btn btn-primary btn-sm">
                    <span>Submit to Track</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <p style={{ marginBottom: '1.25rem' }}>{track.description}</p>

                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cream)', marginBottom: '0.65rem' }}>
                    Recommended Topic Areas:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(track.topics || []).map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '0.825rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
