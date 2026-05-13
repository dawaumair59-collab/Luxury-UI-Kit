# MenuLux

A full-featured luxury SaaS restaurant menu platform — black & gold dark theme, Supabase auth, restaurant dashboard, public menu pages, and TikTok-style video reels.

## Run & Operate

- `pnpm --filter @workspace/luxury-app run dev` — run the app (port 25529)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/luxury-app run typecheck` — typecheck the frontend
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite 7, Tailwind CSS v4, Framer Motion, Wouter (routing), @tanstack/react-query
- Auth + DB: Supabase (auth, PostgreSQL, Storage)
- Video: Cloudinary (unsigned upload, auto compression)
- Drag-drop: @dnd-kit/core + @dnd-kit/sortable
- API: Express 5

## Where things live

- `artifacts/luxury-app/src/App.tsx` — all routes
- `artifacts/luxury-app/src/index.css` — full luxury theme (CSS vars, glassmorphism, gold utilities)
- `artifacts/luxury-app/src/lib/supabase.ts` — Supabase client singleton
- `artifacts/luxury-app/src/lib/db.ts` — all DB helpers (restaurants, categories, items, videos)
- `artifacts/luxury-app/src/lib/upload.ts` — Supabase Storage + Cloudinary upload helpers
- `artifacts/luxury-app/src/hooks/useAuth.ts` — auth state hook
- `artifacts/luxury-app/supabase-migration.sql` — **run this in Supabase SQL Editor first**

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page (7 sections) |
| `/login` | Login |
| `/signup` | Signup (stores restaurant_name) |
| `/dashboard` | Overview with stats + checklist |
| `/dashboard/setup` | Multi-step onboarding (name, logo, banner, theme, slug) |
| `/dashboard/menu` | Menu management — categories, items, drag-drop, image upload |
| `/dashboard/videos` | Video manager — Cloudinary upload, preview, attach to items |
| `/restaurant/:slug` | Public menu page — hero, tabs, food cards, video modal |
| `/restaurant/:slug/reels` | TikTok-style fullscreen video reels |

## Supabase Setup (Required)

1. Go to **Supabase Dashboard → SQL Editor → New Query**
2. Paste and run `artifacts/luxury-app/supabase-migration.sql`
3. Create two Storage buckets in **Storage** tab:
   - `restaurant-assets` — public
   - `menu-items` — public
4. Add storage RLS policies (templates included in migration SQL comments)

## Architecture decisions

- Wouter for routing with `base={import.meta.env.BASE_URL}` — avoids Next.js dependency
- All Supabase calls are in `lib/db.ts` — single source of truth, easy to swap
- Cloudinary unsigned upload via XHR for real progress tracking (no SDK)
- DashboardLayout is composed in App.tsx routes — pages are pure content components
- Public restaurant pages are fully unauthenticated (Supabase RLS `using (true)`)
- Toast system is `LuxToast.tsx` (renamed to avoid conflict with shadcn's `toast.tsx`)

## Product

- **Landing page**: Hero with animated word swap, Features, How It Works, Pricing (monthly/annual), Testimonials, FAQ, Footer
- **Auth**: Signup stores restaurant_name in user_metadata; ProtectedRoute guards dashboard
- **Onboarding**: 5-step flow → name → logo → banner → theme color → launch; auto-generates slug; uploads to Supabase Storage
- **Menu management**: Category sidebar with add/delete, item CRUD with food photo upload, drag-to-reorder via dnd-kit, search/filter
- **Videos**: Cloudinary upload with real-time progress bar, video preview grid, attach to menu items
- **Public menu**: Hero banner + logo, sticky animated category tabs, food cards with video badge, fullscreen cinematic video modal, floating particles
- **Reels**: Fullscreen vertical video feed, swipe up/down (touch + wheel + keyboard), autoplay muted, like/share actions, progress dots

## User preferences

- Black and gold luxury dark theme throughout
- Glassmorphism UI (`glass`, `glass-dark`, `glass-gold`)
- Playfair Display (serif headings) + Inter (body)
- No emojis in UI unless functional

## Gotchas

- Run the SQL migration before testing dashboard features — tables must exist
- Supabase Storage buckets must be created manually in the dashboard (or via CLI)
- Cloudinary `VITE_CLOUDINARY_UPLOAD_PRESET` must be an **unsigned** preset
- `ease: [...]` arrays cause TS errors with Framer Motion — use string easing (`"easeOut"`) instead
- DashboardPage does NOT wrap itself in DashboardLayout — App.tsx does it at the route level
