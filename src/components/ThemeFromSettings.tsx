import { useEffect } from "react";
import { useStore } from "@/context/StoreContext";

/**
 * Aplica el color y estilo de fondo desde la configuración de la tienda al body.
 */
export default function ThemeFromSettings() {
  const { settings } = useStore();

  useEffect(() => {
    const bg = (settings.backgroundColor ?? "").trim() || "#0a0a0a";
    const style = settings.backgroundStyle ?? "solid";
    const accent = (settings.accentColor ?? "").trim() || "hsl(330, 100%, 50%)";

    if (style === "gradient" && accent) {
      document.body.style.background = `linear-gradient(180deg, ${bg} 0%, ${accent}22 50%, ${bg} 100%)`;
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.background = bg;
      document.body.style.backgroundAttachment = "";
    }
  }, [settings.backgroundColor, settings.backgroundStyle, settings.accentColor]);

  return null;
}
