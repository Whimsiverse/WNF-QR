'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Card, PackWithCards } from '@/lib/types';
import QRCodeStyled from './QRCodeStyled';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function CardRow({ card }: { card: Card }) {
  const supabase = createClient();
  const [redirectUrl, setRedirectUrl] = useState(card.redirect_url);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const cardUrl = `${SITE_URL}/c/${card.slug}`;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from('cards')
      .update({ redirect_url: redirectUrl })
      .eq('id', card.id);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  };

  const dirty = redirectUrl !== card.redirect_url;

  return (
    <div>
      <div className="card-row">
        <div>
          <div className="card-row-name">{card.name}</div>
          <div className="card-row-slug">/c/{card.slug}</div>
        </div>
        <div className="row">
          <input
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '0.7rem',
              border: '2px solid rgba(157,102,242,0.4)',
              background: 'rgba(0,0,0,0.2)',
              color: 'var(--cream)',
              fontSize: '0.85rem',
            }}
          />
          {dirty && (
            <button className="btn btn-fill btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? '…' : 'Save'}
            </button>
          )}
          {saved && <span style={{ color: 'var(--green)', fontSize: '0.8rem' }}>Saved ✦</span>}
        </div>
        <div className="card-row-scans">{card.scan_count}</div>
        <div className="card-row-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowQR((s) => !s)}>
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>
        </div>
      </div>
      {showQR && (
        <div style={{ marginBottom: '1rem', marginLeft: '0.5rem' }}>
          <QRCodeStyled url={cardUrl} fileName={card.slug} />
          <p className="muted" style={{ marginTop: '0.5rem' }}>{cardUrl}</p>
        </div>
      )}
    </div>
  );
}

export default function DashboardClient({
  groupedPacks,
  unassigned,
}: {
  groupedPacks: PackWithCards[];
  unassigned: Card[];
}) {
  return (
    <div>
      {groupedPacks.map((pack) => (
        <div className="pack-group" key={pack.id}>
          <div className="pack-group-header">
            <span className="pack-group-title">{pack.name}</span>
            <span className="pack-group-count">
              {pack.cards.length} card{pack.cards.length === 1 ? '' : 's'}
            </span>
          </div>
          {pack.cards.length === 0 && (
            <p className="muted">No cards in this pack yet.</p>
          )}
          {pack.cards.map((card) => (
            <CardRow key={card.id} card={card} />
          ))}
        </div>
      ))}

      {unassigned.length > 0 && (
        <div className="pack-group">
          <div className="pack-group-header">
            <span className="pack-group-title">Unassigned</span>
            <span className="pack-group-count">{unassigned.length} card(s)</span>
          </div>
          {unassigned.map((card) => (
            <CardRow key={card.id} card={card} />
          ))}
        </div>
      )}

      {groupedPacks.length === 0 && unassigned.length === 0 && (
        <div className="panel">
          <p className="muted">
            No cards yet. Create a pack first, then add your first card.
          </p>
        </div>
      )}
    </div>
  );
}
