'use client';

import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#ffffff', color: '#111', margin: 0, padding: 0 }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --green-dark: #1a5c2a;
          --green-mid: #2a7a3b;
          --green-light: #e8f5ec;
          --gold: #d4900a;
          --gold-light: #fdf3dc;
          --gold-bright: #f5b829;
          --white: #ffffff;
          --text-dark: #111;
          --text-muted: #555;
          --border: #e2e8e4;
          --ff-display: 'Playfair Display', Georgia, serif;
          --ff-body: 'DM Sans', sans-serif;
        }

        .nav-links a:hover { color: #f5b829 !important; }
        .feature-card:hover { border-top-color: #d4900a !important; }
        .footer-links a:hover { color: #f5b829 !important; }

        .btn-primary:hover { background: #e0a820 !important; }
        .btn-outline:hover { background: rgba(255,255,255,0.1) !important; }
        .nav-cta:hover { background: #e0a820 !important; }
        .anon-btn:hover { background: #e0a820 !important; }
        .cta-btn-main:hover { background: #2d7a3e !important; }
        .cta-btn-sec:hover { background: rgba(26,92,42,0.08) !important; }

        @media (max-width: 600px) {
          .hero h1 { font-size: 1.8rem !important; }
          .hero-stats { gap: 1rem !important; }
          .nav-links { display: none !important; }
          .footer-top { flex-direction: column !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
        background: '#1a5c2a',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#f5b829', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#1a5c2a',
            flexShrink: 0,
          }}>YCT</div>
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500, lineHeight: 1.2 }}>
            MindBridge
            <div style={{ fontSize: '10px', opacity: 0.7, fontWeight: 400 }}>Yabatech Mental Health Platform</div>
          </div>
        </div>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>Home</a>
          <a href="/resources" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>Resources</a>
          <a href="/about" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>About</a>
          <a href="/contact" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>Contact</a>
          <a href="/login">
            <button className="nav-cta" style={{
              background: '#f5b829', color: '#1a5c2a', border: 'none',
              padding: '7px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer',
            }}>Login</button>
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a5c2a 0%, #2d7a3e 60%, #1e6b30 100%)',
        padding: '4rem 2rem 3.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(245,184,41,0.08)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '660px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(245,184,41,0.18)', border: '1px solid rgba(245,184,41,0.4)',
            color: '#f5b829', padding: '4px 12px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 500, marginBottom: '1.2rem',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f5b829' }} />
            Yaba College of Technology — Dept. of Computer Technology
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.4rem', fontWeight: 700,
            color: '#fff', lineHeight: 1.2, marginBottom: '1rem',
          }}>
            Your Mental Health<br />
            <span style={{ color: '#f5b829' }}>Matters Here.</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.82)', fontSize: '15px', lineHeight: 1.7,
            marginBottom: '2rem', maxWidth: '520px',
          }}>
            A safe, confidential, and student-friendly platform to access counselling support,
            self-assess your wellbeing, and connect with professional help — right here at Yabatech.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a href="/register">
              <button className="btn-primary" style={{
                background: '#f5b829', color: '#1a5c2a', border: 'none',
                padding: '11px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
              }}>Get Started — It&apos;s Free</button>
            </a>
            <a href="/anonymous">
              <button className="btn-outline" style={{
                background: 'transparent', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.4)',
                padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
              }}>Seek Help Anonymously</button>
            </a>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { num: '100%', lbl: 'Confidential' },
              { num: '24/7', lbl: 'Resource Access' },
              { num: 'Free', lbl: 'For all students' },
            ].map(({ num, lbl }) => (
              <div key={lbl}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f5b829', fontFamily: "'Playfair Display', serif" }}>{num}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '1px' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NOTICE BAR ── */}
      <div style={{
        background: '#fdf3dc', borderBottom: '1px solid #f0d8a0',
        padding: '10px 2rem', display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: '#d4900a', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="white">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1 1 0 011 1v3a1 1 0 01-2 0V5a1 1 0 011-1zm0 7a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        </div>
        <p style={{ fontSize: '13px', color: '#7a5500', lineHeight: 1.4 }}>
          <strong style={{ color: '#1a5c2a' }}>Anonymous support available.</strong>{' '}
          You can reach out and chat with a counsellor without sharing your name or matric number. Your privacy is fully protected.
        </p>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a5c2a', marginBottom: '0.5rem' }}>
          What we offer
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.65rem', fontWeight: 700, color: '#111', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          Everything you need, in one place
        </h2>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, maxWidth: '480px', marginBottom: '2rem' }}>
          From self-assessment to booking sessions with a professional counsellor — all designed specifically for Yabatech students.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            {
              title: 'Self-Assessment',
              desc: 'Take validated mental health checks (PHQ-9, GAD-7) and instantly understand your wellbeing score.',
              icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a5c2a" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
            },
            {
              title: 'Book Appointments',
              desc: 'Browse available counsellor slots and book a session in seconds — no phone calls, no queues.',
              icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a5c2a" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
            {
              title: 'Secure Messaging',
              desc: 'Chat privately with your assigned counsellor through our end-to-end encrypted messaging system.',
              icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a5c2a" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              ),
            },
            {
              title: 'Anonymous Mode',
              desc: 'Not ready to share your name? Use our anonymous access feature — no judgement, no exposure.',
              icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a5c2a" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
            },
            {
              title: 'Resource Library',
              desc: 'Browse articles, guides, and self-help materials on stress, anxiety, depression, and more.',
              icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a5c2a" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              ),
            },
            {
              title: 'Early Intervention',
              desc: 'Track your mood over time. Get notified when your scores suggest you need extra support.',
              icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a5c2a" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              ),
            },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="feature-card" style={{
              background: '#fff', border: '1px solid #e2e8e4',
              borderRadius: '12px', padding: '1.25rem',
              borderTop: '3px solid #1a5c2a',
              transition: 'border-top-color 0.2s',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '8px',
                background: '#e8f5ec', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '12px',
              }}>{icon}</div>
              <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#111', marginBottom: '6px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div style={{ margin: '0 1rem' }}>
        <div style={{ background: '#e8f5ec', borderRadius: '16px' }}>
          <section style={{ padding: '2.5rem 2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a5c2a', marginBottom: '0.5rem' }}>
              How it works
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.65rem', fontWeight: 700, color: '#111', marginBottom: '1.5rem', lineHeight: 1.3 }}>
              Three simple steps
            </h2>

            {[
              { n: '1', title: 'Create your account', desc: 'Register with your Yabatech email and matric number. It takes under 2 minutes. Or skip registration and use anonymous mode.' },
              { n: '2', title: 'Check your wellbeing', desc: 'Complete a short self-assessment to understand your current mental health status and get a personalised recommendation.' },
              { n: '3', title: 'Connect with support', desc: 'Book a counselling session, send a secure message, or browse our resource library — whatever feels right for you.' },
            ].map(({ n, title, desc }, i, arr) => (
              <div key={n} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '1rem 0',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(26,92,42,0.1)' : 'none',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#1a5c2a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 500, flexShrink: 0, marginTop: '2px',
                }}>{n}</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#1a5c2a', marginBottom: '3px' }}>{title}</h4>
                  <p style={{ fontSize: '13px', color: '#3a5e42', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* ── ANONYMOUS SECTION ── */}
      <div style={{ margin: '1.5rem 1rem 0' }}>
        <div style={{
          background: '#1a5c2a', borderRadius: '16px',
          padding: '2rem', color: '#fff',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#fff' }}>
            Not ready to share who you are?
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>
            That&apos;s completely okay. MindBridge lets you access counselling support without ever entering your name
            or matric number. Your conversation stays private — our system assigns you a random ID so no one,
            not even the admin, can trace it back to you.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['No name required', 'No matric number', 'Fully encrypted', 'NDPR compliant'].map((label) => (
              <span key={label} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.85)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
              }}>{label}</span>
            ))}
          </div>
          <a href="/anonymous">
            <button className="anon-btn" style={{
              background: '#f5b829', color: '#1a5c2a', border: 'none',
              padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer',
            }}>Start anonymous session</button>
          </a>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
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

      {/* ── FINAL CTA ── */}
      <div style={{ margin: '0 1rem' }}>
        <div style={{
          background: '#fdf3dc', borderRadius: '16px',
          padding: '2.5rem 2rem', textAlign: 'center',
          border: '1px solid #f0d8a0',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#1a5c2a', marginBottom: '0.5rem' }}>
            Ready to take the first step?
          </h2>
          <p style={{ fontSize: '13px', color: '#7a5500', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Join hundreds of Yabatech students who are taking charge of their mental health.<br />
            It&apos;s free, confidential, and built just for you.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register">
              <button className="cta-btn-main" style={{
                background: '#1a5c2a', color: '#fff', border: 'none',
                padding: '11px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
              }}>Create your account</button>
            </a>
            <a href="/anonymous">
              <button className="cta-btn-sec" style={{
                background: 'transparent', color: '#1a5c2a',
                border: '1.5px solid #1a5c2a',
                padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
              }}>Seek anonymous help</button>
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#1a5c2a', color: 'rgba(255,255,255,0.7)',
        padding: '2rem 2rem 1.5rem', marginTop: '3rem',
      }}>
        <div className="footer-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#f5b829', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#1a5c2a',
            }}>YCT</div>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500, lineHeight: 1.2 }}>
              MindBridge
              <div style={{ fontSize: '11px', opacity: 0.6, fontWeight: 400 }}>Dept. of Computer Technology, Yabatech</div>
            </div>
          </div>

          <div className="footer-links" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'About the Project', 'Contact Counsellors', 'Resources'].map((link) => (
              <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none' }}>{link}</a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
          &copy; 2025 MindBridge — Student Mental Health &amp; Counselling Platform, Yaba College of Technology, Lagos.
          Built by Group A, Dept. of Computer Technology.
        </div>
      </footer>
    </div>
  );
}