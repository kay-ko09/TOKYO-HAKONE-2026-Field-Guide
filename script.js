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

// Theme mode: UNIT-01 / ALERT
const themeButtons = document.querySelectorAll('.theme-btn');
const savedTheme = localStorage.getItem('tokyo-field-theme') || 'unit01';
function setTheme(theme){
  document.body.classList.toggle('theme-alert', theme === 'alert');
  themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
  localStorage.setItem('tokyo-field-theme', theme);
}
themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
setTheme(savedTheme);

const missionSchedule = [
  {t:'2026-10-23T08:00:00+09:00', label:'DEPARTURE / TOKYO', meta:'10/23 · TOUR START'},
  {t:'2026-10-25T09:00:00+09:00', label:'HAKONE / TOKYO-III', meta:'DAY 03 · EVA FIELD SURVEY', match:'大涌谷'},
  {t:'2026-10-26T08:00:00+09:00', label:'築地 鮨 山治', meta:'DAY 04 · 08:00', match:'築地 鮨 山治'},
  {t:'2026-10-26T09:30:00+09:00', label:'GLITCH COFFEE GINZA', meta:'DAY 04 · 09:30', match:'GLITCH COFFEE GINZA'},
  {t:'2026-10-26T11:10:00+09:00', label:'KAGEMARU / SESSION 01', meta:'DAY 04 · 11:10 · BOOKED', match:'SESSION 01'},
  {t:'2026-10-26T12:00:00+09:00', label:'KAGEMARU / SESSION 02', meta:'DAY 04 · 12:00 · BOOKED', match:'SESSION 02'},
  {t:'2026-10-26T12:25:00+09:00', label:'辻田 銀座', meta:'DAY 04 · 12:25', match:'辻田 銀座'},
  {t:'2026-10-26T13:15:00+09:00', label:'BUTTER / MARUNOUCHI', meta:'DAY 04 · 13:15', match:'BUTTER'},
  {t:'2026-10-26T15:20:00+09:00', label:'國立新美術館', meta:'DAY 04 · 15:20', match:'國立新美術館'},
  {t:'2026-10-26T17:40:00+09:00', label:'NEWoMan TAKANAWA', meta:'DAY 04 · 17:40', match:'NEWoMan'},
  {t:'2026-10-26T19:30:00+09:00', label:'鳥茂 / TORISHIGE', meta:'DAY 04 · 19:30 · TARGET', match:'鳥茂'},
  {t:'2026-10-27T08:30:00+09:00', label:'かつお食堂', meta:'DAY 05 · 08:30', match:'かつお食堂'},
  {t:'2026-10-27T09:20:00+09:00', label:'STARBUCKS ROASTERY', meta:'DAY 05 · 09:20', match:'Starbucks Reserve'},
  {t:'2026-10-27T11:00:00+09:00', label:'SMALL WORLDS / EVA', meta:'DAY 05 · 11:00 · CORE', match:'SMALL WORLDS'},
  {t:'2026-10-27T13:50:00+09:00', label:'本とさや / HONTOSAYA', meta:'DAY 05 · 13:50', match:'HONTOSAYA'},
  {t:'2026-10-27T15:00:00+09:00', label:'FUGLEN ASAKUSA', meta:'DAY 05 · 15:00', match:'FUGLEN'},
  {t:'2026-10-27T15:45:00+09:00', label:'TiCTAC / SEIKO', meta:'DAY 05 · 15:45 · CORE', match:'TiCTAC'},
  {t:'2026-10-27T17:10:00+09:00', label:'HARD STOP / MOVE', meta:'DAY 05 · 17:10', match:'HARD STOP'},
  {t:'2026-10-27T18:00:00+09:00', label:'RISTOPIZZA / AZABUDAI', meta:'DAY 05 · 18:00 · BOOKED', match:'RistoPizza'},
  {t:'2026-10-27T19:30:00+09:00', label:'TEAMLAB BORDERLESS', meta:'DAY 05 · 19:30 · TARGET', match:'teamLab Borderless'},
  {t:'2026-10-27T21:30:00+09:00', label:'TOKYO TOWER / NIGHT WALK', meta:'DAY 05 · 21:30', match:'東京鐵塔'},
  {t:'2026-10-28T13:55:00+09:00', label:'RETURN FLIGHT', meta:'10/28 · NRT → KHH'}
].map(x => ({...x, d:new Date(x.t)}));

const tripStart = new Date('2026-10-23T08:00:00+09:00');
const tripEnd = new Date('2026-10-28T17:05:00+08:00');

function fmtTokyoClock(date){
  return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(date);
}
function fmtDuration(ms){
  if(ms <= 0) return '00:00:00';
  const total = Math.floor(ms/1000);
  const d = Math.floor(total/86400);
  const h = Math.floor((total%86400)/3600);
  const m = Math.floor((total%3600)/60);
  const s = total%60;
  return d>0 ? `${d}D ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}` : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function updateMissionConsole(){
  const now = new Date();
  const clock = document.getElementById('tokyoClock');
  if(clock) clock.textContent = `TOKYO ${fmtTokyoClock(now)}`;

  const pct = Math.max(0, Math.min(100, ((now-tripStart)/(tripEnd-tripStart))*100));
  const bar = document.getElementById('tripProgressBar');
  const txt = document.getElementById('tripProgressText');
  if(bar) bar.style.width = `${pct}%`;
  if(txt){
    txt.textContent = now < tripStart ? 'STANDBY' : now > tripEnd ? 'MISSION COMPLETE' : `${Math.round(pct)}% COMPLETE`;
  }

  const next = missionSchedule.find(x => x.d > now);
  const target = document.getElementById('nextTarget');
  const meta = document.getElementById('nextMeta');
  const cd = document.getElementById('missionCountdown');
  const cdLabel = document.getElementById('countdownLabel');
  if(next){
    if(target) target.textContent = next.label;
    if(meta) meta.textContent = next.meta;
    if(cd) cd.textContent = fmtDuration(next.d-now);
    if(cdLabel) cdLabel.textContent = 'UNTIL NEXT OPERATION';
  }else{
    if(target) target.textContent = 'MISSION COMPLETE';
    if(meta) meta.textContent = 'TOKYO / HAKONE 2026';
    if(cd) cd.textContent = '00:00:00';
    if(cdLabel) cdLabel.textContent = 'ALL TARGETS CLEARED';
  }

  document.querySelectorAll('.card').forEach(c => c.classList.remove('mission-next','mission-past'));
  if(next && next.match){
    const headings = [...document.querySelectorAll('.card h3')];
    const h = headings.find(el => el.textContent.includes(next.match));
    if(h) h.closest('.card').classList.add('mission-next');
  }
  missionSchedule.filter(x => x.d < now && x.match).forEach(item => {
    const h = [...document.querySelectorAll('.card h3')].find(el => el.textContent.includes(item.match));
    if(h) h.closest('.card').classList.add('mission-past');
  });
}
updateMissionConsole();
setInterval(updateMissionConsole,1000);
