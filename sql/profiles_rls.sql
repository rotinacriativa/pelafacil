-- Habilita RLS na tabela profiles (caso não esteja)
alter table profiles enable row level security;

-- P.S: Se as policies já existirem com esses nomes, vai dar erro, por isso o "drop if exists" antes é boa prática, 
-- mas aqui farei simples para criação. Se der erro de "policy exists", ignore.

-- 1. Permitir LEITURA (Select) para todo mundo (perfis públicos)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- 2. Permitir INSERIR (Insert) apenas o próprio perfil
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- 3. Permitir ATUALIZAR (Update) apenas o próprio perfil
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
