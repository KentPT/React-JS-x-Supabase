import { createClient } from "@supabase/supabase-js";

// const variables
const supabase_PROJECT_URL = 'https://ypdljfstpkyckvrkbjjh.supabase.co';
const supabase_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGxqZnN0cGt5Y2t2cmtiampoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTAzMjYsImV4cCI6MjA3NDYyNjMyNn0.1Xmw28KlU4nUe7j5dLc4SHZ0hWLY92Nzv9WPLtgXHJM';

// connect to the supabase account sa internet -> communicate to the supabase services
export const supabase = createClient( supabase_PROJECT_URL, supabase_ANON_KEY );