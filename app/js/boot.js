/**
 * Pemuat modul. Halaman game cukup memasang satu <script src="…/boot.js">.
 * Urutan di bawah penting: modul yang dimuat belakangan memakai variabel &
 * fungsi global milik modul sebelumnya (semua <script> klasik, tanpa bundler).
 */
(function () {
    const base = document.currentScript.src.replace(/boot\.js(\?.*)?$/, '');

    const MODULES = [
        // fondasi
        'core/landscape.js',
        'core/config.js',
        'core/state.js',
        'core/utils.js',
        // panggung & render
        'render/stage.js',
        'render/sprite-templates.js',
        'render/sprites.js',
        'render/background.js',
        'render/effects.js',
        'render/draw-game.js',
        // sistem
        'systems/time-stop.js',
        'systems/particles.js',
        'systems/story.js',
        'systems/hud.js',
        // entitas
        'entities/player.js',
        'entities/items.js',
        'entities/killers.js',
        'entities/gadflies.js',
        'entities/archers.js',
        'entities/meteors.js',
        'entities/lord-vindex.js',
        // mode SULIT
        'modes/hard/vindex-attacks.js',
        'modes/hard/hard-intro.js',
        'modes/hard/hard-sequence.js',
        // alur permainan
        'game/setup.js',
        'game/loop.js',
        'game/flow.js',
        'game/input.js',
        'game/main.js',
    ];

    MODULES.forEach((file) => {
        const script = document.createElement('script');
        script.src = base + file;
        script.async = false; // jaga urutan eksekusi
        document.body.appendChild(script);
    });
})();
