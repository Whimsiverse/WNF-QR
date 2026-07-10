import { createClient } from '@supabase/supabase-js';

// ⚠️ SERVER-ONLY. This file must never be imported from a Client
// Component or anything shipped to the browser. It uses the service
// role key, which bypasses Row Level Security entirely.
//
// It's safe here because:
//  - SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix, so Next.js
//    never inlines it into client-side JS bundles.
//  - This module is only imported from route handlers (app/c/[slug]/route.ts)
//    and server actions, which run exclusively on Vercel's server.
//  - You set the real value in Vercel → Project Settings → Environment
//    Variables, never commit it to git (.env.example has a placeholder only).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars'
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
