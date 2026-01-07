-- Add city and state columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT;

-- Update the handle_new_user function to include city and state from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, city, state)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'state'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
