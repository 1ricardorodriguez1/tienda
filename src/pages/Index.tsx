import Navbar from "@/components/store/Navbar";
import HeroSection from "@/components/store/HeroSection";
import ProductCard from "@/components/store/ProductCard";
import ProductModal from "@/components/store/ProductModal";
import Footer from "@/components/store/Footer";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types/store";
import { useState } from "react";

const Index = () => {
  const { products } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const featured = products.filter(p => p.featured);
  const recent = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-display text-3xl font-bold text-center mb-10 neon-text">⭐ Productos Destacados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} index={i} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Nuevos Productos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {recent.map((p, i) => (
              <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} index={i} />
            ))}
          </div>
        </section>
      )}

      {products.length === 0 && (
        <section className="container mx-auto px-4 py-32 text-center">
          <p className="text-muted-foreground font-body text-lg">Próximamente nuevas prendas... ¡Estén atentos! 🔥</p>
        </section>
      )}

      <Footer />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default Index;
