-- ============================================================
-- HARSHRAJSINH DODIYA PORTFOLIO — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profile (single row)
create table if not exists profile (
  id integer primary key default 1,
  name text default 'Harshrajsinh Dodiya',
  headline text default 'UI/UX Designer',
  bio text,
  philosophy text,
  currently_exploring text[] default '{}',
  profile_image_url text,
  email text default 'harshrajsinh@example.com',
  resume_url text,
  updated_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category text,
  short_description text,
  role text,
  thumbnail_url text,
  images jsonb default '[]',
  tools text[] default '{}',
  problem text,
  process text,
  solution text,
  outcome text,
  live_url text,
  featured boolean default false,
  display_order integer default 99,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Experience
create table if not exists experience (
  id uuid primary key default uuid_generate_v4(),
  organization text not null,
  role text not null,
  duration_start date,
  duration_end date,
  is_current boolean default false,
  location text,
  responsibilities text[] default '{}',
  key_contribution text,
  outcome text,
  display_order integer default 99,
  created_at timestamptz default now()
);

-- Skills
create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text check (category in ('design', 'ux', 'tools')) default 'design',
  display_order integer default 99
);

-- Education
create table if not exists education (
  id uuid primary key default uuid_generate_v4(),
  degree text not null,
  institution text not null,
  duration_start date,
  duration_end date,
  relevant_areas text[] default '{}',
  achievements text,
  display_order integer default 99
);

-- Certifications
create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  organization text not null,
  issue_date date,
  credential_url text,
  certificate_image_url text,
  display_order integer default 99
);

-- Social Links
create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  url text not null,
  display_order integer default 99,
  is_visible boolean default true
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table profile enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;
alter table skills enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table social_links enable row level security;

-- PROFILE
create policy "Public can read profile" on profile for select using (true);
create policy "Admin can update profile" on profile for all using (auth.role() = 'authenticated');

-- PROJECTS
create policy "Public can read published projects" on projects for select using (published = true);
create policy "Admin can manage projects" on projects for all using (auth.role() = 'authenticated');

-- EXPERIENCE
create policy "Public can read experience" on experience for select using (true);
create policy "Admin can manage experience" on experience for all using (auth.role() = 'authenticated');

-- SKILLS
create policy "Public can read skills" on skills for select using (true);
create policy "Admin can manage skills" on skills for all using (auth.role() = 'authenticated');

-- EDUCATION
create policy "Public can read education" on education for select using (true);
create policy "Admin can manage education" on education for all using (auth.role() = 'authenticated');

-- CERTIFICATIONS
create policy "Public can read certifications" on certifications for select using (true);
create policy "Admin can manage certifications" on certifications for all using (auth.role() = 'authenticated');

-- SOCIAL LINKS
create policy "Public can read visible social links" on social_links for select using (is_visible = true);
create policy "Admin can manage social links" on social_links for all using (auth.role() = 'authenticated');

-- ============================================================
-- PERMISSIONS / GRANTS (Required for Supabase API access)
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;

alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant all on routines to anon, authenticated;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "Public read portfolio storage" on storage.objects
  for select using (bucket_id = 'portfolio');

