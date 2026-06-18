import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-grid">
        
        
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            🌱 Zeleni Kutak
          </Link>
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
            Zeleni Kutak je online prodavnica sertifikovane organske hrane, zdravih ulja, semena i prirodnih začina. Naš cilj je da zdravu ishranu učinimo dostupnom svima.
          </p>
          <div className="footer-social-row">
            <a 
              href="https://www.facebook.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-icon"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-icon"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        
        <div className="footer-col">
          <h3 className="footer-col-title">Brzi Linkovi</h3>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Početna</Link></li>
            <li><Link to="/proizvodi" className="footer-link">Proizvodi</Link></li>
            <li><Link to="/kontakt" className="footer-link">Kontakt</Link></li>
          </ul>
        </div>

        
        <div className="footer-col">
          <h3 className="footer-col-title">Gde Se Nalazimo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
            
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Bulevar+oslobodjenja+50,+Novi+Sad" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-info-item footer-info-link"
            >
              <MapPin size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Zeleni Kutak Novi Sad</strong>
                <div style={{ fontSize: '0.85rem', color: '#8d9590', marginTop: '0.15rem' }}>
                  Bulevar oslobođenja 50 (lokal u prizemlju)
                </div>
              </div>
            </a>

            <div className="footer-info-item">
              <Phone size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
              <a href="tel:+38121555666" className="footer-info-link">+381 21 555 666</a>
            </div>

            <div className="footer-info-item">
              <Mail size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
              <a href="mailto:podrska@zdravahrana.rs" className="footer-info-link">podrska@zdravahrana.rs</a>
            </div>

            <div className="footer-info-item" style={{ borderTop: '1px solid hsl(var(--border) / 0.1)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <Clock size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Radno Vreme:</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
                  Ponedeljak - Petak: 08:00 - 20:00 h
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                  Subota: 09:00 - 15:00 h
                </div>
                <div style={{ fontSize: '0.85rem', color: 'hsl(0 60% 55%)' }}>
                  Nedelja: Zatvoreno
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      
      <div className="footer-bottom-bar">
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} Zeleni Kutak. Sva prava zadržana. Inspirisano sa zdravologija.rs.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
