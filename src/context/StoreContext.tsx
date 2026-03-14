import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem, StoreSettings } from "@/types/store";
import { supabase } from "@/lib/supabaseClient"; // backend client

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  settings: StoreSettings;
  isAdmin: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<{ ok: boolean; error?: string }>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<{ ok: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ ok: boolean; error?: string }>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  login: (password: string) => boolean;
  logout: () => void;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
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

  // load data from Supabase on mount
  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("createdAt", { ascending: false });
    if (!error && data) {
      setProducts(data as Product[]);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();
    if (!error && data) {
      const raw = data as Record<string, unknown>;
      const merged = Object.fromEntries(
        Object.entries(raw).filter(([, v]) => v != null)
      ) as Partial<StoreSettings>;
      setSettings(prev => ({ ...prev, ...merged }));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  // Realtime updates from Supabase so that when el admin agrega/edita/borra
  // productos en otro dispositivo, todos los clientes ven los cambios sin recargar.
  useEffect(() => {
    const channel = supabase
      .channel("public:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        payload => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const next = payload.new as Product;
            setProducts(prev => {
              const without = prev.filter(p => p.id !== next.id);
              return [next, ...without];
            });
          }
          if (payload.eventType === "DELETE") {
            const oldRow = payload.old as { id: string };
            setProducts(prev => prev.filter(p => p.id !== oldRow.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // listen for storage events so that products/settings are updated
  // if another tab (or window) modifies localStorage. This only works
  // between tabs/windows in the same browser; it does **not** synchronise
  // between different devices. For true multi‑user support a backend
  // service is required.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "simiro_products") {
        try {
          setProducts(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          // ignore malformed data
        }
      }
      if (e.key === "simiro_settings") {
        try {
          setSettings(e.newValue ? JSON.parse(e.newValue) : defaultSettings);
        } catch {}
      }
      if (e.key === "simiro_admin") {
        setIsAdmin(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => { localStorage.setItem("simiro_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("simiro_settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("simiro_admin", JSON.stringify(isAdmin)); }, [isAdmin]);

  const addProduct = useCallback(async (product: Omit<Product, "id" | "createdAt">) => {
    const { data, error } = await supabase
      .from("products")
      .insert({ ...product, createdAt: new Date().toISOString() })
      .select("*")
      .single();
    if (error) {
      console.error("failed to add product", error);
      return { ok: false, error: error.message };
    }
    if (data) {
      setProducts(prev => [data as Product, ...prev]);
    }
    return { ok: true };
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      console.error("failed to update product", error);
      return { ok: false, error: error.message };
    }
    if (data) {
      setProducts(prev => prev.map(p => (p.id === id ? (data as Product) : p)));
    }
    return { ok: true };
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("failed to delete product", error);
      return { ok: false, error: error.message };
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    return { ok: true };
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

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + (cart.length > 0 ? (Number(settings.shippingCost) || 0) : 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) { setIsAdmin(true); return true; }
    return false;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const updateSettings = useCallback(async (updates: Partial<StoreSettings>) => {
    // local update first for responsiveness
    setSettings(prev => ({ ...prev, ...updates }));
    const payload = { id: "default", ...updates };
    const { error } = await supabase
      .from("settings")
      .upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("settings save failed", error);
    }
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
