/**
 * Lord Vindex (khusus mode SULIT): gerak, tabrakan, dorongan.
 */

function spawnLordVindex() {
    lordVindex = { x: 389, y: 45, w: 42, h: 42, phase: 0, fire: 45, attack: 0, flash: 0, dead: false, react: 0, evadeCooldown: 0, contactCooldown: 0 };
    vindexMoveDelay = VINDEX_MOVE_DELAY;
}

function updateLordVindex() {
    if (level !== 'hard' || !lordVindex || lordVindex.dead || !player)
        return;
    const l = lordVindex;
    relocateCollectibleFromEnemy(l);
    l.phase += .07;
    l.flash = Math.max(0, l.flash - 1);
    const dx = player.x - l.x, dy = player.y - l.y, dist = Math.hypot(dx, dy) || 1, ang = Math.atan2(dy, dx);
    if (l.contactCooldown > 0)
        l.contactCooldown--;
    if (vindexTimeStop > 0 || vindexLaserCountdown > 0 || vindexLaserFireTimer > 0) {
        l.fire = Math.max(l.fire, 30);
        l.react = Math.max(l.react, 1);
        return;
    }
    if (vindexMoveDelay > 0) {
        vindexMoveDelay--;
        l.fire = Math.max(l.fire, 30);
        l.react = Math.max(l.react, 1);
        return;
    }
    if (vindexTimeStop > 0) {
        /* Gerak random Time Stop ditangani updateVindexTimeStop(). */
    }
    else if (powerActive > 0) {
        if (l.evadeCooldown > 0)
            l.evadeCooldown--;
        if (dist < ARCHER_POWER_EVADE_DISTANCE && l.evadeCooldown <= 0) {
            let safe = null;
            for (let n = 0; n < 30; n++) {
                const p = randomPosAwayFromPlayer();
                const d = Math.hypot(p.x - l.x, p.y - l.y);
                if (d >= ARCHER_POWER_TELEPORT_DISTANCE) {
                    safe = p;
                    break;
                }
            }
            if (!safe)
                safe = randomPosAwayFromPlayer();
            const oldX = l.x + l.w / 2, oldY = l.y + l.h / 2;
            createTeleportParticles(oldX, oldY, 22);
            l.x = safe.x;
            l.y = safe.y;
            createTeleportParticles(l.x + l.w / 2, l.y + l.h / 2, 22);
            l.evadeCooldown = vindexTimeStop > 0 ? 12 : 24;
            l.flash = 12;
            l.react = 36;
            l.attack += .3;
        }
        else {
            l.x -= Math.cos(ang) * LORD_EVADE_SPEED * (vindexTimeStop > 0 ? 1.25 : 1.0);
            l.y -= Math.sin(ang) * LORD_EVADE_SPEED * (vindexTimeStop > 0 ? 1.25 : 1.0);
            l.react = 24;
        }
    }
    else {
        l.x += Math.cos(ang) * LORD_SPEED;
        l.y += Math.sin(ang) * LORD_SPEED;
    }
    l.x = Math.max(35, Math.min(WIDTH - l.w - 35, l.x));
    l.y = Math.max(25, Math.min(HEIGHT - l.h - 35, l.y));
    l.fire--;
    if (l.fire <= 0) {
        archerArrows.push({ x: l.x + l.w / 2, y: l.y + l.h / 2, w: 11, h: 11, vx: Math.cos(ang) * 4.2, vy: Math.sin(ang) * 4.2, life: 190, lord: true });
        l.fire = 145;
    }
    l.attack += .045;
    l.react = Math.max(0, l.react - .5);
}

