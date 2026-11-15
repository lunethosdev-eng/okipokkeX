(()=>{const C=window.POKKE,$=s=>document.querySelector(s),sb=supabase.createClient(C.url,C.key),B='tori-plugin-packages',TV='2026-11-13';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cmpv=(a,b)=>{const x=a.split(/[.+-]/).slice(0,3).map(Number),y=b.split(/[.+-]/).slice(0,3).map(Number);for(let i=0;i<3;i++)if((x[i]||0)!==(y[i]||0))return(x[i]||0)>(y[i]||0)?1:-1;return 0};
const msg=(t,bad)=>{const m=$('#msg');m.textContent=t;m.hidden=!t;m.style.color=bad?'#d4493e':''};
const STEPS=[['upload','Subiendo archivos'],['register','Registrando el plugin'],['fetch','Descargando el paquete'],['hash','Comprobando integridad (SHA-256)'],['scan','Analizando archivos y manifiesto'],['groq','Revisión con IA · Groq'],['openrouter','Revisión con IA · OpenRouter'],['decide','Decisión final'],['notify','Aviso al revisor (correo)']];
let cur=null;
const initSteps=()=>{const o=$('#steps');o.hidden=false;o.innerHTML=STEPS.map(([k,l])=>`<li data-s="${k}"><i></i><span>${l}<small></small></span></li>`).join('')};
const step=(k,st,d)=>{const li=$(`#steps [data-s="${k}"]`);if(!li)return;li.className=st;if(st==='run')cur=k;if(d!=null)li.querySelector('small').textContent=d};
let mode='in';document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('on',x===b));$('#auth-go').textContent=mode==='in'?'Entrar':'Crear cuenta'});
$('#auth-form').onsubmit=async e=>{e.preventDefault();const email=$('#email').value.trim(),password=$('#pass').value;
 const r=mode==='in'?await sb.auth.signInWithPassword({email,password}):await sb.auth.signUp({email,password});
 const b=$('#auth-go');if(r.error){b.textContent=r.error.message;setTimeout(()=>b.textContent=mode==='in'?'Entrar':'Crear cuenta',3500)}else if(!r.data.session)b.textContent='Confirma tu correo y entra'};
$('#logout').onclick=()=>sb.auth.signOut();
sb.auth.onAuthStateChange((_,s)=>setTimeout(()=>render(s?.user),0));
const reqs=[...document.querySelectorAll('.req')];reqs.forEach(c=>c.onchange=()=>$('#accept').disabled=!reqs.every(x=>x.checked));
$('#accept').onclick=async()=>{const {error}=await sb.rpc('accept_dev_terms',{p_version:TV});if(error)return alert(error.message);render((await sb.auth.getUser()).data.user)};
async function render(user){$('#auth').hidden=!!user;$('#dash').hidden=!user;if(!user)return;$('#who').textContent=user.email;
 const {data:ag}=await sb.from('dev_agreements').select('terms_version').eq('user_id',user.id).maybeSingle();
 $('#gate').hidden=!!ag;$('#dev').hidden=!ag;$('#badge').hidden=!ag;if(ag)list(user)}
const ST={pending:'En revisión',published:'Publicado',rejected:'Rechazado',suspended:'Suspendido'};
const why=r=>r?[...(r.static?.issues||[]),...['groq','openrouter'].map(k=>r.ai?.[k]?.verdict==='unsafe'?'IA: '+r.ai[k].reason:'')].filter(Boolean).join(' · '):'';
async function list(u){const {data:ps}=await sb.from('plugins').select('id,name,current_version,status,icon_url,review,downloads').eq('owner_id',u.id).order('created_at',{ascending:false});
 const ids=(ps||[]).map(p=>p.id);const {data:vs}=ids.length?await sb.from('plugin_versions').select('plugin_id,version,status,review,created_at').in('plugin_id',ids).order('created_at',{ascending:false}):{data:[]};
 $('#mine').innerHTML=(ps||[]).map(p=>{const mv=(vs||[]).filter(v=>v.plugin_id===p.id),bad=mv.find(v=>v.status==='rejected');
  return `<div class="mine-row">${p.icon_url?`<img class="pico" src="${esc(p.icon_url)}" alt="">`:''}<div style="flex:1;min-width:0"><b>${esc(p.name)}</b> <span class="tag st-${esc(p.status)}">${ST[p.status]||esc(p.status)}</span><br><small>${esc(p.id)} · ${p.downloads} descargas</small><div class="vers">${mv.map(v=>`<span class="tag st-${esc(v.status)}" title="${ST[v.status]||''}">v${esc(v.version)}${v.version===p.current_version&&p.status==='published'?' · actual':''}</span>`).join('')}</div>${p.status==='rejected'?`<p class="warn">${esc(why(p.review))}</p>`:bad?`<p class="warn">v${esc(bad.version)}: ${esc(why(bad.review))}</p>`:''}<button class="chip nv" data-id="${esc(p.id)}" type="button" style="height:34px;margin-top:8px">${p.status==='published'?'Nueva versión':p.status==='rejected'?'Reintentar':'Reenviar'}</button></div></div>`}).join('')||'<p class="lede" style="font-size:13px">Aún no has publicado plugins.</p>'}
