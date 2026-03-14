import { useStore } from "@/context/StoreContext";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const DEFAULT_INSTAGRAM = "https://www.instagram.com/simiro_store/";
const DEFAULT_FACEBOOK = "https://www.facebook.com/profile.php?id=100066846246237";

const Footer = () => {
  const { settings } = useStore();

  const whatsappNumber = settings.whatsappNumber != null ? String(settings.whatsappNumber) : "";
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}` : "#";
  const instagramUrl = (settings.instagramUrl ?? "").trim() || DEFAULT_INSTAGRAM;
  const facebookUrl = (settings.facebookUrl ?? "").trim() || DEFAULT_FACEBOOK;

  const socialLinks = [
    { href: whatsappUrl, icon: MessageCircle, label: "WhatsApp" },
    { href: instagramUrl, icon: Instagram, label: "Instagram" },
    { href: facebookUrl, icon: Facebook, label: "Facebook" },
  ];

  return (
    <footer className="border-t border-border bg-card/50 py-10 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-lg font-bold neon-text">{settings.storeName ?? "Simiro Store"}</h3>
            <p className="text-muted-foreground font-body text-sm mt-1">Moda urbana con estilo</p>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                title={label}
              >
                <Icon size={22} strokeWidth={1.5} />
                <span>{label}</span>
              </a>
            ))}
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
