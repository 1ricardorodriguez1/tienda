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

### Backend con Supabase

Los productos y la configuración ya no se almacenan únicamente en `localStorage`, sino en tu proyecto de Supabase. Para funcionar sigue estos pasos:

1. Entra en el panel de tu proyecto en Supabase y abre **SQL Editor** → **New query**.
2. Copia y pega **todo** el contenido del archivo **`supabase-setup.sql`** del repositorio y pulsa **Run**. Ese script crea las tablas `products` y `settings` y configura las políticas RLS para que los clientes vean el catálogo. Si ya creaste las tablas antes, el script no las borra; solo añade lo que falte.
3. Asegúrate de que las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén definidas en Vercel (y en tu `.env` local).

Desde la aplicación, los métodos `addProduct`, `updateProduct`, `deleteProduct` y `updateSettings` se comunicarán con Supabase; al cargar la tienda se hace un `select` automático.

> 📦 **Nota:** la base de datos es compartida, así que cualquier cambio que hagas en la consola (o desde Admin) se reflejará para todos los visitantes de la web sin recargar.

Con este backend ya tienes almacenamiento real y la tienda funciona en múltiples dispositivos a la vez.

**Si el catálogo sigue vacío en la web:** Entra en Supabase → **Database** → **Replication** (o **Realtime**) y asegúrate de que la publicación incluye la tabla `products`, o que Realtime está activado para esa tabla. Sobre todo, repasa el paso 3 anterior: sin las políticas RLS, los clientes no pueden leer los productos.
