import { createBrowserClient } from '@supabase/ssr';

// Uses the PUBLIC anon key only — safe to ship to the browser.
// Row Level Security on every table means this key can only do what
// the policies in supabase/schema.sql allow (authenticated read/write
// on packs & cards, nothing on scans).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
