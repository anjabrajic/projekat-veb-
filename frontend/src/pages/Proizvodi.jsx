import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ArrowRight, Sparkles } from 'lucide-react';

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

const Proizvodi = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Ako smo došli sa Početne strane klikom na baner, inicijalizujemo kategoriju iz state-a
  const [kategorija, setKategorija] = useState(location.state?.kategorija || '');
  const [pretraga, setPretraga] = useState('');
  const [usingMock, setUsingMock] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProducts(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedProducts(prev => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = [];
      if (kategorija) params.push(`kategorija=${encodeURIComponent(kategorija)}`);
      if (pretraga) params.push(`pretraga=${encodeURIComponent(pretraga)}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await axios.get(url);
      setProducts(res.data);
      setUsingMock(false);
    } catch (err) {
      console.warn('Backend nije dostupan, koriste se mock podaci.');
      const filtrirani = MOCK_PRODUCTS.filter(p => {
        let match = true;
        if (kategorija && p.kategorija !== kategorija) match = false;
        if (pretraga) {
          const regex = new RegExp(pretraga, 'i');
          if (!regex.test(p.naziv)) match = false;
        }
        return match;
      });
      setProducts(filtrirani);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [kategorija, pretraga]);

  // Ažuriranje kategorije ukoliko stigne novi državni prelaz (location.state)
  useEffect(() => {
    if (location.state?.kategorija !== undefined) {
      setKategorija(location.state.kategorija);
    }
  }, [location.state]);

  return (
    <div className="app-container" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Glavni naslov stranice */}
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
          Naši Proizvodi 🌱
        </h1>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Pregledajte naš celokupan asortiman pažljivo odabranih organskih namirnica vrhunskog kvaliteta.
        </p>
      </div>

      {/* Mock alert baner */}
      {usingMock && (
        <div style={{
          backgroundColor: 'hsl(38 90% 95%)',
          border: '1px solid hsl(38 90% 80%)',
          color: 'hsl(38 70% 30%)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginBottom: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          💡 Prikazuju se rezervni (mock) podaci jer lokalni backend server trenutno nije dostupan.
        </div>
      )}

      {/* Pretraga i Kategorije */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '3.5rem',
        backgroundColor: 'hsl(var(--bg-secondary))',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid hsl(var(--border))'
      }}>
        
        {/* Pretraga */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <span style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', pointerEvents: 'none', opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            placeholder="Pretraži proizvode po nazivu..."
            value={pretraga}
            onChange={(e) => setPretraga(e.target.value)}
            style={{
              padding: '0.85rem 1rem 0.85rem 2.8rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--bg-card))',
              color: 'hsl(var(--text-primary))',
              fontSize: '0.95rem',
              width: '100%',
              fontFamily: 'var(--font-primary)',
              outline: 'none',
              boxShadow: '0 2px 8px hsl(var(--shadow))',
              transition: 'var(--transition)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary))'}
            onBlur={(e) => e.target.style.borderColor = 'hsl(var(--border))'}
          />
        </div>

        {/* Dugmad za kategorije */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'hsl(var(--text-secondary))', marginRight: '0.5rem' }}>
            Kategorije:
          </span>
          {['', 'Ulja', 'Semenke', 'Začini', 'Orašasti plodovi', 'Sušeno voće'].map(cat => (
            <button
              key={cat}
              onClick={() => setKategorija(cat)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '50px',
                border: '1px solid',
                borderColor: kategorija === cat ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                backgroundColor: kategorija === cat ? 'hsl(var(--primary-light))' : 'hsl(var(--bg-card))',
                color: kategorija === cat ? 'hsl(var(--primary))' : 'hsl(var(--text-primary))',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
                fontFamily: 'var(--font-primary)'
              }}
              onMouseEnter={(e) => {
                if (kategorija !== cat) {
                  e.target.style.backgroundColor = 'hsl(var(--bg-primary))';
                }
              }}
              onMouseLeave={(e) => {
                if (kategorija !== cat) {
                  e.target.style.backgroundColor = 'hsl(var(--bg-card))';
                }
              }}
            >
              {cat === '' ? '🌱 Sve' : cat === 'Ulja' ? '🥥 Ulja' : cat === 'Semenke' ? '🌾 Semenke' : cat === 'Začini' ? '🌶️ Začini' : cat === 'Orašasti plodovi' ? '🌰 Orašasti plodovi' : '🍇 Sušeno voće'}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Proizvoda */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 600 }}>Učitavanje proizvoda...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--text-muted))' }}>
          Nema pronađenih proizvoda koji odgovaraju kriterijumu.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          {products.map(product => (
            <div 
              key={product._id} 
              style={{
                backgroundColor: 'hsl(var(--bg-card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 6px -1px hsl(var(--shadow))',
                transition: 'var(--transition)',
                position: 'relative'
              }}
              className="product-card"
            >
              {/* Bedž za kategoriju */}
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 5,
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'hsl(var(--primary))',
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '0.25rem 0.6rem',
                borderRadius: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid hsl(var(--border))'
              }}>
                {product.kategorija}
              </span>

              {/* Dugme za brzu izmenu (samo za administratora) */}
              {user && user.uloga === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '48px',
                    zIndex: 5,
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    border: '1px solid hsl(var(--border))',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    color: 'hsl(var(--accent))',
                    transition: 'var(--transition)',
                    textDecoration: 'none'
                  }}
                  title="Uredi proizvod u Admin panelu"
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ⚙️
                </Link>
              )}

              {/* Dugme za listu želja */}
              {user && (
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (isInWishlist(product._id)) {
                      await removeFromWishlist(product._id);
                    } else {
                      await addToWishlist(product);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 5,
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    border: '1px solid hsl(var(--border))',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    transition: 'var(--transition)'
                  }}
                  title={isInWishlist(product._id) ? "Ukloni sa liste želja" : "Dodaj u listu želja"}
                >
                  {isInWishlist(product._id) ? '❤️' : '💖'}
                </button>
              )}

              {/* Slika ili placeholder */}
              <div style={{
                height: '190px',
                backgroundColor: 'hsl(var(--bg-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {product.slikaUrl ? (
                  <img 
                    src={product.slikaUrl} 
                    alt={product.naziv} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
                    className="product-card-img"
                  />
                ) : (
                  product.kategorija === 'Ulja' ? '🥥' : product.kategorija === 'Semenke' ? '🌾' : product.kategorija === 'Začini' ? '🌶️' : product.kategorija === 'Orašasti plodovi' ? '🌰' : '🍇'
                )}
              </div>

              {/* Detalji */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  margin: '0 0 0.5rem 0',
                  fontFamily: 'var(--font-secondary)',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  height: '2.6rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {product.naziv}
                </h3>
                
                <p style={{
                  fontSize: '0.85rem',
                  color: 'hsl(var(--text-secondary))',
                  margin: '0 0 1.25rem 0',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  height: '2.4rem'
                }}>{product.opis}</p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  borderTop: '1px solid hsl(var(--border))',
                  paddingTop: '1rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>Cena</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>
                      {product.cena} RSD
                    </span>
                  </div>
                  
                  <a 
                    href={`/product/${product._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/product/${product._id}`;
                    }}
                    style={{
                      textDecoration: 'none',
                      color: 'hsl(var(--primary))',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.15rem'
                    }}
                  >
                    Detaljnije <ArrowRight size={14} />
                  </a>
                </div>

                {/* Dugme za dodavanje u korpu ako je ulogovan */}
                {user ? (
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.zalihe === 0}
                    style={{
                      width: '100%',
                      backgroundColor: addedProducts[product._id] ? 'hsl(142 60% 25%)' : 'hsl(var(--primary))',
                      color: '#fff',
                      border: 'none',
                      padding: '0.6rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: product.zalihe === 0 ? 'not-allowed' : 'pointer',
                      transition: 'var(--transition)',
                      fontFamily: 'var(--font-primary)',
                      marginTop: '1rem'
                    }}
                    onMouseEnter={(e) => { if (!addedProducts[product._id] && product.zalihe > 0) e.target.style.backgroundColor = 'hsl(var(--primary-hover))' }}
                    onMouseLeave={(e) => { if (!addedProducts[product._id] && product.zalihe > 0) e.target.style.backgroundColor = 'hsl(var(--primary))' }}
                  >
                    {product.zalihe === 0 ? 'Nema na stanju' : addedProducts[product._id] ? 'Dodato! ✓' : 'Dodaj u korpu'}
                  </button>
                ) : (
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                    color: 'hsl(var(--text-muted))',
                    backgroundColor: 'hsl(var(--bg-secondary))',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                    fontWeight: 600,
                    border: '1px dashed hsl(var(--border))'
                  }}>
                    🔑 Prijavite se za kupovinu
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Proizvodi;
