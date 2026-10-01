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
