# Whimsiverse QR

Dynamic QR codes for your Whimsy Cards. The QR printed on a card never
changes — it points to `/c/<slug>` on this app, and you control where
that redirects from the admin panel, anytime, without reprinting.

## How it works

1. Each card gets a short slug, e.g. `aurora-01`.
2. The printed QR encodes `https://your-domain.com/c/aurora-01`.
3. Scanning it hits a route handler that looks up `aurora-01` in Supabase,
   logs the scan, and redirects to whatever `redirect_url` is set right now.
4. Change `redirect_url` in the admin panel whenever you want — swap a
   placeholder for the real story, update a story, anything — and every
   card already in someone's hands follows along automatically.
5. Later, this same slug system is what lets you add "claim this card to
   your portfolio" without touching a single printed QR.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (or use an
   existing one — this can share a project with other Whimsiverse tools,
   just keep the table names as-is).
2. Open the SQL Editor and run everything in `supabase/schema.sql`.
3. Go to **Authentication → Users** and manually create your one admin
   account (your email + a password). This app has no public sign-up —
   that's the only account that will ever exist.
4. Optional but recommended: **Authentication → Providers → Email** →
   turn off "Allow new users to sign up."
5. Grab your keys from **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep this one secret — never put it in a `NEXT_PUBLIC_` variable or commit it to git)

## 2. Add your logo

Drop your logo file at `public/assets/logo.png` (replacing the placeholder
that's already there). Square, transparent background, 300px+ recommended
— it's what renders in the center of every QR code.

## 3. Local development

```bash
npm install
cp .env.example .env.local   # then fill in your real Supabase keys
npm run dev
```

Visit `http://localhost:3000/admin/login`.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project** → import that repo.
3. Under **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — set this for **Production** (and
     Preview if you want) only. It never gets exposed to the browser
     because it has no `NEXT_PUBLIC_` prefix — Next.js only inlines
     `NEXT_PUBLIC_*` vars into client bundles, everything else stays
     server-side only.
   - `NEXT_PUBLIC_SITE_URL` — your final domain, e.g.
     `https://qr.whimsiverse.art`. This is what gets encoded into every
     QR code, so set it before printing anything.
4. Deploy. Optionally attach a short custom domain (something like
   `qr.whimsiverse.art` or `wsv.art`) — shorter URLs make denser, more
   scannable QR codes.

## 5. Using the admin panel

- **New pack** — create a group first, e.g. "Founder's Anniversary Drop."
- **New card** — name it, set its slug (this becomes the printed URL),
  pick its pack, and set the redirect URL (the story page it should send
  people to today).
- **Dashboard** — every pack, every card, current scan count, an inline
  field to change the redirect URL anytime, and a "Show QR" toggle with
  **Export SVG** / **Export PNG** buttons for print-ready files.

## Notes on the printed QR's error tolerance

The QR is generated with high error correction (level H) specifically
because your logo sits in the center covering part of the code — this
keeps it scannable even with the logo overlay. If you ever swap the logo
for something more detailed, keep the `imageSize` in
`components/QRCodeStyled.tsx` at 0.4 or smaller so enough of the code
stays visible.

## What's next (portfolio claiming)

The `cards` and upcoming `users`/`claims` tables are designed so that
"add this card to my portfolio" can be layered on later without
reprinting anything — same slug, same QR, the redirect route just gets a
branch that checks if a visitor is logged in and offers to claim the card
instead of (or before) redirecting to the story.
