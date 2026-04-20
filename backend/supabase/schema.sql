-- Habilitar pgvector
create extension if not exists vector;

-- Tabla de vehículos
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  year int not null,
  price numeric not null,
  fuel_type text,
  transmission text,
  mileage int default 0,
  color text,
  description text,
  images text[] default '{}',
  available boolean default true,
  created_at timestamptz default now()
);

-- Tabla de embeddings para RAG
create table if not exists vehicle_embeddings (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  content text,
  embedding vector(4096),
  metadata jsonb default '{}'
);

-- Función para búsqueda vectorial
create or replace function match_vehicles(
  query_embedding vector(4096),
  match_count int default 3
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select id, content, metadata,
    1 - (embedding <=> query_embedding) as similarity
  from vehicle_embeddings
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Tabla de leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  customer_name text,
  customer_contact text,
  conversation_summary text,
  score int default 0,
  vehicle_interest text,
  assigned_to text,
  status text default 'new',
  created_at timestamptz default now()
);
