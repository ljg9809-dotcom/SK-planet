-- Admin-only access was explicitly requested. Private rows are never exposed to the Data API.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.chatbot_admins (
 username text primary key, password_hash text not null,
 failed_attempts integer not null default 0, locked_until timestamptz
);
create table private.chatbot_admin_sessions (
 token_hash text primary key, username text not null references private.chatbot_admins,
 expires_at timestamptz not null
);
create table private.chatbot_draft (
 id boolean primary key default true check(id), flow jsonb not null,
 revision integer not null default 1, updated_at timestamptz not null default now()
);
create table private.chatbot_versions (
 version integer generated always as identity primary key,
 flow jsonb not null, note text not null default '', published_at timestamptz not null default now(),
 published_by text not null
);
create table public.chatbot_published (
 id boolean primary key default true check(id), version integer not null,
 flow jsonb not null, published_at timestamptz not null default now()
);
alter table public.chatbot_published enable row level security;
alter table private.chatbot_admins enable row level security;
alter table private.chatbot_admin_sessions enable row level security;
alter table private.chatbot_draft enable row level security;
alter table private.chatbot_versions enable row level security;
revoke all on public.chatbot_published from public,anon,authenticated;
grant select on public.chatbot_published to anon;
create policy read_published_chatbot on public.chatbot_published for select to anon using (true);
revoke all on all tables in schema private from public,anon,authenticated;

create function private.require_chatbot_admin(p_token text) returns text
language plpgsql security definer set search_path='' as $$
declare u text;
begin
 if p_token is null or length(p_token)<>64 then raise sqlstate 'PT401' using message='관리자 로그인이 필요합니다.'; end if;
 select username into u from private.chatbot_admin_sessions
 where token_hash=encode(extensions.digest(p_token,'sha256'),'hex') and expires_at>now();
 if u is null then raise sqlstate 'PT401' using message='로그인이 만료되었습니다. 다시 로그인해 주세요.'; end if;
 return u;
end $$;

create function private.validate_chatbot_flow(f jsonb) returns void
language plpgsql set search_path='' as $$
declare k text; n jsonb; b jsonb; s text;
begin
 if f is null or jsonb_typeof(f)<>'object' or octet_length(f::text)>200000
 or jsonb_typeof(f->'nodes') is distinct from 'object'
 or not (f->'nodes' ? (f->>'root')) or not (f->'nodes' ? (f->>'fallbackTarget'))
 or jsonb_typeof(f->'root') is distinct from 'string'
 or jsonb_typeof(f->'fallbackTarget') is distinct from 'string'
 or jsonb_typeof(f->'ui') is distinct from 'object'
 or jsonb_typeof(f->'commands') is distinct from 'object'
 or jsonb_typeof(f->'version') is distinct from 'number'
 or coalesce(f->>'version','') !~ '^[0-9]+$'
 then raise sqlstate 'PT400' using message='챗봇 JSON 구조가 올바르지 않습니다.'; end if;
 foreach s in array array['title','subtitle','fallback'] loop
 if jsonb_typeof(f->s) is distinct from 'string' then raise sqlstate 'PT400' using message='제목과 기본 안내를 확인해 주세요.'; end if; end loop;
 foreach s in array array['launcher','close','back','home','reset','input','send','drag','privacyNote','resetNotice'] loop
 if jsonb_typeof(f->'ui'->s) is distinct from 'string' then raise sqlstate 'PT400' using message='화면 문구를 확인해 주세요.'; end if; end loop;
 for k,n in select * from jsonb_each(f->'commands') loop
 if k not in ('back','home','reset') or jsonb_typeof(n)<>'array' then raise sqlstate 'PT400' using message='명령어 형식 오류입니다.'; end if;
 for b in select * from jsonb_array_elements(n) loop if jsonb_typeof(b)<>'string' then raise sqlstate 'PT400' using message='명령어는 문자열 배열입니다.'; end if; end loop; end loop;
 for k,n in select * from jsonb_each(f->'nodes') loop
 if k !~ '^[a-zA-Z0-9_-]{1,80}$' or jsonb_typeof(n->'answer') is distinct from 'string'
 or jsonb_typeof(n->'question') is distinct from 'string'
 or jsonb_typeof(n->'buttons') is distinct from 'array'
 then raise sqlstate 'PT400' using message='질문·답변·버튼을 확인해 주세요.'; end if;
 if n ? 'keywords' then
 if jsonb_typeof(n->'keywords')<>'array' then raise sqlstate 'PT400' using message='키워드는 배열입니다.'; end if;
 for b in select * from jsonb_array_elements(n->'keywords') loop if jsonb_typeof(b)<>'string' then raise sqlstate 'PT400' using message='키워드는 문자열 배열입니다.'; end if; end loop; end if;
 for b in select * from jsonb_array_elements(n->'buttons') loop
 if jsonb_typeof(b->'label') is distinct from 'string' or not (f->'nodes' ? (b->>'next'))
 then raise sqlstate 'PT400' using message='버튼의 이동 단계를 확인해 주세요.'; end if; end loop;
 if n ? 'form' and n->>'form' not in ('consultation','information','collaboration','production') then raise sqlstate 'PT400' using message='문의 유형을 확인해 주세요.'; end if;
 if n ? 'links' then
 if jsonb_typeof(n->'links')<>'array' then raise sqlstate 'PT400' using message='링크는 배열입니다.'; end if;
 for b in select * from jsonb_array_elements(n->'links') loop
 if jsonb_typeof(b->'label') is distinct from 'string' or jsonb_typeof(b->'href') is distinct from 'string'
 or b->>'href' !~ '^(https?://|[a-zA-Z0-9_./?#=&%+-]+$)' then raise sqlstate 'PT400' using message='링크 주소를 확인해 주세요.'; end if; end loop; end if;
 end loop;
