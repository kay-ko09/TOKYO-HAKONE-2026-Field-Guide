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

// v16.5 — Driver Mode for taxi-worthy routes only.
const driverModal = document.getElementById('driverModal');
const driverJp = document.getElementById('driverJp');
const driverName = document.getElementById('driverName');
const driverAddress = document.getElementById('driverAddress');
const driverMap = document.getElementById('driverMap');
let currentDriverAddress = '';

document.querySelectorAll('.transit-block[data-driver-address]').forEach(route => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'driver-trigger';
  btn.textContent = '司機に見せる / SHOW DRIVER';
  btn.addEventListener('click', () => {
    currentDriverAddress = route.dataset.driverAddress || '';
    driverJp.textContent = route.dataset.driverJp || route.dataset.driverName || '';
    driverName.textContent = route.dataset.driverName || '';
    driverAddress.textContent = currentDriverAddress;
    driverMap.href = route.dataset.driverMap || ('https://maps.google.com/?q=' + encodeURIComponent(currentDriverAddress));
    driverModal?.classList.add('open');
    driverModal?.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  });
  route.appendChild(btn);
});

function closeDriver(){
  driverModal?.classList.remove('open');
  driverModal?.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
document.querySelectorAll('.driver-close').forEach(b => b.addEventListener('click', closeDriver));
if(driverModal) driverModal.addEventListener('click', e => { if(e.target === driverModal) closeDriver(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && driverModal?.classList.contains('open')) closeDriver(); });
const copyDriver = document.getElementById('copyDriverAddress');
if(copyDriver) copyDriver.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(currentDriverAddress); copyDriver.textContent='コピーしました'; }
  catch(e) { copyDriver.textContent=currentDriverAddress; }
  setTimeout(()=>copyDriver.textContent='住所をコピー',1400);
});


// v16.6 — Starbucks Order Mode.
const orderModal = document.getElementById('orderModal');
function openOrder(){
  if(!orderModal) return;
  orderModal.classList.add('open');
  orderModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeOrder(){
  if(!orderModal) return;
  orderModal.classList.remove('open');
  orderModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
document.querySelectorAll('.show-order').forEach(b=>b.addEventListener('click',openOrder));
document.querySelectorAll('.order-close').forEach(b=>b.addEventListener('click',closeOrder));
if(orderModal) orderModal.addEventListener('click',e=>{if(e.target===orderModal) closeOrder();});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && orderModal?.classList.contains('open')) closeOrder();});


// v16.7 — Nakamura Tokichi Matcha Order Mode.
const matchaOrderModal = document.getElementById('matchaOrderModal');
function openMatchaOrder(){
  if(!matchaOrderModal) return;
  matchaOrderModal.classList.add('open');
  matchaOrderModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeMatchaOrder(){
  if(!matchaOrderModal) return;
  matchaOrderModal.classList.remove('open');
  matchaOrderModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
document.querySelectorAll('.show-matcha-order').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openMatchaOrder();}));
document.querySelectorAll('.matcha-order-close').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();closeMatchaOrder();if(location.hash==='#matchaOrderModal') history.replaceState(null,'',location.pathname+location.search);}));
if(matchaOrderModal) matchaOrderModal.addEventListener('click',e=>{if(e.target===matchaOrderModal) closeMatchaOrder();});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && matchaOrderModal?.classList.contains('open')) closeMatchaOrder();});


