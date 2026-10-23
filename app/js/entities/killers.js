/**
 * Killer: spawn, AI mengejar, tabrakan, kehancuran.
 */

function getKillerSpeed() {
    if (level === "easy") {
        return 2 * enemySlowFactor();
    }
    if (level === "normal") {
        return 2.5 * enemySlowFactor();
    }
    return 2.5 * enemySlowFactor();
}

function addKiller(first = false) {
    const p = randomPosAwayFromPlayer();
    const killer = {
        x: p.x,
        y: p.y,
        w: 20,
        h: 20,
        loading: first ? 90 : KILLER_LOAD_TIME,
        pulse: Math.random() * Math.PI * 2,
        knockbackX: 0,
        knockbackY: 0,
        knockbackTimer: 0,
        elbowCooldown: 0,
        tilt: 0,
        targetTilt: 0,
        scaleX: 1,
        scaleY: 1,
        hitFlash: 0,
        disappointed: 0,
        celebrating: 0,
        celebratingPhase: 0,
        panic: false,
        panicPhase: Math.random() * Math.PI * 2,
        panicTimer: 0,
        disappointedPhase: Math.random() * Math.PI * 2,
        disintegrating: false,
        disintegrateTimer: 0,
        phase: Math.random() * Math.PI * 2
    };
    killers.push(killer);
    showSpawnWarning();
}

let warningTimer = null;

function showSpawnWarning() {
    const warning = document.getElementById("spawnWarning");
    warning.style.display = "block";
    clearTimeout(warningTimer);
    warningTimer =
        setTimeout(function () {
            warning.style.display = "none";
        }, 900);
}

