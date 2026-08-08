(function() {
    try {
        const isEnabled = localStorage.getItem('drm-bypass-enabled') ?? localStorage.getItem('screenshare-fix-enabled');
        if (isEnabled === 'false') {
            return;
        }
    } catch (e) {
        // Accessing localStorage might fail in some contexts, just ignore
    }

    function injectStyleSheet() {
        if (document.getElementById('drm-bypass-style')) return;
        const style = document.createElement('style');
        style.id = 'drm-bypass-style';
        style.textContent = `
            video {
                filter: sepia(0.0001%) opacity(99.99%) !important;
                opacity: 0.9999 !important;
                mix-blend-mode: normal !important;
                transform: translateZ(0) !important;
                will-change: filter, opacity, transform !important;
            }
        `;
        const target = document.head || document.documentElement;
        if (target) {
            target.appendChild(style);
        }
    }

    function applyCompositing(video) {
        if (!video) return;
        try {
            video.style.setProperty('filter', 'sepia(0.0001%) opacity(99.99%)', 'important');
            video.style.setProperty('opacity', '0.9999', 'important');
            video.style.setProperty('mix-blend-mode', 'normal', 'important');
            video.style.setProperty('transform', 'translateZ(0)', 'important');
            video.style.setProperty('will-change', 'filter, opacity, transform', 'important');
        } catch(e) {}
    }

    function getAllVideos(root = document) {
        let videos = [];
        try {
            videos = Array.from(root.querySelectorAll('video'));
            const allElements = root.querySelectorAll('*');
            for (const el of allElements) {
                if (el.shadowRoot) {
                    videos = videos.concat(getAllVideos(el.shadowRoot));
                }
            }
        } catch (e) {}
        return videos;
    }

    function processVideos() {
        injectStyleSheet();
        const videos = getAllVideos();
        videos.forEach(applyCompositing);
    }

    const observer = new MutationObserver((mutations) => {
        processVideos();
    });

    function init() {
        injectStyleSheet();
        processVideos();
        if (document.documentElement) {
            try {
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class', 'src']
                });
            } catch(e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    init();
})();
