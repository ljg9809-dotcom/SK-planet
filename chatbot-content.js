import {validateFlow} from './chatbot-core.mjs';
let config;
export async function publishedFlow(){
 config??=await fetch(new URL('./inquiry-config.json',import.meta.url),{cache:'no-store',signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error('config');return r.json()});
 const response=await fetch(config.supabaseUrl+'/rest/v1/chatbot_published?select=version,flow&id=eq.true',{headers:{apikey:config.publishableKey},cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw Error('게시된 안내를 읽을 수 없습니다.');const rows=await response.json();if(!rows[0])throw Error('게시된 안내가 없습니다.');
 return validateFlow(rows[0].flow);
}
