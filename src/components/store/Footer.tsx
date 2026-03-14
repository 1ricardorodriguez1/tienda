import { useStore } from "@/context/StoreContext";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  const { settings } = useStore();

  const whatsappNumber = settings.whatsappNumber != null ? String(settings.whatsappNumber) : "";
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}` : "#";

  return (
    <footer className="border-t border-border bg-card/50 py-10 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-lg font-bold neon-text">{settings.storeName ?? "Simiro Store"}</h3>
            <p className="text-muted-foreground font-body text-sm mt-1">Moda urbana con estilo</p>
          </div>

          <div className="flex items-center gap-5">
            {whatsappNumber && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="WhatsApp">
                <MessageCircle size={24} />
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Instagram">
                <Instagram size={24} />
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Facebook">
                <Facebook size={24} />
              </a>
            )}
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-muted-foreground font-body text-xs">
              Envío Bogotá: ${(Number(settings.shippingCost) || 0).toLocaleString("es-CO")} COP
            </p>
            <p className="text-muted-foreground font-body text-xs">
              © {new Date().getFullYear()} {settings.storeName ?? "Simiro Store"}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
