/**
 * Pemain: gerak, pengambilan target/nyawa/power, partikel kematian.
 */

function updatePlayer() {
    const sf = worldSlowFactor();
    if (playerShockTimer > 0 && playerDeathTimer <= 0) {
        player.x += playerShockX * sf;
        player.y += playerShockY * sf;
        playerShockX *= .86;
        playerShockY *= .86;
        player.x = Math.max(0, Math.min(WIDTH - player.w, player.x));
        player.y = Math.max(0, Math.min(HEIGHT - player.h, player.y));
    }
    pressedKeys.forEach(function (key) {
        if (key === "ArrowUp") {
            player.y -= PLAYER_SPEED * sf;
        }
        if (key === "ArrowDown") {
            player.y += PLAYER_SPEED * sf;
        }
        if (key === "ArrowLeft") {
            player.x -= PLAYER_SPEED * sf;
        }
        if (key === "ArrowRight") {
            player.x += PLAYER_SPEED * sf;
        }
    });
    wrap(player);
}

function checkPlayerTarget() {
    if (!collide(player, target)) {
        return;
    }
    score++;
    checkLargeMeteorMilestone();
    if (score === METEOR_TRIGGER_SCORE) {
        beginMeteorPreparation();
        scheduleNextLargeMeteor();
    }
    spawnTarget();
    /*
     * TRUE ENDING.
     */
    if (score >= 100) {
        score = 100;
        startEnding();
    }
}

function checkPlayerHealth() {
    if (!health || !health.visible || !collide(player, health)) {
        return;
    }
    if (lives < 3) {
        lives++;
        health.visible = false;
        healthSpawnTime = performance.now() + randomInt(HEALTH_RESPAWN_MIN, HEALTH_RESPAWN_MAX);
        screenShake = 5;
    }
}

function checkPlayerPowerup() {
    if (!powerup || !powerup.visible || !collide(player, powerup)) {
        return;
    }
    powerup.visible = false;
    powerActive = POWER_DURATION;
    powerupSpawnTime = performance.now() + randomInt(POWER_RESPAWN_MIN, POWER_RESPAWN_MAX);
    screenShake = 8;
}

function createPlayerDeathParticles() {
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5.5;
        particleList.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: 2 + Math.random() * 4,
            life: 35 + Math.random() * 45,
            maxLife: 80,
            deathParticle: true
        });
    }
}
