import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// This is the URL printed on every physical card: /c/<slug>
// The QR code itself never changes — this route looks up where <slug>
// currently points and redirects there. Change `redirect_url` in the
// admin panel any time and every already-printed card follows along.
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const supabase = createAdminClient();

  const { data: card, error } = await supabase
    .from('cards')
    .select('id, redirect_url, scan_count')
    .eq('slug', slug)
    .single();

  if (error || !card) {
    // Unknown card — send to a friendly fallback instead of a dead end.
    const fallback = process.env.NEXT_PUBLIC_FALLBACK_URL || 'https://wooblynfrens.com';
    return NextResponse.redirect(fallback, { status: 302 });
  }

  // Log the scan and bump the counter. Fire-and-forget-ish, but awaited
  // here since serverless functions don't guarantee work continues after
  // the response is sent.
  const userAgent = request.headers.get('user-agent') || null;
  const referrer = request.headers.get('referer') || null;
  const country = request.headers.get('x-vercel-ip-country') || null;

  await Promise.all([
    supabase.from('scans').insert({
      card_id: card.id,
      user_agent: userAgent,
      referrer,
      country,
    }),
    supabase
      .from('cards')
      .update({ scan_count: card.scan_count + 1 })
      .eq('id', card.id),
  ]);

  return NextResponse.redirect(card.redirect_url, { status: 302 });
}
