import React from 'react';
import { Button } from './Button';
import { CloseIcon, ArrowRightIcon, TrashIcon } from './IconComponents';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <div 
        className={`fixed inset-0 bg-brand-secondary/60 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        role="dialog" 
        aria-modal="true" 
        onClick={onClose}
    >
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-background shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 bg-brand-surface p-4 flex justify-between items-center border-b border-brand-border">
          <h2 id="cart-heading" className="text-xl font-semibold text-brand-secondary font-serif">Warenkorb</h2>
          <button onClick={onClose} aria-label="Schließen" className="p-1 rounded-md text-brand-secondary hover:text-brand-primary">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-grow p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-brand-text-on-light-secondary h-full flex flex-col justify-center items-center">
              <p className="text-lg">Ihr Warenkorb ist leer.</p>
              <Button to="/angebote" variant="outline" size="sm" className="mt-4" onClick={onClose}>
                Angebote ansehen
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map(item => (
                <li key={item.id} className="flex items-start gap-4 border-b border-brand-border/50 pb-4">
                  <div className="flex-grow">
                    <p className="font-semibold text-brand-text-on-light">{item.name}</p>
                    <p className="text-sm text-brand-text-on-light-secondary">{item.price.toFixed(2)} €</p>
                    <div className="flex items-center gap-2 mt-2">
                       <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border border-brand-border rounded text-brand-secondary disabled:opacity-50 flex items-center justify-center">-</button>
                       <span className="w-8 text-center font-medium">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border border-brand-border rounded text-brand-secondary flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-brand-secondary">{(item.price * item.quantity).toFixed(2)} €</p>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline mt-2 flex items-center justify-end gap-1 ml-auto">
                        <TrashIcon className="w-3 h-3" /> Entfernen
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="flex-shrink-0 bg-brand-surface border-t border-brand-border p-4 space-y-4">
            <div className="flex justify-between items-center font-bold text-lg text-brand-secondary">
              <span>Gesamtsumme:</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <Link to="/kontakt" state={{ cart: cart }} onClick={onClose} className="w-full block">
              <Button variant="primary" size="lg" className="w-full flex justify-center items-center gap-2">
                Zur Kasse gehen <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
};
