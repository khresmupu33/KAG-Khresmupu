/**
 * Latar arena (kanvas).
 */

function drawGameBackground() {
    /*
     * Background hitam.
     */
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    /*
     * Kotak-kotak besar.
     */
    const cell = 40;
    for (let y = 0; y < HEIGHT; y += cell) {
        for (let x = 0; x < WIDTH; x += cell) {
            const checker = (x / cell + y / cell) % 2;
            ctx.fillStyle = checker === 0 ? "#101010" : "#171717";
            ctx.fillRect(x, y, cell, cell);
            /*
             * Garis tipis.
             */
            ctx.strokeStyle = "#222222";
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cell, cell);
        }
    }
    /*
     * Vignette ringan.
     */
    const vignette = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 150, WIDTH / 2, HEIGHT / 2, 550);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,.45)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
