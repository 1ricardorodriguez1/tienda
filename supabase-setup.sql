-- ============================================================
-- Simiro Store – Configuración completa en Supabase
-- Ejecuta TODO este script en: SQL Editor → New query → Pegar → Run
-- ============================================================

-- 1) Crear tablas (si no existen)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text,
  featured boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY DEFAULT 'default',
  "whatsappNumber" text,
  "instagramUrl" text,
  "facebookUrl" text,
  "shippingCost" numeric,
  "storeName" text,
  "heroTitle" text,
  "heroSubtitle" text,
  "backgroundImage" text,
  "backgroundColor" text,
  "accentColor" text,
  "bannerText" text
);

INSERT INTO settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- 2) Activar RLS y políticas para que los clientes vean el catálogo
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leer productos" ON products;
DROP POLICY IF EXISTS "Permitir crear productos" ON products;
DROP POLICY IF EXISTS "Permitir actualizar productos" ON products;
DROP POLICY IF EXISTS "Permitir borrar productos" ON products;
DROP POLICY IF EXISTS "Permitir leer settings" ON settings;
DROP POLICY IF EXISTS "Permitir insertar settings" ON settings;
DROP POLICY IF EXISTS "Permitir actualizar settings" ON settings;

CREATE POLICY "Permitir leer productos" ON products FOR SELECT USING (true);
CREATE POLICY "Permitir crear productos" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizar productos" ON products FOR UPDATE USING (true);
CREATE POLICY "Permitir borrar productos" ON products FOR DELETE USING (true);

CREATE POLICY "Permitir leer settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Permitir insertar settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizar settings" ON settings FOR UPDATE USING (true);
