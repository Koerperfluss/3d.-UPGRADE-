
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, PriceItem, PackageDeal, MembershipTier } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: PriceItem | PackageDeal | MembershipTier, options?: { isAnnual?: boolean }) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('koerperfluss_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('koerperfluss_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: PriceItem | PackageDeal | MembershipTier, options?: { isAnnual?: boolean }) => {
    let price: number;
    let name = item.name;
    let id = item.id;

    if ('priceDetails' in item && item.discountInfo && options?.isAnnual) {
      price = parseFloat(item.discountInfo.annualPrice.replace(/[^0-9.]/g, ''));
      name = `${item.name} (Jahresabo)`;
      id = `${item.id}-annual`;
    } else {
      price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id, name, price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
    }
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
