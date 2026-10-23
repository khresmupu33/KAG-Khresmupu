/**
 * Menyusun satu frame permainan:
 *   1) latar            -> kanvas bawah (bgCtx)
 *   2) karakter         -> lapisan sprite CSS
 *   3) efek & teks      -> kanvas atas (fxCtx)
 */
function drawGame() {
    // getaran layar (urutan pemanggilan acak dipertahankan seperti logika asli)
    let shakeX = 0, shakeY = 0;
    if (screenShake > 0) {
        const shake = Math.random() * 4;
        shakeX = randomInt(-shake, shake);
        shakeY = randomInt(-shake, shake);
    }
    Stage.shake(shakeX, shakeY);

    ctx = bgCtx;
    drawGameBackground();

    Sprites.sync();

    ctx = fxCtx;
    Stage.clearFx();
    drawMeteorEffects();
    drawArcherWarning();
    drawVindexTimeStopWave();
    drawVindexLaser();
    drawHard25SequenceOverlay();
    drawTimeStopWave();
    drawStoryMessage();
    drawParticles();
}
