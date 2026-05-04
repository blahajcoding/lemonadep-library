async function loadVersions() {
    try {
        const response = await fetch('https://orion.orb.gay/ports.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        const container = document.getElementById('container');
        container.innerHTML = '';

        data.forEach(item => {
            // Main OS Level
            const mainDetails = document.createElement('details');
            const mainSummary = document.createElement('summary');

            mainSummary.textContent = item.name;
            mainDetails.appendChild(mainSummary);

            const subMenuContainer = document.createElement('div');
            subMenuContainer.className = 'submenu-container';

            Object.entries(item.versions).forEach(([majorVersion, builds]) => {
                // Major Version Level
                const versionDetails = document.createElement('details');
                versionDetails.className = 'version-menu';
                
                const versionSummary = document.createElement('summary');
                versionSummary.textContent = majorVersion;
                versionDetails.appendChild(versionSummary);
                
                // NEW: Create a single container for all the builds in this subversion
                const buildsContainer = document.createElement('div');
                buildsContainer.className = 'builds-container'; // You can use this class to style the group

                Object.entries(builds).forEach(([buildNumber, info]) => {
                    const itemRow = document.createElement('div');
                    itemRow.className = 'submenu';
                    itemRow.innerHTML = `
                        <stack>
                            <p class="primary">${buildNumber}</p>
                            <p class="secondary">${info.date || ''}</p>
                        </stack>
                    `;

                    const linkContainer = document.createElement('div');
                    linkContainer.className = 'link-container';
                    let linkContent = "";

                    if (info.direct) {
                        linkContent += `
                            <a href="${info.direct}">
                                <btn><i class="ti ti-download"></i></btn>
                            </a>`;
                    }
                    if (info.gdrive) {
                        linkContent += `
                            <a href="${info.gdrive}">
                                <btn><i class="ti ti-brand-google-drive"></i></btn>
                            </a>`;
                    }

                    linkContainer.innerHTML = linkContent;
                    itemRow.appendChild(linkContainer);
                    
                    // Add the itemRow to our new builds container instead of the details tag
                    buildsContainer.appendChild(itemRow);
                });

                // Add the completed container of builds into the version details menu
                versionDetails.appendChild(buildsContainer);
                subMenuContainer.appendChild(versionDetails);
            });

            mainDetails.appendChild(subMenuContainer);
            container.appendChild(mainDetails);
        });

    } catch (error) {
        console.error("Could not fetch the JSON file:", error);
    }
}

loadVersions();