# Harshrajsinh Dodiya — Portfolio Website Implementation Plan

A premium UI/UX designer portfolio with a real CMS-driven admin panel, built with React (Vite) + Supabase.

---

## Design Direction

### Visual Identity

- **Name:** Harshrajsinh Dodiya
- **Background:** Deep architectural navy — `#0B0F1A` (near-black with blue undertone, not pure black)
- **Surface:** `#111827` cards/panels, `#1C2333` elevated surfaces
- **Accent:** Warm amber — `#F59E0B` / `#D97706` (one color, used precisely, not everywhere)
- **Text:** `#F9FAFB` primary, `#9CA3AF` secondary, `#6B7280` muted
- **Border:** `#1F2937` subtle, `#374151` elevated
- **Anti-pattern guard:** NO purple gradients, NO glow blobs, NO bento cards, NO neon

### Typography

- **Display/Headings:** `Syne` (Google Fonts) — geometric, architectural, distinctive
- **Body/UI:** `Inter` (Google Fonts) — reliable, clean, readable
- **Font weight system:**
  - Display: 700–800
  - Section headings: 600–700
  - Body: 400–450
  - Labels/captions: 500

### Animation Philosophy

- **Entrance:** `opacity` + `translateY` clip reveals — not fade-in everywhere, staggered by section
- **Loading:** Name letter-by-letter reveal (500ms total), smooth dissolve into hero
- **Hover states:** `transform: scale(1.02)`, subtle border color shifts, underline draws
- **Project preview:** Image slides in from edge on hover (clip-path reveal)
- **Transitions:** `cubic-bezier(0.16, 1, 0.3, 1)` — fast in, slow out (iOS-like feel)
- **`prefers-reduced-motion`:** All animations collapse to instant transitions
- **NO:** Cursor trails, scroll-jacking, bounce physics, parallax abuse

---

## Information Architecture

```
/ (Home)
├── #hero           — Name, role, one-line positioning, two CTAs
├── #about          — Brief story, philosophy, currently exploring
├── #experience     — Timeline, expandable on click
├── #skills         — Interactive category tabs
├── #projects       — Full-width showcase with hover reveal
├── #process        — Design thinking, click-to-reveal stages
├── #education      — Clean minimal cards
├── #certifications — Certificate grid with modal preview
└── #contact        — Invitation-style, mailto link

/projects/:slug     — Dynamic case study pages

/admin              — Protected CMS dashboard
├── /admin/login    — Auth gate
├── /admin/profile  — Edit name, bio, headline
├── /admin/projects — CRUD + reorder
├── /admin/experience — CRUD + reorder
├── /admin/skills   — CRUD + categories
├── /admin/education — CRUD
├── /admin/certifications — CRUD + upload
└── /admin/settings — Email, social links, contact info
```

---

## Technology Stack

### Frontend
- **React 18 + Vite** — SPA, fast HMR, component reuse
- **React Router v6** — client-side routing (`/projects/:slug`, `/admin/*`)
- **Vanilla CSS** — custom design system via CSS custom properties, no framework
- **Framer Motion** — purposeful animation library (tree-shakeable, performant)
- **@supabase/supabase-js** — client SDK

### Backend / Database / Auth / Storage
- **Supabase** — single hosted service providing:
  - **PostgreSQL** — persistent data store (projects, experience, skills, etc.)
  - **Supabase Auth** — admin authentication (email + password, row-level security)
  - **Supabase Storage** — image uploads (profile, projects, certificates)
  - **Row Level Security (RLS)** — public reads, authenticated-only writes
  - **Realtime** — optional, for live admin preview

> **Why Supabase:** Zero server maintenance. RLS enforces security at the DB layer — public visitors can only read published data. Admin writes require a valid JWT. Storage has CDN-backed URLs. Free tier is generous for a portfolio.

### Dev Tools
- **ESLint + Prettier** — code quality
- **Vite** — build + dev server

---

## Database Schema

### `profile`
```sql
id, name, headline, bio, philosophy, currently_exploring, 
profile_image_url, email, resume_url, updated_at
```

### `projects`
```sql
id, title, slug, category, short_description, role, 
thumbnail_url, images (jsonb[]), tools (text[]), 
problem, process, solution, outcome, 
live_url, case_study_url, featured, display_order, published, 
created_at, updated_at
```

### `experience`
```sql
id, organization, role, duration_start, duration_end, is_current,
location, responsibilities (text[]), key_contribution, outcome, 
display_order, created_at
```

### `skills`
```sql
id, name, category (design|ux|tools), display_order
```

