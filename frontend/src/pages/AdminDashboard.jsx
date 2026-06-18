import React, { useState, useEffect } from 'react';
import axiosActual from 'axios';

// Rezervni mock podaci ako backend nije dostupan
const MOCK_PRODUCTS = [
  { _id: '60c72b2f9b1d8b2e88a0e101', naziv: 'Hladno ceđeno kokosovo ulje', opis: 'Ekstra devičansko organsko kokosovo ulje, 500ml', cena: 750, kategorija: 'Ulja', zalihe: 25, slikaUrl: '/images/kokos_ulje.png' },
  { _id: '60c72b2f9b1d8b2e88a0e102', naziv: 'Bio Chia Semenke', opis: 'Bogate omega-3 masnim kiselinama, 250g', cena: 320, kategorija: 'Semenke', zalihe: 100, slikaUrl: '/images/chia_semenke.png' },
  { _id: '60c72b2f9b1d8b2e88a0e103', naziv: 'Ekstra devičansko maslinovo ulje', opis: 'Hladno ceđeno u Grčkoj, 1L', cena: 1200, kategorija: 'Ulja', zalihe: 15, slikaUrl: '/images/maslinovo_ulje.png' },
  { _id: '60c72b2f9b1d8b2e88a0e104', naziv: 'Himalajska roze so', opis: 'Fino mlevena, čista i nerafinisana, 500g', cena: 180, kategorija: 'Začini', zalihe: 50, slikaUrl: '/images/himalajska_so.png' },
  { _id: '60c72b2f9b1d8b2e88a0e105', naziv: 'Organska kurkuma u prahu', opis: 'Zlatni indijski začin, moćan antioksidans, 100g', cena: 450, kategorija: 'Začini', zalihe: 40, slikaUrl: '/images/kurkuma.png' },
  { _id: '60c72b2f9b1d8b2e88a0e106', naziv: 'Cejlonski cimet u prahu', opis: 'Pravi cejlonski cimet izuzetnog mirisa i ukusa, 100g', cena: 380, kategorija: 'Začini', zalihe: 35, slikaUrl: '/images/cimet.png' },
  { _id: '60c72b2f9b1d8b2e88a0e107', naziv: 'Organsko laneno seme', opis: 'Smeđe laneno seme iz organskog uzgoja, 250g', cena: 150, kategorija: 'Semenke', zalihe: 60, slikaUrl: '/images/laneno_seme.png' },
  { _id: '60c72b2f9b1d8b2e88a0e108', naziv: 'Oljušteno seme konoplje', opis: 'Semenke konoplje izuzetne nutritivne vrednosti, 200g', cena: 550, kategorija: 'Semenke', zalihe: 30, slikaUrl: '/images/seme_konoplje.png' },
  { _id: '60c72b2f9b1d8b2e88a0e109', naziv: 'Organski đumbir u prahu', opis: 'Fino mleveni sušeni koren đumbira, 100g', cena: 280, kategorija: 'Začini', zalihe: 45, slikaUrl: '/images/djumbir.png' },
  { _id: '60c72b2f9b1d8b2e88a0e110', naziv: 'Sirovi indijski orah', opis: 'Kvalitetan sirovi indijski orah, 250g', cena: 950, kategorija: 'Orašasti plodovi', zalihe: 20, slikaUrl: '/images/indijski_orah.png' },
  { _id: '60c72b2f9b1d8b2e88a0e111', naziv: 'Organske urme (datulje)', opis: 'Prirodno slatke urme bez dodatih šećera i konzervansa, 250g', cena: 420, kategorija: 'Sušeno voće', zalihe: 25, slikaUrl: '/images/urme.png' }
];

