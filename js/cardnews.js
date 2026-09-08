(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const STORAGE = 'fold-cardnews-v1';
  const presets = {
    cine:{name:'시네마틱',desc:'사진 · 다크',accent:'#baff2a',bg:'linear-gradient(145deg,#393c32,#11120f)'},
    mag:{name:'매거진 형광',desc:'백지 · 에디토리얼',accent:'#e7ff38',bg:'linear-gradient(145deg,#f7f0db,#d3cec0)'},
    manga:{name:'만화 오버레이',desc:'강한 대비',accent:'#ff563f',bg:'linear-gradient(145deg,#5a4946,#151515)'},
    pixel:{name:'픽셀 인포',desc:'주황 · 청키',accent:'#ff8a1e',bg:'linear-gradient(145deg,#3d3023,#15110d)'},
    doodle:{name:'도들',desc:'손글씨 · 핑크',accent:'#ff6f9f',bg:'linear-gradient(145deg,#fff4f6,#ffd5e2)'},
    blue:{name:'화이트 & 블루',desc:'클린 · 그라데이션',accent:'#2a72ff',bg:'linear-gradient(145deg,#ffffff,#dcecff)'}
  };
  const colors=['#baff2a','#ffe443','#ff8a1e','#ff563f','#ff6f9f','#a67cff','#2a72ff','#26c6da','#34c77b','#f7f7f1','#11120f'];
  const gradients=['linear-gradient(145deg,#313b29,#0d100c)','linear-gradient(145deg,#15253d,#070b12)','linear-gradient(145deg,#5b3128,#160b09)','linear-gradient(145deg,#3c2d4a,#100b15)','linear-gradient(145deg,#25423e,#091310)','linear-gradient(145deg,#5c5436,#17150c)'];
  const freshSlides = () => [
    {type:'cover',f:{badge:'LOCAL STORY',title:'익숙한 도시를\n새롭게 여행하는 법',sub:'골목과 사람의 이야기를 따라 발견하는 로컬 여행의 새로운 기준',bg:'linear-gradient(145deg,#4b5840,#11130f)',scrim:82}},
    {type:'content',f:{tag:'WHY NOW',num:'01',head:'멀리 떠나야만\n여행일까요?',desc:'일상의 반경을 조금만 다르게 바라보면 익숙한 도시도 낯선 목적지가 됩니다.',bg:'linear-gradient(145deg,#303d48,#101213)',scrim:80}},
    {type:'content',f:{tag:'POINT 01',num:'02',head:'장소보다 먼저\n이야기를 찾으세요',desc:'유명한 명소보다 그곳에서 살아가는 사람과 오래된 가게의 서사를 따라가 보세요.',bg:'linear-gradient(145deg,#524234,#16120f)',scrim:86}},
    {type:'quote',f:{tag:'A NEW VIEW',quote:'좋은 여행은 새로운 장소가 아니라 새로운 시선을 남깁니다.',by:'FOLD · LOCAL TRAVEL NOTE',bg:'linear-gradient(145deg,#364a3e,#0d1510)',scrim:76}},
    {type:'closing',f:{badge:'START TODAY',head:'당신의 이야기도\n카드로 접어보세요.',desc:'복잡한 디자인 작업 없이, 메시지에만 집중하세요.',cta1:'AI 커뮤니티 참여 → 댓글 AIMAX',hint:'SAVE · SHARE · FOLD',bg:'linear-gradient(145deg,#303925,#0b0d09)',scrim:88}}
  ];
  const defaultState = () => ({name:'나의 카드뉴스',preset:'cine',accent:'#baff2a',current:0,music:{source:'none',youtubeId:'',volume:70,layout:'horizontal',loop:true},slides:freshSlides()});
  let state = load();
  state.music={source:'none',youtubeId:'',volume:70,layout:'horizontal',loop:true,...state.music};
  function load(){try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch{return defaultState()}}
  function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));$('.autosave').textContent='저장됨'}catch{$('.autosave').textContent='저장 공간 부족'}}
  function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function markup(v=''){return esc(v).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<mark>$1</mark>')}
  function current(){return state.slides[state.current]}
  function cardHTML(slide,mini=false){
    const f=slide.f, total=state.slides.length, top=`<div class="card-topline"><span class="mini-mark">F</span><span>${esc(state.name)}</span></div>`;
    let main='';
    if(slide.type==='cover') main=`<div class="card-main"><span class="card-badge">${markup(f.badge)}</span><h2 class="card-title">${markup(f.title)}</h2><p class="card-sub">${markup(f.sub)}</p></div>`;
    else if(slide.type==='quote') main=`<div class="card-main"><span class="card-badge">${markup(f.tag||'QUOTE')}</span><div class="card-quote">${markup(f.quote)}</div><div class="card-by">${markup(f.by)}</div></div>`;
    else if(slide.type==='closing') main=`<div class="card-main"><span class="card-badge">${markup(f.badge)}</span><h2 class="card-title">${markup(f.head)}</h2><p class="card-sub">${markup(f.desc)}</p><span class="cta-chip">${markup(f.cta1)}</span></div>`;
    else main=`<div class="card-main"><div class="card-num">${esc(f.num||'')}</div><span class="card-badge">${markup(f.tag)}</span><h2 class="card-title">${markup(f.head)}</h2><p class="card-sub">${markup(f.desc)}</p></div>`;
    return `<div class="card-inner ${slide.type==='closing'?'closing':''}">${top}${main}<div class="card-footer"><span>${esc(f.hint||'FOLD YOUR STORY')}</span><span>${String(state.current+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span></div></div>`;
  }
  function render(){
    state.current=Math.max(0,Math.min(state.current,state.slides.length-1));
    const slide=current(),f=slide.f,canvas=$('#cardCanvas');
    canvas.className=`card-canvas preset-${state.preset}`;
    canvas.style.setProperty('--accent',state.accent);
    canvas.style.setProperty('--card-bg',f.image?`url("${f.image}")`:(f.bg||presets[state.preset].bg));
    canvas.style.setProperty('--bg-position',`50% ${f.imageY??50}%`);
    canvas.style.setProperty('--bg-origin',`50% ${f.imageY??50}%`);
    canvas.style.setProperty('--bg-zoom',(f.imageZoom??100)/100);
    canvas.style.setProperty('--scrim',(f.scrim??82)/100);
    canvas.innerHTML=cardHTML(slide);
    $('#deckName').value=state.name; $('#slideCount').textContent=String(state.slides.length).padStart(2,'0');
    $('#pageIndicator').textContent=`${String(state.current+1).padStart(2,'0')} / ${String(state.slides.length).padStart(2,'0')}`;
    $('#cardTypeBadge').textContent=slide.type.toUpperCase(); $('#scrimRange').value=f.scrim??82; $('#scrimValue').value=f.scrim??82;
    renderThumbs(); renderFields(); renderPresets(); renderCustomImageControls(); save();
  }
  function renderThumbs(){
    $('#thumbs').innerHTML=state.slides.map((s,i)=>`<button class="thumb ${i===state.current?'active':''}" data-index="${i}"><span class="thumb-no">${String(i+1).padStart(2,'0')}</span><span class="thumb-card" style="--thumb-accent:${state.accent};background:${s.f.bg||'#171914'}"><small>${esc(s.f.badge||s.f.tag||s.type)}</small><b>${esc(s.f.title||s.f.head||s.f.quote||'새 카드').replace(/\n/g,' ')}</b></span></button>`).join('');
    $$('.thumb').forEach(b=>b.onclick=()=>{state.current=+b.dataset.index;render()});
  }
  const schemas={cover:[['badge','라벨'],['title','제목','textarea'],['sub','설명','textarea']],content:[['tag','섹션 라벨'],['num','큰 번호'],['head','헤드라인','textarea'],['desc','본문','textarea']],quote:[['tag','라벨'],['quote','인용문','textarea'],['by','출처']],closing:[['badge','라벨'],['head','헤드라인','textarea'],['desc','설명','textarea'],['cta1','CTA'],['hint','하단 문구']]};
  function renderFields(){
    const s=current(); $('#fieldForm').innerHTML=(schemas[s.type]||schemas.content).map(([key,label,type])=>`<label class="field"><span>${label}</span>${type==='textarea'?`<textarea name="${key}">${esc(s.f[key]||'')}</textarea>`:`<input name="${key}" value="${esc(s.f[key]||'')}">`}</label>`).join('')+'<p class="field-hint">*강조* · **굵게** · Enter 줄바꿈</p>';
    $$('input,textarea',$('#fieldForm')).forEach(el=>el.oninput=()=>{s.f[el.name]=el.value;renderCanvasOnly();save()});
  }
  function renderCanvasOnly(){const c=$('#cardCanvas'),s=current();c.style.setProperty('--card-bg',s.f.image?`url("${s.f.image}")`:(s.f.bg||presets[state.preset].bg));c.style.setProperty('--bg-position',`50% ${s.f.imageY??50}%`);c.style.setProperty('--bg-origin',`50% ${s.f.imageY??50}%`);c.style.setProperty('--bg-zoom',(s.f.imageZoom??100)/100);c.innerHTML=cardHTML(s)}
  function renderCustomImageControls(){const f=current().f,has=Boolean(f.image),editor=$('#customImageEditor'),drop=$('#imageDropZone');editor.hidden=!has;drop.hidden=has;if(has){$('#customImagePreview').src=f.image;$('#customImagePreview').style.setProperty('--preview-y',`${f.imageY??50}%`);$('#imageZoomRange').value=f.imageZoom??100;$('#imageZoomValue').value=`${f.imageZoom??100}%`;$$('[data-bg-y]').forEach(b=>b.classList.toggle('active',+b.dataset.bgY===(f.imageY??50)))}}
  function renderPresets(){
    $('#presetGrid').innerHTML=Object.entries(presets).map(([key,p])=>`<button class="preset-option ${key===state.preset?'active':''}" data-preset="${key}" style="--swatch:${p.bg}"><i></i><b>${p.name}</b><small>${p.desc}</small></button>`).join('');
    $$('.preset-option').forEach(b=>b.onclick=()=>{state.preset=b.dataset.preset;if(!colors.includes(state.accent))state.accent=presets[state.preset].accent;render()});
    $('#colorRow').innerHTML=colors.map(c=>`<button class="color-dot ${c===state.accent?'active':''}" style="--color:${c}" data-color="${c}" aria-label="${c}"></button>`).join('');
    $$('.color-dot').forEach(b=>b.onclick=()=>{state.accent=b.dataset.color;render()});
  }
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2200)}
  function splitSentences(text){return text.replace(/\r/g,'').split(/(?<=[.!?다요])\s+|\n{2,}/).map(s=>s.replace(/^#+\s*/,'').trim()).filter(s=>s.length>12)}
  function makeDeck(text,amount){
    const lines=text.replace(/\r/g,'').split(/\n+/).map(s=>s.trim()).filter(Boolean), sentences=splitSentences(text);
    const title=(lines[0]||sentences[0]||'새로운 이야기').replace(/^#+\s*/,'').slice(0,42), body=sentences.filter(s=>s!==lines[0]);
    const slides=[{type:'cover',f:{badge:'FOLD ORIGINAL',title:title,sub:(body[0]||'핵심 메시지를 카드뉴스로 정리했습니다.').slice(0,88),bg:gradients[0],scrim:82}}];
    const contentCount=Math.max(2,amount-2);
    for(let i=0;i<contentCount;i++){const raw=body[i%Math.max(1,body.length)]||`핵심 내용을 짧고 명확한 문장으로 전달하는 ${i+1}번째 포인트입니다.`;const cut=raw.split(/[,:—-]/);slides.push({type:'content',f:{tag:`POINT ${String(i+1).padStart(2,'0')}`,num:String(i+1).padStart(2,'0'),head:(cut[0]||raw).slice(0,34),desc:raw.slice(0,110),bg:gradients[(i+1)%gradients.length],scrim:82}})}
    slides.push({type:'closing',f:{badge:'ONE MORE FOLD',head:'당신의 다음 이야기도\n카드로 접어보세요.',desc:'핵심을 남기고, 읽히는 흐름으로 완성합니다.',cta1:'AI 커뮤니티 참여 → 댓글 AIMAX',hint:'SAVE · SHARE · FOLD',bg:gradients[4],scrim:88}});
    return slides.slice(0,amount);
  }
  function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=reject;img.src=src})}
  async function drawToCanvas(slide,index){
    const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;const x=cv.getContext('2d'),f=slide.f;
    const bg=['#151711','#f3f1e9','#211b1a','#271e16','#ffe9ef','#e6f0ff'][Object.keys(presets).indexOf(state.preset)]||'#151711';x.fillStyle=bg;x.fillRect(0,0,1080,1350);
    if(f.image){try{const img=await loadImage(f.image);const scale=Math.max(1080/img.width,1350/img.height)*((f.imageZoom??100)/100),w=img.width*scale,h=img.height*scale,px=(1080-w)/2,py=-(h-1350)*((f.imageY??50)/100);x.drawImage(img,px,py,w,h)}catch{/* Keep the safe gradient fallback. */}}
    const grad=x.createLinearGradient(0,0,1080,1350);grad.addColorStop(0,state.accent+'55');grad.addColorStop(.48,'#00000000');grad.addColorStop(1,'#00000099');x.fillStyle=grad;x.fillRect(0,0,1080,1350);
    const light=['mag','doodle','blue'].includes(state.preset);x.fillStyle=light?'#131410':'#fff';x.font='700 24px Manrope';x.fillText('FOLD / CARD NEWS',86,92);x.textAlign='right';x.fillText(`${String(index+1).padStart(2,'0')} / ${String(state.slides.length).padStart(2,'0')}`,994,92);x.textAlign='left';
    const label=f.badge||f.tag||slide.type.toUpperCase();x.fillStyle=state.accent;x.fillRect(86,690,260,58);x.fillStyle='#111';x.font='800 23px Manrope';x.fillText(label.slice(0,20).toUpperCase(),108,728);
    x.fillStyle=light?'#111':'#fff';x.font=`900 ${slide.type==='quote'?58:72}px "Noto Sans KR"`;const headline=f.title||f.head||f.quote||'';wrap(x,headline,86,830,900,90);
    x.fillStyle=light?'#4f554c':'rgba(255,255,255,.75)';x.font='500 32px "Noto Sans KR"';wrap(x,f.sub||f.desc||f.by||'',86,1110,850,49);
    return cv;
  }
  function wrap(ctx,text,x,y,max,line){let yy=y;String(text).split('\n').forEach(part=>{let row='';[...part].forEach(ch=>{if(ctx.measureText(row+ch).width>max){ctx.fillText(row,x,yy);row=ch;yy+=line}else row+=ch});if(row)ctx.fillText(row,x,yy);yy+=line});}
  async function exportCurrent(){await document.fonts.ready;const cv=await drawToCanvas(current(),state.current);cv.toBlob(b=>download(`${String(state.current+1).padStart(2,'0')}.png`,b),'image/png');toast('현재 카드를 PNG로 저장했습니다.')}
  const crcTable=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
  function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
  function u16(v){return new Uint8Array([v&255,(v>>>8)&255])} function u32(v){return new Uint8Array([v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255])}
  function zipStore(files){
    const encoder=new TextEncoder(),locals=[],centrals=[];let offset=0;
    files.forEach(file=>{const name=encoder.encode(file.name),data=file.data,crc=crc32(data);const local=new Blob([u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);locals.push(local);const central=new Blob([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);centrals.push(central);offset+=local.size});
    const centralSize=centrals.reduce((n,b)=>n+b.size,0),end=new Blob([u32(0x06054b50),u16(0),u16(0),u16(files.length),u16(files.length),u32(centralSize),u32(offset),u16(0)]);return new Blob([...locals,...centrals,end],{type:'application/zip'});
  }
  async function exportAll(){
    const button=$('#exportAll');button.disabled=true;button.querySelector('span').textContent='렌더링 중';
    try{await document.fonts.ready;const files=[];for(let i=0;i<state.slides.length;i++){const canvas=await drawToCanvas(state.slides[i],i);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));files.push({name:`${String(i+1).padStart(2,'0')}.png`,data:new Uint8Array(await blob.arrayBuffer())})}download(`${(state.name||'cardnews').replace(/[\\/:*?"<>|]/g,'-')}.zip`,zipStore(files));toast(`${files.length}장의 PNG를 ZIP으로 저장했습니다.`)}finally{button.disabled=false;button.querySelector('span').textContent='전체 ZIP'}
  }
  $('#deckName').oninput=e=>{state.name=e.target.value;renderCanvasOnly();save()};
  $('#prevCard').onclick=()=>{state.current=(state.current-1+state.slides.length)%state.slides.length;render()};$('#nextCard').onclick=()=>{state.current=(state.current+1)%state.slides.length;render()};
  $('#addCard').onclick=()=>{state.slides.splice(state.current+1,0,{type:'content',f:{tag:'NEW POINT',num:String(state.current+1).padStart(2,'0'),head:'새로운 메시지를\n입력하세요',desc:'오른쪽 패널에서 내용을 바로 수정할 수 있습니다.',bg:gradients[state.slides.length%gradients.length],scrim:82}});state.current++;render()};
  $('#exportCurrent').onclick=exportCurrent;$('#duplicateCard').onclick=()=>{state.slides.splice(state.current+1,0,JSON.parse(JSON.stringify(current())));state.current++;render();toast('카드를 복제했습니다.')};
  $('#deleteCard').onclick=()=>{if(state.slides.length===1)return toast('카드는 최소 1장이 필요합니다.');state.slides.splice(state.current,1);render();toast('카드를 삭제했습니다.')};
  $$('.inspector-tabs button').forEach(b=>b.onclick=()=>{$$('.inspector-tabs button').forEach(x=>x.classList.toggle('active',x===b));$$('.panel').forEach(p=>p.classList.toggle('active',p.id===`${b.dataset.tab}Panel`))});
  $$('.segmented button').forEach(b=>b.onclick=()=>{$$('.segmented button').forEach(x=>x.classList.toggle('active',x===b));$('#cardCanvas').classList.remove('zoom-60','zoom-80');if(b.dataset.zoom!=='fit')$('#cardCanvas').classList.add(`zoom-${b.dataset.zoom}`)});
  const composer=$('#composer');['#openComposer','#openComposer2'].forEach(id=>$(id).onclick=()=>composer.showModal());
  $('#generateDeck').onclick=e=>{e.preventDefault();const text=$('#sourceText').value.trim();if(text.length<20)return toast('원문을 20자 이상 입력해 주세요.');state.slides=makeDeck(text,+$('#cardAmount').value);state.current=0;composer.close();render();toast(`${state.slides.length}장의 카드 덱을 만들었습니다.`)};
  $('#scrimRange').oninput=e=>{current().f.scrim=+e.target.value;$('#scrimValue').value=e.target.value;$('#cardCanvas').style.setProperty('--scrim',e.target.value/100);save()};
  const serverBase=location.protocol==='file:'?'http://127.0.0.1:8787':location.origin;
  async function checkImageServer(){try{const response=await fetch(`${serverBase}/ping`);const data=await response.json();const ready=Boolean(response.ok&&data.openai);$('#aiStatusDot').className=ready?'ready':'error';$('#aiStatusText').textContent=ready?'사용 가능':'API 키 확인 필요';$('#generateBg').disabled=!ready}catch{$('#aiStatusDot').className='error';$('#aiStatusText').textContent='start.bat 실행 필요';$('#generateBg').disabled=true}}
  $('#generateBg').onclick=async()=>{const button=$('#generateBg'),manual=$('#aiBgPrompt').value.trim(),f=current().f;const prompt=manual||[f.title||f.head||f.quote||'',f.sub||f.desc||'',presets[state.preset].name,'editorial photography'].filter(Boolean).join(', ');button.disabled=true;button.querySelector('b').textContent='배경 생성 중…';button.querySelector('small').textContent='약 1분 정도 걸릴 수 있어요';toast('AI가 배경 이미지를 만들고 있습니다.');try{const response=await fetch(`${serverBase}/img-gen`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});const data=await response.json();if(!response.ok)throw new Error(data.error||'이미지 생성에 실패했습니다.');f.image=new URL(data.url,`${serverBase}/`).href;render();toast('AI 배경을 현재 카드에 적용했습니다.')}catch(error){toast(error.message)}finally{button.disabled=false;button.querySelector('b').textContent='AI 배경 생성';button.querySelector('small').textContent='현재 카드에 바로 적용'}};
  $('#shuffleBg').onclick=()=>{current().f.image='';current().f.bg=gradients[Math.floor(Math.random()*gradients.length)];render();toast('배경 분위기를 바꿨습니다.')};
  async function applyCustomImage(file){if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))return toast('JPG, PNG 또는 WebP 이미지를 선택해 주세요.');if(file.size>15*1024*1024)return toast('이미지는 15MB 이하로 선택해 주세요.');try{const data=await resizeImage(file);current().f.image=data;current().f.imageY=50;current().f.imageZoom=100;render();toast('내 이미지를 카드 배경에 적용했습니다.')}catch{toast('이미지를 불러오지 못했습니다.')}}
  function resizeImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const max=1600,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.86))};img.src=reader.result};reader.readAsDataURL(file)})}
  $('#bgUpload').onchange=e=>{applyCustomImage(e.target.files[0]);e.target.value=''};
  $('#changeBgImage').onclick=()=>$('#bgUpload').click();
  $('#removeBgImage').onclick=()=>{current().f.image='';render();toast('내 이미지를 제거했습니다.')};
  $$('[data-bg-y]').forEach(b=>b.onclick=()=>{current().f.imageY=+b.dataset.bgY;render();});
  $('#imageZoomRange').oninput=e=>{current().f.imageZoom=+e.target.value;$('#imageZoomValue').value=`${e.target.value}%`;renderCanvasOnly();save()};
  const dropZone=$('#imageDropZone');['dragenter','dragover'].forEach(type=>dropZone.addEventListener(type,e=>{e.preventDefault();dropZone.classList.add('is-dragging')}));['dragleave','drop'].forEach(type=>dropZone.addEventListener(type,e=>{e.preventDefault();dropZone.classList.remove('is-dragging')}));dropZone.addEventListener('drop',e=>applyCustomImage(e.dataTransfer.files[0]));
  const localAudio=$('#localAudio');let youtubePlayer=null,youtubeReady=false,localAudioUrl='';
  function extractYoutubeId(value){try{const url=new URL(value.trim());if(url.hostname==='youtu.be')return url.pathname.split('/').filter(Boolean)[0]||'';if(url.hostname.endsWith('youtube.com')){if(url.searchParams.get('v'))return url.searchParams.get('v');const parts=url.pathname.split('/').filter(Boolean);if(['embed','shorts','live'].includes(parts[0]))return parts[1]||''}}catch{}return /^[\w-]{11}$/.test(value.trim())?value.trim():''}
  function loadYoutubeApi(){if(window.YT?.Player)return Promise.resolve();if(loadYoutubeApi.promise)return loadYoutubeApi.promise;loadYoutubeApi.promise=new Promise((resolve,reject)=>{const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{if(typeof previous==='function')previous();resolve()};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>reject(new Error('유튜브 플레이어를 불러오지 못했습니다.'));document.head.appendChild(script)});return loadYoutubeApi.promise}
  async function setupYoutube(videoId){try{await loadYoutubeApi();youtubeReady=false;if(youtubePlayer?.destroy)youtubePlayer.destroy();const shell=$('#youtubePlayerShell');shell.hidden=false;shell.innerHTML='<div id="youtubePlayerMount"></div>';youtubePlayer=new YT.Player('youtubePlayerMount',{height:'200',width:'100%',videoId,playerVars:{playsinline:1,controls:1,rel:0,origin:location.origin},events:{onReady:event=>{youtubeReady=true;event.target.setVolume(state.music.volume);event.target.cueVideoById(videoId);const data=event.target.getVideoData();$('#musicTrackName').textContent=data.title||'YouTube 배경음악';toast('유튜브 음악을 불러왔습니다.')},onStateChange:event=>{const playing=event.data===YT.PlayerState.PLAYING;setMusicPlaying(playing);if(event.data===YT.PlayerState.ENDED&&state.music.loop){event.target.seekTo(0);event.target.playVideo()}},onError:()=>toast('이 영상은 임베드 재생이 제한되어 있습니다.')}})}catch(error){toast(error.message)}}
  function setMusicPlaying(playing){$('#musicPlayToggle').textContent=playing?'❚❚':'▶';$('#musicPlayToggle').setAttribute('aria-label',playing?'일시정지':'재생');$('#musicPlayerCard').classList.toggle('is-playing',playing)}
  function applyMusicVolume(value){state.music.volume=+value;localAudio.volume=state.music.volume/100;if(youtubeReady)youtubePlayer.setVolume(state.music.volume);$('#musicVolume').value=state.music.volume;$('#musicVolumeValue').value=`${state.music.volume}%`;save()}
  function setVolumeLayout(layout){state.music.layout=layout;$('#volumeControl').className=`volume-control ${layout}`;$$('[data-volume-layout]').forEach(b=>b.classList.toggle('active',b.dataset.volumeLayout===layout));save()}
  $$('[data-music-source]').forEach(b=>b.onclick=()=>{$$('[data-music-source]').forEach(x=>x.classList.toggle('active',x===b));$$('.music-source').forEach(s=>s.classList.toggle('active',s.id===`${b.dataset.musicSource}MusicSource`))});
  $('#loadYoutube').onclick=()=>{const id=extractYoutubeId($('#youtubeUrl').value);if(!id)return toast('올바른 유튜브 링크를 입력해 주세요.');localAudio.pause();state.music.source='youtube';state.music.youtubeId=id;state.music.fileName='';$('#musicTrackName').textContent='YouTube 음악 준비 중…';setupYoutube(id);save()};
  $('#audioUpload').onchange=e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith('audio/'))return toast('음원 파일을 선택해 주세요.');if(localAudioUrl)URL.revokeObjectURL(localAudioUrl);if(youtubeReady)youtubePlayer.pauseVideo();localAudioUrl=URL.createObjectURL(file);localAudio.src=localAudioUrl;localAudio.volume=state.music.volume/100;localAudio.loop=state.music.loop;state.music.source='file';state.music.fileName=file.name;state.music.youtubeId='';$('#youtubePlayerShell').hidden=true;$('#musicTrackName').textContent=file.name;setMusicPlaying(false);save();toast('내 음원을 불러왔습니다.');e.target.value=''};
  $('#musicPlayToggle').onclick=()=>{if(state.music.source==='youtube'){if(!youtubeReady)return toast('유튜브 플레이어를 준비 중입니다.');youtubePlayer.getPlayerState()===YT.PlayerState.PLAYING?youtubePlayer.pauseVideo():youtubePlayer.playVideo()}else if(state.music.source==='file'&&localAudio.src){localAudio.paused?localAudio.play().catch(()=>toast('음원을 재생하지 못했습니다.')):localAudio.pause()}else toast('먼저 유튜브 링크나 음원 파일을 선택해 주세요.')};
  localAudio.onplay=()=>setMusicPlaying(true);localAudio.onpause=()=>setMusicPlaying(false);localAudio.onended=()=>setMusicPlaying(false);
  $('#musicVolume').oninput=e=>applyMusicVolume(e.target.value);
  $$('[data-volume-layout]').forEach(b=>b.onclick=()=>setVolumeLayout(b.dataset.volumeLayout));
  $('#musicLoop').onchange=e=>{state.music.loop=e.target.checked;localAudio.loop=state.music.loop;save()};
  applyMusicVolume(state.music.volume);setVolumeLayout(state.music.layout);$('#musicLoop').checked=state.music.loop;if(state.music.youtubeId){$('#youtubeUrl').value=`https://youtu.be/${state.music.youtubeId}`;state.music.source='youtube';setupYoutube(state.music.youtubeId)}else if(state.music.source==='file'&&state.music.fileName){$('#musicTrackName').textContent=`${state.music.fileName} · 파일을 다시 선택해 주세요`}
  $('#saveJson').onclick=()=>download(`${state.name||'cardnews'}.json`,new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));$('#loadJson').onclick=()=>$('#jsonFile').click();
  $('#jsonFile').onchange=e=>{const r=new FileReader();r.onload=()=>{try{state={...defaultState(),...JSON.parse(r.result)};render();toast('덱을 불러왔습니다.')}catch{toast('올바른 JSON 파일이 아닙니다.')}};r.readAsText(e.target.files[0])};
  $('#resetDeck').onclick=()=>{if(confirm('저장된 덱을 초기화할까요?')){state=defaultState();render();toast('새 덱으로 초기화했습니다.')}};
  $('#exportAll').onclick=exportAll; document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();$('#saveJson').click()}if(e.key==='ArrowLeft'&&!/INPUT|TEXTAREA/.test(e.target.tagName))$('#prevCard').click();if(e.key==='ArrowRight'&&!/INPUT|TEXTAREA/.test(e.target.tagName))$('#nextCard').click()});
  if(location.hash&&presets[location.hash.slice(1)])state.preset=location.hash.slice(1);render();checkImageServer();
})();
