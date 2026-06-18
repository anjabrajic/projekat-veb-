import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const fetchWishlist = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/api/wishlist');
      setWishlistItems(res.data.proizvodi || []);
    } catch (error) {
      console.error('Greška pri učitavanju liste želja:', error.message);
      
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setWishlistItems([]); 
    }
  }, [token]);

  // Dodavanje u listu želja na backend-u
  const addToWishlist = async (product) => {
    if (!token) return { success: false, message: 'Morate biti prijavljeni' };

    try {
      const res = await axios.post('/api/wishlist', { proizvodId: product._id });
      setWishlistItems(res.data.proizvodi || []);
      return { success: true };
    } catch (error) {
      console.error('Greška pri dodavanju u listu želja:', error.response?.data?.message || error.message);
      
      
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        if (!wishlistItems.find(item => item._id === product._id)) {
          setWishlistItems(prev => [...prev, product]);
        }
        return { success: true, mock: true };
      }

      return {
        success: false,
        message: error.response?.data?.message || 'Greška na serveru.'
      };
    }
  };

  
  const removeFromWishlist = async (productId) => {
    if (!token) return { success: false };

    try {
      const res = await axios.delete(`/api/wishlist/${productId}`);
      setWishlistItems(res.data.proizvodi || []);
      return { success: true };
    } catch (error) {
      console.error('Greška pri uklanjanju iz liste želja:', error.message);

      
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      return { success: true, mock: true };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
