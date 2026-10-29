// Editorial introduction; the separate public-data section preserves API provenance and direction.
const busanPlaces = [
  {
    id: 'gamcheon', name: '감천문화마을', location: '사하구 · 감천동', type: '골목 · 문화',
    intro: '산비탈을 따라 층층이 자리 잡은 집들과 알록달록한 골목이 인상적인 마을입니다. 피란민의 생활 터전으로 시작된 공간에 예술 작품과 주민들의 이야기가 더해져 부산의 시간을 느끼며 걷기 좋습니다.',
    highlights: ['마을 풍경을 한눈에 담는 전망 공간', '골목을 따라 만나는 벽화와 설치 작품', '경사와 계단을 따라 달라지는 지붕 풍경'],
    tip: '실제 주민이 생활하는 마을입니다. 골목에서는 목소리를 낮추고 주택 내부나 주민을 촬영할 때는 동의를 구해주세요.'
  },
  {
    id: 'huinnyeoul', name: '흰여울문화마을', location: '영도구 · 영선동4가', type: '골목 · 해안',
    intro: '영도의 해안 절벽을 따라 작은 집들과 좁은 골목이 이어지는 마을입니다. 골목 사이로 남항의 바다를 바라보고, 아래쪽 절영해안산책로에서는 파도 가까이에서 영도의 풍경을 만날 수 있습니다.',
    highlights: ['담장과 골목 너머로 펼쳐지는 바다', '절영해안산책로를 따라 걷는 해안 풍경', '오르막과 계단이 만드는 입체적인 마을 풍경'],
    tip: '마을과 해안산책로 사이에는 계단과 경사가 있습니다. 편한 신발을 신고 주민의 출입구를 막지 않도록 배려해주세요.'
  },
  {
    id: 'taejongdae', name: '태종대', location: '영도구 · 동삼동', type: '숲 · 해안 절경',
    intro: '영도 남쪽에서 울창한 숲과 바다 절벽을 함께 만나는 자연 명소입니다. 순환 산책길을 따라 걷다 보면 탁 트인 바다와 기암절벽이 번갈아 나타나고, 영도등대 주변에서는 해안 지형을 가까이 감상할 수 있습니다.',
    highlights: ['숲을 지나 바다로 이어지는 순환 산책길', '전망대에서 바라보는 넓은 수평선', '영도등대 주변의 해안 절벽'],
    tip: '산책 구간에 오르막이 있고 등대 방면에는 계단이 있습니다. 다누비열차 운행 여부는 방문 전 공식 안내를 확인해주세요.'
  },
  {
    id: 'dadaepo', name: '다대포해수욕장', location: '사하구 · 다대동', type: '해변 · 노을',
    intro: '낙동강 하구와 바다가 만나는 서부산의 넓은 해변입니다. 긴 모래사장과 열린 하늘이 여유로운 분위기를 만들고, 해 질 무렵에는 물이 남은 모래 위로 하늘빛이 비치는 풍경을 감상할 수 있습니다.',
    highlights: ['넓게 펼쳐지는 모래사장과 수평선', '서쪽 하늘을 물들이는 해 질 무렵의 풍경', '해변공원과 함께 즐기는 가벼운 산책'],
    tip: '바닷물 높이와 날씨에 따라 해변 풍경이 달라집니다. 갯벌과 물가에서는 안전 안내를 따르고 일몰 뒤 돌아갈 동선을 미리 살펴보세요.'
  },
  {
    id: 'songdo', name: '송도해수욕장', location: '서구 · 암남동', type: '해변 · 산책',
    intro: '원도심 가까이에서 바다 산책을 즐길 수 있는 해수욕장입니다. 곡선을 그리는 백사장과 바다 위 구름산책로, 하늘을 지나는 해상케이블카가 어우러져 부산의 해변을 여러 높이에서 바라보는 재미가 있습니다.',
    highlights: ['백사장을 따라 이어지는 해변 산책', '바다 위를 걷는 송도구름산책로', '해상케이블카와 함께 담는 해안 풍경'],
    tip: '해수욕장 산책과 케이블카 이용은 별도로 계획하세요. 산책로 개방과 케이블카 운행은 기상 상황에 따라 달라질 수 있습니다.'
  },
  {
    id: 'yongdusan', name: '용두산공원', location: '중구 · 광복동2가', type: '공원 · 원도심',
    intro: '남포동과 광복동을 둘러보다 잠시 쉬어가기 좋은 언덕 위 공원입니다. 부산타워를 중심으로 원도심의 풍경을 느낄 수 있고, 주변 시장과 골목을 걸으며 부산의 일상으로 여행을 이어가기에도 좋습니다.',
    highlights: ['부산타워를 중심으로 펼쳐지는 공원', '나무 그늘 아래에서 쉬어가는 산책길', '광복로와 남포동으로 이어지는 원도심 여행'],
    tip: '공원 산책과 부산타워 전망대 관람은 구분해서 계획해주세요. 주변 골목을 함께 걸을 예정이라면 오르내리는 동선을 먼저 살펴보세요.'
  },
  {
    id: 'beomeosa', name: '범어사', location: '금정구 · 청룡동', type: '사찰 · 숲',
    intro: '금정산 자락의 숲에 자리 잡은 사찰입니다. 도심의 속도에서 잠시 벗어나 산사로 향하는 길을 걷고, 전통 건축과 주변의 나무가 만드는 차분한 풍경을 느끼기 좋은 장소입니다.',
    highlights: ['숲과 어우러진 산사의 전통 건축', '일주문을 지나 경내로 이어지는 길', '금정산 자락에서 만나는 계절의 풍경'],
    tip: '기도와 수행이 이루어지는 공간입니다. 법당 관람과 촬영 안내를 따르고 조용한 분위기를 지켜주세요.'
  },
  {
    id: 'yonggungsa', name: '해동용궁사', location: '기장군 · 기장읍', type: '사찰 · 해안',
    intro: '기장 해안의 바위 위에 자리 잡아 사찰과 바다를 한 장면으로 만나는 곳입니다. 계단을 따라 내려가면 전각 너머로 푸른 바다가 펼쳐지고, 파도 소리를 들으며 해안 사찰의 풍경을 둘러볼 수 있습니다.',
    highlights: ['바다와 전각이 함께 보이는 해안 풍경', '계단과 다리를 따라 달라지는 전망', '바위 해안으로 밀려오는 파도'],
    tip: '경내로 향하는 길에 계단이 많습니다. 비가 오거나 파도가 높은 날에는 발밑을 주의하고 출입 안내를 따라주세요.'
  },
  {
    id: 'oryukdo', name: '오륙도 스카이워크', location: '남구 · 용호동', type: '전망 · 해안',
    intro: '용호동 해안 절벽에서 오륙도와 바다를 바라보는 전망 공간입니다. 유리 바닥 너머로 발아래 해안을 볼 수 있고, 주변 해맞이공원에서는 바위섬과 바다를 조금 더 느긋하게 감상할 수 있습니다.',
    highlights: ['유리 바닥 너머로 내려다보는 해안', '오륙도 바위섬을 배경으로 한 전망', '해맞이공원에서 이어가는 바다 산책'],
    tip: '강풍이나 비 등 기상 상황에 따라 스카이워크 출입이 제한될 수 있습니다. 현장의 안전 수칙과 덧신 착용 안내를 따라주세요.'
  },
  {
    id: 'eulsukdo', name: '을숙도생태공원', location: '사하구 · 하단동', type: '생태 · 습지',
    intro: '낙동강 하구의 습지와 철새 서식 환경을 가까이에서 느낄 수 있는 생태 공간입니다. 물가와 갈대가 만드는 풍경을 천천히 바라보고, 조용한 탐방을 통해 도시 안에 남아 있는 자연을 발견할 수 있습니다.',
    highlights: ['낙동강 하구의 습지와 갈대 풍경', '계절에 따라 달라지는 새들의 모습', '자연을 관찰하며 천천히 걷는 생태 탐방'],
    tip: '철새와 서식지를 보호하기 위해 지정된 탐방로를 이용해주세요. 보호 구역과 출입 제한 안내를 따르고 새들에게 먹이를 주지 마세요.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#busan-place-grid');
  const dialog = document.querySelector('#place-dialog');
  if (!grid || !dialog) return;
  let trigger = null;
  let requestController = null;
  let activePlaceId = null;
  let selectedCategory = '전체';
  let visibleLimit = 6;
  let currentData = null;
  let snapshotPromise;
  const dataBody = dialog.querySelector('#place-data-body');
  const dataStatus = dialog.querySelector('#place-data-status');
  const list = dialog.querySelector('#place-related-list');
  const more = dialog.querySelector('#place-related-more');
  const filters = dialog.querySelector('#place-related-filters');
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const mapUrl = (name, region, district) => `https://map.naver.com/p/search/${encodeURIComponent([region,district,name].filter(Boolean).join(' '))}`;

  function renderRelated() {
    const incoming = currentData.direction === 'incoming';
    const items = currentData.related.filter(item=>selectedCategory === '전체' || item.category === selectedCategory);
    const shown = items.slice(0,visibleLimit);
    list.replaceChildren(...shown.map(item=>{
      const row = make('li','place-related-item');
      const link = make('a','place-related-link');
      link.href = mapUrl(item.name,item.region,item.district);
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      const rank = make('span','place-related-rank',incoming ? '↗' : String(item.rank || '–').padStart(2,'0'));
      rank.setAttribute('aria-label',incoming ? '이곳으로 연결되는 관광지' : `연관 순위 ${item.rank || '미제공'}위`);
      const text = make('span','place-related-text');
      text.append(make('strong','',item.name));
      text.append(make('span','', [item.region,item.district,item.subcategory || item.category].filter(Boolean).join(' · ')));
      if (incoming) text.append(make('small','place-incoming-rank',`이 출발지의 목록에서 ${currentData.name} ${item.rank || '–'}위`));
      const arrow = make('span','place-related-arrow','↗'); arrow.setAttribute('aria-hidden','true');
      link.append(rank,text,arrow); row.append(link); return row;
    }));
    dialog.querySelector('#place-related-count').textContent = `${selectedCategory} ${items.length}곳 중 ${shown.length}곳`;
    more.hidden = shown.length >= items.length;
    more.textContent = `장소 더 보기 (${shown.length} / ${items.length})`;
    [...filters.children].forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===selectedCategory)));
  }

  function renderData(data) {
    currentData = data;
    const incoming = data.direction === 'incoming';
    const month = /^\d{6}$/.test(data.baseYm) ? `${data.baseYm.slice(0,4)}.${data.baseYm.slice(4)} 기준` : '기준월 미제공';
    dialog.querySelector('#place-data-month').textContent = month;
    dataStatus.textContent = data.delivery === 'live' ? '한국관광공사 조회 자료' : '한국관광공사 공공데이터 자료';
    dataBody.hidden = false;
    const facts = [
      ['소재 지역',[data.region,data.district].filter(Boolean).join(' · ')],
      ['관광 분류',data.category.join(' › ') || '제공된 분류 없음'],
      ['연결 정보',`${data.related.length}곳 · ${incoming ? '이곳으로 연결되는 관광지' : '이곳의 연관 관광지'}`]
    ];
    if (data.registrationName && data.registrationName !== data.name) facts.push(['데이터 등록명',data.registrationName]);
    dialog.querySelector('#place-data-facts').replaceChildren(...facts.map(([label,value])=>{
      const row = make('div','');row.append(make('dt','',label),make('dd','',value));return row;
    }));
    dialog.querySelector('#place-related-intro').textContent = incoming
      ? `${data.name}을 연관 관광지로 포함한 부산의 출발 장소입니다. 이 장소 자체의 연관 목록은 제공되지 않아, 연결되는 출발지를 보여드립니다.`
      : `${data.name}과 연결성이 높은 장소를 살펴보세요. 관광지와 음식점, 숙소를 유형별로 모아 여행 동선을 구상할 수 있습니다.`;
    const categories = ['전체',...new Set(data.related.map(item=>item.category).filter(Boolean))];
    if (!categories.includes(selectedCategory)) selectedCategory = '전체';
    filters.replaceChildren(...categories.map(category=>{
      const count = category==='전체' ? data.related.length : data.related.filter(item=>item.category===category).length;
      const button = make('button','',`${category} ${count}`);
      button.type='button';button.dataset.category=category;
      button.addEventListener('click',()=>{selectedCategory=category;visibleLimit=6;renderRelated();});
      return button;
    }));
    filters.hidden = categories.length < 2;
    dialog.querySelector('#place-data-note').textContent = incoming
      ? '출처: 한국관광공사 · 티맵모빌리티 내비게이션 이동 데이터. 표기된 순위는 각 출발지의 연관 목록에서 이곳이 차지한 순위입니다. 출발지 사이의 순위나 실제 방문자 수를 뜻하지 않습니다. 조사 범위는 부산 16개 구·군입니다.'
      : '출처: 한국관광공사 · 티맵모빌리티 내비게이션 이동 데이터. 순위는 해당 기준월의 연결성을 나타내며, 거리순·여행 만족도·실제 방문자 수를 뜻하지 않습니다. 유형을 선택해도 원자료의 순위를 유지합니다.';
    dialog.querySelector('#place-data-source').href = data.sourceUrl;
    renderRelated();
  }

  async function loadData(place) {
    requestController?.abort();
    const controller = new AbortController();
    requestController = controller;
    activePlaceId = place.id;
    selectedCategory = '전체';visibleLimit = 6;currentData = null;
    dataBody.hidden = true;
    dialog.querySelector('#place-data-month').textContent = '';
    dataStatus.textContent = '공공데이터를 불러오는 중입니다.';
    const stillCurrent = () => !controller.signal.aborted && activePlaceId === place.id && dialog.open;
    if (!snapshotPromise) snapshotPromise = fetch('assets/data/busan-tourism.json').then(response=>{
      if (!response.ok) throw new Error('SNAPSHOT_UNAVAILABLE');return response.json();
    }).catch(()=>{snapshotPromise=null;return null;});
    const saved = (await snapshotPromise)?.places.find(item=>item.id===place.id);
    if (!stillCurrent()) return;
    if (saved) renderData({...saved,delivery:'snapshot'});
    try {
      const response = await fetch(`/api/tourism?place=${encodeURIComponent(place.id)}`,{signal:controller.signal});
      if (!response.ok) throw new Error('DATA_UNAVAILABLE');
      const data = await response.json();
      if (stillCurrent()) renderData(data);
    } catch {
      if (stillCurrent() && !saved) dataStatus.textContent = '공공데이터를 불러오지 못했습니다. 잠시 후 상세창을 다시 열어주세요.';
    }
  }
  more.addEventListener('click',()=>{visibleLimit+=6;renderRelated();});

  function openPlace(place, button) {
    trigger = button;
    const photo = busanPhotoCredits.find(item => item.id === place.id);
    dialog.querySelector('#place-title').textContent = place.name;
    dialog.querySelector('#place-location').textContent = place.location;
    dialog.querySelector('#place-type').textContent = place.type;
    dialog.querySelector('#place-intro').textContent = place.intro;
    dialog.querySelector('#place-tip').textContent = place.tip;
    const image = dialog.querySelector('#place-image');
    image.src = photo.image;
    image.alt = `${place.name} 풍경`;
    dialog.querySelector('#place-highlights').replaceChildren(...place.highlights.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    const credit = dialog.querySelector('#place-credit');
    credit.href = photo.imageSource;
    credit.textContent = `사진·자료 출처: 부산관광아카이브${photo.creator ? ' / ' + photo.creator : ''} · 공공누리 제1유형 ↗`;
    dialog.querySelector('#place-map').href = `https://map.naver.com/p/search/${encodeURIComponent('부산 ' + place.name)}`;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('place-dialog-open');
    loadData(place);
  }

  grid.querySelectorAll('[data-place]').forEach(button => {
    button.addEventListener('click', () => {
      const place = busanPlaces.find(item => item.id === button.dataset.place);
      if (place) openPlace(place, button);
    });
  });
  dialog.querySelector('.place-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    requestController?.abort();
    activePlaceId = null;
    document.body.classList.remove('place-dialog-open');
    trigger?.focus({ preventScroll: true });
  });
});
