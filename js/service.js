document.addEventListener('DOMContentLoaded', () => {
  const routes = {
    haeundae: { area: '해운대구 · 오션뷰 해안로', title: '달맞이길 & 송정 서핑 해변로', score: '97', distance: '7.6 km', time: '45분', level: '쉬움', tip: '청사포 다릿돌전망대를 경유하면 시원한 해무를 만날 수 있어요.', badge: 'OCEAN VIEW ROUTE', start: '광안리', end: '송정' },
    dadaepo: { area: '사하구 · 노을·갈대 힐링', title: '다대포 갈대숲 & 몰운대 노을길', score: '99', distance: '5.2 km', time: '35분', level: '쉬움', tip: '일몰 40분 전에 출발하면 갈대숲과 붉은 노을을 함께 즐길 수 있어요.', badge: 'SUNSET HEALING ROUTE', start: '다대포', end: '몰운대' },
    yeongdo: { area: '영도구 · 로컬 숨은 명소', title: '봉래산 둘레길 & 흰여울 해안코스', score: '98', distance: '8.4 km', time: '50분', level: '보통', tip: '일몰 1시간 전 방문하면 흰여울 해안의 황금빛 윤슬이 가장 아름다워요.', badge: 'LOCAL DISCOVERY ROUTE', start: '봉래산', end: '흰여울' }
  };

  const setText = (selector, value) => {
    const target = document.querySelector(selector);
    if (target) target.textContent = value;
  };

  document.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      const route = routes[button.dataset.route];
      if (!route) return;
      document.querySelectorAll('[data-route]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      setText('#route-area', route.area);
      setText('#route-title', route.title);
      setText('#route-score', route.score);
      setText('#route-distance', route.distance);
      setText('#route-time', route.time);
      setText('#route-level', route.level);
      setText('#route-tip', route.tip);
      setText('#route-badge', route.badge);
      setText('.route-start', route.start);
      setText('.route-end', route.end);
    });
  });

  document.querySelector('#ai-demo-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('#ai-demo-input');
    const message = document.querySelector('#ai-demo-message');
    const query = input?.value.trim();
    if (!message) return;
    message.textContent = query ? `“${query}”에 맞는 해운대 해안 코스를 찾았어요!` : '원하는 풍경이나 시간을 먼저 입력해주세요.';
  });
});
