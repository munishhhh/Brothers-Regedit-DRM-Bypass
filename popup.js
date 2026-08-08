document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('toggle-fix');
    const statusText = document.getElementById('status-text');
    const statusDesc = document.getElementById('status-desc');
    const refreshHint = document.getElementById('refresh-hint');
    const liveStatusPill = document.getElementById('live-status-pill');
    const pillLabel = document.getElementById('pill-label');

    const brandLogo = document.getElementById('brand-logo');
    const versionBadge = document.getElementById('version-badge');
    const mainCard = document.getElementById('main-card');

    const searchSection = document.getElementById('search-section');
    const searchInput = document.getElementById('custom-search-input');
    const btnGoSearch = document.getElementById('btn-go-search');
    const btnOthers = document.getElementById('btn-others');
    const btnDiscordLogo = document.getElementById('btn-discord-logo');

    const STORAGE_KEY = 'drm-bypass-enabled';

    async function getTabState() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) return true;

        if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
            return true;
        }

        try {
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (key) => window.localStorage.getItem(key) ?? window.localStorage.getItem('screenshare-fix-enabled'),
                args: [STORAGE_KEY],
                world: 'MAIN'
            });
            const val = result[0]?.result;
            return val === null ? true : (val === 'true');
        } catch (e) {
            return true;
        }
    }

    async function setTabState(isEnabled) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) return;

        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (key, val) => {
                    window.localStorage.setItem(key, val);
                    window.localStorage.setItem('screenshare-fix-enabled', val);
                },
                args: [STORAGE_KEY, isEnabled.toString()],
                world: 'MAIN'
            });
        } catch (e) {
            console.error(e);
        }
    }

    function updateUI(isEnabled) {
        toggle.checked = isEnabled;
        
        if (isEnabled) {
            statusText.textContent = "DRM Bypass Active";
            statusText.classList.remove('paused');
            statusDesc.textContent = "Discord ScreenShare Black Screen Fix";
            
            liveStatusPill.className = "live-status-pill active";
            pillLabel.textContent = "ACTIVE";

            if (versionBadge) versionBadge.style.color = "#10b981";
            if (brandLogo) brandLogo.style.filter = "drop-shadow(0 0 10px rgba(16, 185, 129, 0.65))";
            if (mainCard) mainCard.classList.remove('paused');
        } else {
            statusText.textContent = "DRM Bypass Disabled";
            statusText.classList.add('paused');
            statusDesc.textContent = "Protection is currently paused";
            
            liveStatusPill.className = "live-status-pill paused";
            pillLabel.textContent = "PAUSED";

            if (versionBadge) versionBadge.style.color = "#ef4444";
            if (brandLogo) brandLogo.style.filter = "drop-shadow(0 0 10px rgba(239, 68, 68, 0.65))";
            if (mainCard) mainCard.classList.add('paused');
        }
    }

    const isEnabled = await getTabState();
    updateUI(isEnabled);

    toggle.addEventListener('change', async (e) => {
        const newState = e.target.checked;
        updateUI(newState);
        await setTabState(newState);
        
        refreshHint.classList.add('show');
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
            chrome.tabs.reload(tab.id);
            setTimeout(() => {
                window.close();
            }, 600);
        }
    });

    // Helper function to open or switch to tab
    async function openPlatform(rawUrl) {
        let url = rawUrl.trim();
        if (!url) return;
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }

        try {
            const domainPart = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
            const tabs = await chrome.tabs.query({});
            const existingTab = tabs.find(t => t.url && t.url.includes(domainPart));

            if (existingTab) {
                await chrome.tabs.update(existingTab.id, { active: true });
                if (existingTab.windowId) {
                    await chrome.windows.update(existingTab.windowId, { focused: true });
                }
            } else {
                await chrome.tabs.create({ url });
            }
        } catch (err) {
            await chrome.tabs.create({ url });
        }
        window.close();
    }

    // Quick Launch Platform Shortcuts (Except Others)
    const platformButtons = document.querySelectorAll('.platform-card:not(.others)');
    platformButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            if (url) {
                openPlatform(url);
            }
        });
    });

    // Others Button Event: Toggle Search Bar Section
    if (btnOthers) {
        btnOthers.addEventListener('click', () => {
            searchSection.classList.toggle('active');
            if (searchSection.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }

    // Search Bar Execute
    if (btnGoSearch && searchInput) {
        btnGoSearch.addEventListener('click', () => {
            openPlatform(searchInput.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                openPlatform(searchInput.value);
            }
        });
    }

    // Search Suggestion Tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagUrl = tag.getAttribute('data-url');
            if (tagUrl) {
                openPlatform(tagUrl);
            }
        });
    });

    // Discord Logo Button Click Event
    if (btnDiscordLogo) {
        btnDiscordLogo.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: 'https://discord.gg/Qtj8wHjF6Z' });
        });
    }
});
