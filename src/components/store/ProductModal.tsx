import { Product } from "@/types/store";
import { useStore } from "@/context/StoreContext";
import { X, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const { addToCart } = useStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  const handleAddToCart = () => {
    addToCart({ product, quantity, selectedSize, selectedColor });
    onClose();
  };

  const nextImage = () => setCurrentImage(i => (i + 1) % product.images.length);
  const prevImage = () => setCurrentImage(i => (i - 1 + product.images.length) % product.images.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6 pt-0">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary cursor-zoom-in" onClick={() => setZoomed(!zoomed)}>
                {product.images[currentImage] ? (
                  <img
                    src={product.images[currentImage]}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? "scale-150" : ""}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sin imagen</div>
                )}
                {product.images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 text-foreground rounded-full p-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 text-foreground rounded-full p-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors ${i === currentImage ? "border-primary" : "border-border"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold">{product.name}</h2>
                <p className="text-primary font-body font-bold text-2xl mt-2">{formatPrice(product.price)}</p>
              </div>

              {product.description && <p className="text-muted-foreground font-body text-sm">{product.description}</p>}

              {product.sizes.length > 0 && (
                <div>
                  <label className="font-body text-sm font-semibold mb-2 block">Talla</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-md border font-body text-sm transition-colors ${selectedSize === s ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors.length > 0 && (
                <div>
                  <label className="font-body text-sm font-semibold mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-4 py-2 rounded-md border font-body text-sm transition-colors ${selectedColor === c ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-body text-sm font-semibold mb-2 block">Cantidad</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:border-primary transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="font-body font-semibold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:border-primary transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full gradient-neon text-primary-foreground font-body font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingCart size={20} /> Agregar al Carrito
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