$('#mine').addEventListener('click',e=>{const b=e.target.closest('.nv');if(!b)return;const f=$('#pub');f.elements.id.value=b.dataset.id;f.elements.ver.focus();f.scrollIntoView({behavior:'smooth',block:'center'})});
$('#pub').onsubmit=async e=>{e.preventDefault();const form=e.target,f=new FormData(form),id=f.get('id').trim().toLowerCase(),ver=f.get('ver').trim(),zip=f.get('zip'),ico=f.get('icon');
 if(!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(id))return msg('ID inválido: minúsculas, números, . _ - (3 a 64).',1);
 if(zip.size>25*1048576)return msg('El ZIP supera 25 MB.',1);if(ico&&ico.size>524288)return msg('El icono supera 512 KB.',1);
 const btn=form.querySelector('[type=submit]');btn.disabled=true;msg('');initSteps();cur=null;
 try{const u=(await sb.auth.getUser()).data.user;
  const {data:ex}=await sb.from('plugins').select('id,status,current_version').eq('id',id).eq('owner_id',u.id).maybeSingle();
  const upd=ex?.status==='published';
  if(upd&&cmpv(ver,ex.current_version)<=0)throw new Error(`La versión debe ser mayor que la actual (${ex.current_version}).`);
  if(!upd&&!(ico&&ico.size))throw new Error('El icono es obligatorio en un plugin nuevo.');
  if(ex&&!upd){const {error}=await sb.rpc('delete_own_unpublished_plugin',{p_id:id});if(error)throw error}
  step('upload','run');
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await zip.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('');
  const up=async(path,file)=>{const {error}=await sb.storage.from(B).upload(path,file,{upsert:true,contentType:file.type||'application/zip'});if(error)throw error;return sb.storage.from(B).getPublicUrl(path).data.publicUrl};
  const base=`${u.id}/${id}/`,pkg=await up(`${base}${ver}.zip`,zip),icon=upd?null:await up(`${base}icon.${(ico.name.split('.').pop()||'png').toLowerCase()}`,ico);
  step('upload','ok',`${(zip.size/1048576).toFixed(2)} MB`);step('register','run');
  if(!upd){const {data:pr}=await sb.from('profiles').select('display_name,username').eq('id',u.id).maybeSingle();
   const author=(pr?.display_name||pr?.username||u.email.split('@')[0]).padEnd(2,'_').slice(0,80);
   const r=await sb.from('plugins').insert({id,owner_id:u.id,name:f.get('name'),description:f.get('desc')||'',category:f.get('cat'),author_name:author,current_version:ver,package_url:pkg,icon_url:icon,sha256:hash,status:'pending'});
   if(r.error)throw new Error(r.error.code==='23505'?'Ese ID ya está en uso por otro plugin.':r.error.message)}
  const rv=await sb.from('plugin_versions').insert({plugin_id:id,version:ver,package_url:pkg,sha256:hash,changelog:f.get('log')||''});
  if(rv.error)throw new Error(rv.error.code==='23505'?'Esa versión ya existe; sube una mayor.':rv.error.message);
  step('register','ok');
  const tok=(await sb.auth.getSession()).data.session.access_token;
  const r=await fetch(`${C.url}/functions/v1/review-plugin`,{method:'POST',headers:{'Content-Type':'application/json',apikey:C.key,Authorization:'Bearer '+tok},body:JSON.stringify({plugin_id:id,version:ver})});
  if(!r.ok||!r.body)throw new Error((await r.json().catch(()=>({}))).error||'No se pudo iniciar la revisión.');
  const rd=r.body.getReader(),dec=new TextDecoder();let buf='',fin=null;
  for(;;){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let i;
   while((i=buf.indexOf('\n'))>=0){const l=buf.slice(0,i).trim();buf=buf.slice(i+1);if(!l)continue;const m=JSON.parse(l);if(m.error)throw new Error(m.error);if(m.step)step(m.step,m.state,m.detail);if(m.done)fin=m}}
  if(!fin)throw new Error('La revisión terminó sin resultado.');
  msg(fin.status==='published'?(upd?'✅ Nueva versión publicada.':'✅ Aprobado y publicado.'):fin.status==='rejected'?'❌ Rechazado: '+(why(fin.review)||'revisión de IA'):(upd?'⏳ Quedó en revisión manual; la versión actual sigue publicada.':'⏳ Quedó en revisión manual. Se publicará cuando se apruebe.'),fin.status==='rejected');
  form.reset();list(u)}
 catch(x){if(cur)step(cur,'fail');msg(x.message||String(x),1)}
 btn.disabled=false};
sb.auth.getSession().then(({data})=>render(data.session?.user));
})();
