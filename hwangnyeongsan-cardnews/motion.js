const deck = document.querySelector('#deck');
const cards = [...document.querySelectorAll('.card')];
const dots = [...document.querySelectorAll('[data-go]')];
const params = new URLSearchParams(location.search);
if (params.get('standalone') === '1') document.body.classList.add('standalone');
let current = Math.min(5, Math.max(1, Number(params.get('card')) || 1));
let staticMode = params.get('static') === '1';

function showCard(number, updateUrl = true) {
  current = number < 1 ? 5 : number > 5 ? 1 : number;
  cards.forEach((card, index) => {
    card.classList.toggle('is-active', index === current - 1);
    card.setAttribute('aria-hidden', index === current - 1 ? 'false' : 'true');
  });
  dots.forEach((dot, index) => dot.classList.toggle('is-active', index === current - 1));
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('card', current);
    staticMode ? url.searchParams.set('static', '1') : url.searchParams.delete('static');
    history.replaceState({}, '', url);
  }
}

function setStatic(value) {
  staticMode = value;
  deck.classList.toggle('is-static', staticMode);
  document.querySelector('#staticToggle').textContent = staticMode ? '모션 켜기' : '정지 화면';
  showCard(current);
}

document.querySelector('#prev').addEventListener('click', () => showCard(current - 1));
document.querySelector('#next').addEventListener('click', () => showCard(current + 1));
dots.forEach(dot => dot.addEventListener('click', () => showCard(Number(dot.dataset.go))));
document.querySelector('#staticToggle').addEventListener('click', () => setStatic(!staticMode));
document.querySelector('#replay').addEventListener('click', () => {
  const active = cards[current - 1];
  active.classList.remove('is-active');
  void active.offsetWidth;
  active.classList.add('is-active');
});
addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showCard(current - 1);
  if (event.key === 'ArrowRight') showCard(current + 1);
});
showCard(current, false);
setStatic(staticMode);
