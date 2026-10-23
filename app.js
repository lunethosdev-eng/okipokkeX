document.addEventListener("DOMContentLoaded", () => {
    const repoOwner = "lunethosdev-eng";
    const repoName = "okipokkeX";
    const releasesApi = `https://api.github.com/repos/${repoOwner}/${repoName}/releases`;

    const latestTarget = document.getElementById("latest-download-container");
    const versionsList = document.getElementById("versions-list");

    async function loadReleases() {
        try {
            const res = await fetch(releasesApi);
            if (!res.ok) throw new Error("Error al obtener releases de GitHub");
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
                    <a href="${link}" class="btn btn-glass" style="padding: 8px 18px; font-size: 0.8rem;" target="_blank">Obtener APK</a>
                `;
                versionsList.appendChild(row);
            });

        } catch (err) {
            latestTarget.innerHTML = `<a href="https://github.com/${repoOwner}/${repoName}/releases" class="btn btn-primary" target="_blank">Ver en GitHub</a>`;
            versionsList.innerHTML = `<div class="version-row"><span style="color: var(--text-muted);">Consulta directa en GitHub Releases.</span></div>`;
        }
    }

    // Observer para animaciones al hacer scroll (Graphic Motion)
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".animate-on-scroll").forEach(el => scrollObserver.observe(el));

    loadReleases();
});
