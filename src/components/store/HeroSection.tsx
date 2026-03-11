import { useStore } from "@/context/StoreContext";
import { motion } from "framer-motion";
import simiroLogo from "@/assets/simiro-logo.png";

const HeroSection = () => {
  const { settings } = useStore();

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={settings.backgroundImage ? { backgroundImage: `url(${settings.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full neon-border-strong blur-sm" />
            <img
              src={simiroLogo}
              alt="Simiro Store"
              className="relative w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-2 border-primary animate-float"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl font-display font-bold mb-4 neon-text"
        >
          {settings.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground font-body max-w-xl mx-auto mb-8"
        >
          {settings.heroSubtitle}
        </motion.p>

        <motion.a
          href="/catalogo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="inline-block gradient-neon text-primary-foreground font-body font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity tracking-wide"
        >
          Ver Colección
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
