import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, lozinka);
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
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-secondary)' }}>Prijava (Login)</h2>
        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>Dobrodošli nazad! Unesite vaše podatke da pristupite korpi i listi želja.</p>
        
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
              placeholder="Min. 6 karaktera"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
              style={inputStyle}
            />
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
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', textAlign: 'center' }}>
          Nemate nalog? <Link to="/register" style={{ color: 'hsl(var(--primary))', fontWeight: 600, textDecoration: 'none' }}>Registrujte se ovde</Link>
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

export default Login;
