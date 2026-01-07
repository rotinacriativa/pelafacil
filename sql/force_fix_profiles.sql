-- FORCE FIX PARA TABELA PROFILES --

-- 1. Garante que RLS está ativo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Remove policies antigas para evitar conflitos (limpeza)
DROP POLICY IF EXISTS "Public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- 3. Recria as permissões CORRETAS

-- LEITURA: Todo mundo pode ver (necessário para ver perfil dos outros)
CREATE POLICY "Public profiles"
  ON profiles FOR SELECT
  USING ( true );

-- INSERÇÃO: Usuário pode criar APENAS seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- ATUALIZAÇÃO: Usuário pode editar APENAS seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- EXTRA: Garante permissões básicas (caso o usuário autenticado não tenha)
GRANT ALL ON TABLE profiles TO postgres;
GRANT ALL ON TABLE profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE profiles TO authenticated;
GRANT SELECT ON TABLE profiles TO anon;
