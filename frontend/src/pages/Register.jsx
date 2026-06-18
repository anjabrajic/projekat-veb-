import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [uloga, setUloga] = useState('registered');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(ime, email, lozinka, uloga);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="app-container" style={{ padding: '3rem 1rem' }}>
      <div className="card" style={{ textAlign: 'left' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-secondary)' }}>Registracija</h2>
        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>Kreirajte besplatan nalog i kupujte zdravu organsku hranu.</p>
        
        {error && (
          <div style={{
            backgroundColor: 'hsl(0 85% 97%)',
            border: '1px solid hsl(0 85% 90%)',
            color: 'hsl(0 70% 40%)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            fontWeight: 500,
            marginBottom: '1.5rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label htmlFor="ime" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Ime i prezime
            </label>
            <input
              id="ime"
              type="text"
              placeholder="npr. Petar Petrović"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Email adresa
            </label>
            <input
              id="email"
              type="email"
              placeholder="npr. petar@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="lozinka" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Lozinka
            </label>
            <input
              id="lozinka"
              type="password"
              placeholder="Minimalno 6 karaktera"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Izbor Uloge (Role) - Veoma korisno za lakše testiranje Admin Dashboard-a */}
          <div>
            <label htmlFor="uloga" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Uloga (Za potrebe testiranja)
            </label>
            <select
              id="uloga"
              value={uloga}
              onChange={(e) => setUloga(e.target.value)}
              style={inputStyle}
            >
              <option value="registered">Kupac (registered)</option>
              <option value="admin">Administrator (admin)</option>
            </select>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.2rem', display: 'block' }}>
              💡 Izaberite ulogu "Administrator" kako biste testirali pristup zaštićenom Admin panelu.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'var(--transition)',
              fontFamily: 'var(--font-primary)',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'hsl(var(--primary-hover))'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'hsl(var(--primary))'}
          >
            {loading ? 'Kreiranje naloga...' : 'Registruj se'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', textAlign: 'center' }}>
          Već imate nalog? <Link to="/login" style={{ color: 'hsl(var(--primary))', fontWeight: 600, textDecoration: 'none' }}>Prijavite se ovde</Link>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--bg-primary))',
  color: 'hsl(var(--text-primary))',
  fontFamily: 'var(--font-primary)',
  fontSize: '0.95rem'
};

export default Register;
