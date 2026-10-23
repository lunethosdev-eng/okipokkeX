document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const root = document.documentElement;
  const languageButton = $('#language-toggle');
  const translations = {
    es: {
      navExperience:'Experiencia',navPreview:'Vista previa',navCommunity:'Comunidad',navAbout:'Nosotros',navDownload:'Descargar',
      eyebrow:'UNA NUEVA FORMA DE ESCUCHAR',heroTitle:'Tu música.<br><span class="muted-heading">Tus reglas.</span>',
      heroBody:'Una experiencia musical diseñada para sentirse tuya. Descubre, organiza y reproduce tus canciones desde un espacio limpio, cuidado y sin distracciones.',
      getApp:'Conoce Pokke',explore:'Explorar la experiencia',androidNote:'Diseñado para Android · APK',yourLibrary:'Tu biblioteca',alwaysYours:'Siempre a tu manera',soundOn:'El sonido, en primer plano',listenYourWay:'Escucha a tu ritmo',scroll:'DESCUBRE POKKE',
      statementKicker:'MENOS RUIDO. MÁS MÚSICA.',statementTitle:'La música es el centro.<br><span class="serif">Todo lo demás, no.</span>',statementBody:'Pokke apuesta por una interfaz serena, controles claros y una experiencia que deja espacio para lo importante: lo que estás escuchando.',
      featuresKicker:'HECHO PARA ESCUCHAR',featuresTitle:'Una experiencia con intención.',featuresIntro:'Cada detalle tiene un propósito: hacer que escuchar música se sienta sencillo otra vez.',
      featureOneTitle:'Tu espacio musical',featureOneBody:'Una biblioteca visual, portadas protagonistas y una interfaz pensada para acompañarte.',featureTwoTitle:'Diseño que respira',featureTwoBody:'Transiciones suaves, superficies translúcidas y modos claro y oscuro para elegir tu ambiente.',featureThreeTitle:'En evolución',featureThreeBody:'Un proyecto independiente que crece con ideas, comentarios y nuevas versiones.',
      previewKicker:'MIRA MÁS DE CERCA',previewTitle:'Cada píxel, con intención.',previewIntro:'Explora algunas pantallas de la aplicación. Toca una imagen para verla completa.',screenPlayer:'Reproductor',screenPlayerSub:'El sonido en el centro',screenLibrary:'Biblioteca',screenLibrarySub:'Todo en su lugar',screenLyrics:'Letras',screenLyricsSub:'Sigue cada momento',screenProfile:'Perfil',screenProfileSub:'Hazlo tuyo',
      listenKicker:'ESCUCHA UNA MUESTRA',listenTitle:'Dale al play.<br><span class="serif">Quédate un rato.</span>',listenBody:'Prueba el reproductor de la web con las pistas incluidas en este proyecto. La disponibilidad depende de que los archivos de audio estén completos.',audioReady:'Preparando reproductor…',nowPlaying:'REPRODUCIENDO EN LA WEB',
      downloadKicker:'TU PRÓXIMO PLAY EMPIEZA AQUÍ',downloadTitle:'Conoce Pokke.',downloadBody:'Consulta las versiones publicadas y descarga el APK desde los lanzamientos oficiales del proyecto.',loadingReleases:'Buscando la última versión…',viewReleases:'Ver lanzamientos ↗',releaseTitle:'Versiones publicadas',allReleases:'Ver todas ↗',loadingVersions:'Cargando versiones…',
      communityKicker:'CRECEMOS CON LA COMUNIDAD',communityTitle:'Las buenas ideas se comparten.',communityBody:'Únete a la conversación, comparte sugerencias y acompaña el desarrollo de Pokke.',discordSoon:'Discord próximamente',discordNote:'El enlace de invitación de Discord se añadirá aquí cuando esté disponible.',
      aboutKicker:'DE UN ESTUDIO INDEPENDIENTE',aboutTitle:'Pequeño equipo.<br><span class="serif">Grandes ganas de crear.</span>',aboutBody:'Pokke nace de la curiosidad y las ganas de construir una experiencia musical diferente. Detrás del proyecto hay un desarrollador que lleva la dirección y el desarrollo, y un amigo que aporta ideas y comentarios para seguir mejorando.',studioLabel:'Estudio independiente · Proyecto en desarrollo',footerLine:'Hecho con intención por Nakama Studio.',
      trackUnavailable:'Este archivo de audio está vacío o no se puede reproducir. Sustituye el MP3 de muestra por el archivo completo.',audioError:'No se pudo cargar el audio. Comprueba que el archivo exista y sea válido.',noReleases:'Todavía no hay lanzamientos publicados.',stable:'Estable',beta:'Beta',getApk:'Descargar APK',viewGithub:'Ver en GitHub',releaseFallback:'Consulta las versiones en GitHub Releases.',menuOpen:'Abrir menú',menuClose:'Cerrar menú'
    },
    en: {
      navExperience:'Experience',navPreview:'Preview',navCommunity:'Community',navAbout:'About',navDownload:'Download',
      eyebrow:'A NEW WAY TO LISTEN',heroTitle:'Your music.<br><span class="muted-heading">Your rules.</span>',
      heroBody:'A music experience designed to feel like yours. Discover, organize, and play your songs in a clean, considered space without distractions.',
      getApp:'Meet Pokke',explore:'Explore the experience',androidNote:'Designed for Android · APK',yourLibrary:'Your library',alwaysYours:'Always your way',soundOn:'Sound takes center stage',listenYourWay:'Listen at your pace',scroll:'DISCOVER POKKE',
      statementKicker:'LESS NOISE. MORE MUSIC.',statementTitle:'Music is the center.<br><span class="serif">Everything else is not.</span>',statementBody:'Pokke focuses on a calm interface, clear controls, and an experience that leaves room for what matters: what you are listening to.',
      featuresKicker:'MADE FOR LISTENING',featuresTitle:'An experience with intention.',featuresIntro:'Every detail has a purpose: making listening to music feel simple again.',
      featureOneTitle:'Your music space',featureOneBody:'A visual library, cover art in focus, and an interface designed to be with you.',featureTwoTitle:'A design that breathes',featureTwoBody:'Soft transitions, translucent surfaces, and light and dark modes to set your mood.',featureThreeTitle:'Always evolving',featureThreeBody:'An independent project growing through ideas, feedback, and new releases.',
      previewKicker:'TAKE A CLOSER LOOK',previewTitle:'Every pixel, with purpose.',previewIntro:'Explore a few app screens. Tap an image to view it in full.',screenPlayer:'Player',screenPlayerSub:'Sound at the center',screenLibrary:'Library',screenLibrarySub:'Everything in its place',screenLyrics:'Lyrics',screenLyricsSub:'Follow every moment',screenProfile:'Profile',screenProfileSub:'Make it yours',
      listenKicker:'LISTEN TO A SAMPLE',listenTitle:'Press play.<br><span class="serif">Stay a while.</span>',listenBody:'Try the web player with the tracks included in this project. Playback depends on the audio files being complete.',audioReady:'Preparing player…',nowPlaying:'NOW PLAYING ON THE WEB',
      downloadKicker:'YOUR NEXT PLAY STARTS HERE',downloadTitle:'Meet Pokke.',downloadBody:'Browse published versions and download the APK from the project’s official releases.',loadingReleases:'Looking for the latest version…',viewReleases:'View releases ↗',releaseTitle:'Published versions',allReleases:'View all ↗',loadingVersions:'Loading versions…',
      communityKicker:'GROWING WITH THE COMMUNITY',communityTitle:'Good ideas are meant to be shared.',communityBody:'Join the conversation, share suggestions, and follow Pokke’s development.',discordSoon:'Discord coming soon',discordNote:'The Discord invite link will be added here when it is available.',
      aboutKicker:'FROM AN INDEPENDENT STUDIO',aboutTitle:'Small team.<br><span class="serif">Big reasons to create.</span>',aboutBody:'Pokke comes from curiosity and the desire to build a different music experience. Behind the project is one developer leading its direction and development, alongside a friend who contributes ideas and feedback to help it improve.',studioLabel:'Independent studio · Project in development',footerLine:'Made with intention by Nakama Studio.',
      trackUnavailable:'This audio file is empty or cannot be played. Replace the sample MP3 with the complete audio file.',audioError:'The audio could not be loaded. Check that the file exists and is valid.',noReleases:'There are no published releases yet.',stable:'Stable',beta:'Beta',getApk:'Download APK',viewGithub:'View on GitHub',releaseFallback:'Browse versions on GitHub Releases.',menuOpen:'Open menu',menuClose:'Close menu'
    }
  };
  let lang = localStorage.getItem('pokke-language') || 'es';
  let currentTrackIndex = 0;
  const tracks = [
    {title:'EoO',artist:'Bad Bunny',src:'assets/music/track1.mp3',cover:'assets/music/covers/cover1.jpg'},
    {title:'Contigo',artist:'Los Panchos',src:'assets/music/track2.mp3',cover:'assets/music/covers/cover2.jpg'},
    {title:'From the Start',artist:'Laufey',src:'assets/music/track3.mp3',cover:'assets/music/covers/cover3.jpg'},
    {title:'Jane!',artist:'Jane!',src:'assets/music/track4.mp3',cover:'assets/music/covers/cover4.jpg'}
  ];
  const audio = $('#audio-element'), playBtn = $('#btn-play'), seek = $('#seek');
  const title = $('#current-title'), artist = $('#current-artist'), cover = $('#current-cover');
  const status = $('#audio-status'), trackList = $('#track-list');
  const t = key => translations[lang][key] || translations.es[key] || key;

  function applyLanguage(next) {
    lang = next;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { const value = t(el.dataset.i18n); if(value) el.textContent = value; });
    $$('[data-i18n-html]').forEach(el => { const value = t(el.dataset.i18nHtml); if(value) el.innerHTML = value; });
    languageButton.textContent = lang === 'es' ? 'EN' : 'ES';
    languageButton.setAttribute('aria-label', lang === 'es' ? 'Change language' : 'Cambiar idioma');
    localStorage.setItem('pokke-language', lang);
    renderTrackList();
    loadTrack(currentTrackIndex, false);
    $('#mobile-menu').setAttribute('aria-label', t('menuOpen'));
    if(status.dataset.state === 'missing') status.textContent = t('trackUnavailable');
    if(status.dataset.state === 'error') status.textContent = t('audioError');
  }
  languageButton.addEventListener('click', () => applyLanguage(lang === 'es' ? 'en' : 'es'));

  const savedTheme = localStorage.getItem('pokke-theme');
  if (savedTheme === 'dark') root.dataset.theme = 'dark';
  $('#theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if(next === 'dark') root.dataset.theme = 'dark'; else delete root.dataset.theme;
    localStorage.setItem('pokke-theme', next);
    $('#theme-toggle').setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  const nav = $('.nav-links'), menuBtn = $('#mobile-menu');
  menuBtn.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-label', open ? t('menuClose') : t('menuOpen')); });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), {threshold:.12});
  $$('.reveal').forEach(el => observer.observe(el));

  function renderTrackList() {
    trackList.innerHTML = '';
    tracks.forEach((track, index) => {
      const row = document.createElement('button');
      row.type = 'button'; row.className = `track-row${index === currentTrackIndex ? ' active' : ''}`;
      row.setAttribute('aria-label', `${track.title} — ${track.artist}`);
      const img = document.createElement('img'); img.src = track.cover; img.alt = '';
      const meta = document.createElement('span'); meta.className = 'track-meta';
      const b = document.createElement('b'); b.textContent = track.title;
      const small = document.createElement('small'); small.textContent = track.artist;
      meta.append(b, small);
      const number = document.createElement('span'); number.className = 'track-number'; number.textContent = String(index+1).padStart(2,'0');
      row.append(img, meta, number); row.addEventListener('click', () => { currentTrackIndex=index; loadTrack(index, true); });
      trackList.appendChild(row);
    });
  }
  function loadTrack(index, autoplay) {
    const track = tracks[index];
    audio.pause(); audio.src = track.src; audio.load();
    title.textContent = track.title; artist.textContent = track.artist; cover.src = track.cover;
    playBtn.classList.remove('is-playing'); playBtn.setAttribute('aria-label', lang==='es'?'Reproducir':'Play');
    $('#time-current').textContent = '0:00'; $('#time-duration').textContent = '0:00'; seek.value = 0;
    status.dataset.state = 'ready'; status.textContent = t('audioReady');
    $$('.track-row').forEach((row,i) => row.classList.toggle('active', i===index));
    if(autoplay) attemptPlay();
  }
  async function attemptPlay() {
    try { await audio.play(); playBtn.classList.add('is-playing'); playBtn.setAttribute('aria-label',lang==='es'?'Pausar':'Pause'); status.dataset.state='playing'; status.textContent=''; }
    catch(err) {
      playBtn.classList.remove('is-playing');
      if(audio.error || audio.readyState === 0) { status.dataset.state='missing'; status.textContent=t('trackUnavailable'); }
    }
  }
  playBtn.addEventListener('click', () => { if(audio.paused) attemptPlay(); else {audio.pause();playBtn.classList.remove('is-playing');playBtn.setAttribute('aria-label',lang==='es'?'Reproducir':'Play');} });
  $('#btn-prev').addEventListener('click', () => {currentTrackIndex=(currentTrackIndex-1+tracks.length)%tracks.length;loadTrack(currentTrackIndex,true);});
  $('#btn-next').addEventListener('click', () => {currentTrackIndex=(currentTrackIndex+1)%tracks.length;loadTrack(currentTrackIndex,true);});
  audio.addEventListener('play', () => playBtn.classList.add('is-playing'));
  audio.addEventListener('pause', () => playBtn.classList.remove('is-playing'));
  audio.addEventListener('loadedmetadata', () => { $('#time-duration').textContent = formatTime(audio.duration); status.dataset.state='loaded'; status.textContent=''; });
  audio.addEventListener('timeupdate', () => { $('#time-current').textContent=formatTime(audio.currentTime); if(Number.isFinite(audio.duration)&&audio.duration>0) seek.value=String(Math.round(audio.currentTime/audio.duration*1000)); });
  audio.addEventListener('ended', () => {currentTrackIndex=(currentTrackIndex+1)%tracks.length;loadTrack(currentTrackIndex,true);});
  audio.addEventListener('error', () => {status.dataset.state='missing';status.textContent=t('trackUnavailable');});
  seek.addEventListener('input', () => {if(Number.isFinite(audio.duration)&&audio.duration>0) audio.currentTime=(Number(seek.value)/1000)*audio.duration;});
  function formatTime(value){if(!Number.isFinite(value))return '0:00';return `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;}

  // Screenshot lightbox: images use contain so the entire screen is visible.
  const modal = $('#image-modal'), modalImage = $('#modal-image');
  $$('.screen-card').forEach(card => card.addEventListener('click', () => {
    modalImage.src = card.dataset.fullImage; modalImage.alt = card.dataset.imageTitle || '';
    $('#modal-caption').textContent = card.dataset.imageTitle || '';
    modal.hidden = false; document.body.style.overflow='hidden'; $('#modal-close').focus();
  }));
  function closeModal(){modal.hidden=true;document.body.style.overflow='';}
  $('#modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => {if(e.target===modal)closeModal();});
  document.addEventListener('keydown', e => {if(e.key==='Escape'&&!modal.hidden)closeModal();});
  $('#year').textContent = new Date().getFullYear();

  async function loadReleases(){
    const owner='lunethosdev-eng', repo='okipokkeX';
    const latestTarget=$('#latest-download-container'), list=$('#versions-list');
    try{
      const response=await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
      if(!response.ok)throw new Error('GitHub releases unavailable');
      const releases=await response.json();
      if(!releases.length){list.innerHTML=`<p class="release-empty">${t('noReleases')}</p>`;return;}
      const latest=releases[0], apk=latest.assets.find(asset=>asset.name.toLowerCase().endsWith('.apk'));
      latestTarget.innerHTML='';
      const label=document.createElement('span');label.className='loading-line';label.textContent=latest.tag_name+(apk?' · APK':'');latestTarget.appendChild(label);
      const link=document.createElement('a');link.className='button button-dark';link.href=apk?apk.browser_download_url:latest.html_url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=apk?t('getApk'):t('viewGithub');latestTarget.appendChild(link);
      list.innerHTML='';
      releases.slice(0,6).forEach(release=>{
        const row=document.createElement('div');row.className='release-row';
        const meta=document.createElement('div');meta.className='release-meta';
        const tag=document.createElement('span');tag.className='release-tag';tag.textContent=release.tag_name;
        const badge=document.createElement('span');badge.className='release-badge';badge.textContent=(release.prerelease||/beta|alpha/i.test(release.tag_name))?t('beta'):t('stable');
        const date=document.createElement('span');date.className='release-date';date.textContent=new Date(release.published_at).toLocaleDateString(lang==='es'?'es-SV':'en-US',{year:'numeric',month:'short',day:'numeric'});
        meta.append(tag,badge,date);
        const a=document.createElement('a');a.className='release-link';a.href=release.assets.find(asset=>asset.name.toLowerCase().endsWith('.apk'))?.browser_download_url||release.html_url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('getApk');
        row.append(meta,a);list.appendChild(row);
      });
    }catch(error){
      latestTarget.innerHTML='';
      const fallback=document.createElement('a');fallback.className='button button-dark';fallback.href=`https://github.com/${owner}/${repo}/releases`;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent=t('viewReleases');latestTarget.appendChild(fallback);
      list.innerHTML=`<p class="release-empty">${t('releaseFallback')}</p>`;
    }
  }
  applyLanguage(lang);
  loadReleases();
});
