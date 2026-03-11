import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import simiroLogo from "@/assets/simiro-logo.png";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card rounded-xl p-8 max-w-sm w-full text-center">
        <img src={simiroLogo} alt="Simiro Store" className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-2 border-primary" />
        <h1 className="font-display text-2xl font-bold mb-2">Panel Admin</h1>
        <p className="text-muted-foreground font-body text-sm mb-6">Ingresa tu contraseña de administrador</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {error && <p className="text-destructive font-body text-sm">Contraseña incorrecta</p>}
          <button type="submit" className="w-full gradient-neon text-primary-foreground font-body font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