create policy "Admin upload portfolio storage" on storage.objects
  for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "Admin delete portfolio storage" on storage.objects
  for delete using (bucket_id = 'portfolio' and auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA
-- ============================================================

insert into profile (id, name, headline, bio, philosophy, currently_exploring, email)
values (
  1,
  'Harshrajsinh Dodiya',
  'UI/UX Designer',
  'I design digital products that are <strong>clear, purposeful, and human</strong>. I believe the best design is the kind people don''t notice — it just works.',
  'Design is not how it looks. It''s how it works, how it feels, and what it makes someone do next.',
  array['Interaction Design Patterns', 'Design Systems', 'Motion Design', 'Accessibility'],
  'harshrajsinh@example.com'
) on conflict (id) do nothing;

insert into skills (name, category, display_order) values
  ('UI Design', 'design', 1), ('UX Design', 'design', 2), ('Interaction Design', 'design', 3),
  ('Visual Design', 'design', 4), ('Design Systems', 'design', 5), ('Prototyping', 'design', 6),
  ('User Research', 'ux', 1), ('User Flows', 'ux', 2), ('Information Architecture', 'ux', 3),
  ('Wireframing', 'ux', 4), ('Usability Testing', 'ux', 5), ('Journey Mapping', 'ux', 6),
  ('Figma', 'tools', 1), ('FigJam', 'tools', 2), ('Adobe XD', 'tools', 3),
  ('Illustrator', 'tools', 4), ('Photoshop', 'tools', 5), ('HTML / CSS', 'tools', 6),
  ('Maze', 'tools', 7), ('Notion', 'tools', 8)
on conflict do nothing;

insert into experience (organization, role, duration_start, duration_end, is_current, location, responsibilities, key_contribution, outcome, display_order) values
(
  'Nexus Digital Studio', 'Senior UI/UX Designer', '2023-06-01', null, true, 'Remote',
  array['Led end-to-end UX for 3 enterprise SaaS products','Built and maintained a cross-platform design system used by 4 engineering teams','Established UX research practice with regular usability testing cycles','Mentored 2 junior designers through weekly design critiques'],
  'Redesigned the core dashboard experience, reducing time-on-task by 40%',
  'Product NPS improved from 32 to 61 after the redesign shipped', 1
),
(
  'Pixel Craft Agency', 'UI/UX Designer', '2021-09-01', '2023-05-31', false, 'Ahmedabad, India',
  array['Designed mobile and web interfaces for 12+ clients across fintech, health, and e-commerce','Ran discovery workshops and user interviews for client projects','Created high-fidelity prototypes for investor presentations','Collaborated closely with development teams in Agile sprints'],
  'Led the UI redesign of a fintech app that secured Series A funding',
  'Agency won "Best Digital Agency" award for work completed during tenure', 2
),
(
  'Freelance', 'UX/UI Designer', '2020-01-01', '2021-08-31', false, 'Remote',
  array['Delivered end-to-end design for 8+ independent client projects','Specialized in early-stage startups needing product-market fit validation','Designed landing pages, onboarding flows, and product interfaces'],
  'Helped 3 startups validate their MVP concepts through clickable prototypes',
  'Two clients successfully raised pre-seed funding using prototypes', 3
);

insert into education (degree, institution, duration_start, duration_end, relevant_areas, achievements, display_order) values (
  'Bachelor of Design', 'National Institute of Design', '2017-07-01', '2021-05-31',
  array['Visual Communication', 'Human-Computer Interaction', 'Typography', 'Product Design'],
  'Graduated with distinction. Final thesis on accessibility in public digital kiosks.', 1
);

insert into certifications (name, organization, issue_date, credential_url, display_order) values
  ('Google UX Design Certificate', 'Google', '2022-04-01', 'https://coursera.org/verify/example', 1),
  ('Interaction Design Specialization', 'UC San Diego / Coursera', '2021-11-01', 'https://coursera.org/verify/example2', 2),
  ('Figma Advanced Design Systems', 'Figma', '2023-02-01', null, 3);

insert into social_links (platform, url, display_order, is_visible) values
  ('LinkedIn', 'https://linkedin.com/in/harshrajsinh', 1, true),
  ('Figma', 'https://figma.com/@harshrajsinh', 2, true),
  ('Dribbble', 'https://dribbble.com/harshrajsinh', 3, true),
  ('Behance', 'https://behance.net/harshrajsinh', 4, true),
  ('Instagram', 'https://instagram.com/harshrajsinh', 5, true);

insert into projects (title, slug, category, short_description, role, tools, problem, process, solution, outcome, featured, display_order, published) values
(
  'Luminary Banking App', 'luminary-banking-app', 'Mobile App',
  'Reimagining personal finance for Gen Z — making money management feel less intimidating and more empowering.',
  'Lead UX Designer', array['Figma', 'FigJam', 'Maze'],
  'Young adults struggle to engage with traditional banking apps that feel designed for older generations.',
  'Started with 20+ user interviews across age 18-26. Identified key friction points around financial literacy and notifications.',
  'Designed a progressive disclosure system where complexity reveals only when needed.',
  'Prototype tested with 40 users showed 78% improvement in task completion rate.', true, 1, true
),
(
  'Meridian Design System', 'meridian-design-system', 'Design System',
  'A comprehensive component library and design language built to unify a fragmented product ecosystem across 6 platforms.',
  'Design System Lead', array['Figma', 'Storybook', 'Zeplin'],
  'A fast-growing SaaS company had inconsistent UI across web, iOS, Android, and 3 internal tools.',
  'Conducted a full UI audit. Identified 40+ component variations that could be unified into 12 core components.',
  'Built a 3-tier design system: tokens to components to patterns. Created living documentation.',
  'Reduced design-to-development handoff time by 60%.', true, 2, true
),
(
  'Kira Health Platform', 'kira-health-platform', 'Web App',
  'A patient-centered mental health platform bridging the gap between therapy sessions.',
  'UX/UI Designer', array['Figma', 'UserTesting', 'Hotjar'],
  'Mental health support traditionally stops at the therapy session.',
  'Worked with licensed therapists and ran 3 rounds of participatory design workshops.',
  'Created a gentle, non-clinical interface with mood check-ins, journaling, and therapist resources.',
  'Beta users reported 65% higher engagement. 4.8/5 usability score.', false, 3, true
);

-- ============================================================
-- DONE! Next steps:
-- 1. Go to Auth > Users > Add User (set your admin email + password)
-- 2. Get Project URL + Anon Key from Settings > API
-- 3. Add them to .env file in the portfolio project
-- ============================================================
