import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ArrowRight, MapPin, Sparkles, Star } from 'lucide-react';

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

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const [loading, setLoading] = useState(true);
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
      const res = await axios.get('/api/products');
      setProducts(res.data);
      setUsingMock(false);
    } catch (err) {
      console.warn('Backend nije dostupan, koriste se mock podaci.');
      setProducts(MOCK_PRODUCTS);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Preusmeravanje na stranicu sa proizvodima sa odabranom kategorijom
  const handleSelectCategory = (catName) => {
    navigate('/proizvodi', { state: { kategorija: catName } });
  };

  // Izdvajamo 4 istaknuta proizvoda (prva 4 proizvoda iz liste)
  const featuredProducts = products.slice(0, 4);

  // Novi proizvodi (poslednja 4 proizvoda iz liste)
  const newProducts = [...products].reverse().slice(0, 4);

  return (
    <div style={{ backgroundColor: 'hsl(var(--bg-primary))', minHeight: '100vh' }}>
      
      {/* 1. HERO SEKCIJA sa tamnim gradijentom i SVG talasom */}
      <div style={{
        background: 'linear-gradient(135deg, #1A271D 0%, #0c120e 100%)',
        color: '#fff',
        padding: '7rem 1rem 8rem 1rem',
        position: 'relative',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'hsl(var(--accent-green))',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Sparkles size={14} /> Organski i Sertifikovano
          </span>
          
          <h1 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1.25rem', 
            fontFamily: 'var(--font-secondary)',
            fontWeight: 800,
            lineHeight: 1.15,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Neka hrana bude tvoj lek 🌿
          </h1>
          
          <p style={{ 
            color: '#c4c9c5', 
            fontSize: '1.25rem', 
            maxWidth: '650px', 
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Zdrava ishrana podrazumeva uzimanje raznovrsnih namirnica koje Vam omogućavaju dosta hranljivih materija, kako bi bili zdravi, osećali se dobro i imali energije.
          </p>

          <Link 
            to="/proizvodi"
            style={{
              textDecoration: 'none',
              display: 'inline-block',
              backgroundColor: 'hsl(var(--primary))',
              color: '#fff',
              border: 'none',
              padding: '0.9rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              transition: 'var(--transition)',
              fontFamily: 'var(--font-primary)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'hsl(var(--primary-hover))';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'hsl(var(--primary))';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Naša prodavnica
          </Link>
        </div>

        {/* SVG Mountains talasasti divider na dnu */}
        <div className="hero-shape-divider">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path className="shape-fill" opacity="0.33" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"/>
            <path className="shape-fill" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"/>
            <path className="shape-fill" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"/>
          </svg>
        </div>
      </div>

      {/* GLAVNI KONTEJNER SA SADRŽAJEM */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* MOCK ALERT BANNER */}
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

        {/* 2. PROMO BANERI ZA KATEGORIJE (Organska hrana / Prirodna ulja) */}
        <div className="category-promo-container">
          
          {/* Organska Hrana Baner */}
          <div className="category-promo-card" onClick={() => handleSelectCategory('Semenke')}>
            <img src="/images/organska_hrana_banner.png" alt="Organska hrana" />
            <div className="category-promo-overlay">
              <h3 className="category-promo-title">Organska Hrana</h3>
              <span className="category-promo-btn">
                Istraži organsko <ArrowRight size={16} />
              </span>
            </div>
          </div>

          {/* Prirodna Kozmetika i Ulja Baner */}
          <div className="category-promo-card" onClick={() => handleSelectCategory('Ulja')}>
            <img src="/images/prirodna_ulja_banner.png" alt="Prirodna kozmetika i ulja" />
            <div className="category-promo-overlay">
              <h3 className="category-promo-title">Prirodna Ulja</h3>
              <span className="category-promo-btn">
                Pregledaj ulja <ArrowRight size={16} />
              </span>
            </div>
          </div>

        </div>

        {/* 3. SEKCIJA: "IZABRALI SMO ZA VAS" */}
        <div style={{ marginBottom: '5rem', paddingTop: '1rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ 
              fontSize: '2.25rem', 
              fontFamily: 'var(--font-secondary)',
              fontWeight: 800,
              margin: '0 0 0.5rem 0',
              display: 'inline-block'
            }}>
              Izabrali smo za vas
            </h2>
            <div style={{
              width: '80px',
              height: '3px',
              backgroundColor: 'hsl(var(--primary))',
              margin: '0.5rem auto 0 auto',
              borderRadius: '2px'
            }} />
          </div>

          {/* Grid Proizvoda */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 600 }}>Učitavanje proizvoda...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--text-muted))' }}>
              Nema pronađenih proizvoda.
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
              }}>
                {featuredProducts.map(product => (
                  <ProductCardItem 
                    key={product._id} 
                    product={product} 
                    user={user} 
                    added={addedProducts[product._id]} 
                    onAddToCart={handleAddToCart}
                    isInWishlist={isInWishlist}
                    addToWishlist={addToWishlist}
                    removeFromWishlist={removeFromWishlist}
                  />
                ))}
              </div>

              {/* Dugme za preusmeravanje na stranu sa svim proizvodima */}
              <div style={{ textAlign: 'center' }}>
                <Link
                  to="/proizvodi"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-block',
                    backgroundColor: 'transparent',
                    border: '2px solid hsl(var(--primary))',
                    color: 'hsl(var(--primary))',
                    padding: '0.75rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'hsl(var(--primary))';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'hsl(var(--primary))';
                  }}
                >
                  Pogledaj sve proizvode
                </Link>
              </div>
            </>
          )}

        </div>

        {/* 4. SEKCIJA: "NOVI PROIZVODI" */}
        <div style={{ marginBottom: '5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ 
              fontSize: '2.25rem', 
              fontFamily: 'var(--font-secondary)',
              fontWeight: 800,
              margin: '0 0 0.5rem 0',
              display: 'inline-block'
            }}>
              Novi proizvodi
            </h2>
            <div style={{
              width: '80px',
              height: '3px',
              backgroundColor: 'hsl(var(--primary))',
              margin: '0.5rem auto 0 auto',
              borderRadius: '2px'
            }} />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Učitavanje...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2rem'
            }}>
              {newProducts.map(product => (
                <ProductCardItem 
                  key={`new-${product._id}`} 
                  product={product} 
                  user={user} 
                  added={addedProducts[product._id]} 
                  onAddToCart={handleAddToCart}
                  isInWishlist={isInWishlist}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                />
              ))}
            </div>
          )}

        </div>

        {/* 5. SEKCIJA: LOKACIJA I PROMO DETALJI */}
        <div className="card" style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: 'hsl(var(--bg-secondary))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          borderLeft: '5px solid hsl(var(--primary))',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--primary-light))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(var(--primary))'
          }}>
            <MapPin size={28} />
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-secondary)', margin: 0 }}>
            Posetite nas u Novom Sadu 📍
          </h2>
          
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.05rem', maxWidth: '650px', margin: 0, lineHeight: '1.6' }}>
            Nalazimo se na <strong>Bulevaru oslobođenja 50</strong> u Novom Sadu (prolaz pored prodavnica u prizemlju). Dođite da se posavetujete sa našim nutricionistima i izaberete najbolje za vaše zdravlje na licu mesta.
          </p>

          <a 
            href="https://www.google.com/maps/search/?api=1&query=Bulevar+oslobodjenja+50,+Novi+Sad" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: 'hsl(var(--primary))',
              color: '#fff',
              padding: '0.8rem 2rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'hsl(var(--primary-hover))'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'hsl(var(--primary))'}
          >
            Prikaži na mapi
          </a>
        </div>

      </div>

    </div>
  );
};

// --- POD-KOMPONENTA: KARTICA PROIZVODA (Premium HSL Vanilla CSS) ---
const ProductCardItem = ({ product, user, added, onAddToCart, isInWishlist, addToWishlist, removeFromWishlist }) => {
  const isWish = isInWishlist(product._id);
  
  return (
    <div style={{
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
            if (isWish) {
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
          title={isWish ? "Ukloni sa liste želja" : "Dodaj u listu želja"}
        >
          {isWish ? '❤️' : '💖'}
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
            onClick={() => onAddToCart(product)}
            disabled={product.zalihe === 0}
            style={{
              width: '100%',
              backgroundColor: added ? 'hsl(142 60% 25%)' : 'hsl(var(--primary))',
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
            onMouseEnter={(e) => { if (!added && product.zalihe > 0) e.target.style.backgroundColor = 'hsl(var(--primary-hover))' }}
            onMouseLeave={(e) => { if (!added && product.zalihe > 0) e.target.style.backgroundColor = 'hsl(var(--primary))' }}
          >
            {product.zalihe === 0 ? 'Nema na stanju' : added ? 'Dodato! ✓' : 'Dodaj u korpu'}
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
  );
};

export default Home;
