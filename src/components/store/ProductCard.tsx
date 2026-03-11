import { Product } from "@/types/store";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

const ProductCard = ({ product, onClick, index }: ProductCardProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group glass-card rounded-lg overflow-hidden cursor-pointer hover:neon-border transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sin imagen</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="flex items-center gap-2 text-primary font-body text-sm font-semibold">
            <Eye size={16} /> Ver detalles
          </span>
        </div>
        {product.featured && (
          <span className="absolute top-3 left-3 gradient-neon text-primary-foreground text-xs font-body font-bold px-3 py-1 rounded-full">
            ⭐ Destacado
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-primary font-body font-bold text-lg mt-1">{formatPrice(product.price)}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.sizes.slice(0, 4).map(s => (
            <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