function updateKillers() {
    const sf = worldSlowFactor();
    const speed = getKillerSpeed();
    killers.forEach(function (k) {
        if (k.vindexKnockbackCooldown > 0)
            k.vindexKnockbackCooldown -= sf;
        if (!k.loading && !k.disintegrating) {
            relocateCollectibleFromEnemy(k);
        }
        /*
         * Jika sedang bersurai.
         */
        if (k.disintegrating) {
            updateDisintegratingKiller(k);
            return;
        }
        /*
         * Cooldown.
         */
        if (k.elbowCooldown > 0) {
            k.elbowCooldown -= sf;
        }
        if (k.hitFlash > 0) {
            k.hitFlash -= sf;
        }
        k.pulse += .13 * sf;
        /*
         * Merayakan setelah mengenai player.
         */
        if (k.celebrating > 0) {
            k.celebrating -= sf;
            k.celebratingPhase += .28 * sf;
            k.targetTilt = Math.sin(k.celebratingPhase) * .28;
            k.scaleX = 1 + Math.sin(k.celebratingPhase * 2) * .12;
            k.scaleY = 1 - Math.sin(k.celebratingPhase * 2) * .08;
            return;
        }
        /*
         * Kecewa.
         */
        if (k.disappointed > 0) {
            k.disappointed -= sf;
            k.disappointedPhase += .15 * sf;
            /*
             * Masih diam selama
             * freeze global.
             */
            return;
        }
        /*
         * Global freeze.
         */
        if (globalFreeze > 0) {
            return;
        }
        /*
         * POWER KILL:
         * Killer panik dan menjauh dari icon Power Kill.
         * Setelah icon diambil, mereka menjauh dari player.
         * Kecepatan tetap sama dengan kecepatan normal.
         */
        if (powerActive > 0 && k.loading <= 0) {
            const dangerX = player.x + player.w / 2;
            const dangerY = player.y + player.h / 2;
            const kx = k.x + k.w / 2;
            const ky = k.y + k.h / 2;
            let dx = kx - dangerX;
            let dy = ky - dangerY;
            let dist = Math.hypot(dx, dy);
            if (dist < .001) {
                dx = k.x < WIDTH / 2 ? -1 : 1;
                dy = k.y < HEIGHT / 2 ? -1 : 1;
                dist = Math.hypot(dx, dy);
            }
            /*
             * Steering ala NPC:
             * jangan hanya bergerak lurus menjauh, tetapi juga
             * membaca dinding/pojok agar bisa membelok sebelum mentok.
             */
            let fleeX = dx / dist;
            let fleeY = dy / dist;
            const margin = POWER_SAFE_MARGIN;
            const cx = k.x + k.w / 2;
            const cy = k.y + k.h / 2;
            const leftGap = cx - margin;
            const rightGap = WIDTH - margin - cx;
            const topGap = cy - margin;
            const bottomGap = HEIGHT - margin - cy;
            const wallRange = 95;
            /* Dorongan menjauh dari dinding. Makin dekat dinding,
             * makin kuat dorongannya sehingga NPC berbelok. */
            if (leftGap < wallRange) {
                fleeX += (1 - leftGap / wallRange) * 1.8;
            }
            if (rightGap < wallRange) {
                fleeX -= (1 - rightGap / wallRange) * 1.8;
            }
            if (topGap < wallRange) {
                fleeY += (1 - topGap / wallRange) * 1.8;
            }
            if (bottomGap < wallRange) {
                fleeY -= (1 - bottomGap / wallRange) * 1.8;
            }
            /* Kalau sudah sangat dekat sudut, prioritaskan keluar dari
             * sudut dengan gerakan menyamping, bukan terus menabrak. */
            const cornerX = Math.min(leftGap, rightGap);
            const cornerY = Math.min(topGap, bottomGap);
            if (cornerX < 42 && cornerY < 42) {
                if (leftGap < rightGap)
                    fleeX = Math.abs(fleeX) + .9;
                else
                    fleeX = -Math.abs(fleeX) - .9;
                if (topGap < bottomGap)
                    fleeY = Math.abs(fleeY) + .9;
                else
                    fleeY = -Math.abs(fleeY) - .9;
            }
            const steerDist = Math.hypot(fleeX, fleeY) || 1;
            fleeX /= steerDist;
            fleeY /= steerDist;
            const fleeSpeed = speed * POWER_FLEE_SPEED_MULTIPLIER;
            k.x += fleeX * fleeSpeed * sf;
            k.y += fleeY * fleeSpeed * sf;
            k.x = Math.max(margin, Math.min(WIDTH - k.w - margin, k.x));
            k.y = Math.max(margin, Math.min(HEIGHT - k.h - margin, k.y));
            /* Sedikit belokan visual mengikuti arah gerak. */
            k.targetTilt = Math.max(-.28, Math.min(.28, fleeX * .18));
            k.panicPhase += .55 * sf;
            k.panicTimer = Math.max(k.panicTimer, 3 * sf);
            k.targetTilt = Math.sin(k.panicPhase * 1.7) * .22;
            k.scaleX = .78 + Math.sin(k.panicPhase * 2.1) * .06;
            k.scaleY = 1.16 + Math.abs(Math.sin(k.panicPhase * 2.1)) * .08;
            k.panic = true;
            return;
        }
        k.panic = false;
        /*
         * Loading spawn.
         */
        if (k.loading > 0) {
            k.loading -= sf;
            k.targetTilt *= .9;
            k.tilt += (k.targetTilt - k.tilt) * .2;
            return;
        }
        /*
         * Knockback.
         */
        if (k.knockbackTimer > 0) {
            k.x += k.knockbackX;
            k.y += k.knockbackY;
            k.knockbackX *= Math.pow(.91, sf);
            k.knockbackY *= Math.pow(.91, sf);
            k.knockbackTimer -= sf;
            /*
             * Tetap mengejar.
             */
            moveTowards(k, player, speed * .4 * sf);
        }
        else {
            moveTowards(k, player, speed * sf);
        }
        /*
         * Animasi badan kembali.
         */
        k.targetTilt *= Math.pow(.80, sf);
        k.tilt += (k.targetTilt - k.tilt) * .17;
        k.scaleX += (1 - k.scaleX) * .14;
        k.scaleY += (1 - k.scaleY) * .14;
        wrap(k);
        /*
         * Killer mengenai item.
         */
        if (collide(k, target)) {
            spawnTarget();
        }
        if (health && health.visible && collide(k, health)) {
            spawnHealth();
        }
    });
}

