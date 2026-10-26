-- Review-ready schema. Not applied: public INSERT authorization awaits confirmation.
create table public.portfolio_inquiries (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null unique,
 created_at timestamptz not null default now(),
 name text check (name is null or char_length(name) <= 80),
 email text not null check (char_length(email) between 3 and 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
 message text not null check (char_length(btrim(message)) between 1 and 3000),
 category text not null check (category in ('1:1 개인 상담','정보 추가·정정','협업 문의','제작 문의')),
 consent boolean not null check (consent is true),
 consent_at timestamptz not null default now(),
 privacy_version text not null default '2026-10-26' check (privacy_version = '2026-10-26'),
 source text not null default 'chatbot' check (source = 'chatbot'),
 status text not null default 'new' check (status in ('new','in_progress','answered'))
);
alter table public.portfolio_inquiries enable row level security;
revoke all on public.portfolio_inquiries from public, anon, authenticated;
grant insert (request_id,name,email,message,category,consent,consent_at,privacy_version,source) on public.portfolio_inquiries to anon;
create policy chatbot_submit_inquiries on public.portfolio_inquiries for insert to anon
 with check (consent is true and source = 'chatbot' and status = 'new'
 and consent_at between now() - interval '10 minutes' and now() + interval '2 minutes');
grant all on public.portfolio_inquiries to service_role;
create index portfolio_inquiries_created_idx on public.portfolio_inquiries (created_at desc);
comment on table public.portfolio_inquiries is '부산기 포트폴리오 챗봇 문의. 운영자는 Supabase Table Editor에서 확인하고 답변 완료 후 삭제합니다.';
