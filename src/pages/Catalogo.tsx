import Navbar from "@/components/store/Navbar";
import ProductCard from "@/components/store/ProductCard";
import ProductModal from "@/components/store/ProductModal";
import Footer from "@/components/store/Footer";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types/store";
import { useState, useRef, useEffect } from "react";
import { Search, Filter } from "lucide-react";

const Catalogo = () => {
  const { products, settings } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    if (filterOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [filterOpen]);

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

        <div className="flex gap-2 mb-8 max-w-2xl mx-auto" ref={filterRef}>
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen(v => !v)}
              className={`h-[42px] px-4 rounded-lg font-body text-sm flex items-center gap-2 border transition-colors ${filterOpen || category !== "Todos" ? "gradient-neon text-primary-foreground border-primary" : "bg-input border-border text-muted-foreground hover:bg-secondary"}`}
              aria-label="Filtrar por categoría"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">{category}</span>
            </button>
            {filterOpen && (
              <div className="absolute top-full left-0 mt-1 min-w-[160px] py-1 rounded-lg bg-card border border-border shadow-lg z-10">
                {categories.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCategory(c); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 font-body text-sm transition-colors ${category === c ? "bg-primary/20 text-primary" : "text-foreground hover:bg-secondary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
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
