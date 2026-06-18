import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [addedProducts, setAddedProducts] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProducts(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedProducts(prev => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-secondary)' }}>💖 Moja Lista Želja</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Učitavanje liste želja...</div>
      ) : wishlistItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Nemate nijedan proizvod na listi želja.
          </p>
          <Link to="/" style={{
            textDecoration: 'none',
            backgroundColor: 'hsl(var(--primary))',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'hsl(var(--primary-hover))'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'hsl(var(--primary))'}
          >
            Pregledaj proizvode
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {wishlistItems.map(item => (
            <div 
              key={item._id} 
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  backgroundColor: 'hsl(var(--bg-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {item.slikaUrl ? (
                    <img 
                      src={item.slikaUrl} 
                      alt={item.naziv} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    item.kategorija === 'Ulja' ? '🥥' : item.kategorija === 'Semenke' ? '🌾' : item.kategorija === 'Začini' ? '🌶️' : item.kategorija === 'Orašasti plodovi' ? '🌰' : '🍇'
                  )}
                </div>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'hsl(var(--primary))',
                    backgroundColor: 'hsl(var(--primary-light))',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                  }}>{item.kategorija}</span>
                  <h3 style={{ fontSize: '1.15rem', marginTop: '0.25rem' }}>{item.naziv}</h3>
                  <span style={{ fontWeight: 700, color: 'hsl(var(--text-primary))', display: 'block', marginTop: '0.2rem' }}>
                    {item.cena} RSD
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => handleAddToCart(item)}
                  style={{
                    backgroundColor: addedProducts[item._id] ? 'hsl(142 60% 25%)' : 'hsl(var(--primary-light))',
                    color: addedProducts[item._id] ? '#fff' : 'hsl(var(--primary))',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    fontFamily: 'var(--font-primary)'
                  }}
                  onMouseEnter={(e) => {
                    if (!addedProducts[item._id]) {
                      e.target.style.backgroundColor = 'hsl(var(--primary))';
                      e.target.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!addedProducts[item._id]) {
                      e.target.style.backgroundColor = 'hsl(var(--primary-light))';
                      e.target.style.color = 'hsl(var(--primary))';
                    }
                  }}
                >
                  {addedProducts[item._id] ? 'Dodato! ✓' : 'Dodaj u korpu'}
                </button>

                <button 
                  onClick={() => removeFromWishlist(item._id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'hsl(0 70% 50%)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.25rem'
                  }}
                  title="Ukloni sa liste želja"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
