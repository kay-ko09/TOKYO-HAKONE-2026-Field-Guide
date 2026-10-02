const buttons = document.querySelectorAll('.day-btn');
const sections = document.querySelectorAll('.day-section');

function activateDay(target){
  buttons.forEach(b => b.classList.toggle('active', b.dataset.day === target));
  sections.forEach(s => s.classList.toggle('active', s.id === target));
  history.replaceState(null, '', `#${target}`);
  window.scrollTo({top:0, behavior:'smooth'});
}
buttons.forEach(btn => btn.addEventListener('click', () => activateDay(btn.dataset.day)));
const hash = location.hash.replace('#','');
if(hash && document.getElementById(hash)) activateDay(hash);

// Persist checklist state on the user's device.
document.querySelectorAll('.checklist input[type="checkbox"]').forEach((box, idx) => {
  const key = `tokyo-field-check-${idx}`;
  box.checked = localStorage.getItem(key) === '1';
  box.addEventListener('change', () => localStorage.setItem(key, box.checked ? '1' : '0'));
});

// Travel mode toggle. Script now loads after the button, so this always binds correctly.
const travelBtn = document.getElementById('travelMode');
if (travelBtn) {
  const saved = localStorage.getItem('tokyo-travel-mode') === '1';
  document.body.classList.toggle('travel-mode', saved);
  travelBtn.textContent = saved ? 'FULL GUIDE' : 'TRAVEL MODE';
  travelBtn.addEventListener('click', () => {
    const on = document.body.classList.toggle('travel-mode');
    localStorage.setItem('tokyo-travel-mode', on ? '1' : '0');
    travelBtn.textContent = on ? 'FULL GUIDE' : 'TRAVEL MODE';
  });
}

// Field-use helper buttons. Do NOT duplicate MAP/OFFICIAL links already present in .actions.
document.querySelectorAll('.card').forEach(card => {
  const content = card.querySelector('.content');
  if (!content || content.querySelector('.travel-tools')) return;

  const tools = document.createElement('div');
  tools.className = 'travel-tools';

  const info = [...content.querySelectorAll('.quick-info b')];
  const address = info.find(el => /東京都|区|丁目/.test(el.textContent));
  if (address) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'COPY ADDRESS';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(address.textContent.trim());
        btn.textContent = 'COPIED';
      } catch (e) {
        btn.textContent = 'COPY FAILED';
      }
      setTimeout(() => btn.textContent = 'COPY ADDRESS', 1200);
    });
    tools.appendChild(btn);
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'NEXT ROUTE';
  next.addEventListener('click', () => {
    const section = card.closest('.day-section');
    if (!section) return;
    const flow = [...section.querySelectorAll('.card, .transit-block')];
    const here = flow.indexOf(card);
    let target = null;
    for (let i = here + 1; i < flow.length; i++) {
      if (flow[i].classList.contains('transit-block')) { target = flow[i]; break; }
    }
    // If this card is the last stop of the day, move to the next card instead of doing nothing.
    if (!target && here >= 0 && flow[here + 1]) target = flow[here + 1];
    if (target) {
      if (target.tagName === 'DETAILS') target.open = true;
      target.scrollIntoView({behavior:'smooth', block:'start'});
      target.classList.add('route-flash');
      setTimeout(() => target.classList.remove('route-flash'), 900);
    } else {
      next.textContent = 'END OF DAY';
      setTimeout(() => next.textContent = 'NEXT ROUTE', 1200);
    }
  });
  tools.appendChild(next);

  if (tools.children.length) content.appendChild(tools);
});

// STPX107 full-screen clerk card.
const watchModal = document.getElementById('watchModal');
const openWatch = () => {
  if (!watchModal) return;
  watchModal.classList.add('open');
  watchModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};
const closeWatch = () => {
  if (!watchModal) return;
  watchModal.classList.remove('open');
  watchModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};
document.querySelectorAll('.show-watch').forEach(btn => btn.addEventListener('click', openWatch));
document.querySelectorAll('.watch-close').forEach(btn => btn.addEventListener('click', closeWatch));
if (watchModal) watchModal.addEventListener('click', e => { if (e.target === watchModal) closeWatch(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWatch(); });

const copyWatch = document.getElementById('copyWatchModel');
if (copyWatch) {
  copyWatch.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('SEIKO Selection STPX107');
      copyWatch.textContent = 'コピーしました';
    } catch (e) {
      copyWatch.textContent = 'STPX107';
    }
    setTimeout(() => copyWatch.textContent = '型番をコピー', 1200);
  });
}
