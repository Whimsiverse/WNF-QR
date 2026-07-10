import { createServerSupabase } from '@/lib/supabase/server';
import NewCardForm from '@/components/NewCardForm';
import type { CardPack } from '@/lib/types';

export default async function NewCardPage() {
  const supabase = createServerSupabase();
  const { data: packs } = await supabase
    .from('card_packs')
    .select('*')
    .order('name', { ascending: true });

  return <NewCardForm packs={(packs || []) as CardPack[]} />;
}
