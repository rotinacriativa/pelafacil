
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kuitgqsrerbghbmrxciy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pQjaZFOy2UhGLk2l2pCrBw_nadUiJsa';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
