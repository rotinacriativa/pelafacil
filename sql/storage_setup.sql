-- 1. Cria o Bucket 'avatars' se não existir
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Permite que qualquer pessoa (público) consiga VER as imagens
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- 3. Permite que usuários logados façam UPLOAD de imagens
create policy "Authenticated users can upload avatars."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- 4. Permite que usuários logados atualizem suas imagens
create policy "Authenticated users can update avatars."
  on storage.objects for update
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
