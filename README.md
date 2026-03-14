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

3. **Importante – políticas RLS:** Sin esto, los clientes no ven productos (el catálogo queda vacío). En la misma pestaña **SQL** de Supabase ejecuta también:
   ```sql
   -- Permitir que cualquiera (incluidos clientes anónimos) pueda LEER productos y configuración
   alter table products enable row level security;
   alter table settings enable row level security;

   create policy "Permitir leer productos" on products for select using (true);
   create policy "Permitir crear productos" on products for insert with check (true);
   create policy "Permitir actualizar productos" on products for update using (true);
   create policy "Permitir borrar productos" on products for delete using (true);

   create policy "Permitir leer settings" on settings for select using (true);
   create policy "Permitir insertar settings" on settings for insert with check (true);
   create policy "Permitir actualizar settings" on settings for update using (true);
   ```
   Así la web (Vercel y local) puede leer y escribir en `products` y `settings` con la clave anónima.

4. Asegúrate de que las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén definidas en Vercel (y en tu `.env` local).

Desde la aplicación, los métodos `addProduct`, `updateProduct`, `deleteProduct` y `updateSettings` se comunicarán con Supabase; al cargar la tienda se hace un `select` automático.

> 📦 **Nota:** la base de datos es compartida, así que cualquier cambio que hagas en la consola (o desde Admin) se reflejará para todos los visitantes de la web sin recargar.

Con este backend ya tienes almacenamiento real y la tienda funciona en múltiples dispositivos a la vez.

**Si el catálogo sigue vacío en la web:** Entra en Supabase → **Database** → **Replication** (o **Realtime**) y asegúrate de que la publicación incluye la tabla `products`, o que Realtime está activado para esa tabla. Sobre todo, repasa el paso 3 anterior: sin las políticas RLS, los clientes no pueden leer los productos.
