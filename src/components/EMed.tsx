import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  Filter, 
  ShoppingBag, 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin,
  Package,
  AlertCircle
} from 'lucide-react';

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Pain relief' | 'Fever' | 'Vitamins' | 'Cough' | 'Antibiotics' | 'Other';
  stockStatus: 'In stock' | 'Low stock' | 'Out of stock';
  image: string;
}

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    description: 'Effective relief for pain and fever.',
    price: 5.99,
    category: 'Pain relief',
    stockStatus: 'In stock',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Ibuprofen',
    description: 'Anti-inflammatory for muscle pain and swelling.',
    price: 8.50,
    category: 'Pain relief',
    stockStatus: 'Low stock',
    image: 'https://images.unsplash.com/photo-1576073719710-418228334440?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Vitamin C',
    description: 'Immune system support supplement.',
    price: 12.00,
    category: 'Vitamins',
    stockStatus: 'In stock',
    image: 'https://images.unsplash.com/photo-1616671285442-8759b5f94735?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Cough Syrup',
    description: 'Soothing relief for dry and chesty coughs.',
    price: 9.99,
    category: 'Cough',
    stockStatus: 'In stock',
    image: 'https://images.unsplash.com/photo-1550572017-ed20015a0b63?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    name: 'Amoxicillin',
    description: 'Broad-spectrum antibiotic (Prescription required).',
    price: 15.75,
    category: 'Antibiotics',
    stockStatus: 'In stock',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    name: 'Multivitamins',
    description: 'Daily essential vitamins and minerals.',
    price: 18.00,
    category: 'Vitamins',
    stockStatus: 'Out of stock',
    image: 'https://images.unsplash.com/photo-1471864190281-ad5fe9ac072b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    name: 'Aspirin',
    description: 'Relief for headaches and minor aches.',
    price: 4.50,
    category: 'Pain relief',
    stockStatus: 'In stock',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    name: 'Zinc Tablets',
    description: 'Supports immune function and skin health.',
    price: 11.25,
    category: 'Vitamins',
    stockStatus: 'Low stock',
    image: 'https://images.unsplash.com/photo-1550572017-4f3b20875953?auto=format&fit=crop&w=800&q=80'
  }
];

interface CartItem extends Medicine {
  quantity: number;
}

interface EMedProps {
  initialSearch?: string;
}

export const EMed: React.FC<EMedProps> = ({ initialSearch = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [address, setAddress] = useState('');

  const categories = ['All', 'Pain relief', 'Fever', 'Vitamins', 'Cough', 'Antibiotics'];

  const filteredMedicines = useMemo(() => {
    return MOCK_MEDICINES.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            med.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const addToCart = (medicine: Medicine) => {
    if (medicine.stockStatus === 'Out of stock') return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrderSuccess(true);
    setCart([]);
    setTimeout(() => {
      setIsOrderSuccess(false);
      setIsCheckoutModalOpen(false);
      setIsCartOpen(false);
    }, 5000);
  };

  return (
    <div className="p-10 space-y-10 min-h-full bg-slate-50/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">E-Med</h2>
          <p className="text-slate-500 font-bold">Your digital health store, delivered to your door.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all w-64 md:w-80 font-medium"
            />
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white border border-slate-200 rounded-2xl hover:border-accent hover:text-accent transition-all group"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-200 animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-accent text-white shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredMedicines.map(med => (
            <motion.div
              layout
              key={med.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-card group hover:border-accent/20 transition-all duration-300"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={med.image} 
                  alt={med.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
                    med.stockStatus === 'In stock' ? 'bg-emerald-500/90 text-white' :
                    med.stockStatus === 'Low stock' ? 'bg-amber-500/90 text-white' :
                    'bg-slate-500/90 text-white'
                  }`}>
                    {med.stockStatus}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{med.category}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 group-hover:text-accent transition-colors leading-tight">{med.name}</h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">{med.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
                    <span className="text-2xl font-black text-slate-900">${med.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(med)}
                    disabled={med.stockStatus === 'Out of stock'}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                      med.stockStatus === 'Out of stock' 
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                        : 'bg-accent text-white hover:bg-blue-600 shadow-lg shadow-blue-100'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[120] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Your Cart</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{cartCount} Items</p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <Package className="w-16 h-16 text-slate-300" />
                    <p className="text-slate-500 font-bold">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-bold text-slate-900 truncate">{item.name}</h5>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-3">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg transition-all"><Minus className="w-3 h-3" /></button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg transition-all"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="text-sm font-black text-slate-900 ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Delivery Fee</span>
                      <span className="text-emerald-500">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="w-full py-5 bg-accent text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-3"
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isOrderSuccess && setIsCheckoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-xl rounded-[48px] p-12 relative z-10 shadow-2xl overflow-hidden"
            >
              {isOrderSuccess ? (
                <div className="text-center space-y-6 py-10">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Order Placed!</h2>
                  <div className="space-y-2">
                    <p className="text-slate-500 font-bold">Your medicine is on its way.</p>
                    <div className="flex items-center justify-center gap-2 text-accent font-black uppercase tracking-widest text-xs">
                      <Clock className="w-4 h-4" />
                      Estimated Delivery: 2 Hours
                    </div>
                  </div>
                  <div className="pt-8">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-3">
                      <div className="flex items-center gap-3 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Delivery Address</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700">{address || 'Home Address (Default)'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">Checkout</h2>
                      <p className="text-slate-500 font-bold">Complete your medical order.</p>
                    </div>
                    <button onClick={() => setIsCheckoutModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>

                  <form className="space-y-8" onSubmit={handleCheckout}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Order Summary</span>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 font-medium">{item.name} <span className="text-slate-400 ml-1">x{item.quantity}</span></span>
                            <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-black text-slate-900">Total Amount</span>
                        <span className="text-2xl font-black text-accent">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Delivery Address</label>
                      <textarea 
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-medium transition-all"
                        placeholder="Enter your full delivery address..."
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setIsCheckoutModalOpen(false)}
                        className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[24px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-5 bg-accent text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95"
                      >
                        Confirm Order
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
