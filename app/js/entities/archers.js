/**
 * Archer: bidik, tembak panah, teleport.
 */

function spawnArcher(x = null, y = null) {
    if (level === 'easy')
        return;
    if (archers.length >= MAX_ARCHERS)
        return;
    const p = randomPosAwayFromPlayer();
    const a = { x: x ?? p.x, y: y ?? p.y, w: 22, h: 22, loading: ARCHER_LOAD_TIME, aim: 0, fire: 35, phase: Math.random() * 6.28, flash: 0, dead: false, evadeCooldown: 0, spawnAnim: 1, teleportAnim: 0 };
    archers.push(a);
}

function updateArchers() {
    if (!player || level === 'easy')
        return;
    const slow = enemySlowFactor();
    for (let i = archers.length - 1; i >= 0; i--) {
        const a = archers[i];
        if (a.dead) {
            archers.splice(i, 1);
            continue;
        }
        if (a.vindexKnockbackCooldown > 0)
            a.vindexKnockbackCooldown--;
        relocateCollectibleFromEnemy(a);
        a.phase += .1 * slow;
        a.spawnAnim = Math.max(0, a.spawnAnim - .045 * slow);
        a.teleportAnim = Math.max(0, a.teleportAnim - .08 * slow);
        a.flash = Math.max(0, a.flash - 1 * slow);
        a.aim = angleTo(a, player);
        if (a.evadeCooldown > 0)
            a.evadeCooldown -= slow;
        if (a.loading > 0) {
            a.loading -= slow;
            continue;
        }
        const dx = player.x - a.x, dy = player.y - a.y, dist = Math.hypot(dx, dy) || 1;
        /*
         * Power Kill membuat Archer panik dan berpindah INSTAN.
         * Ia tidak lari sedikit demi sedikit, sehingga player tidak
         * bisa sekadar mengejar dan menyentuhnya.
         * Jika player sudah benar-benar menyentuh Archer pada frame
         * sebelum teleport, collision tetap bisa membunuhnya.
         */
        if (powerActive > 0 && dist < ARCHER_POWER_EVADE_DISTANCE && a.evadeCooldown <= 0) {
            let safe = null;
            for (let n = 0; n < 30; n++) {
                const p = randomPosAwayFromPlayer();
                const d = Math.hypot(p.x - a.x, p.y - a.y);
                if (d >= ARCHER_POWER_TELEPORT_DISTANCE) {
                    safe = p;
                    break;
                }
            }
            if (!safe)
                safe = randomPosAwayFromPlayer();
            const oldX = a.x + a.w / 2, oldY = a.y + a.h / 2;
            createTeleportParticles(oldX, oldY, 18);
            a.x = safe.x;
            a.y = safe.y;
            createTeleportParticles(a.x + a.w / 2, a.y + a.h / 2, 18);
            a.evadeCooldown = 28;
            a.flash = 10;
            a.teleportAnim = 1;
            a.aim = angleTo(a, player);
        }
        else if (powerActive <= 0) {
            /* Di luar Power Kill, Archer menjaga jarak dan tidak mengejar cepat. */
            const desired = 250;
            if (dist > desired) {
                a.x += (dx / dist) * ARCHER_SPEED * .28 * slow;
                a.y += (dy / dist) * ARCHER_SPEED * .28 * slow;
            }
            else if (dist < 170) {
                a.x -= (dx / dist) * ARCHER_SPEED * .18 * slow;
                a.y -= (dy / dist) * ARCHER_SPEED * .18 * slow;
            }
        }
        a.x = Math.max(12, Math.min(WIDTH - a.w - 12, a.x));
        a.y = Math.max(70, Math.min(HEIGHT - a.h - 12, a.y));
        a.fire -= slow;
        if (a.fire <= 0) {
            const ang = a.aim;
            archerArrows.push({
                x: a.x + a.w / 2, y: a.y + a.h / 2, w: 8, h: 8,
                vx: Math.cos(ang) * ARCHER_ARROW_SPEED,
                vy: Math.sin(ang) * ARCHER_ARROW_SPEED,
                life: 180
            });
            a.fire = ARCHER_FIRE_INTERVAL + randomInt(-25, 30);
        }
    }
    /* Panah juga terkena efek Time Stop, tetapi tidak terkena slow dua kali. */
    const arrowSlow = enemySlowFactor();
    for (let i = archerArrows.length - 1; i >= 0; i--) {
        const q = archerArrows[i];
        q.x += q.vx * arrowSlow;
        q.y += q.vy * arrowSlow;
        q.life -= arrowSlow;
        if (q.life <= 0 || q.x < -20 || q.x > WIDTH + 20 || q.y < -20 || q.y > HEIGHT + 20) {
            archerArrows.splice(i, 1);
            continue;
        }
    }
}

function checkArcherCollisions() {
    if (level === 'easy' || !player)
        return;
    for (const a of archers) {
        if (a.dead)
            continue;
        if (collide(player, a)) {
            if (powerActive > 0 || timeStop > 0) {
                a.dead = true;
                createDisintegrationParticles(a);
                screenShake = 8;
                continue;
            }
            if (hitCooldown <= 0) {
                lives--;
                hitCooldown = ARCHER_ARROW_DAMAGE_COOLDOWN;
                globalFreeze = 20;
                screenShake = 8;
                if (lives <= 0) {
                    lives = 0;
                    playerDeathMax = 100;
                    playerDeathTimer = 100;
                    createPlayerDeathParticles();
                    return;
                }
            }
        }
    }
    if (timeStop > 0)
        return;
    if (hitCooldown > 0)
        return;
    for (let i = archerArrows.length - 1; i >= 0; i--) {
        if (collide(player, archerArrows[i])) {
            lives--;
            hitCooldown = ARCHER_ARROW_DAMAGE_COOLDOWN;
            screenShake = 9;
            archerArrows.splice(i, 1);
            if (lives <= 0) {
                lives = 0;
                playerDeathMax = 100;
                playerDeathTimer = 100;
                createPlayerDeathParticles();
                return;
            }
        }
    }
}

function createTeleportParticles(x, y, amount = 14) {
    for (let i = 0; i < amount; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = randomInt(2, 6);
        particleList.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, size: randomInt(2, 4), life: randomInt(18, 32), maxLife: 32 });
    }
}
