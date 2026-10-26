import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const c=JSON.parse(await readFile(new URL('../inquiry-config.json',import.meta.url),'utf8'));
const password=process.env.BUSANGI_ADMIN_TEST_PASSWORD;if(!password)throw Error('Set BUSANGI_ADMIN_TEST_PASSWORD for authenticated checks.');
const headers={apikey:c.publishableKey,'Content-Type':'application/json'};
async function rpc(name,args){const r=await fetch(c.supabaseUrl+'/rest/v1/rpc/chatbot_admin_'+name,{method:'POST',headers,body:JSON.stringify(args)});return {status:r.status,data:await r.json().catch(()=>null)}}
async function live(){const r=await fetch(c.supabaseUrl+'/rest/v1/chatbot_published?select=version,flow&id=eq.true',{headers,cache:'no-store'});assert.equal(r.status,200);return (await r.json())[0]}
assert.equal((await rpc('state',{p_token:null})).status,401);
assert.equal((await rpc('inquiries',{p_token:'0'.repeat(64),p_page:0})).status,401);
assert.equal((await rpc('save',{p_token:'0'.repeat(64),p_flow:{},p_revision:1})).status,401);
assert.equal((await rpc('publish',{p_token:'0'.repeat(64),p_revision:1,p_note:'unauthorized'})).status,401);
assert.equal((await rpc('restore',{p_token:'0'.repeat(64),p_version:1,p_revision:1})).status,401);
assert.equal((await rpc('inquiry_status',{p_token:'0'.repeat(64),p_id:crypto.randomUUID(),p_status:'answered'})).status,401);
assert.ok([401,403].includes((await fetch(c.supabaseUrl+'/rest/v1/portfolio_inquiries?limit=0',{headers})).status));
const login=await rpc('login',{p_username:'admin',p_password:password});assert.equal(login.status,200);assert.ok(login.data.token);const token=login.data.token;
let original,latest;
try{
 const state=await rpc('state',{p_token:token});assert.equal(state.status,200);original=state.data.draft.flow;latest=state.data;
 const initial=await live();const draft=structuredClone(original);draft.nodes[draft.root].answer+=' [초안 분리 검증]';
 const saved=await rpc('save',{p_token:token,p_flow:draft,p_revision:latest.draft.revision});assert.equal(saved.status,200);latest=saved.data;
 assert.deepEqual(await live(),initial,'Saving a draft must never change public content');
 assert.equal((await rpc('publish',{p_token:token,p_revision:state.data.draft.revision,p_note:'stale'})).status,409);
 const bad=structuredClone(draft);bad.nodes[bad.root].buttons.push({label:'broken',next:'nonexistent'});
 assert.equal((await rpc('save',{p_token:token,p_flow:bad,p_revision:latest.draft.revision})).status,400);
 const restored=await rpc('restore',{p_token:token,p_version:initial.version,p_revision:latest.draft.revision});assert.equal(restored.status,200);latest=restored.data;
 assert.deepEqual(await live(),initial,'Restoring an old version must only change the draft');
 const publish=await rpc('publish',{p_token:token,p_revision:latest.draft.revision,p_note:'관리자 기능 초기 게시 · 초안 분리 및 권한 검증 완료'});assert.equal(publish.status,200);latest=publish.data;
 const published=await live();assert.equal(published.version,latest.published.version);assert.ok(published.version>initial.version);
 assert.equal(published.flow.nodes[published.flow.root].answer,initial.flow.nodes[initial.flow.root].answer);
 assert.equal((await rpc('inquiries',{p_token:token,p_page:0})).status,200);
 console.log('PASS: admin authentication, denied anonymous access, draft isolation, invalid flow rejection, stale revision conflict, version restore, atomic publication and inquiry access.');
}finally{
 await rpc('logout',{p_token:token});assert.equal((await rpc('state',{p_token:token})).status,401);
}
