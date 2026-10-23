document.addEventListener("DOMContentLoaded", () => {
    const repoOwner = "lunethosdev-eng";
    const repoName = "okipokkeX";
    const releasesApi = `https://api.github.com/repos/${repoOwner}/${repoName}/releases`;

    const latestTarget = document.getElementById("latest-download-container");
    const versionsList = document.getElementById("versions-list");

    // Lista de Canciones Muestra
    const tracks = [
        { title: "Muestra Musical 01", artist: "Pokke Sound Engine", src: "assets/music/track1.mp3", cover: "assets/music/covers/cover1.jpg" },
        { title: "Muestra Musical 02", artist: "Pokke Sound Engine", src: "assets/music/track2.mp3", cover: "assets/music/covers/cover2.jpg" },
        { title: "Muestra Musical 03", artist: "Pokke Sound Engine", src: "assets/music/track3.mp3", cover: "assets/music/covers/cover3.jpg" },
        { title: "Muestra Musical 04", artist: "Pokke Sound Engine", src: "assets/music/track4.mp3", cover: "assets/music/covers/cover4.jpg" }
    ];

    let currentTrackIndex = 0;
    const audio = document.getElementById("audio-element");
    const playBtn = document.getElementById("btn-play");
    const prevBtn = document.getElementById("btn-prev");
    const nextBtn = document.getElementById("btn-next");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const currentTitle = document.getElementById("current-title");
    const currentArtist = document.getElementById("current-artist");
    const currentCover = document.getElementById("current-cover");
    const timeCurrent = document.getElementById("time-current");
    const timeDuration = document.getElementById("time-duration");

    function loadTrack(index) {
        const track = tracks[index];
        currentTitle.textContent = track.title;
        currentArtist.textContent = track.artist;
        currentCover.src = track.cover;
        audio.src = track.src;
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = "PAUSE";
        } else {
            audio.pause();
            playBtn.textContent = "PLAY";
        }
    }

    playBtn.addEventListener("click", togglePlay);

    prevBtn.addEventListener("click", () => {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.textContent = "PAUSE";
    });

    nextBtn.addEventListener("click", () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.textContent = "PAUSE";
    });

    audio.addEventListener("timeupdate", (e) => {
        const { duration, currentTime } = e.srcElement;
        if (isNaN(duration)) return;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Tiempos
        const curMin = Math.floor(currentTime / 60);
        const curSec = Math.floor(currentTime % 60);
        const durMin = Math.floor(duration / 60);
        const durSec = Math.floor(duration % 60);

        timeCurrent.textContent = `${curMin}:${curSec < 10 ? '0' : ''}${curSec}`;
        timeDuration.textContent = `${durMin}:${durSec < 10 ? '0' : ''}${durSec}`;
    });

    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // Cargar GitHub Releases
    async function loadReleases() {
        try {
            const res = await fetch(releasesApi);
            if (!res.ok) throw new Error("Error al obtener releases");
            const data = await res.json();

            if (!data || data.length === 0) {
                latestTarget.innerHTML = `<span style="color: var(--text-muted);">Proximamente disponible.</span>`;
                versionsList.innerHTML = `<div class="version-row"><span style="color: var(--text-muted);">Sin historial registrado.</span></div>`;
                return;
            }

            const latest = data[0];
            const apkAsset = latest.assets.find(a => a.name.endsWith(".apk"));
            const downloadUrl = apkAsset ? apkAsset.browser_download_url : latest.html_url;

            latestTarget.innerHTML = `
                <a href="${downloadUrl}" class="btn btn-primary" target="_blank">Descargar ${latest.tag_name} (.APK)</a>
                <a href="https://lunethosdev-eng.github.io/Moshii/#/firstpage" class="btn btn-glass" target="_blank">Abrir Web App</a>
            `;

            versionsList.innerHTML = "";
            data.forEach(rel => {
                const isBeta = rel.prerelease || rel.tag_name.toLowerCase().includes("beta");
                const fileAsset = rel.assets.find(a => a.name.endsWith(".apk"));
                const link = fileAsset ? fileAsset.browser_download_url : rel.html_url;
                const formattedDate = new Date(rel.published_at).toLocaleDateString("es-ES", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                const row = document.createElement("div");
                row.className = "version-row";
                row.innerHTML = `
                    <div class="v-meta">
                        <span class="v-tag">${rel.tag_name}</span>
                        <span class="v-badge">${isBeta ? 'Beta' : 'Stable'}</span>
                        <span class="v-date">${formattedDate}</span>
                    </div>
                    <a href="${link}" class="btn btn-glass" style="padding: 6px 14px; font-size: 0.78rem;" target="_blank">Obtener APK</a>
                `;
                versionsList.appendChild(row);
            });

        } catch (err) {
            latestTarget.innerHTML = `<a href="https://github.com/${repoOwner}/${repoName}/releases" class="btn btn-primary" target="_blank">Ver en GitHub</a>`;
            versionsList.innerHTML = `<div class="version-row"><span style="color: var(--text-muted);">Consulta directa en GitHub Releases.</span></div>`;
        }
    }

    // Scroll Animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".animate-on-scroll").forEach(el => scrollObserver.observe(el));

    loadTrack(0);
    loadReleases();
});
