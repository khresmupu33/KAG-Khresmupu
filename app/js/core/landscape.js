/**
 * Overlay "putar ke landscape" untuk ponsel dalam mode potret.
 * Mencoba fullscreen + kunci orientasi saat overlay disentuh.
 */
(function () {
    const overlay = document.getElementById('mobileLandscapeOverlay');
    const mobileQuery = window.matchMedia('(max-width: 900px)');

    const isMobile = () => mobileQuery.matches && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const isLandscape = () => window.innerWidth > window.innerHeight;

    function update() {
        if (!overlay) return;
        const show = isMobile() && !isLandscape();
        overlay.style.display = show ? 'flex' : 'none';
        overlay.setAttribute('aria-hidden', show ? 'false' : 'true');
        document.documentElement.classList.toggle('mobile-portrait-lock', show);
        document.body.classList.toggle('mobile-portrait-lock', show);
    }

    async function tryLockLandscape() {
        try {
            if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (e) { /* tidak semua peramban mengizinkan */ }
        update();
    }

    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(update, 100));
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('DOMContentLoaded', update);
    if (overlay) {
        overlay.addEventListener('click', tryLockLandscape);
        overlay.addEventListener('touchend', tryLockLandscape, { passive: true });
    }
    update();
})();
