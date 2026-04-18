import React from 'react'

const Footer = () => {
  return (
    <div>
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
  )
}

export default Footer