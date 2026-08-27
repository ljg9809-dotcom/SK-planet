document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('#period-select');
  const data = {
    '30': { views: '128,420', reach: '86,240', engagement: '7.8%', followers: '12,860' },
    '90': { views: '354,860', reach: '218,700', engagement: '7.2%', followers: '12,860' },
    all: { views: '682,140', reach: '441,320', engagement: '6.9%', followers: '12,860' }
  };
  select?.addEventListener('change', () => {
    Object.entries(data[select.value]).forEach(([key, value]) => {
      const target = document.querySelector(`[data-metric="${key}"]`);
      if (target) target.textContent = value;
    });
  });
});
