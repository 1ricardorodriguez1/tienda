import Navbar from "@/components/store/Navbar";
import ProductCard from "@/components/store/ProductCard";
import ProductModal from "@/components/store/ProductModal";
import Footer from "@/components/store/Footer";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types/store";
import { useState } from "react";
import { Search } from "lucide-react";

const Catalogo = () => {
  const { products, settings } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const categoriesFromSettings = (settings.filterCategories ?? "")
    .split(",")
    .map(c => c.trim())
    .filter(Boolean);
  const categories = categoriesFromSettings.length > 0
    ? ["Todos", ...categoriesFromSettings]
    : ["Todos", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todos" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold text-center mb-8 neon-text">Catálogo</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-lg font-body text-sm transition-colors ${category === c ? "gradient-neon text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/20"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-body py-16">No se encontraron productos</p>
        )}
      </div>
      <Footer />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default Catalogo;
