document.addEventListener("DOMContentLoaded", () => {
    const repoOwner = "lunethosdev-eng";
    const repoName = "okipokkeX";
    const releasesApi = `https://api.github.com/repos/${repoOwner}/${repoName}/releases`;

    const latestTarget = document.getElementById("latest-release-target");
    const releasesTarget = document.getElementById("releases-list");

    // Fetch GitHub Releases
    async function loadReleases() {
        try {
            const res = await fetch(releasesApi);
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();

            if (!data || data.length === 0) {
                latestTarget.innerHTML = `<p style="color: var(--text-muted);">Sin versiones públicas registradas por ahora.</p>`;
                releasesTarget.innerHTML = `<div class="version-row"><span style="color: var(--text-muted);">Sin historial disponible.</span></div>`;
                return;
            }

            // Primer elemento = release más reciente
            const latest = data[0];
            const apkAsset = latest.assets.find(a => a.name.endsWith(".apk"));
            const downloadUrl = apkAsset ? apkAsset.browser_download_url : latest.html_url;

            latestTarget.innerHTML = `
                <a href="${downloadUrl}" class="btn btn-primary" target="_blank">Descargar ${latest.tag_name} (.APK)</a>
            `;

            // Historial de Releases
            releasesTarget.innerHTML = "";
            data.forEach(rel => {
                const isPrerelease = rel.prerelease || rel.tag_name.toLowerCase().includes("beta");
                const fileAsset = rel.assets.find(a => a.name.endsWith(".apk"));
                const link = fileAsset ? fileAsset.browser_download_url : rel.html_url;
                const releaseDate = new Date(rel.published_at).toLocaleDateString("es-ES", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                const row = document.createElement("div");
                row.className = "version-row";
                row.innerHTML = `
                    <div class="v-meta">
                        <span class="v-tag">${rel.tag_name}</span>
                        ${isPrerelease ? '<span class="v-badge">Beta</span>' : '<span class="v-badge">Stable</span>'}
                        <span class="v-date">${releaseDate}</span>
                    </div>
                    <a href="${link}" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.78rem;" target="_blank">Obtener APK</a>
                `;
                releasesTarget.appendChild(row);
            });

        } catch (err) {
            latestTarget.innerHTML = `<a href="https://github.com/${repoOwner}/${repoName}/releases" class="btn btn-primary" target="_blank">Ver Releases en GitHub</a>`;
            releasesTarget.innerHTML = `<div class="version-row"><span style="color: var(--text-muted);">Consulta directa en GitHub Releases.</span></div>`;
        }
    }

    // Scroll Animations Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

    loadReleases();
});
