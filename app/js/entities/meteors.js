/**
 * Hujan meteor, meteor besar, dan dampaknya.
 */

function startMeteorSession() {
    if (meteorSessionActive || gameState !== "playing")
        return;
    meteorSessionUsed = true;
    meteorSessionActive = true;
    meteorSessionTimer = METEOR_SESSION_DURATION;
    meteorNextSpawn = randomInt(150, 300);
    meteorWarningTimer = 120;
    meteorPhase = 'firstBurst';
    meteorPhaseTimer = 0;
    meteorBurstCooldown = METEOR_BURST_COOLDOWN;
    screenShake = 6;
    for (let i = 0; i < METEOR_FIRST_BURST; i++)
        spawnMeteor(-i * 55, true);
}

function spawnMeteor(offsetY = 0, forceDiagonal = false) {
    const size = randomInt(12, 20);
    const x = randomInt(METEOR_SAFE_MARGIN, WIDTH - size - METEOR_SAFE_MARGIN);
    const diagonal = forceDiagonal || Math.random() < .72;
    const direction = Math.random() < .5 ? -1 : 1;
    meteors.push({ x: x, y: -size - 20 + offsetY, w: size, h: size, vx: diagonal ? direction * randomInt(2, 4) : (Math.random() - .5) * 1.4, vy: randomInt(METEOR_SPEED_MIN, METEOR_SPEED_MAX), rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() - .5) * .18, life: 180, trail: [], large: false, impacted: false });
}

function spawnLargeMeteor() {
    if (largeMeteor || gameState !== "playing")
        return;
    const size = LARGE_METEOR_SIZE;
    const targetX = largeMeteorWarning ? largeMeteorWarning.x : randomInt(60, WIDTH - 60);
    const targetY = largeMeteorWarning ? largeMeteorWarning.y : randomInt(150, HEIGHT - 100);
    const startX = Math.max(0, Math.min(WIDTH - size, targetX - size / 2 + randomInt(-170, 170)));
    const startY = -size - 45;
    const dx = targetX - (startX + size / 2);
    const dy = targetY - (startY + size / 2);
    const dist = Math.hypot(dx, dy) || 1;
    largeMeteor = { x: startX, y: startY, w: size, h: size, vx: dx / dist * LARGE_METEOR_SPEED, vy: dy / dist * LARGE_METEOR_SPEED, rotation: Math.random() * Math.PI * 2, rotationSpeed: .08 * (Math.random() < .5 ? -1 : 1), targetX, targetY, trail: [], active: true };
    largeMeteorWarning = null;
}

function triggerRareLargeMeteor() {
    if (gameState === "playing" && level === 'hard') {
        triggerVindexPowerAttack();
        return;
    }
    if (largeMeteorPending || largeMeteorWarning || gameState !== "playing")
        return;
    largeMeteorPending = true;
    largeMeteorSpawnTimer = LARGE_METEOR_WARNING_TIME;
    largeMeteorWarning = {
        x: randomInt(80, WIDTH - 80),
        y: randomInt(130, HEIGHT - 100),
        targetX: randomInt(80, WIDTH - 80),
        targetY: randomInt(130, HEIGHT - 100),
        radius: LARGE_METEOR_SIZE * .62,
        life: LARGE_METEOR_WARNING_TIME,
        phase: Math.random() * Math.PI * 2
    };
    screenShake = 3;
}

function checkLargeMeteorMilestone() {
    if (score < METEOR_TRIGGER_SCORE || largeMeteorMilestones.has(score))
        return;
    largeMeteorMilestones.add(score);
}

function scheduleNextLargeMeteor() {
    if (score < METEOR_TRIGGER_SCORE) {
        largeMeteorSpawnTimer = 999999;
        return;
    }
    largeMeteorSpawnTimer = randomInt(LARGE_METEOR_RANDOM_MIN, LARGE_METEOR_RANDOM_MAX);
}

