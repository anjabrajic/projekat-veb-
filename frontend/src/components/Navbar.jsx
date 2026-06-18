import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ShoppingCart, Heart, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.kolicina, 0);

  return (
    <nav className="navbar-wrapper">
      
      
      <Link to="/" className="navbar-logo">
        🌱 Zeleni Kutak
      </Link>

      
      <div className="navbar-links">
        <Link to="/" className={`navbar-link ${isActive('/')}`}>
          Početna
        </Link>
        <Link to="/proizvodi" className={`navbar-link ${isActive('/proizvodi')}`}>
          Proizvodi
        </Link>
        <Link to="/kontakt" className={`navbar-link ${isActive('/kontakt')}`}>
          Kontakt
        </Link>
      </div>

      
      <div className="navbar-actions">
        
        
        {user && (
          <Link to="/wishlist" className="navbar-icon-btn" title="Lista želja">
            <Heart size={22} />
            {wishlistItems.length > 0 && (
              <span className="navbar-badge" style={{ backgroundColor: '#e11d48' }}>
                {wishlistItems.length}
              </span>
            )}
          </Link>
        )}

        
        {user && (
          <Link to="/cart" className="navbar-icon-btn" title="Moja korpa">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="navbar-badge">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        
        {user && user.uloga === 'admin' && (
          <Link to="/admin" className="navbar-icon-btn" title="Admin Panel" style={{ color: 'hsl(var(--accent))' }}>
            <Shield size={22} />
          </Link>
        )}

        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.25' }}>
                <span className="navbar-user-text" style={{ fontSize: '0.75rem', color: user.uloga === 'admin' ? 'hsl(var(--accent))' : '#8d9590', fontWeight: 600 }}>
                  {user.uloga === 'admin' ? '👑 Admin panel:' : 'Zdravo,'}
                </span>
                <span className="navbar-user-text" style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {user.ime}
                  {user.uloga === 'admin' ? (
                    <span style={{ fontSize: '0.65rem', backgroundColor: 'hsl(var(--accent) / 0.2)', color: 'hsl(var(--accent))', padding: '0.15rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Admin
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.65rem', backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))', padding: '0.15rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Kupac
                    </span>
                  )}
                </span>
              </div>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Odjavi se
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-icon-btn" title="Prijavi se" style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <User size={20} />
              <span>Prijava</span>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