// v17.3 — One-tap expense logging from food / drink cards.
const expensePresets = [
  {match:'築地 鮨 山治', place:'築地 鮨 山治', category:'FOOD', date:'2026-10-26', item:'早餐壽司'},
  {match:'GLITCH COFFEE GINZA', place:'GLITCH COFFEE GINZA', category:'COFFEE', date:'2026-10-26', item:'Coffee'},
  {match:'辻田 銀座', place:'辻田 銀座', category:'FOOD', date:'2026-10-26', item:'つけ麺 / 拉麵'},
  {match:'治一郎 KITTE 丸之內', place:'治一郎 KITTE 丸之內', category:'FOOD', date:'2026-10-26', item:'治一郎プリン'},
  {match:'BUTTER — Biei Pasture Dairy Farm', place:'BUTTER — Biei Pasture Dairy Farm', category:'FOOD', date:'2026-10-26', item:'Hot Cake / 美瑛奶油'},
  {match:'uRn.chAi&TeA LUMINE1', place:'uRn.chAi&TeA LUMINE1', category:'COFFEE', date:'2026-10-26', item:'Original Chai'},
  {match:'鳥茂 / TORISHIGE', place:'鳥茂 / TORISHIGE', category:'FOOD', date:'2026-10-26', item:'Dinner'},
  {match:'かつお食堂', place:'かつお食堂', category:'FOOD', date:'2026-10-27', item:'鰹節ごはん'},
  {match:'Starbucks Reserve Roastery Tokyo', place:'Starbucks Reserve Roastery Tokyo', category:'COFFEE', date:'2026-10-27', item:'Starbucks'},
  {match:'本とさや / HONTOSAYA', place:'本とさや / HONTOSAYA', category:'FOOD', date:'2026-10-27', item:'燒肉'},
  {match:'龜十', place:'龜十', category:'FOOD', date:'2026-10-27', item:'銅鑼燒'},
  {match:'FUGLEN ASAKUSA', place:'FUGLEN ASAKUSA', category:'COFFEE', date:'2026-10-27', item:'Coffee'},
  {match:'中村藤吉本店 麻布台店', place:'中村藤吉本店 麻布台店', category:'COFFEE', date:'2026-10-27', item:'ミクスチャ［抹茶とミルク］'},
  {match:'RistoPizza by Napoli sta ca', place:'RistoPizza by Napoli sta ca', category:'FOOD', date:'2026-10-27', item:'Dinner'}
];

document.querySelectorAll('.card').forEach(card => {
  const h3 = card.querySelector('.content h3');
  const content = card.querySelector('.content');
  if (!h3 || !content) return;
  const preset = expensePresets.find(x => h3.textContent.trim().startsWith(x.match));
  if (!preset) return;
  let tools = content.querySelector('.travel-tools');
  if (!tools) {
    tools = document.createElement('div');
    tools.className = 'travel-tools';
    content.appendChild(tools);
  }
  // Any existing wallet link in this card already fulfills the action.
  // Check the whole card, not just .travel-tools, so hand-authored buttons never duplicate.
  if (content.querySelector('a[href^="wallet.html"]') || tools.querySelector('.expense-link')) return;
  const params = new URLSearchParams({
    place:preset.place,
    category:preset.category,
    date:preset.date,
    item:preset.item,
    source:'field-guide'
  });
  const a = document.createElement('a');
  a.className = 'expense-link';
  a.href = 'wallet.html?' + params.toString();
  a.textContent = '¥ 記帳';
  tools.appendChild(a);
});


// v17.6.2 — Defensive button de-duplication.
// Older page revisions sometimes contained a hand-authored wallet button plus a JS-generated one.
document.querySelectorAll('.card .content').forEach(content => {
  const expenseLinks = [...content.querySelectorAll('a[href^="wallet.html"], .expense-link')];
  expenseLinks.slice(1).forEach(el => el.remove());

  // Remove exact duplicate action links (same label + same destination) without touching distinct photo-spot maps.
  const seen = new Set();
  content.querySelectorAll('.actions a, .travel-tools a').forEach(a => {
    const key = `${a.textContent.trim()}|${a.getAttribute('href') || ''}`;
    if (seen.has(key)) a.remove(); else seen.add(key);
  });
});

// v17.8.1 Kenyan order card
const kenyanOrderModal = document.getElementById('kenyanOrderModal');
function openKenyanOrder(){if(!kenyanOrderModal)return;kenyanOrderModal.classList.add('open');kenyanOrderModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeKenyanOrder(){if(!kenyanOrderModal)return;kenyanOrderModal.classList.remove('open');kenyanOrderModal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('.show-kenyan-order').forEach(b=>b.addEventListener('click',openKenyanOrder));
document.querySelectorAll('.kenyan-order-close').forEach(b=>b.addEventListener('click',closeKenyanOrder));
if(kenyanOrderModal) kenyanOrderModal.addEventListener('click',e=>{if(e.target===kenyanOrderModal)closeKenyanOrder();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&kenyanOrderModal?.classList.contains('open'))closeKenyanOrder();});
