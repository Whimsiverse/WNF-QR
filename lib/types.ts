export type CardPack = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Card = {
  id: string;
  pack_id: string | null;
  name: string;
  slug: string;
  redirect_url: string;
  story_title: string | null;
  scan_count: number;
  created_at: string;
  updated_at: string;
};

export type PackWithCards = CardPack & { cards: Card[] };
