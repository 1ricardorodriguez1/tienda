## Simiro Store – Tienda de moda online

Este proyecto es la tienda oficial **Simiro Store**, una aplicación web para vender ropa con catálogo, carrito, compra por WhatsApp y panel de administración.

### Tecnologías principales

- Vite + React + TypeScript  
- Tailwind CSS + shadcn-ui  
- React Router  
- Supabase (preparado para datos, auth e imágenes)

### Cómo ejecutar el proyecto en tu computador

```bash
npm install
npm run dev
```

Luego abre `http://localhost:5173` en tu navegador.

### Estructura básica

- `src/pages` – páginas públicas (`Index`, `Catalogo`, `Carrito`, `Login`, `Admin`).  
- `src/components` – componentes de UI, tienda y admin.  
- `src/context/StoreContext.tsx` – estado global de productos, carrito y configuración de la tienda.  
- `src/lib/supabaseClient.ts` – cliente Supabase configurado para este proyecto.

El objetivo es que puedas cargar tus prendas, gestionar textos, enlaces y estilo visual sin tocar código.
