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

// v15: field-use controls
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

document.querySelectorAll('.card').forEach(card => {
  const content = card.querySelector('.content');
  if (!content || content.querySelector('.travel-tools')) return;
  const tools = document.createElement('div');
  tools.className = 'travel-tools';
  const map = content.querySelector('.actions a.map');
  const official = content.querySelector('.actions a:not(.map)');
  if (map) tools.insertAdjacentHTML('beforeend', `<a href="${map.href}" target="_blank" rel="noopener">MAP</a>`);
  const info = [...content.querySelectorAll('.quick-info b')];
  const address = info.find(el => /東京都|区|丁目/.test(el.textContent));
  if (address) {
    const btn = document.createElement('button'); btn.type='button'; btn.textContent='COPY ADDRESS';
    btn.addEventListener('click', async () => { await navigator.clipboard.writeText(address.textContent.trim()); btn.textContent='COPIED'; setTimeout(()=>btn.textContent='COPY ADDRESS',1200); });
    tools.appendChild(btn);
  }
  if (official) tools.insertAdjacentHTML('beforeend', `<a href="${official.href}" target="_blank" rel="noopener">OFFICIAL</a>`);
  const next = document.createElement('button'); next.type='button'; next.textContent='NEXT ROUTE';
  next.addEventListener('click', () => { let n=card.nextElementSibling; while(n && !n.classList.contains('transit-block')) n=n.nextElementSibling; if(n){n.open=true;n.scrollIntoView({behavior:'smooth',block:'start'});} });
  tools.appendChild(next);
  if (tools.children.length) content.appendChild(tools);
});
