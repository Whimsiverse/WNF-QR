import { createServerSupabase } from '@/lib/supabase/server';
import DashboardClient from '@/components/DashboardClient';
import type { Card, CardPack, PackWithCards } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const [{ data: packs }, { data: cards }] = await Promise.all([
    supabase.from('card_packs').select('*').order('created_at', { ascending: true }),
    supabase.from('cards').select('*').order('created_at', { ascending: true }),
  ]);

  const packList = (packs || []) as CardPack[];
  const cardList = (cards || []) as Card[];

  const grouped: PackWithCards[] = packList.map((pack) => ({
    ...pack,
    cards: cardList.filter((c) => c.pack_id === pack.id),
  }));

  const unassigned = cardList.filter((c) => !c.pack_id);

  return (
    <div>
      <p className="eyebrow">✦ dashboard ✦</p>
      <h1 style={{ fontSize: '1.9rem', marginBottom: '0.5rem' }}>
        Your <span className="c-yellow">QR Cards</span>
      </h1>
      <p className="muted" style={{ marginBottom: '2rem' }}>
        {cardList.length} card{cardList.length === 1 ? '' : 's'} across {packList.length} pack
        {packList.length === 1 ? '' : 's'} · edit a redirect anytime, printed QR codes never
        need to change.
      </p>

      <DashboardClient groupedPacks={grouped} unassigned={unassigned} />
    </div>
  );
}
