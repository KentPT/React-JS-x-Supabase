import { createClient } from "@supabase/supabase-js";

// const variables
const supabase_PROJECT_URL = process.env.VITE_SUPABASE_URL!;
const supabase_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

// connect to the supabase account sa internet -> communicate to the supabase services
export const supabase = createClient( supabase_PROJECT_URL, supabase_ANON_KEY );