const MOCK_ORDERS = [
  {
    _id: '60c72b2f9b1d8b2e88a0e201',
    korisnik: { ime: 'Marko Marković', email: 'marko@example.com' },
    stavke: [
      { proizvod: { naziv: 'Hladno ceđeno kokosovo ulje' }, kolicina: 2, cena: 750 },
      { proizvod: { naziv: 'Bio Chia Semenke' }, kolicina: 1, cena: 320 }
    ],
    ukupnaCena: 1820,
    statusPlacanja: true,
    datum: '2026-06-15T20:15:30.000Z'
  },
  {
    _id: '60c72b2f9b1d8b2e88a0e202',
    korisnik: { ime: 'Milica Jovanović', email: 'milica@example.com' },
    stavke: [
      { proizvod: { naziv: 'Himalajska roze so' } , kolicina: 3, cena: 180 }
    ],
    ukupnaCena: 540,
    statusPlacanja: false,
    datum: '2026-06-15T21:10:00.000Z'
  }
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  // Form state
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [cena, setCena] = useState('');
  const [kategorija, setKategorija] = useState('Ulja');
  const [zalihe, setZalihe] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    // 1. Fetch Products
    setLoadingProducts(true);
    let mockActive = false;
    try {
      const res = await axiosActual.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.warn('Backend offline, učitavanje mock admin liste proizvoda...');
      setProducts(MOCK_PRODUCTS);
      mockActive = true;
    } finally {
      setLoadingProducts(false);
    }

    // 2. Fetch Orders
    setLoadingOrders(true);
    try {
      const res = await axiosActual.get('/api/orders');
      setOrders(res.data);
      setUsingMock(mockActive);
    } catch (err) {
      console.warn('Backend offline, učitavanje mock porudžbina...');
      setOrders(MOCK_ORDERS);
      setUsingMock(true);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!naziv || !cena || !kategorija) {
      alert('Molimo unesite obavezna polja (naziv, cena, kategorija).');
      return;
    }

    const itemData = {
      naziv,
      opis,
      cena: Number(cena),
      kategorija,
      zalihe: Number(zalihe || 0)
    };

    if (editingId) {
      try {
        const res = await axiosActual.put(`/api/products/${editingId}`, itemData);
        setProducts(prev => prev.map(p => p._id === editingId ? res.data : p));
        alert('Proizvod uspešno izmenjen!');
      } catch (err) {
        if (usingMock) {
          setProducts(prev => prev.map(p => p._id === editingId ? { ...p, ...itemData } : p));
          alert('Proizvod izmenjen lokalno (Mock)!');
        } else {
          alert('Greška prilikom izmene: ' + (err.response?.data?.message || err.message));
        }
      }
    } else {
      try {
        const res = await axiosActual.post('/api/products', itemData);
        setProducts(prev => [...prev, res.data]);
        alert('Proizvod uspešno kreiran!');
      } catch (err) {
        if (usingMock) {
          const newMock = {
            _id: Math.random().toString(36).substr(2, 9),
            ...itemData
          };
          setProducts(prev => [...prev, newMock]);
          alert('Proizvod dodat lokalno (Mock)!');
        } else {
          alert('Greška prilikom kreiranja: ' + (err.response?.data?.message || err.message));
        }
      }
    }

    resetForm();
  };

  const handleEditSelect = (p) => {
    setEditingId(p._id);
    setNaziv(p.naziv);
    setOpis(p.opis || '');
    setCena(p.cena);
    setKategorija(p.kategorija);
    setZalihe(p.zalihe);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj proizvod?')) return;

    try {
      await axiosActual.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      alert('Proizvod uspešno obrisan!');
    } catch (err) {
      if (usingMock) {
        setProducts(prev => prev.filter(p => p._id !== id));
        alert('Proizvod obrisan lokalno (Mock)!');
      } else {
        alert('Greška prilikom brisanja: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNaziv('');
    setOpis('');
    setCena('');
    setKategorija('Ulja');
    setZalihe('');
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-secondary)' }}>🛠️ Admin Panel</h2>
      <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>Upravljanje proizvodima i pregled porudžbina u sistemu.</p>

      {usingMock && (
        <div style={{
          backgroundColor: 'hsl(38 90% 95%)',
          border: '1px solid hsl(38 90% 80%)',
          color: 'hsl(38 70% 30%)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          💡 Radite u lokalnom režimu (Mock). Sve promene su privremene i izvršavaju se u memoriji browsera.
        </div>
      )}

      {/* Gornji deo: Forma + Tabela Proizvoda */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Forma */}
        <div className="card" style={{ padding: '2rem', alignSelf: 'start', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-secondary)', fontSize: '1.35rem' }}>
            {editingId ? '📝 Izmeni proizvod' : '➕ Unos novog proizvoda'}
          </h3>

          <form onSubmit={handleAddOrEdit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Naziv proizvoda*</label>
              <input type="text" value={naziv} onChange={(e) => setNaziv(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Opis</label>
              <textarea value={opis} onChange={(e) => setOpis(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Cena (RSD)*</label>
                <input type="number" min="0" value={cena} onChange={(e) => setCena(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Zalihe (kom)</label>
                <input type="number" min="0" value={zalihe} onChange={(e) => setZalihe(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Kategorija*</label>
              <select value={kategorija} onChange={(e) => setKategorija(e.target.value)} style={inputStyle}>
                <option value="Ulja">Ulja</option>
                <option value="Semenke">Semenke</option>
                <option value="Začini">Začini</option>
                <option value="Orašasti plodovi">Orašasti plodovi</option>
                <option value="Sušeno voće">Sušeno voće</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                style={{
                  flex: 2,
                  backgroundColor: 'hsl(var(--primary))',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-primary)'
                }}
              >
                {editingId ? 'Sačuvaj izmene' : 'Kreiraj proizvod'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--text-primary))',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-primary)'
                  }}
                >
                  Otkaži
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela Proizvoda */}
        <div style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-secondary)', fontSize: '1.35rem', textAlign: 'left' }}>
            Tabela svih proizvoda
          </h3>
          
          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Učitavanje proizvoda...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--text-muted))' }}>Nema proizvoda u bazi.</div>
          ) : (
            <div style={{
              backgroundColor: 'hsl(var(--bg-card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{ backgroundColor: 'hsl(var(--primary-light))', color: 'hsl(var(--primary))', borderBottom: '2px solid hsl(var(--border))' }}>
                    <th style={thStyle}>Tip</th>
                    <th style={thStyle}>Naziv</th>
                    <th style={thStyle}>Kategorija</th>
                    <th style={thStyle}>Cena</th>
                    <th style={thStyle}>Zalihe</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                      <td style={tdStyle}>
                        {p.kategorija === 'Ulja' ? '🥥' : p.kategorija === 'Semenke' ? '🌾' : '🌶️'}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{p.naziv}</td>
                      <td style={tdStyle}>{p.kategorija}</td>
                      <td style={tdStyle}>{p.cena} RSD</td>
                      <td style={tdStyle}>
                        <span style={{
                          color: p.zalihe > 10 ? 'inherit' : p.zalihe > 0 ? 'hsl(var(--accent))' : '#dc2626',
                          fontWeight: p.zalihe <= 10 ? 600 : 'normal'
                        }}>
                          {p.zalihe} kom
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleEditSelect(p)}
                            style={actionBtnStyle('hsl(var(--primary-light))', 'hsl(var(--primary))')}
                            title="Izmeni proizvod"
                          >
                            Uredi
                          </button>
                          <button 
                            onClick={() => handleDelete(p._id)}
                            style={actionBtnStyle('hsl(0 80% 95%)', 'hsl(0 75% 45%)')}
                            title="Obriši proizvod"
                          >
                            Obriši
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Donji deo: Lista svih porudžbina u sistemu */}
      <div style={{ borderTop: '2px solid hsl(var(--border))', paddingTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-secondary)', fontSize: '1.5rem', textAlign: 'left' }}>
          📦 Sve porudžbine u sistemu
        </h3>

        {loadingOrders ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Učitavanje porudžbina...</div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--text-muted))' }}>
            Trenutno nema kreiranih porudžbina u sistemu.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map(order => (
              <div 
                key={order._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `5px solid ${order.statusPlacanja ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}`
                }}
              >
                {/* Header porudžbine */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  borderBottom: '1px solid hsl(var(--border))',
                  paddingBottom: '0.75rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', display: 'block' }}>
                      ID PORUDŽBINE: {order._id}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      Kupac: {order.korisnik?.ime || 'Nepoznat'} ({order.korisnik?.email || 'Nema email'})
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>
                      Datum: {new Date(order.datum).toLocaleString('sr-RS')}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      marginTop: '0.25rem',
                      backgroundColor: order.statusPlacanja ? 'hsl(var(--primary-light))' : 'hsl(38 90% 90%)',
                      color: order.statusPlacanja ? 'hsl(var(--primary))' : 'hsl(38 70% 35%)'
                    }}>
                      {order.statusPlacanja ? 'Plaćeno ✅' : 'Na čekanju ⏳'}
                    </span>
                  </div>
                </div>

                {/* Stavke porudžbine */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>Naručeni artikli:</h4>
                  <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {order.stavke.map((stavka, index) => (
                      <li 
                        key={index} 
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.25rem 0',
                          fontSize: '0.9rem',
                          color: 'hsl(var(--text-primary))'
                        }}
                      >
                        <span>
                          • {stavka.proizvod?.naziv || 'Obrisani proizvod'} x <strong>{stavka.kolicina}</strong>
                        </span>
                        <span style={{ color: 'hsl(var(--text-secondary))' }}>
                          {stavka.cena * stavka.kolicina} RSD
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ukupno */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px dashed hsl(var(--border))'
                }}>
                  <span style={{ fontWeight: 600 }}>Ukupan iznos porudžbine:</span>
                  <strong style={{ fontSize: '1.2rem', color: 'hsl(var(--primary))' }}>
                    {order.ukupnaCena} RSD
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  marginBottom: '0.3rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--bg-primary))',
  color: 'hsl(var(--text-primary))',
  fontFamily: 'var(--font-primary)',
  fontSize: '0.9rem'
};

const thStyle = {
  padding: '12px 16px',
  fontWeight: 600
};

const tdStyle = {
  padding: '12px 16px',
  color: 'hsl(var(--text-primary))'
};

const actionBtnStyle = (bgColor, textColor) => ({
  backgroundColor: bgColor,
  color: textColor,
  border: 'none',
  padding: '0.35rem 0.75rem',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'var(--transition)',
  fontFamily: 'var(--font-primary)'
});

export default AdminDashboard;
