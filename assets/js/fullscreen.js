/**
 * Fullscreen + kunci landscape untuk ponsel.
 *   <a data-fullscreen="enter">   masuk fullscreen lalu pindah halaman
 *   <a data-fullscreen="exit">    keluar fullscreen lalu pindah halaman
 *   <body data-auto-fullscreen>   coba fullscreen otomatis di ponsel
 */
(function () {
    const isMobile = () => matchMedia('(max-width:900px)').matches && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    async function enter() {
        try { if (document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch (_) {}
        try { if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); } catch (_) {}
    }
    async function exit() {
        try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (_) {}
        try { if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); } catch (_) {}
    }

    document.querySelectorAll('a[data-fullscreen]').forEach((link) => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            await (link.dataset.fullscreen === 'exit' ? exit() : enter());
            location.href = link.href;
        });
    });

    if (document.body.hasAttribute('data-auto-fullscreen') && isMobile()) enter();
})();
