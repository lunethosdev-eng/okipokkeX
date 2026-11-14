(()=>{const C=window.POKKE,$=s=>document.querySelector(s),sb=supabase.createClient(C.url,C.key),B='tori-plugin-packages',TV='2026-11-13';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const msg=(t,bad)=>{const m=$('#msg');m.textContent=t;m.hidden=!t;m.style.color=bad?'#d4493e':''};
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
async function list(u){const {data}=await sb.from('plugins').select('id,name,current_version,status,icon_url,review,downloads').eq('owner_id',u.id).order('created_at',{ascending:false});
 $('#mine').innerHTML=(data||[]).map(p=>`<div class="mine-row">${p.icon_url?`<img class="pico" src="${esc(p.icon_url)}" alt="">`:''}<div><b>${esc(p.name)}</b> <span class="tag">v${esc(p.current_version)}</span> <span class="tag">${ST[p.status]||esc(p.status)}</span><br><small>${esc(p.id)} · ${p.downloads} descargas</small>${p.status==='rejected'&&p.review?`<p class="warn">${esc([...(p.review.static?.issues||[]),p.review.ai?.groq?.verdict==='unsafe'?'IA: '+p.review.ai.groq.reason:'',p.review.ai?.openrouter?.verdict==='unsafe'?'IA: '+p.review.ai.openrouter.reason:''].filter(Boolean).join(' · '))}</p>`:''}</div></div>`).join('')||'<p class="lede" style="font-size:13px">Aún no has publicado plugins.</p>'}
$('#pub').onsubmit=async e=>{e.preventDefault();const u=(await sb.auth.getUser()).data.user,f=new FormData(e.target),id=f.get('id').trim().toLowerCase(),ver=f.get('ver').trim(),zip=f.get('zip'),ico=f.get('icon');
 if(!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(id))return msg('ID inválido: minúsculas, números, . _ - (3 a 64).',1);
 if(zip.size>25*1048576)return msg('El ZIP supera 25 MB.',1);if(ico.size>524288)return msg('El icono supera 512 KB.',1);
 try{msg('Subiendo…');const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await zip.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('');
  const up=async(path,file)=>{const {error}=await sb.storage.from(B).upload(path,file,{upsert:false,contentType:file.type||'application/zip'});if(error)throw error;return sb.storage.from(B).getPublicUrl(path).data.publicUrl};
  const base=`${u.id}/${id}/`,pkg=await up(`${base}${ver}.zip`,zip),icon=await up(`${base}icon.${(ico.name.split('.').pop()||'png').toLowerCase()}`,ico);
  const {data:pr}=await sb.from('profiles').select('display_name,username').eq('id',u.id).maybeSingle();
  const author=(pr?.display_name||pr?.username||u.email.split('@')[0]).padEnd(2,'_').slice(0,80);
  let r=await sb.from('plugins').insert({id,owner_id:u.id,name:f.get('name'),description:f.get('desc')||'',category:f.get('cat'),author_name:author,current_version:ver,package_url:pkg,icon_url:icon,sha256:hash,status:'pending'});if(r.error)throw r.error;
  r=await sb.from('plugin_versions').insert({plugin_id:id,version:ver,package_url:pkg,sha256:hash,changelog:f.get('log')||null});if(r.error)throw r.error;
  msg('Analizando el código (verificación automática + 2 IAs)…');
  const {data,error}=await sb.functions.invoke('review-plugin',{body:{plugin_id:id}});if(error)throw error;
  msg(data.status==='published'?'✅ Aprobado y publicado.':data.status==='rejected'?'❌ Rechazado. Revisa los motivos en «Mis plugins».':'⏳ Quedó en revisión manual.',data.status==='rejected');e.target.reset();list(u)}
 catch(x){msg(x.message||String(x),1)}};
sb.auth.getSession().then(({data})=>render(data.session?.user));
})();
