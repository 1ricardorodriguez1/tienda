import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { useStore } from "@/context/StoreContext";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";

const Carrito = () => {
  const { cart, cartTotal, settings, removeFromCart, updateCartQuantity, clearCart } = useStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  const handleWhatsAppCheckout = () => {
    const items = cart.map(item =>
      `• ${item.product.name} | Talla: ${item.selectedSize} | Color: ${item.selectedColor} | Cantidad: ${item.quantity} | Precio: ${formatPrice(item.product.price * item.quantity)}`
    ).join("\n");

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = Number(settings.shippingCost) || 0;
    const message = `🛒 *Pedido Simiro Store*\n\n${items}\n\n📦 Subtotal: ${formatPrice(subtotal)}\n🚚 Envío Bogotá: ${formatPrice(shipping)}\n💰 *Total: ${formatPrice(cartTotal)}*\n\n¡Quiero comprar esto con envío a Bogotá! 🙏`;

    const phone = settings.whatsappNumber != null ? String(settings.whatsappNumber).replace(/[^0-9]/g, "") : "";
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-8 neon-text">Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg mb-4">Tu carrito está vacío</p>
            <a href="/catalogo" className="gradient-neon text-primary-foreground font-body font-semibold px-6 py-3 rounded-lg inline-block hover:opacity-90 transition-opacity">
              Ver Catálogo
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="glass-card rounded-lg p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sin img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold truncate">{item.product.name}</h3>
                    <p className="text-muted-foreground font-body text-xs mt-0.5">
                      Talla: {item.selectedSize} · Color: {item.selectedColor}
                    </p>
                    <p className="text-primary font-body font-bold mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-primary transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-primary transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-lg p-6 mt-6 space-y-3">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cartTotal - (Number(settings.shippingCost) || 0))}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Envío Bogotá</span>
                <span>{formatPrice(Number(settings.shippingCost) || 0)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-body font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(cartTotal)}</span>
              </div>

              <p className="text-muted-foreground font-body text-sm text-center pt-1">
                La compra, el pago y el envío se coordinan por WhatsApp.
              </p>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full gradient-neon text-primary-foreground font-body font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-4"
              >
                <MessageCircle size={20} /> Comprar por WhatsApp
              </button>
              <button onClick={clearCart} className="w-full text-muted-foreground font-body text-sm hover:text-destructive transition-colors py-2">
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Carrito;
