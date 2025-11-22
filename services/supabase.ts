import { createClient } from "@supabase/supabase-js";

const supabase_PROJECT_URL = import.meta.env.VITE_SUPABASE_URL;
const supabase_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
// console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10) + "...");

// connect to the supabase account sa internet -> communicate to the supabase services
export const supabase = createClient(supabase_PROJECT_URL, supabase_ANON_KEY);