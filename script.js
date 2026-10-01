const buttons = document.querySelectorAll('.day-btn');
const sections = document.querySelectorAll('.day-section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.day;
    buttons.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `#${target}`);
  });
});

const hash = location.hash.replace('#','');
if(hash && document.getElementById(hash)){
  const btn = document.querySelector(`[data-day="${hash}"]`);
  if(btn) btn.click();
}
