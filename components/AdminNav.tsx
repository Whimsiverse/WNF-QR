'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminNav() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="admin-nav">
      <Link href="/admin/dashboard" className="admin-nav-logo">
        <img src="/assets/logo.png" alt="Whimsiverse" />
        Whimsiverse QR
      </Link>
      <div className="admin-nav-links">
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/packs/new">New pack</Link>
        <Link href="/admin/cards/new">New card</Link>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
