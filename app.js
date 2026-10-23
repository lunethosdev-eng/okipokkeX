document.addEventListener("DOMContentLoaded", async () => {
    const repoOwner = "lunethosdev-eng";
    const repoName = "okipokkeX";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases`;

    const latestContainer = document.getElementById("latest-download-container");
    const versionsList = document.getElementById("versions-list");

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("No se pudieron cargar los releases.");
        
        const releases = await response.json();

        if (releases.length === 0) {
            latestContainer.innerHTML = `<p class="loading-text">Pronto habrá releases disponibles.</p>`;
            versionsList.innerHTML = `<p class="loading-text">No hay versiones registradas aún.</p>`;
            return;
        }

        // Encontrar el último release estable (o el más reciente si no hay estables)
        const latestRelease = releases[0];
        
        // Buscar el archivo .apk en los assets del release
        const apkAsset = latestRelease.assets.find(asset => asset.name.endsWith(".apk"));
        const downloadUrl = apkAsset ? apkAsset.browser_download_url : latestRelease.html_url;

        // Renderizar la sección de descarga principal
        latestContainer.innerHTML = `
            <a href="${downloadUrl}" class="btn btn-primary" target="_blank">
                ⬇️ Descargar APK (${latestRelease.tag_name})
            </a>
            <a href="#versions" class="btn btn-secondary">Ver versiones anteriores</a>
        `;

        // Renderizar la lista completa de versiones (viejas, betas, etc.)
        versionsList.innerHTML = "";
        releases.forEach(release => {
            const isBeta = release.prerelease || release.tag_name.includes("beta") || release.tag_name.includes("alpha");
            const apkFile = release.assets.find(asset => asset.name.endsWith(".apk"));
            const fileUrl = apkFile ? apkFile.browser_download_url : release.html_url;
            
            const dateStr = new Date(release.published_at).toLocaleDateString("es-ES", {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const versionElement = document.createElement("div");
            versionElement.className = "version-item";
            versionElement.innerHTML = `
                <div class="version-info">
                    <h4>
                        ${release.name || release.tag_name} 
                        ${isBeta ? '<span class="badge-beta">Beta</span>' : ''}
                    </h4>
                    <span>Publicado el ${dateStr}</span>
                </div>
                <a href="${fileUrl}" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;" target="_blank">
                    Descargar
                </a>
            `;
            versionsList.appendChild(versionElement);
        });

    } catch (error) {
        console.error(error);
        latestContainer.innerHTML = `<p class="loading-text">Error al conectar con GitHub Releases.</p>`;
        versionsList.innerHTML = `<p class="loading-text">No se pudo cargar el historial.</p>`;
    }
});
