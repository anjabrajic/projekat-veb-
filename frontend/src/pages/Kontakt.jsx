import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Kontakt = () => {
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [naslov, setNaslov] = useState('');
  const [poruka, setPoruka] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuliramo slanje poruke na 1.5 sekundi
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setIme('');
      setEmail('');
      setNaslov('');
      setPoruka('');
      
      // Resetujemo status uspeha nakon 5 sekundi
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="app-container" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Glavni naslov sa zelenim gradijentom */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.8rem', 
          marginBottom: '0.75rem', 
          fontFamily: 'var(--font-secondary)',
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800
        }}>
          Kontaktirajte Nas 🌱
        </h1>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Imate pitanje, predlog ili želite saradnju? Tu smo da vam pomognemo i odgovorimo u najkraćem roku.
        </p>
      </div>

      {/* Grid raspored: 2 kolone na desktopu, 1 na mobilnom */}
      <div className="kontakt-grid" style={gridStyle}>
        
        {/* LEVA STRANA - Informacije i radno vreme */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Informacije */}
          <div className="card" style={{ padding: '2rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: 'var(--font-secondary)', color: 'hsl(var(--primary))' }}>
              Naši Podaci
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Adresa */}
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Bulevar+oslobodjenja+50,+Novi+Sad" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ ...infoRowStyle, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const pElement = e.currentTarget.querySelector('.address-text');
                  if (pElement) pElement.style.color = 'hsl(var(--primary))';
                }}
                onMouseLeave={(e) => {
                  const pElement = e.currentTarget.querySelector('.address-text');
                  if (pElement) pElement.style.color = 'hsl(var(--text-primary))';
                }}
              >
                <div style={iconBoxStyle}>
                  <MapPin size={22} color="hsl(var(--primary))" />
                </div>
                <div>
                  <h4 style={infoTitleStyle}>Adresa</h4>
                  <p className="address-text" style={{ ...infoValueStyle, transition: 'var(--transition)' }}>
                    Bulevar oslobođenja 50, Novi Sad
                  </p>
                </div>
              </a>

              {/* Telefon */}
              <a 
                href="tel:+38121555666" 
                style={{ ...infoRowStyle, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const pElement = e.currentTarget.querySelector('.phone-text');
                  if (pElement) pElement.style.color = 'hsl(var(--primary))';
                }}
                onMouseLeave={(e) => {
                  const pElement = e.currentTarget.querySelector('.phone-text');
                  if (pElement) pElement.style.color = 'hsl(var(--text-primary))';
                }}
              >
                <div style={iconBoxStyle}>
                  <Phone size={22} color="hsl(var(--primary))" />
                </div>
                <div>
                  <h4 style={infoTitleStyle}>Telefon</h4>
                  <p className="phone-text" style={{ ...infoValueStyle, transition: 'var(--transition)' }}>
                    +381 21 555 666
                  </p>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:podrska@zdravahrana.rs" 
                style={{ ...infoRowStyle, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const pElement = e.currentTarget.querySelector('.email-text');
                  if (pElement) pElement.style.color = 'hsl(var(--primary))';
                }}
                onMouseLeave={(e) => {
                  const pElement = e.currentTarget.querySelector('.email-text');
                  if (pElement) pElement.style.color = 'hsl(var(--text-primary))';
                }}
              >
                <div style={iconBoxStyle}>
                  <Mail size={22} color="hsl(var(--primary))" />
                </div>
                <div>
                  <h4 style={infoTitleStyle}>Email adresa</h4>
                  <p className="email-text" style={{ ...infoValueStyle, transition: 'var(--transition)' }}>
                    podrska@zdravahrana.rs
                  </p>
                </div>
              </a>

            </div>
          </div>

          {/* Radno Vreme */}
          <div className="card" style={{ padding: '2rem', textAlign: 'left', borderLeft: '4px solid hsl(var(--primary))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Clock size={24} color="hsl(var(--primary))" />
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-secondary)', margin: 0 }}>
                Radno Vreme
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div style={workDayRowStyle}>
                <span>Ponedeljak - Petak</span>
                <strong>08:00 - 20:00</strong>
              </div>
              <div style={workDayRowStyle}>
                <span>Subota</span>
                <strong>09:00 - 15:00</strong>
              </div>
              <div style={workDayRowStyle}>
                <span>Nedelja</span>
                <strong style={{ color: 'hsl(0 70% 45%)' }}>Zatvoreno</strong>
              </div>
            </div>
          </div>

        </div>

        {/* DESNA STRANA - Kontakt Forma */}
        <div className="card" style={{ padding: '2.5rem', textAlign: 'left', position: 'relative' }}>
          
          {success ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '2rem 0',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <CheckCircle size={64} color="hsl(var(--primary))" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-secondary)' }}>Poruka je poslata!</h3>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1rem' }}>
                Hvala vam na javljanju. Naš tim će vas kontaktirati u najkraćem mogućem roku.
              </p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-secondary)' }}>
                Pošaljite nam poruku
              </h3>
              <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Popunite formu ispod i dobićete odgovor na vašu email adresu.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                
                {/* Ime i Prezime */}
                <div>
                  <label htmlFor="ime" style={labelStyle}>Ime i prezime</label>
                  <input
                    id="ime"
                    type="text"
                    placeholder="Unesite vaše ime i prezime"
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'hsl(var(--primary))';
                      e.target.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'hsl(var(--border))';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Email Adresa */}
                <div>
                  <label htmlFor="email" style={labelStyle}>Email adresa</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="npr. ime@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'hsl(var(--primary))';
                      e.target.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'hsl(var(--border))';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Naslov Poruke */}
                <div>
                  <label htmlFor="naslov" style={labelStyle}>Naslov poruke</label>
                  <input
                    id="naslov"
                    type="text"
                    placeholder="O čemu se radi?"
                    value={naslov}
                    onChange={(e) => setNaslov(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'hsl(var(--primary))';
                      e.target.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'hsl(var(--border))';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Tekst Poruke */}
                <div>
                  <label htmlFor="poruka" style={labelStyle}>Vaša poruka</label>
                  <textarea
                    id="poruka"
                    placeholder="Napišite vašu poruku ovde..."
                    rows={5}
                    value={poruka}
                    onChange={(e) => setPoruka(e.target.value)}
                    required
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'hsl(var(--primary))';
                      e.target.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'hsl(var(--border))';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Dugme za slanje */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.5rem',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'var(--transition)',
                    fontFamily: 'var(--font-primary)',
                    marginTop: '0.5rem',
                    boxShadow: '0 4px 6px hsl(var(--primary) / 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'hsl(var(--primary-hover))';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'hsl(var(--primary))';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? (
                    <span>Slanje...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Pošalji poruku</span>
                    </>
                  )}
                </button>

              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

// --- STILOVI ---

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2.5rem',
  width: '100%'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const iconBoxStyle = {
  width: '45px',
  height: '45px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'hsl(var(--primary-light))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const infoTitleStyle = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'hsl(var(--text-secondary))',
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const infoValueStyle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'hsl(var(--text-primary))',
  margin: '0.15rem 0 0 0'
};

const workDayRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid hsl(var(--border))'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: 600,
  marginBottom: '0.4rem',
  color: 'hsl(var(--text-primary))'
};

const inputStyle = {
  width: '100%',
  padding: '0.8rem 1rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--bg-primary))',
  color: 'hsl(var(--text-primary))',
  fontFamily: 'var(--font-primary)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'var(--transition)'
};

export default Kontakt;
