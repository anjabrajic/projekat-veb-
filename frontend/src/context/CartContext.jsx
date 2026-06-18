import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Greška pri parsiranju korpe iz localStorage');
      }
    }
  }, []);

  
  const saveCartToStorage = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product._id);

    if (existingItem) {
      const updated = cartItems.map(item =>
        item.id === product._id
          ? { ...item, kolicina: item.kolicina + quantity }
          : item
      );
      saveCartToStorage(updated);
    } else {
      const newItem = {
        id: product._id,
        naziv: product.naziv,
        cena: product.cena,
        kategorija: product.kategorija,
        slikaUrl: product.slikaUrl,
        kolicina: quantity
      };
      saveCartToStorage([...cartItems, newItem]);
    }
  };

 
  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCartToStorage(updated);
  };

  
  const updateQuantity = (id, change) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const novaKol = item.kolicina + change;
        return { ...item, kolicina: novaKol < 1 ? 1 : novaKol };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  
  const clearCart = () => {
    saveCartToStorage([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