function beginMeteorPreparation() {
    if (meteorPreShowerActive || meteorSessionActive || gameState !== "playing" || score < METEOR_TRIGGER_SCORE)
        return;
    meteorShowerUnlocked = true;
    meteorPreShowerActive = true;
    meteorPreShowerTimer = randomInt(METEOR_PRE_SHOWER_MIN, METEOR_PRE_SHOWER_MAX);
    meteorPreShowerNextSpawn = randomInt(45, 90);
    meteorPreShowerSpawned = 0;
    meteorWarningTimer = 0;
    screenShake = 3;
}

function updateMeteorPreparation() {
    if (!meteorPreShowerActive)
        return;
    if (gameState !== "playing")
        return;
    meteorPreShowerTimer--;
    if (meteorPreShowerSpawned < METEOR_PRE_SHOWER_MAX_METEORS) {
        if (meteorPreShowerNextSpawn <= 0) {
            spawnMeteor(0, false);
            meteorPreShowerSpawned++;
            meteorPreShowerNextSpawn = randomInt(METEOR_PRE_SHOWER_SPAWN_INTERVAL_MIN, METEOR_PRE_SHOWER_SPAWN_INTERVAL_MAX);
        }
        else {
            meteorPreShowerNextSpawn--;
        }
    }
    if (meteorPreShowerTimer <= 0) {
        meteorPreShowerActive = false;
        meteorSessionUsed = false;
        startMeteorSession();
    }
}

function updateLargeMeteorRandomEvent() {
    if (gameState !== "playing" || score < METEOR_TRIGGER_SCORE || !meteorShowerUnlocked || meteorPreShowerActive)
        return;
    if (level === 'hard') {
        if (vindexPowerAttack)
            return;
        largeMeteorSpawnTimer--;
        if (largeMeteorSpawnTimer <= 0)
            triggerVindexPowerAttack();
        return;
    }
    if (largeMeteorPending) {
        if (largeMeteorWarning) {
            largeMeteorWarning.life--;
            largeMeteorWarning.phase += .14;
            const progress = 1 - largeMeteorWarning.life / LARGE_METEOR_WARNING_TIME;
            const nx = largeMeteorWarning.x + (largeMeteorWarning.targetX - largeMeteorWarning.x) * .035;
            const ny = largeMeteorWarning.y + (largeMeteorWarning.targetY - largeMeteorWarning.y) * .035;
            largeMeteorWarning.x = nx + Math.sin(largeMeteorWarning.phase) * 5;
            largeMeteorWarning.y = ny + Math.cos(largeMeteorWarning.phase * 1.3) * 3;
            if (largeMeteorWarning.life <= 0) {
                largeMeteorPending = false;
                spawnLargeMeteor();
                screenShake = 8;
            }
        }
        return;
    }
    largeMeteorSpawnTimer--;
    if (largeMeteorSpawnTimer <= 0)
        triggerRareLargeMeteor();
}

function updateLargeMeteor() {
    if (largeMeteor && largeMeteor.active) {
        const m = largeMeteor;
        m.trail.push({ x: m.x + m.w / 2, y: m.y + m.h / 2 });
        if (m.trail.length > 4)
            m.trail.shift();
        m.x += m.vx;
        m.y += m.vy;
        m.rotation += m.rotationSpeed;
        if (m.x < 0) {
            m.x = 0;
            m.vx = Math.abs(m.vx);
        }
        if (m.x + m.w > WIDTH) {
            m.x = WIDTH - m.w;
            m.vx = -Math.abs(m.vx);
        }
        const cx = m.x + m.w / 2, cy = m.y + m.h / 2;
        if (Math.hypot(m.targetX - cx, m.targetY - cy) <= Math.max(8, m.w * .13) || m.y > HEIGHT + 80) {
            m.active = false;
            queueLargeMeteorImpact(m.targetX, m.targetY);
            largeMeteor = null;
            screenShake = 12;
        }
    }
}

