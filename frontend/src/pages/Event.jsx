import React from 'react';
import { Clock, MapPin, Users, Award, Coffee, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Event() {
  const schedule = [
    {
      time: '09:00 AM – 10:00 AM',
      title: 'Registration & Welcome Kit Distribution',
      desc: 'Participants report to the reception desk, receive conference badges, delegate kits, and verify presentation slots.',
      icon: Users,
    },
    {
      time: '10:00 AM – 11:15 AM',
      title: 'Inaugural Ceremony & Lighting of the Lamp',
      desc: 'Address by Shri P.K. Gupta (Chairman), Dr. R.S. Pavithra (Director), and opening keynote address by guest luminaries.',
      icon: BookOpen,
    },
    {
      time: '11:15 AM – 11:30 AM',
      title: 'High Tea & Poster Exhibition Walkthrough',
      desc: 'Delegates and judges interact around the research poster galleries set up in the main concourse.',
      icon: Coffee,
    },
    {
      time: '11:30 AM – 01:30 PM',
      title: 'Technical Session I: Oral Paper Presentations',
      desc: 'Parallel track sessions across AI/ML, Data Science, and Emerging Tech in designated auditoriums.',
      icon: Clock,
    },
    {
      time: '01:30 PM – 02:15 PM',
      title: 'Networking Lunch',
      desc: 'Hosted in the institute dining hall for all registered participants, faculty mentors, and session chairs.',
      icon: Coffee,
    },
    {
      time: '02:15 PM – 03:45 PM',
      title: 'Technical Session II: Oral Paper Presentations',
      desc: 'Parallel track sessions across Sustainable Tech and Interdisciplinary Innovations, Q&A with evaluation jury.',
      icon: Clock,
    },
    {
      time: '04:00 PM – 05:00 PM',
      title: 'Valedictory Ceremony & Awards Presentation',
      desc: 'Announcement of Best Paper Awards across each track, Certificate distribution, and closing remarks.',
      icon: Award,
    },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Conference Day Schedule</span>
        </div>
        <h1 style={{ marginBottom: '1.25rem' }}>
          Event <span className="heading-gradient">Overview & Itinerary</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          Join us on <strong>14 October 2026</strong> at the APJ Abdul Kalam Auditorium, HCST Mathura.
          Below is the day-long sequence of keynote lectures, parallel technical tracks, and awards.
        </p>

        {/* Schedule Rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {schedule.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    background: 'rgba(45, 212, 191, 0.12)',
                    color: 'var(--accent-teal-light)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{item.title}</h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cream)', background: 'rgba(255, 228, 181, 0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                      {item.time}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Venue Information */}
        <div className="card" style={{ border: '1px solid var(--accent-teal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <MapPin size={24} color="var(--accent-teal-light)" />
            <h3 style={{ margin: 0 }}>Venue & Logistics</h3>
          </div>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Location:</strong> Dr. A.P.J. Abdul Kalam Auditorium, HCST Campus, NH-19, Farah, Mathura.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>How to Reach:</strong> Located on the Delhi-Agra National Highway (NH-19). Well-connected via Mathura Junction Railway Station (18 km), Agra Cantt Railway Station (32 km), and local express bus services.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Link to="/register" className="btn btn-primary">
              Register for Event
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Organizing Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
