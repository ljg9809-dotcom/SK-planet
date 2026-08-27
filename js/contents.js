document.addEventListener('DOMContentLoaded', () => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.content-card')];
  const count = document.querySelector('#content-count');
  const dialog = document.querySelector('#content-dialog');
  const closeButton = dialog?.querySelector('.dialog-close');

  filters.forEach((button) => button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    let visible = 0;
    cards.forEach((card) => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visible += 1;
    });
    count.textContent = visible;
  }));

  cards.forEach((card) => card.querySelector('button')?.addEventListener('click', (event) => {
    const source = event.currentTarget;
    document.querySelector('#dialog-title').textContent = source.dataset.title;
    document.querySelector('#dialog-type').textContent = source.dataset.type;
    document.querySelector('#dialog-description').textContent = source.dataset.description;
    dialog?.showModal();
  }));
  closeButton?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
});
