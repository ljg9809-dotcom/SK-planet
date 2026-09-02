document.addEventListener('DOMContentLoaded', () => {
  const search = document.querySelector('#report-search');
  const filter = document.querySelector('#report-filter');
  const rows = [...document.querySelectorAll('#report-table tr')];
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#no-results');

  const updateTable = () => {
    const query = search.value.trim().toLowerCase();
    const category = filter.value;
    let visible = 0;
    rows.forEach((row) => {
      const matchesText = row.textContent.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || row.dataset.type === category;
      row.hidden = !(matchesText && matchesCategory);
      if (!row.hidden) visible += 1;
    });
    count.textContent = visible;
    empty.hidden = visible !== 0;
  };
  search?.addEventListener('input', updateTable);
  filter?.addEventListener('change', updateTable);

  const resourceData = {
    'citizens-park': {
      index: '01 / BUSANJIN-GU',
      name: '부산시민공원',
      type: '일상 공간 · 도심공원',
      summary: '부산진구 옛 캠프 하야리아 부지에 조성된 도심공원입니다. 기억·문화·즐거움·자연·참여를 주제로 한 숲길과 역사 공간, 잔디광장과 문화시설을 함께 둘러볼 수 있습니다.',
      navLabels: ['홈','위치정보','주요 공간','이용 안내','Card News'],
      cardNews: [
        ['assets/images/reports/새 폴더/1.표지.jpg', '표지'],
        ['assets/images/reports/새 폴더/2.소개.jpg', '소개'],
        ['assets/images/reports/새 폴더/3.메타세쿼이아길.jpg', '메타세쿼이아길'],
        ['assets/images/reports/새 폴더/4.잔디광장.jpg', '잔디광장'],
        ['assets/images/reports/새 폴더/5.왕벚나무 산책길.jpg', '왕벚나무 산책길'],
        ['assets/images/reports/새 폴더/6.일러스트 스팟.jpg', '일러스트 스팟'],
        ['assets/images/reports/새 폴더/7.낮 풍경.jpg', '낮 풍경'],
        ['assets/images/reports/새 폴더/8.밤 풍경.jpg', '밤 풍경'],
        ['assets/images/reports/새 폴더/9.마무리  + CTA.jpg', '마무리 + CTA']
      ],
      quickLabel1: '운영시간',
      hours: '매일 05:00–24:00',
      quickLabel2: '이용요금',
      bestTime: '무료 · 연중무휴',
      tags: '#부산시민공원  #하야리아부대  #공원산책  #피크닉',
      address: '부산광역시 부산진구 시민공원로 73',
      transport: '도시철도 1호선 부전역 7번 출구 또는 동해선 부전역 2번 출구에서 접근할 수 있습니다. 공원 공식 홈페이지는 원활한 관람을 위해 대중교통 이용을 권장합니다.',
      tip: '버스는 연지동·부암동·부전동 방면의 여러 노선을 이용할 수 있습니다. 방문 전 공식 교통 안내에서 이용 정류장과 노선을 확인하세요.',
      locationTags: '#부산진구  #부전역  #도시철도1호선  #동해선',
      mapLink: 'https://www.citizenpark.or.kr/04_int/int07.asp',
      mapLinkLabel: '공식 교통정보 보기',
      category2Title: '주요 공간',
      category2Kicker: 'Park highlights',
      tenantIntro: '부산시민공원이 공식적으로 소개하는 명소 중 공간의 성격이 잘 드러나는 여섯 곳입니다.',
      tenants: [
        ['01','5대 숲길·메타세쿼이아 길','기억·문화·즐거움·자연·참여의 숲길','assets/images/reports/citizen-forest-road.jpg'],
        ['02','하야리아 잔디광장','약 40,000㎡ 잔디광장과 목재조명타워','assets/images/reports/citizen-hialeah-lawn.jpg'],
        ['03','기억의 숲','캠프 하야리아 플라타너스로 조성한 숲길','assets/images/reports/citizen-memory-forest.jpg'],
        ['04','하늘빛폭포·거울연못','대형 분수와 야간 경관 공간','assets/images/reports/citizen-skyfall-pond.jpg'],
        ['05','문화예술촌','공방·공연장·전시실을 갖춘 체험 공간','assets/images/reports/citizen-art-village.jpg'],
        ['06','공원역사관','부지의 변천과 공원 조성 역사를 기록한 공간','assets/images/reports/citizen-history-museum.jpg']
      ],
      tenantTags: '#숲길  #잔디광장  #기억의숲  #문화예술촌  #공원역사관',
      category3Title: '이용 안내',
      category3Kicker: 'Visitor information',
      category3PrimaryLabel: '기본 이용',
      popupTitle: '05:00–24:00 · 연중무휴',
      popupCopy: '공원 입장료는 무료입니다. 시설별 이용시간과 휴장일은 서로 다를 수 있으므로 개별 안내를 확인하세요.',
      popupPeriod: 'OFFICIAL PARK INFORMATION',
      category3ListLabel: '그늘막·피크닉 수칙',
      performances: [['돗자리 이용','기간과 장소에 관계없이 상시 이용 가능'],['소형 그늘막','4월부터 10월 말까지 일출 후–일몰 전 허용, 월요일 설치 불가'],['허용 규격','4인용 이하 2.5m × 3.0m, 2면 이상 개방'],['금지 사항','고정시설 설치, 음주·흡연·취사 금지']],
      eventTags: '#무료입장  #연중무휴  #돗자리  #소형그늘막',
      updateNote: '시설별 운영시간과 그늘막 허용 조건은 계절·행사 운영에 따라 달라질 수 있습니다. 방문 전 부산시민공원 공식 홈페이지의 최신 공지를 확인하세요.'
    },
    hwangnyeongsan: {
      index: '02 / NAM-GU',
      name: '황령산 전망대',
      type: '야간 관광 · 도심 야경 · 드라이브',
      summary: '해발 427m 황령산 정상 부근에서 부산 도심과 바다를 여러 방향으로 조망하는 전망 명소입니다. 조선시대 통신 거점이었던 봉수대의 역사와 광안리·해운대·부산항·서면 방면의 경관을 함께 만날 수 있습니다.',
      navLabels: ['홈','위치정보','전망 포인트','방문 안내'],
      quickLabel1: '해발',
      hours: '427m',
      quickLabel2: '주차',
      bestTime: '황령산 전망쉼터 주차장',
      tags: '#황령산  #봉수대  #부산전망  #도심야경',
      address: '부산광역시 남구 황령산로 391-39',
      transport: '비짓부산은 도시철도 2호선 금련산역 6번 출구에서 택시를 이용하는 경로를 안내합니다. 자동차도로를 통해 정상 부근 전망쉼터 주차장까지 접근할 수 있습니다.',
      tip: '부산시 공식 리포트 기준으로 주차장에서 봉수대 전망대까지 약 350m이며 도보 약 10분이 소요됩니다.',
      locationTags: '#남구  #금련산역  #전망쉼터주차장  #봉수대',
      mapLink: 'https://www.visitbusan.net/index.do?lang_cd=ko&menuCd=DOM_000000201013001000&uc_seq=981',
      mapLinkLabel: '비짓부산 위치정보 보기',
      category2Title: '전망 포인트',
      category2Kicker: 'Official viewpoints',
      tenantIntro: '비짓부산과 부산시가 공식적으로 안내하는 황령산 정상 부근의 주요 조망 지점과 시설입니다.',
      tenants: [['01','정상석 인근 전망대','광안리·해운대·시청 방면 조망'],['02','봉수대 전망대','부산항·서면·낙동강 방면 조망'],['03','황령산 봉수대','조선시대 부산 봉수망의 중심 역할'],['04','황령산 전망쉼터','정상 부근의 휴식·전망 공간'],['05','목재 데크 전망대','능선을 따라 이어지는 소규모 전망 공간'],['06','전망 망원경','부산 도심 경관을 확대해 보는 무료 시설']],
      tenantTags: '#광안대교  #해운대  #부산항  #서면  #낙동강',
      category3Title: '방문 안내',
      category3Kicker: 'Access information',
      category3PrimaryLabel: '공식 접근 안내',
      popupTitle: '금련산역 6번 출구 → 택시 이용',
      popupCopy: '차량 방문 시 황령산 전망쉼터 주차장을 이용할 수 있습니다. 주차장에서 봉수대 전망대까지는 약 350m 거리입니다.',
      popupPeriod: 'VISIT BUSAN · BUSAN CITY',
      category3ListLabel: '현장 동선',
      performances: [['차량 접근','자동차도로를 따라 정상 부근 전망쉼터 주차장까지 이동'],['도보 구간','주차장에서 봉수대 전망대까지 약 350m·약 10분'],['정상석 전망대','광안리·해운대·시청 방면 조망'],['봉수대 전망대','부산항·서면·낙동강 방면 조망']],
      eventTags: '#금련산역  #주차장  #도보10분  #파노라마전망',
      updateNote: '산 정상부 도로와 주차장 이용 여건은 기상·현장 상황에 따라 달라질 수 있습니다. 출발 전 비짓부산 또는 현장 안내를 확인하세요.'
    },
    'millac-market': {
      index: '03 / SUYEONG-GU',
      name: '밀락 더 마켓',
      type: '복합문화공간 · F&B · 팝업 · 버스킹',
      summary: '광안대교 오션뷰와 먹거리, 팝업스토어, 공연을 한곳에서 즐기는 부산의 복합문화공간입니다. 탁 트인 건축과 감각적인 포토존이 어우러져 SNS 콘텐츠 촬영지로도 매력적입니다.',
      hours: '매일 10:00–24:00',
      bestTime: '오후 5시–밤 9시',
      tags: '#밀락더마켓  #민락동  #부산팝업  #광안리야경',
      address: '부산광역시 수영구 민락수변로17번길 56',
      transport: '부산 2호선 민락역 1번 출구 앞에서 210번 버스 승차 후 ‘민락 매립지 공영주차장’ 정류장에서 하차하면 도보 약 1분입니다. 민락수변공원에서는 약 460m, 도보 7분 거리입니다.',
      tip: '주차 공간이 혼잡할 수 있어 주말 저녁에는 대중교통 이용을 권장합니다. 오션뷰 좌석은 일몰 전후 빠르게 채워집니다.',
      locationTags: '#민락동  #수변공원  #2호선  #주차장',
      mapImage: 'assets/images/reports/millac-naver-map.png',
      mapLink: 'https://naver.me/GWW9sWki',
      mainImage: 'assets/images/reports/millac-main-view.jpg',
      detailImage: 'assets/images/reports/millac-space-detail.jpg',
      tenantIntro: '식사부터 디저트와 주류, 소품 쇼핑까지 한 공간에서 이용할 수 있도록 업종별로 정리했습니다.',
      tenantGroups: [
        { title: '식당', items: [['카사레티코 밀락더마켓점','멕시코 음식점'],['마켓나이트','아시안 펍 · 음식과 주류'],['밀락항바베큐','바비큐 음식점']] },
        { title: '카페 · 디저트', items: [['스타벅스 밀락더마켓점','카페 · 베이커리'],['크레이지 롯어빵','붕어빵 · 디저트'],['리초야','말차 아이스크림 · 디저트']] },
        { title: '주류 · 소품 판매점', items: [['PODO · 포도','와인 · 식료품 · 소품 판매점']] }
      ],
      tenantTags: '#타코  #야시장  #바비큐  #스타벅스  #소품숍',
      popupTitle: '현재 진행 중인 팝업 없음',
      popupCopy: '시즌별 브랜드 팝업과 플리마켓이 비정기적으로 열립니다. 새로운 일정은 공식 채널에서 안내됩니다.',
      popupPeriod: 'CURRENT STATUS',
      performances: [['마켓나이트 라이브 공연','가수·DJ 등 라이브 공연'],['버스킹 공연','버스킹 스퀘어 중심의 비정기 공연'],['퍼포먼스 공연','야시장 운영시간 중 비정기 진행']],
      eventTags: '#민락동  #공연  #팝업  #버스킹',
      popupImage: 'assets/images/reports/millac-popup-night.jpg',
      performanceImage: 'assets/images/reports/millac-performance.jpg'
    }
  };

  const modal = document.querySelector('#resource-modal');
  const modalContent = modal?.querySelector('.resource-modal-content');
  const navButtons = [...(modal?.querySelectorAll('[data-modal-target]') || [])];
  const cardNewsSection = modal?.querySelector('#modal-card-news');
  const cardNewsNav = modal?.querySelector('[data-modal-target="modal-card-news"]');
  const cardNewsImage = modal?.querySelector('#card-news-image');
  const cardNewsCarousel = modal?.querySelector('#card-news-carousel');
  const cardNewsDots = modal?.querySelector('#card-news-dots');
  const cardNewsPrev = modal?.querySelector('.card-news-prev');
  const cardNewsNext = modal?.querySelector('.card-news-next');
  let currentCardNews = [];
  let currentCardIndex = 0;
  const setText = (selector, value) => {
    const target = modal?.querySelector(selector);
    if (target) target.textContent = value;
  };

  const renderTenants = (items, groups) => {
    const list = modal?.querySelector('#modal-tenant-list');
    if (!list) return;
    list.classList.toggle('is-grouped', Boolean(groups));
    if (groups) {
      list.replaceChildren(...groups.map((group) => {
        const section = document.createElement('section');
        section.className = 'tenant-group';
        const heading = document.createElement('h4');
        const groupList = document.createElement('ul');
        heading.textContent = group.title;
        groupList.replaceChildren(...group.items.map(([name, description]) => {
          const item = document.createElement('li');
          const nameElement = document.createElement('strong');
          const descriptionElement = document.createElement('span');
          nameElement.textContent = name;
          descriptionElement.textContent = description;
          item.append(nameElement, descriptionElement);
          return item;
        }));
        section.append(heading, groupList);
        return section;
      }));
      return;
    }
    list.replaceChildren(...items.map(([number, title, description, imageSource]) => {
      const item = document.createElement('article');
      item.className = 'tenant-item';
      if (imageSource) {
        const image = document.createElement('img');
        image.src = imageSource;
        image.alt = `${title} 실제 전경`;
        image.loading = 'lazy';
        item.classList.add('has-photo');
        item.append(image);
      }
      const numberElement = document.createElement('span');
      const titleElement = document.createElement('h4');
      const descriptionElement = document.createElement('p');
      numberElement.textContent = number;
      titleElement.textContent = title;
      descriptionElement.textContent = description;
      item.append(numberElement, titleElement, descriptionElement);
      return item;
    }));
  };

  const renderPerformances = (items = []) => {
    const list = modal?.querySelector('#modal-performance-list');
    if (!list) return;
    list.replaceChildren(...items.map(([title, description]) => {
      const item = document.createElement('li');
      const titleElement = document.createElement('strong');
      const descriptionElement = document.createElement('span');
      titleElement.textContent = title;
      descriptionElement.textContent = description;
      item.append(titleElement, descriptionElement);
      return item;
    }));
  };

  const setEventImage = (selector, source, alt) => {
    const image = modal?.querySelector(selector);
    if (!image) return;
    if (source) {
      image.src = source;
      image.alt = alt;
      image.hidden = false;
    } else {
      image.removeAttribute('src');
      image.alt = '';
      image.hidden = true;
    }
  };

  const setMap = (data) => {
    const map = modal?.querySelector('#modal-map');
    const image = modal?.querySelector('#modal-map-image');
    const link = modal?.querySelector('#modal-map-link');
    if (!map || !image || !link) return;
    map.classList.toggle('has-map-image', Boolean(data.mapImage));
    if (data.mapImage) {
      image.src = data.mapImage;
      image.alt = `${data.name} 네이버 지도 위치`;
      image.hidden = false;
    } else {
      image.removeAttribute('src');
      image.alt = '';
      image.hidden = true;
    }
    if (data.mapLink) {
      link.href = data.mapLink;
      link.childNodes[0].nodeValue = `${data.mapLinkLabel || '네이버 지도에서 크게 보기'} `;
      link.hidden = false;
    } else {
      link.removeAttribute('href');
      link.hidden = true;
    }
  };

  const setMainVisuals = (data) => {
    const imageSettings = [
      ['#modal-main-image', data.mainImage, `${data.name} 외관 전경`],
      ['#modal-detail-image', data.detailImage, `${data.name} 내부 공간`]
    ];
    imageSettings.forEach(([selector, source, alt]) => {
      const image = modal?.querySelector(selector);
      if (!image) return;
      image.parentElement.classList.toggle('has-image', Boolean(source));
      if (source) {
        image.src = source;
        image.alt = alt;
        image.hidden = false;
      } else {
        image.removeAttribute('src');
        image.alt = '';
        image.hidden = true;
      }
    });
  };

  const showCardNewsSlide = (index) => {
    if (!currentCardNews.length || !cardNewsImage) return;
    currentCardIndex = Math.max(0, Math.min(index, currentCardNews.length - 1));
    const [source, title] = currentCardNews[currentCardIndex];
    cardNewsImage.src = source;
    cardNewsImage.alt = `부산시민공원 카드뉴스 ${currentCardIndex + 1} — ${title}`;
    setText('#card-news-title', title);
    setText('#card-news-count', `${currentCardIndex + 1} / ${currentCardNews.length}`);
    setText('#card-news-status', `${currentCardIndex + 1}번째 카드, 총 ${currentCardNews.length}장 — ${title}`);
    cardNewsPrev.disabled = currentCardIndex === 0;
    cardNewsNext.disabled = currentCardIndex === currentCardNews.length - 1;
    [...cardNewsDots.children].forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentCardIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const setCardNews = (items = []) => {
    currentCardNews = items;
    currentCardIndex = 0;
    const hasCardNews = items.length > 0;
    cardNewsNav.hidden = !hasCardNews;
    cardNewsSection.hidden = !hasCardNews;
    if (!hasCardNews) return;
    cardNewsDots.replaceChildren(...items.map(([, title], index) => {
      const dot = document.createElement('button');
      dot.className = 'card-news-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `${index + 1}번 카드 ${title} 보기`);
      dot.addEventListener('click', () => showCardNewsSlide(index));
      return dot;
    }));
    showCardNewsSlide(0);
  };

  const openResourceModal = (resourceKey) => {
    const data = resourceData[resourceKey];
    if (!data || !modal) return;
    setText('#modal-resource-index', data.index);
    setText('#modal-resource-title', data.name);
    setText('#modal-resource-type', data.type);
    setText('#modal-resource-summary', data.summary);
    setText('#modal-quick-label1', data.quickLabel1 || '운영시간');
    setText('#modal-resource-hours', data.hours);
    setText('#modal-quick-label2', data.quickLabel2 || '추천 시간');
    setText('#modal-resource-best-time', data.bestTime);
    setText('#modal-resource-tags', data.tags);
    setText('#modal-map-name', data.name);
    setText('#modal-resource-address', data.address);
    setText('#modal-resource-transport', data.transport);
    setText('#modal-resource-tip', data.tip);
    setText('#modal-location-title', `${data.name} — 위치정보`);
    setText('#modal-location-tags', data.locationTags || data.tags);
    setText('#modal-tenants-title', `${data.name} — ${data.category2Title || '입점 정보'}`);
    setText('#modal-category2-kicker', data.category2Kicker || 'Tenant information');
    setText('#modal-tenant-intro', data.tenantIntro);
    setText('#modal-tenant-tags', data.tenantTags || data.tags);
    setText('#modal-popup-section-title', `${data.name} — ${data.category3Title || '팝업 및 공연'}`);
    setText('#modal-category3-kicker', data.category3Kicker || 'Event & Performance');
    setText('#modal-primary-label', data.category3PrimaryLabel || '팝업');
    setText('#modal-popup-title', data.popupTitle);
    setText('#modal-popup-copy', data.popupCopy);
    setText('#modal-popup-period', data.popupPeriod);
    setText('#modal-list-label', data.category3ListLabel || '공연');
    setText('#modal-update-note', data.updateNote || '팝업 및 프로그램 일정은 운영 상황에 따라 변경될 수 있습니다. 방문 전 공식 채널에서 최신 정보를 확인하세요.');
    setText('#modal-event-tags', data.eventTags || data.tags);
    setMap(data);
    setMainVisuals(data);
    setCardNews(data.cardNews);
    renderTenants(data.tenants || [], data.tenantGroups);
    renderPerformances(data.performances || [['프로그램 안내', data.popupCopy]]);
    setEventImage('#modal-popup-image', data.popupImage, `${data.name} 야간 팝업 현장`);
    setEventImage('#modal-performance-image', data.performanceImage, `${data.name} 공연 공간`);
    modal.querySelector('#modal-event-gallery').classList.toggle('is-empty', !data.popupImage && !data.performanceImage);
    const visuals = modal.querySelector('#modal-resource-visuals');
    visuals.className = `modal-visuals visual-${resourceKey}`;
    const labels = data.navLabels || ['홈','위치정보','입점 정보','팝업'];
    navButtons.forEach((button, index) => {
      const label = button.querySelector('span');
      if (label) label.textContent = labels[index];
    });
    navButtons.forEach((button, index) => button.classList.toggle('is-active', index === 0));
    modal.showModal();
    modalContent.scrollTop = 0;
  };

  document.querySelectorAll('.resource-card').forEach((card) => {
    card.querySelector('.resource-card-open')?.addEventListener('click', () => openResourceModal(card.dataset.resource));
  });

  modal?.querySelector('.resource-modal-close')?.addEventListener('click', () => modal.close());
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });

  navButtons.forEach((button) => button.addEventListener('click', () => {
    const section = modal.querySelector(`#${button.dataset.modalTarget}`);
    if (!section) return;
    modalContent.scrollTo({ top: Math.max(section.offsetTop - 24, 0), behavior: 'smooth' });
    navButtons.forEach((item) => item.classList.toggle('is-active', item === button));
  }));

  cardNewsPrev?.addEventListener('click', () => showCardNewsSlide(currentCardIndex - 1));
  cardNewsNext?.addEventListener('click', () => showCardNewsSlide(currentCardIndex + 1));
  cardNewsCarousel?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showCardNewsSlide(currentCardIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showCardNewsSlide(currentCardIndex + 1);
    }
  });
  let cardTouchStartX = 0;
  cardNewsCarousel?.addEventListener('touchstart', (event) => {
    cardTouchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  cardNewsCarousel?.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - cardTouchStartX;
    if (Math.abs(distance) < 45) return;
    showCardNewsSlide(currentCardIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  modalContent?.addEventListener('scroll', () => {
    const visibleButtons = navButtons.filter((button) => !button.hidden);
    const sections = visibleButtons.map((button) => modal.querySelector(`#${button.dataset.modalTarget}`));
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= modalContent.scrollTop + 90) activeIndex = index;
    });
    if (modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight - 4) {
      activeIndex = sections.length - 1;
    }
    navButtons.forEach((button) => button.classList.remove('is-active'));
    visibleButtons[activeIndex]?.classList.add('is-active');
  }, { passive: true });
});
