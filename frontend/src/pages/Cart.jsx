import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const ukupnaCena = cartItems.reduce((sum, item) => sum + (item.cena * item.kolicina), 0);

  const [nacinPlacanja, setNacinPlacanja] = useState('pouzece'); // 'pouzece' ili 'paypal'

  // Funkcija za kreiranje porudžbine (za oba načina plaćanja)
  const handleCreateOrder = async (isPaid = false) => {
    setPaymentError('');
    // Priprema stavki u formatu koji backend očekuje
    const stavke = cartItems.map(item => ({
      proizvod: item.id, // Referenca na Product ID
      kolicina: item.kolicina,
      cena: item.cena
    }));

    try {
      // Slanje zahteva backendu za kreiranje porudžbine
      const res = await axios.post('/api/orders', {
        stavke,
        ukupnaCena,
        statusPlacanja: isPaid
      });

      console.log('Porudžbina je kreirana na backendu:', res.data);
      setOrderInfo(res.data);
      setIsSimulated(false);
      setIsOrderSuccess(true);
      clearCart(); // Praznimo korpu
    } catch (err) {
      console.error('Greška pri kreiranju porudžbine na backendu:', err);
      
      // Provera mrežnih/offline grešaka radi mock rada
      if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
        setOrderInfo({ _id: 'MOCK_ORDER_' + Math.random().toString(36).substr(2, 9), ukupnaCena });
        setIsSimulated(true);
        setIsOrderSuccess(true);
        clearCart();
      } else {
        // Prikazujemo specifičnu grešku sa bekenda (npr. nedovoljno zaliha)
        setPaymentError(err.response?.data?.message || err.message);
      }
    }
  };

  if (isOrderSuccess) {
    return (
      <div style={{ padding: '3rem 1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{
            fontSize: '4.5rem',
            marginBottom: '1.5rem',
            animation: 'float 3s ease-in-out infinite',
            display: 'inline-block'
          }}>
            🎉
          </div>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'hsl(var(--primary))', fontFamily: 'var(--font-secondary)' }}>
            Kupovina uspešna!
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Hvala Vam na poverenju! Vaša porudžbina je uspešno primljena, a zalihe u bazi su ažurirane.
          </p>
          
          <div style={{
            backgroundColor: 'hsl(var(--bg-secondary))',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem',
            border: '1px solid hsl(var(--border))',
            textAlign: 'left'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--text-secondary))', marginBottom: '0.75rem' }}>
              Detalji porudžbine:
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              <span style={{ color: 'hsl(var(--text-muted))' }}>ID porudžbine:</span>
              <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{orderInfo?._id || 'Nepoznat'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'hsl(var(--text-muted))' }}>Ukupno plaćeno:</span>
              <span style={{ fontWeight: 800, color: 'hsl(var(--primary))' }}>{orderInfo?.ukupnaCena || 0} RSD</span>
            </div>
            {isSimulated && (
              <div style={{
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: 'hsl(38 70% 35%)',
                backgroundColor: 'hsl(38 90% 95%)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid hsl(38 90% 85%)',
                fontWeight: 500
              }}>
                💡 Porudžbina je procesuirana u mock (offline) režimu jer server nije bio dostupan.
              </div>
            )}
          </div>

          <Link to="/" style={{
            display: 'inline-block',
            textDecoration: 'none',
            backgroundColor: 'hsl(var(--primary))',
            color: '#fff',
            padding: '0.85rem 2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            transition: 'var(--transition)',
            boxShadow: '0 4px 10px hsl(var(--primary) / 0.2)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'hsl(var(--primary-hover))'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'hsl(var(--primary))'}
          >
            Nastavi sa kupovinom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-secondary)' }}>🛒 Vaša Korpa</h2>

      {paymentError && (
        <div style={{
          backgroundColor: 'hsl(0 85% 97%)',
          border: '1px solid hsl(0 85% 90%)',
          color: 'hsl(0 70% 40%)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginBottom: '1.5rem',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <div>
            <strong>Greška pri plaćanju:</strong> {paymentError}
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Vaša korpa je trenutno prazna.
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
            Nazad na kupovinu
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'left' }}>
            {cartItems.map(item => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '1px solid hsl(var(--border))',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Sličica proizvoda */}
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: 'hsl(var(--bg-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
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
                    <h3 style={{ fontSize: '1.1rem' }}>{item.naziv}</h3>
                    <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
                      Cena: {item.cena} RSD
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Količina kontroleri */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius-sm)' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{ border: 'none', background: 'none', padding: '0.5rem 0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >-</button>
                    <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>{item.kolicina}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{ border: 'none', background: 'none', padding: '0.5rem 0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >+</button>
                  </div>

                  <span style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                    {item.cena * item.kolicina} RSD
                  </span>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'hsl(0 70% 50%)',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                    title="Obriši stavku"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {/* Suma */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderBottom: '1px solid hsl(var(--border))',
              paddingBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Ukupno za plaćanje:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>
                {ukupnaCena} RSD
              </span>
            </div>

            {/* IZBOR NAČINA PLAĆANJA */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', marginBottom: '1rem' }}>
                Izaberite način plaćanja:
              </h4>

              {/* Tasteri za izbor */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNacinPlacanja('pouzece')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: nacinPlacanja === 'pouzece' ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                    backgroundColor: nacinPlacanja === 'pouzece' ? 'hsl(var(--primary-light))' : 'hsl(var(--bg-card))',
                    color: nacinPlacanja === 'pouzece' ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-primary)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💵 Plaćanje pouzećem
                </button>
                <button
                  type="button"
                  onClick={() => setNacinPlacanja('paypal')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: nacinPlacanja === 'paypal' ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                    backgroundColor: nacinPlacanja === 'paypal' ? 'hsl(var(--primary-light))' : 'hsl(var(--bg-card))',
                    color: nacinPlacanja === 'paypal' ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-primary)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💳 PayPal / Kartica
                </button>
              </div>

              {nacinPlacanja === 'pouzece' ? (
                /* OPCIJA 1: Plaćanje pouzećem */
                <button
                  onClick={() => handleCreateOrder(false)}
                  style={{
                    width: '100%',
                    backgroundColor: 'hsl(var(--primary))',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-primary)',
                    boxShadow: '0 4px 12px hsl(var(--primary) / 0.25)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'hsl(var(--primary-hover))'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'hsl(var(--primary))'}
                >
                  Potvrdi porudžbinu (Plaćanje pouzećem)
                </button>
              ) : (
                /* OPCIJA 2: PayPal */
                <div>
                  <PayPalScriptProvider options={{ 'client-id': 'test', currency: 'USD' }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
                      createOrder={(data, actions) => {
                        const iznosUSD = (ukupnaCena / 117).toFixed(2);
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: iznosUSD
                              },
                              description: 'Kupovina zdrave hrane - Zeleni Kutak'
                            }
                          ]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        const captureDetails = await actions.order.capture();
                        await handleCreateOrder(true);
                      }}
                      onError={(err) => {
                        console.error('PayPal greška pri plaćanju:', err);
                        setPaymentError('Došlo je do greške prilikom obrade uplate preko PayPal-a.');
                      }}
                    />
                  </PayPalScriptProvider>

                  {/* Brzi taster za testiranje (simulacija uplate) */}
                  <button
                    onClick={() => handleCreateOrder(true)}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      backgroundColor: 'hsl(var(--primary-light))',
                      color: 'hsl(var(--primary))',
                      border: '1px dashed hsl(var(--primary))',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-primary)',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = 'hsl(var(--primary))'; e.target.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'hsl(var(--primary-light))'; e.target.style.color = 'hsl(var(--primary))'; }}
                  >
                    ⚡ Brza simulacija plaćanja (Zaobilazi PayPal login)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nazad link */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
            <Link to="/" style={{
              textDecoration: 'none',
              color: 'hsl(var(--text-secondary))',
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--bg-card))',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              transition: 'var(--transition)'
            }}>
              ← Nazad na kupovinu
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
