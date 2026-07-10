'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { CardPack } from '@/lib/types';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function NewCardForm({ packs }: { packs: CardPack[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [packId, setPackId] = useState(packs[0]?.id || '');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.from('cards').insert({
      name,
      slug,
      pack_id: packId || null,
      redirect_url: redirectUrl,
      story_title: storyTitle || null,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(
        error.code === '23505'
          ? 'That slug is already taken — try a different one.'
          : 'Something went wrong. Check your fields and try again.'
      );
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="panel" style={{ maxWidth: 520 }}>
      <p className="eyebrow">✦ new card ✦</p>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Add a <span className="c-yellow">collectible card</span>
      </h1>

      {packs.length === 0 && (
        <p className="muted" style={{ marginBottom: '1rem' }}>
          You don't have any packs yet — this card will be created as unassigned. You can{' '}
          <a href="/admin/packs/new" style={{ color: 'var(--yellow)' }}>
            create a pack first
          </a>{' '}
          if you'd like to group it.
        </p>
      )}

      <form onSubmit={handleSubmit} className="stack">
        <div className="field">
          <label htmlFor="name">Card name</label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Aurora — Story 01"
          />
        </div>

        <div className="field">
          <label htmlFor="slug">Slug (this becomes the printed URL)</label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
          <p className="field-hint">
            Printed as: {process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/c/
            {slug || 'your-slug'}
          </p>
        </div>

        {packs.length > 0 && (
          <div className="field">
            <label htmlFor="pack">Card pack</label>
            <select id="pack" value={packId} onChange={(e) => setPackId(e.target.value)}>
              {packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="redirect">Redirect URL (the full story page)</label>
          <input
            id="redirect"
            type="url"
            required
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://wooblynfrens.com/story/aurora-01"
          />
          <p className="field-hint">
            You can change this anytime later without reprinting the card.
          </p>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="story">Story title (optional, for your reference)</label>
          <input
            id="story"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
          />
        </div>

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button type="submit" className="btn btn-fill" disabled={loading}>
          {loading ? 'Creating…' : 'Create card'}
        </button>
      </form>
    </div>
  );
}