function updateMeteors() {
    const worldSlow = enemySlowFactor();
    if (level === 'hard' && score >= 25) {
        hardMeteorPermanent = true;
        meteorShowerUnlocked = true;
        if (!meteorSessionActive && !meteorPreShowerActive) {
            meteorSessionActive = true;
            meteorSessionTimer = 999999;
            meteorPhase = 'random2';
            meteorNextSpawn = Math.min(meteorNextSpawn || 1, 8);
        }
    }
    updateLargeMeteorRandomEvent();
    if (level === 'hard')
        updateVindexPowerAttack();
    else {
        updateLargeMeteor();
        processLargeMeteorImpact();
    }
    if (score >= METEOR_TRIGGER_SCORE && !meteorShowerUnlocked) {
        beginMeteorPreparation();
    }
    updateMeteorPreparation();
    if (!meteorSessionActive && !meteorPreShowerActive) {
        if (meteorShowerUnlocked && meteorSessionUsed) {
            if (meteorNextSessionTimer > 0)
                meteorNextSessionTimer -= worldSlow;
            if (meteorNextSessionTimer <= 0)
                startMeteorSession();
        }
    }
    else if (meteorSessionActive) {
        meteorSessionTimer -= worldSlow;
        meteorPhaseTimer += worldSlow;
        if (meteorBurstCooldown > 0)
            meteorBurstCooldown = Math.max(0, meteorBurstCooldown - worldSlow);
        if (meteorPhase === 'firstBurst' && meteorPhaseTimer > 75) {
            meteorPhase = 'random';
            meteorPhaseTimer = 0;
            meteorNextSpawn = randomInt(150, 300);
        }
        else if (meteorPhase === 'random') {
            if (meteorPhaseTimer >= METEOR_SECOND_BURST_TIME) {
                meteorPhase = 'secondBurst';
                meteorPhaseTimer = 0;
                meteorBurstCooldown = METEOR_BURST_COOLDOWN;
                for (let i = 0; i < METEOR_SECOND_BURST; i++)
                    spawnMeteor(-i * 62, true);
            }
            else if (meteorNextSpawn <= 0) {
                spawnMeteor();
                meteorNextSpawn = randomInt(150, 300);
            }
            else
                meteorNextSpawn -= worldSlow;
        }
        else if (meteorPhase === 'secondBurst' && meteorPhaseTimer > 70) {
            meteorPhase = 'random2';
            meteorPhaseTimer = 0;
            meteorNextSpawn = randomInt(150, 300);
        }
        else if (meteorPhase === 'random2') {
            if (meteorNextSpawn <= 0) {
                spawnMeteor();
                meteorNextSpawn = randomInt(180, 330);
            }
            else
                meteorNextSpawn -= worldSlow;
        }
        if (meteorSessionTimer <= 0 && !hardMeteorPermanent) {
            meteorSessionActive = false;
            meteorPhase = 'idle';
            meteorNextSessionTimer = randomInt(METEOR_NEXT_SESSION_MIN, METEOR_NEXT_SESSION_MAX);
            meteors.length = 0;
        }
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.trail.push({ x: m.x + m.w / 2, y: m.y + m.h / 2 });
        if (m.trail.length > 3)
            m.trail.shift();
        m.x += m.vx * worldSlow;
        m.y += m.vy * worldSlow;
        m.rotation += m.rotationSpeed * worldSlow;
        if (m.x < 0) {
            m.x = 0;
            m.vx = Math.abs(m.vx);
        }
        if (m.x + m.w > WIDTH) {
            m.x = WIDTH - m.w;
            m.vx = -Math.abs(m.vx);
        }
        if (m.y > HEIGHT + 70)
            meteors.splice(i, 1);
    }
}

function queueLargeMeteorImpact(x, y) {
    if (largeMeteorImpactState || gameState !== "playing")
        return;
    largeMeteorImpactState = { x, y, stage: 0, playerDirect: false };
    screenShake = 12;
}

