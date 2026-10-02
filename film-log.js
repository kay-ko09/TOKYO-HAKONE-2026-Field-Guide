// v17.1 — film inventory lives only on the dedicated Film Log page.
(() => {
  const wrap=document.getElementById('filmCounter');
  const out=document.getElementById('filmCount');
  const status=document.getElementById('filmStatus');
  if(!wrap||!out||!status) return;
  const key='tokyoHakoneFilmRolls';
  let n=parseInt(localStorage.getItem(key) ?? '6',10);
  if(!Number.isFinite(n)||n<0) n=6;
  function render(){
    out.textContent=n;
    wrap.classList.toggle('low',n>0&&n<=2);
    wrap.classList.toggle('empty',n===0);
    status.textContent=n===0?'EMPTY · 需要補貨':n<=2?'LOW FILM · 下一個機會補貨':n<=4?'WATCH SUPPLY · 留意補給點':`READY · ${n} ROLLS REMAINING`;
    localStorage.setItem(key,String(n));
  }
  document.getElementById('filmMinus')?.addEventListener('click',()=>{n=Math.max(0,n-1);render();});
  document.getElementById('filmPlus')?.addEventListener('click',()=>{n+=1;render();});
  document.getElementById('filmReset')?.addEventListener('click',()=>{n=6;render();});
  render();
})();

(() => {
  const KEY='tokyo-film-log-v1';
  const list=document.getElementById('rollList');
  const template=document.getElementById('rollTemplate');
  const rollCount=document.getElementById('rollCount');
  const frameNoted=document.getElementById('frameNoted');
  let data=[];

  const uid=()=>`r${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
  const blankFrames=(n=36)=>Array.from({length:n},()=>({date:'',note:''}));
  const newRoll=()=>({id:uid(),name:'',film:'',iso:'',camera:'',loaded:'',finished:'',frames:36,status:'loaded',note:'',shots:blankFrames(36),collapsed:false});
  function load(){try{const raw=localStorage.getItem(KEY);data=raw?JSON.parse(raw):[];if(!Array.isArray(data))data=[];}catch{data=[];}}
  function save(){localStorage.setItem(KEY,JSON.stringify(data));updateStats();}
  function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function updateStats(){rollCount.textContent=data.length;frameNoted.textContent=data.reduce((n,r)=>n+(r.shots||[]).filter(x=>x.note?.trim()).length,0);}
  function normalize(r){r.frames=Number(r.frames)||36;r.shots=Array.isArray(r.shots)?r.shots:[];while(r.shots.length<r.frames)r.shots.push({date:'',note:''});if(r.shots.length>r.frames)r.shots=r.shots.slice(0,r.frames);return r;}

  function render(){list.innerHTML='';if(!data.length){list.innerHTML='<div class="empty"><b>還沒有底片紀錄</b><br>按「＋ NEW ROLL」建立第一捲。</div>';updateStats();return;}
    data.forEach((r,i)=>{normalize(r);const frag=template.content.cloneNode(true);const card=frag.querySelector('.roll-card');card.dataset.id=r.id;if(r.collapsed)card.classList.add('collapsed');
      frag.querySelector('.roll-index').textContent=`ROLL ${String(i+1).padStart(2,'0')} · ${r.status.toUpperCase()}`;
      frag.querySelector('.roll-title').textContent=r.name||r.film||'UNTITLED ROLL';
      frag.querySelector('.collapse').textContent=r.collapsed?'＋':'−';
      frag.querySelectorAll('[data-field]').forEach(el=>{const f=el.dataset.field;el.value=r[f]??'';});
      const frames=frag.querySelector('.frames');
      r.shots.forEach((shot,idx)=>{const row=document.createElement('div');row.className='frame-row'+(shot.note?.trim()?' noted':'');row.innerHTML=`<div class="frame-no">#${idx+1}</div><input class="frame-date" type="date" value="${esc(shot.date)}" aria-label="Frame ${idx+1} date"><input class="frame-note" value="${esc(shot.note)}" placeholder="拍了什麼？地點 / 人物 / 畫面" aria-label="Frame ${idx+1} note">`;frames.appendChild(row);});
      const noted=r.shots.filter(x=>x.note?.trim()).length;frag.querySelector('.frame-progress').textContent=`${noted} / ${r.frames} noted`;
      list.appendChild(frag);
    });updateStats();}

  function findRoll(el){const card=el.closest('.roll-card');return data.find(r=>r.id===card?.dataset.id);}
  list.addEventListener('input',e=>{const r=findRoll(e.target);if(!r)return;
    if(e.target.matches('[data-field]')){const f=e.target.dataset.field;r[f]=e.target.value;if(f==='frames'){r.frames=Number(e.target.value);normalize(r);render();}else{save();const card=e.target.closest('.roll-card');if(f==='name'||f==='film')card.querySelector('.roll-title').textContent=r.name||r.film||'UNTITLED ROLL';}}
    if(e.target.matches('.frame-date,.frame-note')){const row=e.target.closest('.frame-row');const idx=[...row.parentElement.children].indexOf(row);if(e.target.classList.contains('frame-date'))r.shots[idx].date=e.target.value;else r.shots[idx].note=e.target.value;save();row.classList.toggle('noted',!!r.shots[idx].note.trim());const card=e.target.closest('.roll-card');card.querySelector('.frame-progress').textContent=`${r.shots.filter(x=>x.note?.trim()).length} / ${r.frames} noted`;}
  });
  list.addEventListener('change',e=>{if(e.target.matches('[data-field]')){const r=findRoll(e.target);if(r){r[e.target.dataset.field]=e.target.value;save();}}});
  list.addEventListener('click',e=>{const r=findRoll(e.target);if(!r)return;
    if(e.target.closest('.collapse')){r.collapsed=!r.collapsed;save();render();}
    if(e.target.closest('.delete')){if(confirm(`刪除「${r.name||r.film||'這捲底片'}」及全部拍攝紀錄？`)){data=data.filter(x=>x.id!==r.id);save();render();}}
    if(e.target.closest('.duplicate')){const copy=JSON.parse(JSON.stringify(r));copy.id=uid();copy.name=(r.name||r.film||'ROLL')+' COPY';copy.loaded='';copy.finished='';copy.status='loaded';copy.shots=blankFrames(copy.frames);data.push(copy);save();render();}
    if(e.target.closest('.fill-date')){const today=new Date().toISOString().slice(0,10);r.shots.forEach(s=>{if(!s.date)s.date=today;});save();render();}
  });
  document.getElementById('addRoll').addEventListener('click',()=>{data.push(newRoll());save();render();setTimeout(()=>list.lastElementChild?.scrollIntoView({behavior:'smooth',block:'start'}),30);});
  document.getElementById('exportData').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),rolls:data},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`tokyo-film-log-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
  document.getElementById('importData').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const obj=JSON.parse(await f.text());const rolls=Array.isArray(obj)?obj:obj.rolls;if(!Array.isArray(rolls))throw new Error();if(!confirm(`匯入 ${rolls.length} 捲紀錄？目前資料會被取代。`))return;data=rolls.map(normalize);save();render();}catch{alert('無法讀取這個備份檔。');}finally{e.target.value='';}});
  load();render();
})();
