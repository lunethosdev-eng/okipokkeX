(()=>{const q=new URLSearchParams(location.search),$=s=>document.querySelector(s),P=window.POKKE;
const a={id:q.get('id'),v:q.get('v'),a:q.get('a'),e:q.get('e'),s:q.get('s')},ok=a.id&&a.v&&['approve','reject'].includes(a.a)&&a.e&&a.s,yes=a.a==='approve';
if(!ok){$('#ttl').textContent='Enlace no válido';$('#go').hidden=true;return}
$('#ttl').textContent=yes?'Aprobar plugin':'Rechazar plugin';$('#sub').textContent=`${a.id} · v${a.v}`;$('#go').textContent=yes?'Confirmar aprobación':'Confirmar rechazo';
const note=t=>{const n=$('#note');n.hidden=false;n.textContent=t};
$('#go').onclick=async()=>{const b=$('#go');b.disabled=true;
 try{const r=await fetch(`${P.url}/functions/v1/review-plugin`,{method:'POST',headers:{'Content-Type':'application/json',apikey:P.key},body:JSON.stringify({approve:a})}),d=await r.json().catch(()=>({}));
  if(r.ok){note(yes?'✅ Plugin aprobado y publicado.':'❌ Plugin rechazado.');b.hidden=true;return}
  note(d.error==='already_processed'?`Este plugin ya fue procesado (${d.status}).`:d.error==='invalid_or_expired'?'El enlace no es válido o venció.':'Error: '+(d.error||r.status));
  if(d.error!=='already_processed')b.disabled=false}
 catch{note('No se pudo conectar.');b.disabled=false}}})();
