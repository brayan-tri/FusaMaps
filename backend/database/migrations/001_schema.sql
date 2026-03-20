CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuarios (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre                VARCHAR(100) NOT NULL,
  email                 VARCHAR(255) UNIQUE NOT NULL,
  password_hash         VARCHAR(255),
  telefono              VARCHAR(20),
  foto_url              TEXT,
  rol                   VARCHAR(30)  NOT NULL DEFAULT 'ciudadano'
                        CHECK (rol IN ('ciudadano','conductor','admin_empresa','admin_municipal','super_admin')),
  activo                BOOLEAN      NOT NULL DEFAULT true,
  refresh_token         TEXT,
  reset_token           TEXT,
  reset_token_expires   TIMESTAMPTZ,
  ultimo_login          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rutas (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          VARCHAR(100) NOT NULL,
  descripcion     TEXT,
  color_hex       VARCHAR(7)   NOT NULL DEFAULT '#16A34A',
  zona            VARCHAR(30),
  estado          VARCHAR(20)  NOT NULL DEFAULT 'activa',
  horario_inicio  TIME         NOT NULL DEFAULT '05:00',
  horario_fin     TIME         NOT NULL DEFAULT '22:00',
  frecuencia_min  INTEGER,
  tarifa          NUMERIC(8,0) NOT NULL DEFAULT 2800,
  trazado         GEOMETRY(LINESTRING, 4326),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paraderos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      VARCHAR(150) NOT NULL,
  codigo      VARCHAR(20)  UNIQUE NOT NULL,
  direccion   VARCHAR(200),
  ubicacion   GEOMETRY(POINT, 4326) NOT NULL,
  activo      BOOLEAN      NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paraderos_ubicacion ON paraderos USING GIST (ubicacion);

-- Usuario admin inicial
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
  ('Admin FusaMaps', 'admin@fusamaps.co',
   '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin')
ON CONFLICT DO NOTHING;

-- Rutas de prueba
INSERT INTO rutas (nombre, descripcion, color_hex, zona, tarifa) VALUES
  ('Ruta A – Centro', 'Terminal ↔ Parque Principal', '#16A34A', 'centro', 2800),
  ('Ruta B – Sur',    'Centro ↔ Balmoral',           '#EA580C', 'sur',    2800),
  ('Ruta C – Norte',  'Parque ↔ Los Cerezos',        '#1D4ED8', 'norte',  2800)
ON CONFLICT DO NOTHING;

-- Paraderos de prueba (coordenadas reales de Fusagasugá)
INSERT INTO paraderos (nombre, codigo, direccion, ubicacion) VALUES
  ('Parque Principal',        'PDR-001', 'Cra. 6 con Cl. 7',   ST_SetSRID(ST_MakePoint(-74.3647, 4.3361), 4326)),
  ('Terminal de Transportes', 'PDR-002', 'Av. Colón',           ST_SetSRID(ST_MakePoint(-74.3710, 4.3270), 4326)),
  ('Hospital San Rafael',     'PDR-003', 'Cra. 5 con Cl. 14',  ST_SetSRID(ST_MakePoint(-74.3590, 4.3420), 4326)),
  ('Plaza de Mercado',        'PDR-004', 'Cl. 10 con Cra. 8',  ST_SetSRID(ST_MakePoint(-74.3668, 4.3340), 4326))
ON CONFLICT DO NOTHING;
