/**
 * Panggung (stage) 800x600: dua kanvas + lapisan sprite CSS.
 *
 *   #arena
 *     ├─ #gameCanvas   (bgCtx)  latar
 *     ├─ #spriteLayer           karakter CSS (lihat sprites.js)
 *     └─ #fxCanvas     (fxCtx)  efek di atas karakter (partikel, gelombang, teks)
 *
 * Seluruh #arena diskalakan lewat CSS agar muat di layar dan getaran layar
 * (screen shake) cukup menggeser #arena, sehingga kanvas & karakter ikut bergetar.
 */
const bgCanvas = document.getElementById('gameCanvas');
const fxCanvas = document.getElementById('fxCanvas');
const bgCtx = bgCanvas.getContext('2d');
const fxCtx = fxCanvas.getContext('2d');

/** Konteks aktif: fungsi gambar efek memakai `ctx` (diganti drawGame sesuai lapisan). */
let ctx = bgCtx;

const Stage = (() => {
    const wrapper = document.getElementById('gameWrapper');
    const arena = document.getElementById('arena');

    function fit() {
        if (!wrapper || !arena) return;
        const scale = Math.min(wrapper.clientWidth / WIDTH, wrapper.clientHeight / HEIGHT) || 1;
        arena.style.setProperty('--stage-scale', scale);
    }

    function shake(dx = 0, dy = 0) {
        arena.style.setProperty('--shake-x', `${dx}px`);
        arena.style.setProperty('--shake-y', `${dy}px`);
    }

    function clearFx() {
        fxCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    if (wrapper && 'ResizeObserver' in window) new ResizeObserver(fit).observe(wrapper);
    window.addEventListener('resize', fit, { passive: true });
    document.addEventListener('fullscreenchange', fit);
    fit();

    return { fit, shake, clearFx };
})();
