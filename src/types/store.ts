export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  shippingCost: number;
  storeName: string;
  heroTitle: string;
  heroSubtitle: string;
  backgroundImage: string;
  backgroundColor: string;
  accentColor: string;
  bannerText: string;
  /** Categorías del filtro en catálogo, separadas por coma (ej. Chaqueta,Buso,Pantalones,Sacos) */
  filterCategories?: string;
  /** Estilo de fondo: "solid" | "gradient" */
  backgroundStyle?: string;
}
