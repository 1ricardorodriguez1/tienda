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

1. Entra en el panel de tu proyecto (por ejemplo la URL que compartiste) y abre la pestaña **SQL**.
2. Ejecuta la siguiente consulta para crear las tablas necesarias:
   ```sql
   -- productos
   create table if not exists products (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     price numeric not null,
     description text,
     images jsonb not null default '[]'::jsonb,
     sizes jsonb not null default '[]'::jsonb,
     colors jsonb not null default '[]'::jsonb,
     category text,
     featured boolean not null default false,
     createdAt timestamptz not null default now()
   );

   -- configuración de la tienda (una sola fila)
   create table if not exists settings (
     id text primary key default 'default',
     whatsappNumber text,
     instagramUrl text,
     facebookUrl text,
     shippingCost numeric,
     storeName text,
     heroTitle text,
     heroSubtitle text,
     backgroundImage text,
     backgroundColor text,
     accentColor text,
     bannerText text
   );
   insert into settings (id) values ('default') on conflict do nothing;
   ```
3. Asegúrate de que las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén definidas en tu `.env` (se usan como fallback en `supabaseClient.ts`).

Desde la aplicación, los métodos `addProduct`, `updateProduct`, `deleteProduct` y `updateSettings` se comunicarán con Supabase; al cargar la tienda se hace un `select` automático.

> 📦 **Nota:** la base de datos es compartida, así que cualquier cambio que hagas en la consola (o desde Admin) se reflejará para todos los visitantes de la web sin recargar.

Con este backend ya tienes almacenamiento real y la tienda funciona en múltiples dispositivos a la vez.