function processLargeMeteorImpact() {
    const state = largeMeteorImpactState;
    if (!state)
        return;
    if (gameState !== "playing") {
        largeMeteorImpactState = null;
        return;
    }
    if (state.stage === 0) {
        const box = { x: state.x - LARGE_METEOR_SIZE / 2, y: state.y - LARGE_METEOR_SIZE / 2, w: LARGE_METEOR_SIZE, h: LARGE_METEOR_SIZE };
        state.playerDirect = !!(player && collide(player, box));
        if (state.playerDirect && hitCooldown <= 0 && lives > 0) {
            lives = Math.max(0, lives - LARGE_METEOR_PLAYER_DAMAGE);
            hitCooldown = METEOR_PLAYER_COOLDOWN;
            screenShake = 20;
            if (lives <= 0) {
                lives = 0;
                playerDeathMax = 100;
                playerDeathTimer = playerDeathMax;
                globalFreeze = playerDeathMax;
                hitCooldown = playerDeathMax;
            }
        }
        for (let i = killers.length - 1; i >= 0; i--) {
            const k = killers[i];
            if (!k || k.loading > 0 || k.disintegrating)
                continue;
            if (collide(k, box)) {
                k.disintegrating = true;
                k.disintegrateTimer = 38;
                k.hitFlash = 18;
                k.panic = false;
                createDisintegrationParticles(k);
            }
        }
        state.stage = 1;
        return;
    }
    if (state.stage === 1) {
        createLargeMeteorImpactParticles(state.x, state.y);
        state.stage = 2;
        return;
    }
    if (state.stage === 2) {
        if (!state.playerDirect && player && playerDeathTimer <= 0) {
            const dx = player.x + player.w / 2 - state.x, dy = player.y + player.h / 2 - state.y, d = Math.hypot(dx, dy) || 1;
            const f = Math.max(.18, 1 - Math.min(d / (Math.hypot(WIDTH, HEIGHT) / 2), 1) * .72);
            playerShockTimer = 34;
            playerShockX = (dx / d) * (5 + LARGE_METEOR_SHOCK_POWER * f);
            playerShockY = (dy / d) * (5 + LARGE_METEOR_SHOCK_POWER * f);
        }
        const maxDist = Math.hypot(WIDTH, HEIGHT) / 2;
        for (let i = 0; i < killers.length; i++) {
            const k = killers[i];
            if (!k || k.loading > 0 || k.disintegrating)
                continue;
            const dx = k.x + k.w / 2 - state.x, dy = k.y + k.h / 2 - state.y, d = Math.hypot(dx, dy) || 1;
            const f = Math.max(.18, 1 - Math.min(d / maxDist, 1) * .72), power = 5 + LARGE_METEOR_SHOCK_POWER * f;
            k.knockbackX = (dx / d) * power;
            k.knockbackY = (dy / d) * power;
            k.knockbackTimer = 34;
            k.hitFlash = 16;
        }
        largeMeteorShockwave(state.x, state.y);
        scheduleNextLargeMeteor();
        largeMeteorImpactState = null;
    }
}

function createLargeMeteorImpactParticles(x, y) {
    const count = 8;
    for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4;
        particleList.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, size: 2 + Math.random() * 3, life: 20 + Math.random() * 18, maxLife: 40, meteorParticle: true });
    }
}

function largeMeteorShockwave(x, y) { meteorShockwave = { x, y, r: 8, max: Math.hypot(WIDTH, HEIGHT) * .72, life: 42 }; }

function checkMeteorCollisions() {
    if (!meteors.length)
        return;
    if (hitCooldown > 0)
        hitCooldown--;
    for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (m.large)
            continue;
        if (collide(player, m)) {
            meteors.splice(i, 1);
            createMeteorImpactParticles(m.x + m.w / 2, m.y + m.h / 2);
            screenShake = 14;
            if (hitCooldown <= 0 && lives > 0) {
                lives--;
                hitCooldown = METEOR_PLAYER_COOLDOWN;
                if (lives <= 0) {
                    lives = 0;
                    playerDeathMax = 100;
                    playerDeathTimer = playerDeathMax;
                    globalFreeze = playerDeathMax;
                    hitCooldown = playerDeathMax;
                    createPlayerDeathParticles();
                    screenShake = 18;
                    return;
                }
            }
        }
        for (let k = killers.length - 1; k >= 0; k--) {
            const killer = killers[k];
            if (killer.loading > 0 || killer.disintegrating)
                continue;
            if (collide(killer, m)) {
                killer.disintegrating = true;
                killer.disintegrateTimer = 32;
                createDisintegrationParticles(killer);
                killer.hitFlash = 12;
                screenShake = 8;
                meteors.splice(i, 1);
                break;
            }
        }
    }
}

function createMeteorImpactParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 4;
        particleList.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 2 + Math.random() * 3, life: 18 + Math.random() * 22, maxLife: 40, meteorParticle: true });
    }
}
