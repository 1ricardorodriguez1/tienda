import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import ImageUploader from "@/components/admin/ImageUploader";
import { Plus, Pencil, Trash2, Settings, Package, Save, X } from "lucide-react";
import { Product } from "@/types/store";

const Admin = () => {
  const { isAdmin, products, addProduct, updateProduct, deleteProduct, settings, updateSettings } = useStore();
  const [tab, setTab] = useState<"products" | "settings">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Product form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);

  // Settings form state
  const [sWhatsapp, setSWhatsapp] = useState(settings.whatsappNumber ?? "");
  const [sInstagram, setSInstagram] = useState(settings.instagramUrl ?? "");
  const [sFacebook, setSFacebook] = useState(settings.facebookUrl ?? "");
  const [sShipping, setSShipping] = useState(String(settings.shippingCost ?? 0));
  const [sStoreName, setSStoreName] = useState(settings.storeName ?? "");
  const [sHeroTitle, setSHeroTitle] = useState(settings.heroTitle ?? "");
  const [sHeroSubtitle, setSHeroSubtitle] = useState(settings.heroSubtitle ?? "");
  const [sBgImage, setSBgImage] = useState(settings.backgroundImage ?? "");
  const [sBannerText, setSBannerText] = useState(settings.bannerText ?? "");

  if (!isAdmin) return <Navigate to="/login" replace />;

  const resetForm = () => {
    setName(""); setPrice(""); setDescription(""); setImages([]); setSizes(""); setColors(""); setCategory(""); setFeatured(false);
    setEditingId(null); setShowForm(false);
  };

  const editProduct = (p: Product) => {
    setName(p.name); setPrice(String(p.price)); setDescription(p.description); setImages(p.images);
    setSizes(p.sizes.join(", ")); setColors(p.colors.join(", ")); setCategory(p.category); setFeatured(p.featured);
    setEditingId(p.id); setShowForm(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name, price: Number(price), description, images,
      sizes: sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: colors.split(",").map(c => c.trim()).filter(Boolean),
      category, featured,
    };
    const result = editingId
      ? await updateProduct(editingId, data)
      : await addProduct(data);
    if (!result.ok) {
      alert("No se pudo guardar en la base de datos.\n\nRevisa que en Vercel estén bien configuradas VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (Supabase → Settings → API) y que hayas hecho Redeploy.\n\nError: " + (result.error ?? ""));
      return;
    }
    resetForm();
  };

  const handleSaveSettings = async () => {
    await updateSettings({
      whatsappNumber: sWhatsapp, instagramUrl: sInstagram, facebookUrl: sFacebook,
      shippingCost: Number(sShipping), storeName: sStoreName, heroTitle: sHeroTitle,
      heroSubtitle: sHeroSubtitle, backgroundImage: sBgImage, bannerText: sBannerText,
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 container mx-auto px-4 max-w-4xl pb-16">
        <h1 className="font-display text-3xl font-bold mb-6 neon-text">Panel de Administración</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("products")} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors ${tab === "products" ? "gradient-neon text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
            <Package size={16} /> Productos
          </button>
          <button onClick={() => setTab("settings")} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors ${tab === "settings" ? "gradient-neon text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
            <Settings size={16} /> Configuración
          </button>
        </div>

        {tab === "products" && (
          <>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 gradient-neon text-primary-foreground font-body font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity mb-6">
              <Plus size={18} /> Agregar Producto
            </button>

            {showForm && (
              <form onSubmit={handleSubmitProduct} className="glass-card rounded-xl p-6 mb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-lg font-bold">{editingId ? "Editar" : "Nuevo"} Producto</h3>
                  <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-primary"><X size={20} /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm font-semibold mb-1 block">Nombre</label>
                    <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-semibold mb-1 block">Precio (COP)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-semibold mb-1 block">Tallas (separar con coma)</label>
                    <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="S, M, L, XL" className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-semibold mb-1 block">Colores (separar con coma)</label>
                    <input value={colors} onChange={e => setColors(e.target.value)} placeholder="Negro, Blanco, Rojo" className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-semibold mb-1 block">Categoría</label>
                    <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Camisetas, Pantalones..." className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-primary" />
                    <label htmlFor="featured" className="font-body text-sm">Producto destacado ⭐</label>
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm font-semibold mb-1 block">Descripción</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>

                <div>
                  <label className="font-body text-sm font-semibold mb-2 block">Imágenes</label>
                  <ImageUploader images={images} onChange={setImages} />
                </div>

                <button type="submit" className="gradient-neon text-primary-foreground font-body font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save size={16} /> {editingId ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {products.length === 0 && <p className="text-muted-foreground font-body text-center py-8">No hay productos. ¡Agrega el primero!</p>}
              {products.map(p => (
                <div key={p.id} className="glass-card rounded-lg p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    {p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sin img</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold truncate">{p.name}</h3>
                    <p className="text-primary font-body font-bold text-sm">{formatPrice(p.price)}</p>
                    <p className="text-muted-foreground font-body text-xs">{p.category} · {p.sizes.join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editProduct(p)} className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "settings" && (
          <div className="glass-card rounded-xl p-6 space-y-5">
            <h3 className="font-display text-lg font-bold">Configuración de la Tienda</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm font-semibold mb-1 block">Nombre de la Tienda</label>
                <input value={sStoreName} onChange={e => setSStoreName(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="font-body text-sm font-semibold mb-1 block">WhatsApp (+57...)</label>
                <input value={sWhatsapp} onChange={e => setSWhatsapp(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="font-body text-sm font-semibold mb-1 block">Instagram URL</label>
                <input value={sInstagram} onChange={e => setSInstagram(e.target.value)} placeholder="https://instagram.com/simiro_store" className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="font-body text-sm font-semibold mb-1 block">Facebook URL</label>
                <input value={sFacebook} onChange={e => setSFacebook(e.target.value)} placeholder="https://facebook.com/simirostore" className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="font-body text-sm font-semibold mb-1 block">Costo de Envío (COP)</label>
                <input type="number" value={sShipping} onChange={e => setSShipping(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="font-body text-sm font-semibold mb-1 block">Texto del Banner</label>
                <input value={sBannerText} onChange={e => setSBannerText(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="font-body text-sm font-semibold mb-1 block">Título del Hero</label>
              <input value={sHeroTitle} onChange={e => setSHeroTitle(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="font-body text-sm font-semibold mb-1 block">Subtítulo del Hero</label>
              <input value={sHeroSubtitle} onChange={e => setSHeroSubtitle(e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="font-body text-sm font-semibold mb-1 block">Imagen de Fondo (URL)</label>
              <input value={sBgImage} onChange={e => setSBgImage(e.target.value)} placeholder="https://..." className="w-full bg-input border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <button onClick={handleSaveSettings} className="gradient-neon text-primary-foreground font-body font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Save size={16} /> Guardar Configuración
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
