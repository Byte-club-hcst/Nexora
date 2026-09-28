import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

export default function Guidelines() {
  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>Submission Policies</span>
        </div>
        <h1 style={{ marginBottom: '0.75rem' }}>
          Author & Presentation <span className="heading-accent">Guidelines</span>
        </h1>
        <p style={{ fontSize: '1.05rem', marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
          Please carefully review all technical and ethical formatting specifications before submitting your research.
        </p>

        {/* Action card for Rulebook */}
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem',
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-teal)',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>Official Conference Rulebook (PDF)</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Comprehensive documentation covering judging rubrics, awards, and terms.
            </p>
          </div>
          <a
            href="/downloads/NEXORA_2026_Rulebook.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <Download size={16} />
            <span>Download Rulebook</span>
          </a>
        </div>

        {/* Section 1: Authorship & Team Structure */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--dark-teal)', marginBottom: '1rem' }}>
            1. Authorship & Team Composition
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Each submission may have between <strong>1 and 4 authors</strong> (student researchers or faculty co-authors).</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>For each author, you must furnish: Full Name, Course (e.g. B.Tech, M.Tech, BCA, MCA), Academic Branch, and Year of study.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>A student may be a primary author on only <strong>one submission</strong> per track.</span>
            </li>
          </ul>
        </div>

        {/* Section 2: Round 1 Abstract & Poster */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--dark-teal)', marginBottom: '1rem' }}>
            2. Round 1: Abstract & Poster Requirements
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <FileText size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Abstract:</strong> Must not exceed ~150-250 words, succinctly stating problem statement, proposed methodology, key findings, and keywords (3-6).</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <FileText size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Abstract Document:</strong> Uploaded strictly as a single <strong>PDF</strong> document (maximum file size <strong>10MB</strong>).</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <FileText size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Research Poster:</strong> Uploaded as <strong>PDF, PNG, or JPG/JPEG</strong> (maximum file size <strong>10MB</strong>). Should be clearly readable in standard A1 / A2 orientation.</span>
            </li>
          </ul>
        </div>

        {/* Section 3: Plagiarism & Originality */}
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'rgba(179, 38, 30, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlertTriangle size={22} color="var(--status-error)" />
            <h2 style={{ fontSize: '1.35rem', color: 'var(--status-error)', margin: 0 }}>
              3. Originality & Academic Integrity
            </h2>
          </div>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Submissions must represent original, authentic research conducted by the listed authors.
          </p>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Plagiarism similarity index (excluding bibliography) must not exceed <strong>15%</strong>. Papers found to contain fabricated results, undisclosed AI text generation, or plagiarized materials will be summarily disqualified without refund.
          </p>
        </div>

        {/* Section 4: Round 2 Presentation */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--dark-teal)', marginBottom: '1rem' }}>
            4. Round 2: Oral Presentation Guidelines
          </h2>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Candidates shortlisted from Round 1 will be invited to present their research in-person before an academic panel on 14 October 2026.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            <li>• <strong>Presentation Time:</strong> 10 minutes oral presentation using PowerPoint/PDF slides.</li>
            <li>• <strong>Question & Answer:</strong> 3 minutes of questions from evaluation committee members.</li>
            <li>• <strong>Equipment:</strong> Projector, pointer, and podium microphone provided in every hall.</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/submission" className="btn btn-primary btn-lg">
            Proceed to Abstract Submission →
          </Link>
        </div>
      </div>
    </div>
  );
}