### `education`
```sql
id, degree, institution, duration_start, duration_end, 
relevant_areas (text[]), achievements, display_order
```

### `certifications`
```sql
id, name, organization, issue_date, credential_url, 
certificate_image_url, display_order
```

### `social_links`
```sql
id, platform, url, display_order, is_visible
```

### `contact_settings`
```sql
id, email, availability_status, custom_cta_text
```

---

## Component Architecture

```
src/
├── main.jsx
├── App.jsx
├── index.css              ← Design system (all CSS custom properties)
│
├── components/
│   ├── layout/
│   │   ├── Navigation.jsx
│   │   ├── Footer.jsx
│   │   └── PageTransition.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Tag.jsx
│   │   ├── Divider.jsx
│   │   ├── Modal.jsx
│   │   └── ImageWithFallback.jsx
│   └── sections/
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Experience.jsx
│       ├── Skills.jsx
│       ├── Projects.jsx
│       ├── Process.jsx
│       ├── Education.jsx
│       ├── Certifications.jsx
│       └── Contact.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── ProjectCase.jsx       ← /projects/:slug
│   └── NotFound.jsx
│
├── admin/
│   ├── AdminLayout.jsx
│   ├── AdminLogin.jsx
│   └── pages/
│       ├── AdminDashboard.jsx
│       ├── AdminProfile.jsx
│       ├── AdminProjects.jsx
│       ├── AdminProjectEdit.jsx
│       ├── AdminExperience.jsx
│       ├── AdminSkills.jsx
│       ├── AdminEducation.jsx
│       ├── AdminCertifications.jsx
│       └── AdminSettings.jsx
│
├── hooks/
│   ├── useProfile.js
│   ├── useProjects.js
│   ├── useAuth.js
│   └── useSupabase.js
│
├── lib/
│   ├── supabase.js           ← Supabase client (env vars only)
│   └── storage.js            ← Image upload helpers
│
└── utils/
    ├── animations.js         ← Framer Motion variants
    └── helpers.js
```

---

## Admin Security Model

- Supabase Auth handles sessions (JWT stored in browser via Supabase SDK)
- **Row Level Security on every table:**
  - `SELECT`: Public (anon role) — only `published = true` rows
  - `INSERT/UPDATE/DELETE`: Authenticated role only
- **No secrets in client code** — only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` (anon key is intentionally public-safe; RLS enforces access)
- Admin login at `/admin/login` — wrong credentials show proper error
- Protected routes: redirect to `/admin/login` if no session

---

## Build Stages

1. **Stage 1 — Foundation:** Vite project setup, design system CSS, font imports, navigation skeleton
2. **Stage 2 — Supabase:** Create project, schema, RLS policies, seed data
3. **Stage 3 — Public Sections:** Hero → About → Experience → Skills → Projects → Process → Education → Certifications → Contact → Footer
4. **Stage 4 — Case Study Pages:** Dynamic `/projects/:slug` with template
5. **Stage 5 — Admin Panel:** Login + protected layout + all CRUD pages
6. **Stage 6 — Polish:** Loading screen, scroll reveals, micro-interactions, mobile optimization
7. **Stage 7 — SEO + Accessibility:** Meta tags, semantic HTML, keyboard nav, reduced-motion

---

## Open Questions

> [!IMPORTANT]
> **Supabase Setup:** You'll need a free Supabase account (supabase.com). I will generate all the SQL schema and provide step-by-step setup. After creating the project, you'll give me your `SUPABASE_URL` and `SUPABASE_ANON_KEY` so I can wire the frontend.

> [!IMPORTANT]
> **Admin Credentials:** Since we're using Supabase Auth, you'll create your admin account directly in the Supabase dashboard (Auth → Users → Add User). I'll document this. No hardcoded passwords.

> [!NOTE]
> **Contact Form:** You chose mailto link (no backend form). I'll make it a beautiful "mailto:" CTA that opens the email client — cleaner and more reliable.

> [!NOTE]
> **Deployment:** The site works on any static host (Vercel, Netlify, GitHub Pages) since Supabase is the backend. I'll include a `vercel.json` / `netlify.toml` for SPA routing.

---

## Verification Plan

### Automated
- `npm run build` — clean production build, no errors
- Supabase RLS: test that unauthenticated requests cannot write

### Manual
- Public site loads and shows seeded data
- Admin login works / rejects wrong credentials
- CRUD operations persist and appear on public site
- Image upload works (profile + project + certificate)
- `/projects/:slug` shows correct case study
- Mobile layout at 375px, 768px, 1440px
- `prefers-reduced-motion` disables animations
- Keyboard navigation through all sections

