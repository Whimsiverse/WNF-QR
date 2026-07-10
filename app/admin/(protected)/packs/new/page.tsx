'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function NewPackPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
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

    const { error } = await supabase.from('card_packs').insert({ name, slug });

    setLoading(false);

    if (error) {
      setErrorMsg(
        error.code === '23505' ? 'That slug is already taken.' : 'Something went wrong.'
      );
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="panel" style={{ maxWidth: 480 }}>
      <p className="eyebrow">✦ new pack ✦</p>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Create a <span className="c-yellow">card pack</span>
      </h1>
      <form onSubmit={handleSubmit} className="stack">
        <div className="field">
          <label htmlFor="name">Pack name</label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Founder's Anniversary Drop"
          />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
          <p className="field-hint">Just for organizing in the dashboard — not part of the QR URL.</p>
        </div>
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        <button type="submit" className="btn btn-fill" disabled={loading}>
          {loading ? 'Creating…' : 'Create pack'}
        </button>
      </form>
    </div>
  );
}
