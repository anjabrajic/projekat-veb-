import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const MOCK_PRODUCTS = [
  { _id: '60c72b2f9b1d8b2e88a0e101', naziv: 'Hladno ceđeno kokosovo ulje', opis: 'Ekstra devičansko organsko kokosovo ulje, 500ml. Bogato je zasićenim masnim kiselinama srednjeg lanca (MCFA), koje se u organizmu brzo vare i pretvaraju u energiju umesto da se skladište u masno tkivo. Može se koristiti za kuvanje, pečenje ili kao kozmetičko sredstvo za negu kose i kože.', cena: 750, kategorija: 'Ulja', zalihe: 25, slikaUrl: '/images/kokos_ulje.png' },
  { _id: '60c72b2f9b1d8b2e88a0e102', naziv: 'Bio Chia Semenke', opis: 'Bogate omega-3 masnim kiselinama, 250g. Chia semenke su superhrana bogata vlaknima, proteinima i esencijalnim mineralima. U dodiru sa tečnošću formiraju gel koji produžava osećaj sitosti i pomaže hidrataciji organizma. Idealne za doručak, šejkove ili chia puding.', cena: 320, kategorija: 'Semenke', zalihe: 100, slikaUrl: '/images/chia_semenke.png' },
  { _id: '60c72b2f9b1d8b2e88a0e103', naziv: 'Ekstra devičansko maslinovo ulje', opis: 'Hladno ceđeno u Grčkoj, 1L. Maslinovo ulje vrhunskog kvaliteta dobijeno direktno iz plodova masline isključivo mehaničkim putem. Bogato je mononezasićenim mastima i antioksidansima. Savršeno za salate, prelive i blago kuvanje.', cena: 1200, kategorija: 'Ulja', zalihe: 15, slikaUrl: '/images/maslinovo_ulje.png' },
  { _id: '60c72b2f9b1d8b2e88a0e104', naziv: 'Himalajska roze so', opis: 'Fino mlevena, čista i nerafinisana, 500g. Himalajska roze so je nastala isparavanjem pradavnih mora duboko u Himalajima. Sadrži preko 80 minerala u tragovima koji joj daju karakterističnu roze boju i bogatiji ukus. Zdravija je alternativa običnoj kuhinjskoj soli.', cena: 180, kategorija: 'Začini', zalihe: 50, slikaUrl: '/images/himalajska_so.png' },
  { _id: '60c72b2f9b1d8b2e88a0e105', naziv: 'Organska kurkuma u prahu', opis: 'Zlatni indijski začin, moćan antioksidans, 100g. Kurkuma u prahu ima snažno protivupalno dejstvo i široku primenu u kulinarstvu i tradicionalnoj medicini. Može se koristiti za začinjavanje jela, pravljenje zlatnog mleka ili kao dodatak šejkovima.', cena: 450, kategorija: 'Začini', zalihe: 40, slikaUrl: '/images/kurkuma.png' },
  { _id: '60c72b2f9b1d8b2e88a0e106', naziv: 'Cejlonski cimet u prahu', opis: 'Pravi cejlonski cimet izuzetnog mirisa i ukusa, 100g. Cejlonski cimet je poznat po svojim brojnim lekovitim svojstvima. Pomaže u regulaciji šećera u krvi i savršen je dodatak kašama, kolačima, čajevima i drugim poslasticama.', cena: 380, kategorija: 'Začini', zalihe: 35, slikaUrl: '/images/cimet.png' },
  { _id: '60c72b2f9b1d8b2e88a0e107', naziv: 'Organsko laneno seme', opis: 'Smeđe laneno seme iz organskog uzgoja, 250g. Bogato je vlaknima, lignanima i omega-3 masnim kiselinama. Preporučuje se mlevenje pre konzumacije radi lakše apsorpcije nutrijenata.', cena: 150, kategorija: 'Semenke', zalihe: 60, slikaUrl: '/images/laneno_seme.png' },
  { _id: '60c72b2f9b1d8b2e88a0e108', naziv: 'Oljušteno seme konoplje', opis: 'Semenke konoplje izuzetne nutritivne vrednosti, 200g. Sadrže savršen odnos omega-3 i omega-6 masnih kiselina i predstavljaju kompletan izvor proteina sa svim esencijalnim aminokiselinama.', cena: 550, kategorija: 'Semenke', zalihe: 30, slikaUrl: '/images/seme_konoplje.png' },
  { _id: '60c72b2f9b1d8b2e88a0e109', naziv: 'Organski đumbir u prahu', opis: 'Fino mleveni sušeni koren đumbira, 100g. Poznat po svom ljutkastom ukusu i zagrevajućem dejstvu. Odličan je za imunitet, protiv mučnine, i kao začin za čajeve i jela.', cena: 280, kategorija: 'Začini', zalihe: 45, slikaUrl: '/images/djumbir.png' },
  { _id: '60c72b2f9b1d8b2e88a0e110', naziv: 'Sirovi indijski orah', opis: 'Kvalitetan sirovi indijski orah, 250g. Kremaste teksture i blagog ukusa, bogat je zdravim mastima, proteinima, i mineralima poput magnezijuma i bakra. Idealan za zdrave namaze i sireve.', cena: 950, kategorija: 'Orašasti plodovi', zalihe: 20, slikaUrl: '/images/indijski_orah.png' },
  { _id: '60c72b2f9b1d8b2e88a0e111', naziv: 'Organske urme (datulje)', opis: 'Prirodno slatke urme bez dodatih šećera i konzervansa, 250g. Zovu ih "najzdravije voće na planeti" jer su bogate vlaknima, kalijumom i antioksidansima. Savršena prirodna zamena za slatkiše.', cena: 420, kategorija: 'Sušeno voće', zalihe: 25, slikaUrl: '/images/urme.png' }
];

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(location.state?.product || null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState('');

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`/api/products/${id}`);
          setProduct(res.data);
        } catch (err) {
          console.warn('Neuspešno učitavanje sa backend-a, pretraga u mock bazi...');
          const found = MOCK_PRODUCTS.find(p => p._id === id);
          if (found) {
            setProduct(found);
          } else {
            setError('Proizvod nije pronađen.');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Učitavanje detalja...</div>;
  }

  if (error || !product) {
    return (
      <div className="app-container">
        <div className="card" style={{ padding: '2rem' }}>
          <h3>⚠️ Greška</h3>
          <p style={{ margin: '1rem 0' }}>{error || 'Proizvod nije pronađen.'}</p>
          <Link to="/" style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>Nazad na početnu</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{
          border: 'none',
          background: 'none',
          color: 'hsl(var(--text-secondary))',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        ← Nazad
      </button>

      <div className="card" style={{
        padding: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        maxWidth: '100%',
        textAlign: 'left'
      }}>
        {/* Slika proizvoda ili placeholder */}
        <div style={{
          height: '300px',
          backgroundColor: 'hsl(var(--bg-secondary))',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '6rem',
          overflow: 'hidden'
        }}>
          {product.slikaUrl ? (
            <img 
              src={product.slikaUrl} 
              alt={product.naziv} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            product.kategorija === 'Ulja' ? '🥥' : product.kategorija === 'Semenke' ? '🌾' : product.kategorija === 'Začini' ? '🌶️' : product.kategorija === 'Orašasti plodovi' ? '🌰' : '🍇'
          )}
        </div>

        {/* Informacije */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            alignSelf: 'flex-start',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'hsl(var(--primary))',
            backgroundColor: 'hsl(var(--primary-light))',
            padding: '0.25rem 0.6rem',
            borderRadius: '4px',
            marginBottom: '0.75rem'
          }}>{product.kategorija}</span>

          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-secondary)' }}>
            {product.naziv}
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'hsl(var(--text-secondary))',
            lineHeight: 1.6,
            marginBottom: '1.5rem'
          }}>
            {product.opis}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'hsl(var(--text-primary))' }}>
              {product.cena} RSD
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ 
              fontSize: '0.85rem', 
              color: product.zalihe > 0 ? '#16a34a' : '#dc2626',
              fontWeight: 600 
            }}>
              {product.zalihe > 0 ? `🟢 Na stanju (preostalo: ${product.zalihe} kom)` : '🔴 Nema na zalihama'}
            </span>
          </div>

          {user ? (
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
               <button 
                onClick={handleAddToCart}
                disabled={product.zalihe === 0}
                style={{
                  flex: 1,
                  backgroundColor: added ? 'hsl(142 60% 25%)' : 'hsl(var(--primary))',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => { if (product.zalihe > 0 && !added) e.target.style.backgroundColor = 'hsl(var(--primary-hover))' }}
                onMouseLeave={(e) => { if (product.zalihe > 0 && !added) e.target.style.backgroundColor = 'hsl(var(--primary))' }}
              >
                {added ? 'Dodato! ✓' : 'Dodaj u korpu'}
              </button>

              <button 
                onClick={async () => {
                  if (isInWishlist(product._id)) {
                    await removeFromWishlist(product._id);
                  } else {
                    await addToWishlist(product);
                  }
                }}
                style={{
                  backgroundColor: isInWishlist(product._id) ? 'hsl(var(--primary-light))' : 'hsl(var(--bg-secondary))',
                  color: isInWishlist(product._id) ? 'hsl(var(--primary))' : 'hsl(var(--text-primary))',
                  border: '1px solid',
                  borderColor: isInWishlist(product._id) ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {isInWishlist(product._id) ? '❤️ Ukloni' : '💖 Sačuvaj'}
              </button>
            </div>
          ) : (
            <div style={{
              marginTop: 'auto',
              borderTop: '1px solid hsl(var(--border))',
              paddingTop: '1rem',
              fontSize: '0.9rem',
              color: 'hsl(var(--text-muted))',
              backgroundColor: 'hsl(var(--bg-secondary))',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontWeight: 500
            }}>
              🔑 Morate se <Link to="/login" style={{ color: 'hsl(var(--primary))', fontWeight: 700, textDecoration: 'none' }}>prijaviti</Link> da biste dodali u korpu ili sačuvali u listu želja.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
