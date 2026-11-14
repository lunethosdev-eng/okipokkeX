(()=>{const P=window.POKKE,q=new URLSearchParams(location.search),$=s=>document.querySelector(s),t=q.get('t')||'',id=q.get('id')||'',embed=q.get('embed')==='1';
const K={profile:'Perfil',song:'Canción',playlist:'Playlist',lyrics:'Letra',box:'Custom box'};document.body.classList.toggle('embed',embed);
if(!K[t]||!/^[A-Za-z0-9_.-]{1,64}$/.test(id)){$('#ttl').textContent='Enlace no válido';$('#open').hidden=true;return}
$('#kind').textContent=K[t].toUpperCase();
const base=location.href.split('?')[0].replace(/[^/]*$/,''),install=base+'index.html#download',e=encodeURIComponent(id),scheme=`pokke://${t}/${e}`,
 android=/android/i.test(navigator.userAgent),mobile=android||/iphone|ipad|ipod/i.test(navigator.userAgent),
 intent=`intent://${t}/${e}#Intent;scheme=pokke;${P.pkg?`package=${P.pkg};`:''}S.browser_fallback_url=${encodeURIComponent(install)};end`;
$('#get').href=install;if(embed)$('#get').target='_blank';
const go=()=>{if(android){location.href=intent;return}location.href=scheme;
 setTimeout(()=>{if(!document.hidden){const n=$('#note');n.hidden=false;n.textContent='No parece que tengas Pokke instalada. Te llevamos a la instalación…';setTimeout(()=>location.href=install,2500)}},1800)};
if(embed){const u=new URL(location.href);u.searchParams.delete('embed');$('#open').href=u.href;$('#open').target='_blank'}
else{$('#open').onclick=ev=>{ev.preventDefault();go()};if(mobile&&q.get('auto')!=='0')setTimeout(go,500)}
const Q={profile:`profiles?select=display_name,username,avatar_url,bio,is_public&username=eq.${e}`,song:`tracks?select=title,artist,cover_url&id=eq.${e}`,lyrics:`tracks?select=title,artist,cover_url&id=eq.${e}`,playlist:`playlists?select=name,description,cover_url,is_public&id=eq.${e}`}[t];
if(Q)fetch(`${P.url}/rest/v1/${Q}&limit=1`,{headers:{apikey:P.key}}).then(r=>r.ok?r.json():[]).then(([d])=>{if(!d)return;
 if(d.is_public===false){$('#ttl').textContent=t==='profile'?'Perfil privado':'Playlist privada';return}
 $('#ttl').textContent=d.title||d.name||d.display_name||d.username||'Pokke';
 $('#sub').textContent=t==='profile'?(d.bio||'@'+d.username):t==='playlist'?(d.description||''):(d.artist||'')+(t==='lyrics'?' · Letra':'');
 const i=d.cover_url||d.avatar_url;if(i&&/^https:\/\//.test(i)){$('#cv').src=i;$('#cv').hidden=false}}).catch(()=>{});
})();
