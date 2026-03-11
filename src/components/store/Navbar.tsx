import { useStore } from "@/context/StoreContext";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import simiroLogo from "@/assets/simiro-logo.png";

const Navbar = () => {
  const { cartCount, settings, isAdmin, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      {settings.bannerText && (
        <div className="gradient-neon text-center py-1.5 text-xs font-body font-semibold tracking-wider text-primary-foreground">
          {settings.bannerText}
        </div>
      )}
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img src={simiroLogo} alt="Simiro Store" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-xl font-bold neon-text">{settings.storeName}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 font-body text-sm">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">Inicio</Link>
          <Link to="/catalogo" className="text-foreground/80 hover:text-primary transition-colors">Catálogo</Link>
          {isAdmin && <Link to="/admin" className="text-primary font-semibold">Admin</Link>}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/carrito")} className="relative text-foreground/80 hover:text-primary transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          {isAdmin ? (
            <button onClick={logout} className="text-xs text-muted-foreground hover:text-primary transition-colors">Salir</button>
          ) : (
            <button onClick={() => navigate("/login")} className="text-foreground/80 hover:text-primary transition-colors">
              <User size={20} />
            </button>
          )}
          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-card border-t border-border p-4 space-y-3">
          <Link to="/" className="block text-foreground/80 hover:text-primary" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/catalogo" className="block text-foreground/80 hover:text-primary" onClick={() => setMenuOpen(false)}>Catálogo</Link>
          {isAdmin && <Link to="/admin" className="block text-primary font-semibold" onClick={() => setMenuOpen(false)}>Admin</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