function checkLordCollision() {
    if (level !== 'hard' || !lordVindex || lordVindex.dead || !player)
        return;
    if (collide(player, lordVindex)) {
        /* Saat bersentuhan, keduanya saling terpental sedikit agar tidak menempel. */
        separatePlayerAndVindex(lordVindex.contactCooldown <= 0 ? 9 : 4);
        lordVindex.contactCooldown = 8;
        lordVindex.react = 28;
        if (powerActive > 0 || timeStop > 0 || vindexTimeStop > 0) {
            if (powerActive > 0) {
                lordVindex.evadeCooldown = 0;
                createTeleportParticles(lordVindex.x + lordVindex.w / 2, lordVindex.y + lordVindex.h / 2, 12);
            }
            if (powerActive > 0 && timeStop > 0) {
                storyMessage = 'LORD VINDEX: "TIME STOP TIDAK BERFUNGSI PADAKU."';
                storyMessageTimer = 95;
            }
            return;
        }
        if (hitCooldown <= 0) {
            lives = Math.max(0, lives - 1);
            hitCooldown = 45;
            globalFreeze = 28;
            screenShake = 10;
            storyMessage = 'LORD VINDEX MENYENTUHMU — 1 NYAWA HILANG';
            storyMessageTimer = 90;
            if (lives <= 0) {
                lives = 0;
                playerDeathMax = 100;
                playerDeathTimer = 100;
                createPlayerDeathParticles();
            }
        }
    }
}

function pushEnemyByVindex(enemy, force = 42) {
    if (!enemy || enemy.dead || enemy.disintegrating)
        return;
    if (enemy.vindexKnockbackCooldown > 0)
        return;
    enemy.vindexKnockbackCooldown = 14;
    const vx = enemy.x + enemy.w / 2 - (lordVindex.x + lordVindex.w / 2);
    const vy = enemy.y + enemy.h / 2 - (lordVindex.y + lordVindex.h / 2);
    let d = Math.hypot(vx, vy);
    let nx, ny;
    if (d < .001) {
        const a = Math.random() * Math.PI * 2;
        nx = Math.cos(a);
        ny = Math.sin(a);
        d = 1;
    }
    else {
        nx = vx / d;
        ny = vy / d;
    }
    const oldX = enemy.x + enemy.w / 2, oldY = enemy.y + enemy.h / 2;
    enemy.x += nx * force;
    enemy.y += ny * force;
    const margin = enemy.w <= 22 ? 12 : 18;
    enemy.x = Math.max(margin, Math.min(WIDTH - enemy.w - margin, enemy.x));
    enemy.y = Math.max(70, Math.min(HEIGHT - enemy.h - margin, enemy.y));
    enemy.hitFlash = 10;
    enemy.flash = 10;
    enemy.knockbackX = nx * 4;
    enemy.knockbackY = ny * 4;
    enemy.knockbackTimer = 12;
    if (enemy.panicTimer !== undefined)
        enemy.panicTimer = 12;
    createTeleportParticles(oldX, oldY, 10);
    createTeleportParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 10);
}

function checkVindexEnemyCollisions() {
    if (level !== 'hard' || !lordVindex || lordVindex.dead)
        return;
    for (const k of killers) {
        if (k.loading > 0 || k.disintegrating)
            continue;
        if (collide(lordVindex, k))
            pushEnemyByVindex(k, 46);
    }
    for (const a of archers) {
        if (a.dead)
            continue;
        if (collide(lordVindex, a))
            pushEnemyByVindex(a, 46);
    }
}

function separatePlayerAndVindex(push = 7) {
    if (!player || !lordVindex)
        return;
    const pcx = player.x + player.w / 2, pcy = player.y + player.h / 2;
    const vcx = lordVindex.x + lordVindex.w / 2, vcy = lordVindex.y + lordVindex.h / 2;
    let dx = pcx - vcx, dy = pcy - vcy;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.001) {
        dx = 1;
        dy = 0;
    }
    else {
        dx /= dist;
        dy /= dist;
    }
    const playerPush = push * .58;
    const vindexPush = push * .42;
    player.x += dx * playerPush;
    player.y += dy * playerPush;
    lordVindex.x -= dx * vindexPush;
    lordVindex.y -= dy * vindexPush;
    player.x = Math.max(10, Math.min(WIDTH - player.w - 10, player.x));
    player.y = Math.max(70, Math.min(HEIGHT - player.h - 10, player.y));
    lordVindex.x = Math.max(35, Math.min(WIDTH - lordVindex.w - 35, lordVindex.x));
    lordVindex.y = Math.max(25, Math.min(HEIGHT - lordVindex.h - 35, lordVindex.y));
}
