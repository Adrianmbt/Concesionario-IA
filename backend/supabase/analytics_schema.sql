-- Visitas a la página
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  vehicle_id uuid references vehiculos(id) on delete set null,
  session_id text,
  created_at timestamptz default now()
);

-- Valoraciones de productos
create table if not exists valoraciones (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehiculos(id) on delete cascade,
  tipo text check (tipo in ('producto', 'atencion_ia', 'atencion_vendedor')),
  rating int check (rating between 1 and 5),
  comentario text,
  session_id text,
  vendedor_id uuid references perfiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Ventas cerradas
create table if not exists ventas (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehiculos(id) on delete set null,
  vendedor_id uuid references perfiles(id) on delete set null,
  cliente_nombre text,
  precio_final numeric not null,
  origen text default 'directo', -- 'chatbot', 'directo', 'referido'
  created_at timestamptz default now()
);

-- Vista: productos estrella (top 5 por rating)
create or replace view top_productos as
select
  v.id,
  v.marca,
  v.modelo,
  v.ano,
  v.precio,
  v.tipo_vehiculo,
  v.imagen_url,
  round(avg(val.rating)::numeric, 1) as rating_promedio,
  count(val.id) as total_valoraciones,
  count(ven.id) as total_ventas
from vehiculos v
left join valoraciones val on val.vehicle_id = v.id and val.tipo = 'producto'
left join ventas ven on ven.vehicle_id = v.id
group by v.id
order by rating_promedio desc nulls last, total_ventas desc
limit 10;

-- Vista: resumen de leads por día
create or replace view leads_por_dia as
select
  date_trunc('day', created_at) as dia,
  count(*) as total,
  count(*) filter (where estado = 'caliente') as calientes
from negociaciones
group by dia
order by dia desc;