function updateKillerCollisions() {
    for (let i = 0; i < killers.length; i++) {
        for (let j = i + 1; j < killers.length; j++) {
            const k1 = killers[i];
            const k2 = killers[j];
            if (k1.disintegrating || k2.disintegrating) {
                continue;
            }
            if (k1.loading > 0 || k2.loading > 0) {
                continue;
            }
            if (k1.elbowCooldown > 0 || k2.elbowCooldown > 0) {
                continue;
            }
            if (!collide(k1, k2)) {
                continue;
            }
            let dx = (k2.x + k2.w / 2) - (k1.x + k1.w / 2);
            let dy = (k2.y + k2.h / 2) - (k1.y + k1.h / 2);
            let distance = Math.hypot(dx, dy);
            if (distance < .01) {
                const angle = Math.random() * Math.PI * 2;
                dx = Math.cos(angle);
                dy = Math.sin(angle);
                distance = 1;
            }
            dx /= distance;
            dy /= distance;
            /*
             * SIKUTAN SANGAT JAUH.
             *
             * 11 px/frame selama 35 frame
             * lalu melambat.
             */
            k2.knockbackX = dx * KILLER_KNOCKBACK_POWER;
            k2.knockbackY = dy * KILLER_KNOCKBACK_POWER;
            k2.knockbackTimer = KILLER_KNOCKBACK_TIME;
            /*
             * Gerakan miring.
             */
            k2.targetTilt = Math.atan2(dy, dx) * .55;
            k2.scaleX = 1.35;
            k2.scaleY = .68;
            k2.hitFlash = 8;
            /*
             * Cooldown.
             */
            k1.elbowCooldown = KILLER_COLLISION_COOLDOWN;
            k2.elbowCooldown = KILLER_COLLISION_COOLDOWN;
            /*
             * Pisahkan.
             */
            k2.x += dx * 5;
            k2.y += dy * 5;
            k1.x -= dx * 1.5;
            k1.y -= dy * 1.5;
        }
    }
}

function checkPlayerKillers() {
    if (powerActive > 0) {
        for (let i = 0; i < killers.length; i++) {
            const k = killers[i];
            if (k.loading > 0 || k.disintegrating) {
                continue;
            }
            if (collide(player, k)) {
                k.disintegrating = true;
                k.disintegrateTimer = 32;
                createDisintegrationParticles(k);
                k.hitFlash = 12;
                screenShake = 9;
            }
        }
        return;
    }
    if (hitCooldown > 0) {
        hitCooldown--;
        return;
    }
    for (let i = 0; i < killers.length; i++) {
        const k = killers[i];
        if (k.loading > 0 || k.disintegrating) {
            continue;
        }
        if (collide(player, k)) {
            lives--;
            hitCooldown = 30;
            globalFreeze = GLOBAL_KILLER_FREEZE;
            /* Killer yang menyerang MERAYAKAN. */
            k.celebrating = GLOBAL_KILLER_FREEZE + 20;
            k.celebratingPhase = 0;
            k.targetTilt = 0;
            k.scaleX = 1.12;
            k.scaleY = .90;
            /* Killer lain kecewa dengan timing yang sama. */
            killers.forEach(function (other) {
                if (other !== k && !other.disintegrating) {
                    other.disappointed = GLOBAL_KILLER_FREEZE + 20;
                    other.targetTilt = .35;
                    other.scaleX = .85;
                    other.scaleY = 1.15;
                }
            });
            screenShake = 12;
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
            break;
        }
    }
}

function updateDisintegratingKiller(k) {
    if (k.disintegrateTimer > 0) {
        k.disintegrateTimer--;
    }
    if (k.disintegrateTimer === 0) {
        const index = killers.indexOf(k);
        if (index !== -1) {
            killers.splice(index, 1);
        }
    }
}

function createDisintegrationParticles(k) {
    const cx = k.x + k.w / 2;
    const cy = k.y + k.h / 2;
    for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = randomInt(2, 7);
        particleList.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: randomInt(2, 5),
            life: randomInt(25, 50),
            maxLife: 50
        });
    }
}

function updateGlobalFreeze() {
    if (meteorShockwave && meteorShockwave.life > 0)
        meteorShockwave.life--;
    else if (meteorShockwave)
        meteorShockwave = null;
    if (playerShockTimer > 0) {
        playerShockTimer--;
        playerShockX *= .9;
        playerShockY *= .9;
    }
    if (globalFreeze > 0) {
        globalFreeze--;
    }
    if (screenShake > 0) {
        screenShake--;
    }
}