end $$;

create function public.chatbot_admin_login(p_username text,p_password text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a private.chatbot_admins; t text; expiry timestamptz:=now()+interval '8 hours';
begin
 select * into a from private.chatbot_admins where username='admin' for update;
 if a.username is null or (a.locked_until is not null and a.locked_until>now()) then return jsonb_build_object('error','로그인 정보가 올바르지 않거나 일시 제한 중입니다.'); end if;
 if p_username is distinct from a.username or p_password is null or length(p_password)>200 or extensions.crypt(p_password,a.password_hash) is distinct from a.password_hash then
 update private.chatbot_admins set failed_attempts=case when failed_attempts>=4 then 0 else failed_attempts+1 end,
 locked_until=case when failed_attempts>=4 then now()+interval '15 minutes' else null end where username=a.username;
 return jsonb_build_object('error','로그인 정보가 올바르지 않거나 일시 제한 중입니다.'); end if;
 update private.chatbot_admins set failed_attempts=0,locked_until=null where username=a.username;
 delete from private.chatbot_admin_sessions where expires_at<now();
 t:=encode(extensions.gen_random_bytes(32),'hex');
 insert into private.chatbot_admin_sessions values(encode(extensions.digest(t,'sha256'),'hex'),a.username,expiry);
 return jsonb_build_object('token',t,'expiresAt',expiry);
end $$;

create function public.chatbot_admin_logout(p_token text) returns void
language plpgsql security definer set search_path='' as $$
begin
 perform private.require_chatbot_admin(p_token);
 delete from private.chatbot_admin_sessions where token_hash=encode(extensions.digest(p_token,'sha256'),'hex');
end $$;

create function public.chatbot_admin_state(p_token text) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform private.require_chatbot_admin(p_token);
 return jsonb_build_object('draft',(select to_jsonb(d) from private.chatbot_draft d where id),
 'published',(select to_jsonb(p) from public.chatbot_published p where id),
 'versions',coalesce((select jsonb_agg(v order by version desc) from (select version,note,published_at,published_by from private.chatbot_versions order by version desc limit 100) v),'[]'::jsonb));
end $$;

create function public.chatbot_admin_save(p_token text,p_flow jsonb,p_revision integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare d private.chatbot_draft;
begin
 perform private.require_chatbot_admin(p_token);perform private.validate_chatbot_flow(p_flow);
 select * into d from private.chatbot_draft where id for update;
 if d.revision is distinct from p_revision then raise sqlstate 'PT409' using message='다른 변경이 있습니다. 다시 불러와 주세요.'; end if;
 update private.chatbot_draft set flow=p_flow,revision=revision+1,updated_at=now() where id;
 return public.chatbot_admin_state(p_token);
end $$;

create function public.chatbot_admin_publish(p_token text,p_revision integer,p_note text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare d private.chatbot_draft; f jsonb; v integer; u text; live public.chatbot_published;
begin
 u:=private.require_chatbot_admin(p_token);
 select * into d from private.chatbot_draft where id for update;
 if d.revision is distinct from p_revision then raise sqlstate 'PT409' using message='초안이 변경되었습니다. 다시 불러와 주세요.'; end if;
 perform private.validate_chatbot_flow(d.flow);
 select * into live from public.chatbot_published where id;
 f:=jsonb_set(d.flow,'{version}',to_jsonb((live.flow->>'version')::integer+1));
 insert into private.chatbot_versions(flow,note,published_by) values(f,left(coalesce(p_note,''),300),u) returning version into v;
 update public.chatbot_published set flow=f,version=v,published_at=now() where id;
 update private.chatbot_draft set flow=f,revision=revision+1,updated_at=now() where id;
 return public.chatbot_admin_state(p_token);
end $$;

create function public.chatbot_admin_restore(p_token text,p_version integer,p_revision integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare f jsonb; d private.chatbot_draft;
begin
 perform private.require_chatbot_admin(p_token);
 select * into d from private.chatbot_draft where id for update;
 if d.revision is distinct from p_revision then raise sqlstate 'PT409' using message='다른 변경이 있습니다. 새로고침해 주세요.'; end if;
 select flow into f from private.chatbot_versions where version=p_version;
 if f is null then raise sqlstate 'PT404' using message='버전을 찾을 수 없습니다.'; end if;
 update private.chatbot_draft set flow=f,revision=revision+1,updated_at=now() where id;
 return public.chatbot_admin_state(p_token);
end $$;

create function public.chatbot_admin_inquiries(p_token text,p_page integer default 0) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform private.require_chatbot_admin(p_token);
 return jsonb_build_object('total',(select count(*) from public.portfolio_inquiries),
 'rows',coalesce((select jsonb_agg(r) from (select id,created_at,name,email,message,category,consent,consent_at,privacy_version,status from public.portfolio_inquiries order by created_at desc,id limit 30 offset greatest(0,coalesce(p_page,0))*30) r),'[]'::jsonb));
end $$;

create function public.chatbot_admin_inquiry_status(p_token text,p_id uuid,p_status text) returns void
language plpgsql security definer set search_path='' as $$
begin
 perform private.require_chatbot_admin(p_token);
 if p_status not in ('new','in_progress','answered') then raise sqlstate 'PT400' using message='상태를 확인해 주세요.'; end if;
 update public.portfolio_inquiries set status=p_status where id=p_id;
end $$;

revoke all on all functions in schema private from public,anon,authenticated;
revoke all on function public.chatbot_admin_login(text,text),public.chatbot_admin_logout(text),public.chatbot_admin_state(text),public.chatbot_admin_save(text,jsonb,integer),public.chatbot_admin_publish(text,integer,text),public.chatbot_admin_restore(text,integer,integer),public.chatbot_admin_inquiries(text,integer),public.chatbot_admin_inquiry_status(text,uuid,text) from public,anon,authenticated;
grant execute on function public.chatbot_admin_login(text,text),public.chatbot_admin_logout(text),public.chatbot_admin_state(text),public.chatbot_admin_save(text,jsonb,integer),public.chatbot_admin_publish(text,integer,text),public.chatbot_admin_restore(text,integer,integer),public.chatbot_admin_inquiries(text,integer),public.chatbot_admin_inquiry_status(text,uuid,text) to anon;
