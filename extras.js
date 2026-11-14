(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fine=matchMedia('(pointer:fine)').matches,calm=matchMedia('(prefers-reduced-motion:reduce)').matches,root=document.documentElement;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!$('#language-toggle')){ // subpages: home's app.js owns theme/menu
 if(localStorage.getItem('pokke-theme')==='dark')root.dataset.theme='dark';
 $('#theme-toggle')?.addEventListener('click',()=>{const d=root.dataset.theme==='dark';d?delete root.dataset.theme:root.dataset.theme='dark';localStorage.setItem('pokke-theme',d?'light':'dark')});
 $('#mobile-menu')?.addEventListener('click',()=>$('.nav-links').classList.toggle('open'));
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.1});
 $$('.rv').forEach((el,i)=>{el.style.setProperty('--d',i%6);io.observe(el)});
 const y=$('#year');if(y)y.textContent=new Date().getFullYear();
}
$$('.nav-links a').forEach((a,i)=>a.style.setProperty('--i',i));
if(fine&&!calm){let last=null;
 document.addEventListener('pointermove',e=>{const g=e.target.closest?.('.glass');if(g){const r=g.getBoundingClientRect();g.style.setProperty('--mx',e.clientX-r.left+'px');g.style.setProperty('--my',e.clientY-r.top+'px')}
  const b=e.target.closest?.('.button,.nav-cta');if(last&&last!==b)last.style.translate='';
  if(b){const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.12}px ${(e.clientY-r.top-r.height/2)*.2}px`}last=b},{passive:true});}
// legal: scroll-spy
const toc=$$('.toc a');if(toc.length){const so=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)toc.forEach(a=>a.classList.toggle('on',a.hash==='#'+x.target.id))}),{rootMargin:'-30% 0px -60% 0px'});$$('.legal section').forEach(s=>so.observe(s))}
// android tv: enable download when a TV apk is published
addEventListener('pokke:releases',e=>{for(const r of e.detail){const a=r.assets.find(x=>/\.apk$/i.test(x.name)&&/tv/i.test(x.name));if(a){const b=$('#tv-download'),s=$('#tv-status');if(b){b.href=a.browser_download_url;b.textContent='Descargar APK para TV'}if(s){s.textContent='Disponible';s.classList.remove('soon');s.classList.add('available')}break}}});
// plugins
const cnt=p=>fetch(`${POKKE.url}/rest/v1/rpc/plugin_download`,{method:'POST',headers:{apikey:POKKE.key,'Content-Type':'application/json'},body:JSON.stringify({p_id:p.id})}).catch(()=>{});
const grid=$('#plug-grid');if(grid){let data=[],cat='all',q='',timer;const pm=$('#pm');
 const draw=()=>{const l=data.filter(p=>(cat==='all'||p.cat===cat)&&(p.name+p.desc).toLowerCase().includes(q));
  grid.innerHTML=l.length?l.map((p,i)=>`<article class="plug glass" style="animation:menuItem .6s var(--ease) both;animation-delay:${i*60}ms">${p.icon?`<img class="pico" src="${esc(p.icon)}" alt="" loading="lazy">`:''}<span class="tag">${esc(p.cat.toUpperCase())}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><small>v${esc(p.ver)} · ${esc(p.author)}</small><button class="button button-dark" data-id="${esc(p.id)}" type="button">Instalar</button></article>`).join(''):'<p class="lede">No hay plugins que coincidan.</p>'};
 fetch(`${POKKE.url}/rest/v1/plugins?select=id,name,description,category,author_name,current_version,icon_url,package_url&status=eq.published&order=downloads.desc`,{headers:{apikey:POKKE.key}}).then(r=>r.json()).then(d=>{data=d.map(p=>({id:p.id,name:p.name,desc:p.description,cat:p.category,ver:p.current_version,author:p.author_name,zip:p.package_url,icon:p.icon_url}));draw()}).catch(()=>{grid.innerHTML='<p class="lede">No se pudo cargar el catálogo.</p>'});
 $('#plug-q').addEventListener('input',e=>{q=e.target.value.toLowerCase().trim();draw()});
 $$('.chip[data-cat]').forEach(c=>c.addEventListener('click',()=>{cat=c.dataset.cat;$$('.chip[data-cat]').forEach(x=>x.classList.toggle('on',x===c));draw()}));
 const close=()=>{pm.hidden=true;clearTimeout(timer);document.body.style.overflow=''};
 grid.addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;const p=data.find(x=>x.id===b.dataset.id);if(!p)return;
  $('#pm-title').textContent=p.name;$('#pm-ver').textContent='v'+p.ver;$('#pm-help').hidden=true;$('#pm-miss').hidden=true;
  const url=new URL(p.zip,location.href).href;$('#pm-zip').href=p.zip;$('#pm-zip').setAttribute('download',p.id+'.zip');
  $('#pm-app').onclick=ev=>{ev.preventDefault();cnt(p);clearTimeout(timer);location.href=`pokke://plugin/install?id=${encodeURIComponent(p.id)}&url=${encodeURIComponent(url)}`;
   timer=setTimeout(()=>{if(!document.hidden){$('#pm-miss').hidden=false;$('#pm-help').hidden=false}},1800)};
  $('#pm-zip').onclick=()=>{cnt(p);$('#pm-miss').hidden=true;$('#pm-help').hidden=false};
  pm.hidden=false;document.body.style.overflow='hidden';$('#pm-close').focus()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer)});
 $('#pm-close').addEventListener('click',close);pm.addEventListener('click',e=>{if(e.target===pm)close()});addEventListener('keydown',e=>{if(e.key==='Escape'&&!pm.hidden)close()});}
})();
