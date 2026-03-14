-- Ejecuta este script en Supabase: SQL Editor → New query → pegar y Run
-- Sin estas políticas, los clientes no ven los productos (catálogo vacío).

-- Activar RLS en las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Quitar políticas anteriores si existen (para poder volver a ejecutar el script)
DROP POLICY IF EXISTS "Permitir leer productos" ON products;
DROP POLICY IF EXISTS "Permitir crear productos" ON products;
DROP POLICY IF EXISTS "Permitir actualizar productos" ON products;
DROP POLICY IF EXISTS "Permitir borrar productos" ON products;
DROP POLICY IF EXISTS "Permitir leer settings" ON settings;
DROP POLICY IF EXISTS "Permitir insertar settings" ON settings;
DROP POLICY IF EXISTS "Permitir actualizar settings" ON settings;

-- Políticas para products: todos pueden leer, insertar, actualizar y borrar
-- (la app usa la clave anónima; el “admin” se controla con contraseña en la app)
CREATE POLICY "Permitir leer productos" ON products FOR SELECT USING (true);
CREATE POLICY "Permitir crear productos" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizar productos" ON products FOR UPDATE USING (true);
CREATE POLICY "Permitir borrar productos" ON products FOR DELETE USING (true);

-- Políticas para settings
CREATE POLICY "Permitir leer settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Permitir insertar settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizar settings" ON settings FOR UPDATE USING (true);
