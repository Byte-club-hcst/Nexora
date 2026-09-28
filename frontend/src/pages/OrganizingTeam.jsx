import React from 'react';
import { Phone, Mail, Award, Users } from 'lucide-react';

export default function OrganizingTeam() {
  const patronList = [
    { name: 'Shri P.K. Gupta', role: 'Chief Patron', designation: 'Chairman, Sharda Group of Institutions', photo: '/images/leaders/pkgupta.jpg' },
    { name: 'Shri Y.K. Gupta', role: 'Patron', designation: 'Vice Chairman, Sharda Group of Institutions', photo: '/images/leaders/ykgupta.jpg' },
    { name: 'Prof. Vinod Kumar Sharma', role: 'Co-Patron', designation: 'Executive Vice President, SGI', photo: '/images/leaders/vksharma.jpg' },
    { name: 'Dr. R.S. Pavithra', role: 'General Chair', designation: 'Director, HCST Mathura', photo: '/images/leaders/drrspavitra.png' },
    { name: 'Prof. M.S. Gaur', role: 'Conference Chair', designation: 'Dean R&D, HCST', photo: '/images/leaders/gaursir.png' },
  ];

  const facultyChairs = [
    { name: 'Dr. Shankar Thawkar', role: 'Department Chair (CSE)', designation: 'Head of Department, CSE', photo: '/images/leaders/Shankarsirhod.png' },
    { name: 'Mrs. Deepti Mittal', role: 'Department Chair (IT)', designation: 'Head of Department, IT', photo: '/images/leaders/Deeptimam.png' },
    { name: 'Mr. Gaurav Pandey', role: 'Convener & Faculty Coordinator', designation: 'Assistant Professor (CSE) & Byte Club Coordinator', photo: '/images/leaders/gauravsir.jpeg' },
    { name: 'Mr. Utkarsh Gupta', role: 'Co-Convener & Faculty Coordinator', designation: 'Assistant Professor (IT) & Qubit Club Coordinator', photo: '/images/leaders/utkarshsir.jpeg' },
  ];

  const studentCoordinators = [
    { name: 'Akshita Mathur', role: 'Lead Student Coordinator', club: 'BYTE Club', phone: '+91 70550 02687', branch: 'CSE 4th Year' },
    { name: 'Kunal Rathore', role: 'Technical Head & Coordinator', club: 'BYTE Club', phone: '+91 75057 08793', branch: 'CSE 4th Year' },
    { name: 'Vinarm Verma', role: 'Operations & Event Lead', club: 'QUBIT Club', phone: '+91 90456 61289', branch: 'IT 4th Year' },
    { name: 'Divyansh Agrawal', role: 'Submissions & Review Desk', club: 'BYTE Club', phone: '+91 88812 34567', branch: 'CSE 3rd Year' },
    { name: 'Priya Sharma', role: 'Hospitality & Delegate Relations', club: 'QUBIT Club', phone: '+91 98971 23456', branch: 'IT 3rd Year' },
    { name: 'Rohan Saxena', role: 'Logistics & Stage Management', club: 'BYTE Club', phone: '+91 78950 98765', branch: 'CSE 3rd Year' },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Committees & Leadership</span>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>
          Organizing <span className="heading-gradient">Team & Committee</span>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
          Meet the academic mentors and student leaders driving the success of NEXORA 2026.
        </p>

        {/* Advisory Patrons */}
        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-cream)', marginBottom: '1.5rem' }}>
          Chief Patrons & Institutional Leadership
        </h2>
        <div className="grid-3" style={{ marginBottom: '3.5rem' }}>
          {patronList.map((leader, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <img
                src={leader.photo}
                alt={leader.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-teal)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h4 style={{ margin: '0 0 0.2rem', color: '#fff' }}>{leader.name}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-teal-light)', fontWeight: 600 }}>{leader.role}</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{leader.designation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Faculty Conveners */}
        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-cream)', marginBottom: '1.5rem' }}>
          Department Chairs & Faculty Coordinators
        </h2>
        <div className="grid-2" style={{ marginBottom: '3.5rem' }}>
          {facultyChairs.map((leader, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
              <img
                src={leader.photo}
                alt={leader.name}
                style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-teal)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem', color: '#fff' }}>{leader.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-teal-light)', fontWeight: 600 }}>{leader.role}</p>
                <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{leader.designation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Student Organizing Committee */}
        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-cream)', marginBottom: '1.5rem' }}>
          Student Core Committee
        </h2>
        <div className="grid-3">
          {studentCoordinators.map((stud, idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#fff' }}>{stud.name}</h4>
                <span className="badge badge-info">{stud.club}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-teal-light)', fontWeight: 600, margin: '0 0 0.25rem' }}>
                {stud.role}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {stud.branch}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-cream)' }}>
                <Phone size={14} />
                <a href={`tel:${stud.phone.replace(/[^0-9]/g, '')}`} style={{ color: 'inherit' }}>{stud.phone}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
