import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem, StoreSettings } from "@/types/store";

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  settings: StoreSettings;
  isAdmin: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  login: (password: string) => boolean;
  logout: () => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
}

const defaultSettings: StoreSettings = {
  whatsappNumber: "+573215067520",
  instagramUrl: "",
  facebookUrl: "",
  shippingCost: 9000,
  storeName: "Simiro Store",
  heroTitle: "Estilo que define tu esencia",
  heroSubtitle: "Descubre la nueva colección exclusiva",
  backgroundImage: "",
  backgroundColor: "",
  accentColor: "",
  bannerText: "¡Envío a Bogotá por solo $9.000 COP!",
};

const ADMIN_PASSWORD = "SIMIROSTORE2026";

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage("simiro_products", []));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(() => loadFromStorage("simiro_settings", defaultSettings));
  const [isAdmin, setIsAdmin] = useState(() => loadFromStorage("simiro_admin", false));

  useEffect(() => { localStorage.setItem("simiro_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("simiro_settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("simiro_admin", JSON.stringify(isAdmin)); }, [isAdmin]);

  const addProduct = useCallback((product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = { ...product, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setProducts(prev => [newProduct, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === item.product.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor);
      if (existing) {
        return prev.map(c => c === existing ? { ...c, quantity: c.quantity + item.quantity } : c);
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(c => !(c.product.id === productId && c.selectedSize === size && c.selectedColor === color)));
  }, []);

  const updateCartQuantity = useCallback((productId: string, size: string, color: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId, size, color); return; }
    setCart(prev => prev.map(c => c.product.id === productId && c.selectedSize === size && c.selectedColor === color ? { ...c, quantity: qty } : c));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + (cart.length > 0 ? settings.shippingCost : 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) { setIsAdmin(true); return true; }
    return false;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const updateSettings = useCallback((updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <StoreContext.Provider value={{ products, cart, settings, isAdmin, addProduct, updateProduct, deleteProduct, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount, login, logout, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
