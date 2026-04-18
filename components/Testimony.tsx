import React from 'react'

const Testimony = () => {
  return (
    <div>
            <section style={{ padding: '3rem 2rem' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a5c2a', marginBottom: '0.5rem' }}>
          Student voices
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.65rem', fontWeight: 700, color: '#111', marginBottom: '1.5rem', lineHeight: 1.3 }}>
          What students are saying
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { initials: 'AO', name: 'Ayomide O.', dept: 'Computer Technology, ND2', quote: '"I was scared to walk into the counselling office on campus. This platform let me talk to someone from my room. It genuinely helped me during exams."' },
            { initials: 'CU', name: 'Chidinma U.', dept: 'Business Administration, ND1', quote: '"The self-assessment showed me I was more stressed than I realised. Booking a session was so easy — no long queues, no awkward conversations."' },
            { initials: 'TE', name: 'Tobi E.', dept: 'Electrical Engineering, HND1', quote: '"Anonymous mode was a lifesaver. I didn\'t want anyone to know I was struggling. This platform made me feel safe enough to ask for help."' },
          ].map(({ initials, name, dept, quote }) => (
            <div key={name} style={{
              background: '#fff', border: '1px solid #e2e8e4',
              borderRadius: '12px', padding: '1.1rem',
            }}>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, marginBottom: '12px', fontStyle: 'italic' }}>{quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#1a5c2a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 500, flexShrink: 0,
                }}>{initials}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#111' }}>{name}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{dept}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Testimony