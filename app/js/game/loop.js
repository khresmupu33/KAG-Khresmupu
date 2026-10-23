/**
 * Update logika per-tick (60 FPS tetap) + game loop requestAnimationFrame.
 */

function updateGame() {
    const now = performance.now();
    if (level === 'hard' && hard25SequenceActive) {
        updateHard25Sequence();
        return;
    }
    if (playerDeathTimer > 0) {
        playerDeathTimer--;
        updateParticles();
        if (playerDeathTimer <= 0) {
            showEnd();
            return;
        }
        return;
    }
    /*
     * Otomatis pindah.
     */
    if (now - targetSpawnTime > 10000) {
        spawnTarget();
    }
    if (health && !health.visible && now >= healthSpawnTime && lives < 3) {
        spawnHealth();
    }
    if (powerup && !powerup.visible && now >= powerupSpawnTime && powerActive <= 0) {
        spawnPowerup();
    }
    if (now >= killerSpawnTime && killers.length < MAX_KILLERS) {
        addKiller();
        killerSpawnTime = now + nextKillerSpawnDelay;
    }
    /*
     * Player tetap bisa bergerak
     * hanya saat tidak pause.
     */
    updatePlayer();
    /*
     * Power-up pickup happens before Killer movement so the panic/flee
     * behavior starts on the exact frame the player gets Power Kill.
     */
    checkPlayerPowerup();
    checkTimeStopPowerup();
    updateTimeStop();
    updateVindexTimeStop();
    /*
     * Hujan meteor.
     */
    updateMeteors();
    checkMeteorCollisions();
    if (playerDeathTimer > 0) {
        return;
    }
    /*
     * Killer.
     */
    updateKillers();
    updateArchers();
    updateLordVindex();
    checkVindexEnemyCollisions();
    /*
     * Killer collision.
     */
    updateKillerCollisions();
    checkArcherCollisions();
    checkLordCollision();
    /*
     * Gadfly.
     */
    updateGadflies();
    /*
     * Player target.
     */
    checkPlayerTarget();
    updateStoryTriggers();
    if (gameState !== "playing") {
        return;
    }
    /*
     * Health.
     */
    checkPlayerHealth();
    /*
     * Gadfly.
     */
    checkPlayerGadflies();
    /*
     * Killer.
     */
    checkPlayerKillers();
    /*
     * Power timer.
     */
    if (powerActive > 0) {
        powerActive -= worldSlowFactor();
        if (powerActive < 0)
            powerActive = 0;
    }
    /*
     * Freeze.
     */
    updateGlobalFreeze();
    /*
     * Partikel.
     */
    updateParticles();
}

const FIXED_STEP_MS = 1000 / 60;

let fixedAccumulator = 0;

let lastFrameTime = 0;

function runGame(frameTime) {
    if (gameState !== "playing") {
        return;
    }
    if (!lastFrameTime) {
        lastFrameTime = frameTime;
    }
    let elapsed = frameTime - lastFrameTime;
    lastFrameTime = frameTime;
    /*
     * Semua logika game berjalan pada fixed timestep 60 FPS.
     * Jadi komputer 30 FPS, 60 FPS, 120 FPS, dst tetap mendapatkan
     * kecepatan gerak dan durasi yang sama dalam waktu nyata.
     */
    if (elapsed > 120)
        elapsed = 120;
    if (paused) {
        fixedAccumulator = 0;
        document.getElementById("pauseText").style.display = "block";
        updateHUD();
        drawGame();
        requestAnimationFrame(runGame);
        return;
    }
    document.getElementById("pauseText").style.display = "none";
    fixedAccumulator += elapsed;
    let steps = 0;
    /* Maksimal 8 tick per frame agar komputer yang sempat lag tidak
       menyebabkan game meloncat terlalu jauh atau CPU tersedot. */
    while (fixedAccumulator >= FIXED_STEP_MS && steps < 4) {
        updateGame();
        fixedAccumulator -= FIXED_STEP_MS;
        steps++;
        if (gameState !== "playing") {
            fixedAccumulator = 0;
            break;
        }
    }
    if (steps >= 4) {
        fixedAccumulator = 0;
    }
    drawGame();
    updateHUD();
    requestAnimationFrame(runGame);
}
