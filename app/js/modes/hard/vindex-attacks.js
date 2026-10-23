/**
 * Serangan Lord Vindex: Time Stop, laser terkunci, serangan kekuatan.
 */

function lockVindexLaserTarget() {
    if (!player || !lordVindex)
        return;
    const sx = lordVindex.x + lordVindex.w / 2;
    const sy = lordVindex.y + lordVindex.h / 2;
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    let ang = Math.atan2(py - sy, px - sx);
    if (!Number.isFinite(ang))
        ang = 0;
    vindexLaserAngle = ang;
    /*
     * Jangan jadikan posisi player sebagai ujung laser.
     * Laser harus berupa jalur panjang dari Vindex sampai keluar arena,
     * sehingga player yang berada di jalurnya benar-benar terkena.
     */
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const distances = [];
    if (Math.abs(dx) > 0.0001) {
        distances.push((0 - sx) / dx);
        distances.push((WIDTH - sx) / dx);
    }
    if (Math.abs(dy) > 0.0001) {
        distances.push((0 - sy) / dy);
        distances.push((HEIGHT - sy) / dy);
    }
    const positive = distances.filter(d => d > 0 && Number.isFinite(d));
    const far = Math.max(...positive, Math.hypot(WIDTH, HEIGHT) * 1.5);
    vindexLaserX = sx + dx * (far + 40);
    vindexLaserY = sy + dy * (far + 40);
}

function setVindexTimeStopEscapeTarget() {
    if (!lordVindex || !player)
        return;
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    const corners = [{ x: 90, y: 75 }, { x: WIDTH - 90, y: 75 }, { x: 90, y: HEIGHT - 75 }, { x: WIDTH - 90, y: HEIGHT - 75 }];
    corners.sort((a, b) => Math.hypot(b.x - px, b.y - py) - Math.hypot(a.x - px, a.y - py));
    vindexTimeStopMoveX = corners[0].x;
    vindexTimeStopMoveY = corners[0].y;
    vindexTimeStopMoveTimer = 300;
}

function triggerVindexTimeStop() {
    if (level !== 'hard' || !lordVindex || lordVindex.dead || !player || vindexTimeStop > 0 || vindexLaserCountdown > 0 || (!continuationMode && score < 25) || hard25SequenceActive)
        return;
    const dx = player.x - lordVindex.x, dy = player.y - lordVindex.y, dist = Math.hypot(dx, dy) || 1;
    if (dist < 190 || dist > 520)
        return;
    /* TIME STOP terlebih dahulu. Laser BELUM menyerang. */
    vindexTimeStop = 300;
    vindexTimeStopCooldown = randomInt(2100, 3000);
    vindexLaserActive = true;
    vindexLaserCountdown = 0;
    vindexLaserPulse = 0;
    /* Wave dikunci di titik Vindex saat Time Stop DIAKTIFKAN. */
    timeStopOriginX = lordVindex.x + lordVindex.w / 2;
    timeStopOriginY = lordVindex.y + lordVindex.h / 2;
    /* Saat Time Stop dimulai, tentukan pojok terjauh. Vindex bergerak ke sana, TANPA teleport. */
    setVindexTimeStopEscapeTarget();
    /* Daerah target mulai mengejar player PERSIS saat Time Stop dimulai. */
    lockVindexLaserTarget();
    lordVindex.react = 40;
    storyMessage = 'LORD VINDEX: "TIME STOP. SEMUANYA MELAMBAT... KECUALI AKU."';
    storyMessageTimer = 190;
    screenShake = 8;
}

function vindexLaserHitsPlayer() {
    if (!player || !lordVindex)
        return false;
    const sx = vindexLaserOriginX, sy = vindexLaserOriginY;
    const ex = vindexLaserX, ey = vindexLaserY;
    const px = player.x + player.w / 2, py = player.y + player.h / 2;
    const vx = ex - sx, vy = ey - sy;
    const len2 = vx * vx + vy * vy || 1;
    /* Laser dimulai dari Vindex dan membentang jauh melewati arena. */
    const t = ((px - sx) * vx + (py - sy) * vy) / len2;
    if (t < 0)
        return false;
    const qx = sx + vx * t, qy = sy + vy * t;
    return Math.hypot(px - qx, py - qy) <= VINDEX_POWER_BEAM_WIDTH / 2 + Math.max(player.w, player.h) * .35;
}

function vindexLaserHitsRect(entity) {
    if (!entity)
        return false;
    const sx = vindexLaserOriginX, sy = vindexLaserOriginY;
    const ex = vindexLaserX, ey = vindexLaserY;
    const cx = entity.x + entity.w / 2, cy = entity.y + entity.h / 2;
    const vx = ex - sx, vy = ey - sy;
    const len2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((cx - sx) * vx + (cy - sy) * vy) / len2));
    const qx = sx + vx * t, qy = sy + vy * t;
    const radius = VINDEX_POWER_BEAM_WIDTH / 2 + Math.hypot(entity.w, entity.h) * .42;
    return Math.hypot(cx - qx, cy - qy) <= radius;
}

function destroyEnemyByVindexLaser(enemy) {
    if (!enemy)
        return;
    if (enemy.disintegrating || enemy.dead)
        return;
    enemy.disintegrating = true;
    enemy.disintegrateTimer = 38;
    enemy.hitFlash = 18;
    enemy.panic = false;
    createDisintegrationParticles(enemy);
}

function killEnemiesByVindexLaser() {
    if (!lordVindex)
        return;
    for (const k of killers) {
        if (k && k.loading <= 0 && !k.disintegrating && vindexLaserHitsRect(k)) {
            destroyEnemyByVindexLaser(k);
        }
    }
    for (const a of archers) {
        if (a && !a.dead && vindexLaserHitsRect(a)) {
            a.dead = true;
            createDisintegrationParticles(a);
        }
    }
}

function updateVindexTimeStop() {
    if (level !== 'hard')
        return;
    /* =========================
       1. TIME STOP
       Mekanik Time Stop tetap seperti sebelumnya.
       Vindex bergerak sendiri, bukan mengejar player.
    ========================= */
    if (vindexTimeStop > 0) {
        vindexTimeStop--;
        vindexLaserPulse += .18;
        if (lordVindex && vindexTimeStopMoveTimer > 0)
            vindexTimeStopMoveTimer--;
        if (lordVindex) {
            const tx = vindexTimeStopMoveX - (lordVindex.x + lordVindex.w / 2);
            const ty = vindexTimeStopMoveY - (lordVindex.y + lordVindex.h / 2);
            const td = Math.hypot(tx, ty) || 1;
            lordVindex.x += tx / td * LORD_EVADE_SPEED * 1.15;
            lordVindex.y += ty / td * LORD_EVADE_SPEED * 1.15;
            lordVindex.x = Math.max(35, Math.min(WIDTH - lordVindex.w - 35, lordVindex.x));
            lordVindex.y = Math.max(25, Math.min(HEIGHT - lordVindex.h - 35, lordVindex.y));
        }
        /* Daerah target benar-benar mengikuti arah player selama Time Stop. */
        lockVindexLaserTarget();
        if (vindexTimeStop <= 0) {
            /* Time Stop selesai: target sudah mendapat arah player terakhir, lalu DIKUNCI. */
            lockVindexLaserTarget();
            vindexLaserCountdown = 60;
            /* Selama countdown Vindex TIDAK bergerak. */
            vindexLaserFireTimer = 0;
            vindexLaserHasHit = false;
            storyMessage = 'LORD VINDEX: "TARGET TERKUNCI. SATU DETIK SEBELUM LASER..."';
            storyMessageTimer = 100;
        }
        return;
    }
    /* =========================
       2. INDIKATOR / TARGETING
       Hanya garis/daerah peringatan yang mengikuti player.
       Laser BELUM ditembakkan.
    ========================= */
    if (vindexLaserCountdown > 0) {
        /* 1 detik terakhir: daerah target sudah TERKUNCI, tidak mengejar player. */
        vindexLaserCountdown--;
        vindexLaserPulse += .32;
        if (vindexLaserCountdown <= 0 && player && lordVindex && lives > 0) {
            /*
             * DETIK TEMBAK:
             * Ambil target terakhir sekali.
             * Simpan posisi Vindex + arah + ujung laser.
             * Setelah blok ini TIDAK ADA lagi lockVindexLaserTarget()
             * sampai serangan selesai.
             */
            /* Tidak relock di sini: arah/daerah sudah dikunci selama 1 detik. */
            vindexLaserOriginX = lordVindex.x + lordVindex.w / 2;
            vindexLaserOriginY = lordVindex.y + lordVindex.h / 2;
            vindexLaserFireTimer = 42;
            vindexLaserHasHit = false;
            vindexLaserActive = true;
            /* Damage hanya dihitung sekali ketika laser benar-benar menembak. */
            killEnemiesByVindexLaser();
            if (vindexLaserHitsPlayer()) {
                vindexLaserHasHit = true;
                lives = Math.max(0, lives - VINDEX_POWER_DAMAGE);
                hitCooldown = 50;
                screenShake = 16;
                storyMessage = '⚡ LASER VINDEX — 2 NYAWA HILANG';
                storyMessageTimer = 130;
                createMeteorImpactParticles(vindexLaserX, vindexLaserY);
                if (lives <= 0) {
                    lives = 0;
                    playerDeathMax = 100;
                    playerDeathTimer = 100;
                    createPlayerDeathParticles();
                }
            }
            else {
                storyMessage = '⚡ LASER VINDEX — MENGHANCURKAN AREA';
                storyMessageTimer = 90;
            }
        }
        return;
    }
    /* =========================
       3. LASER SEDANG MENEMBAK
       Arah dan posisi TETAP. Tidak mengejar player.
    ========================= */
    if (vindexLaserFireTimer > 0) {
        vindexLaserFireTimer--;
        vindexLaserPulse += .48;
        if (vindexLaserFireTimer <= 0) {
            vindexLaserActive = false;
            vindexLaserHasHit = false;
            vindexMoveDelay = 0;
        }
        return;
    }
    /* =========================
       4. COOLDOWN
    ========================= */
    if (vindexTimeStopCooldown > 0)
        vindexTimeStopCooldown--;
    if (vindexTimeStopCooldown <= 0)
        triggerVindexTimeStop();
}

function triggerVindexPowerAttack() {
    if (level !== 'hard' || !lordVindex || lordVindex.dead || gameState !== 'playing' || vindexPowerAttack)
        return;
    const targetX = randomInt(80, WIDTH - 80);
    const targetY = randomInt(120, HEIGHT - 100);
    const dx = targetX - (lordVindex.x + lordVindex.w / 2);
    const dy = targetY - (lordVindex.y + lordVindex.h / 2);
    const angle = Math.atan2(dy, dx);
    vindexPowerAttack = { timer: VINDEX_POWER_CHARGE_TIME, x: targetX, y: targetY, angle, hit: false };
    lordVindex.react = VINDEX_POWER_CHARGE_TIME;
    screenShake = 5;
    storyMessage = 'LORD VINDEX: "KALI INI, KEKUATANKU MENUJU DAERAH ITU."';
    storyMessageTimer = 150;
}

function updateVindexPowerAttack() {
    if (level !== 'hard' || !vindexPowerAttack)
        return;
    const a = vindexPowerAttack;
    a.timer--;
    if (a.timer <= 0 && !a.hit) {
        a.hit = true;
        const sx = lordVindex.x + lordVindex.w / 2, sy = lordVindex.y + lordVindex.h / 2;
        const ex = sx + Math.cos(a.angle) * Math.hypot(WIDTH, HEIGHT);
        const ey = sy + Math.sin(a.angle) * Math.hypot(WIDTH, HEIGHT);
        if (player) {
            const px = player.x + player.w / 2, py = player.y + player.h / 2, vx = ex - sx, vy = ey - sy, len2 = vx * vx + vy * vy || 1;
            const t = Math.max(0, Math.min(1, ((px - sx) * vx + (py - sy) * vy) / len2));
            const qx = sx + vx * t, qy = sy + vy * t;
            if (Math.hypot(px - qx, py - qy) <= VINDEX_POWER_BEAM_WIDTH / 2 + Math.max(player.w, player.h) * .35 && hitCooldown <= 0) {
                lives = Math.max(0, lives - VINDEX_POWER_DAMAGE);
                hitCooldown = 55;
                screenShake = 22;
                storyMessage = '⚡ SERANGAN KEKUATAN VINDEX — 2 NYAWA HILANG';
                storyMessageTimer = 120;
                createMeteorImpactParticles(a.x, a.y);
                if (lives <= 0) {
                    lives = 0;
                    playerDeathMax = 100;
                    playerDeathTimer = 100;
                    createPlayerDeathParticles();
                }
            }
            else {
                storyMessage = '⚡ SERANGAN VINDEX MENGHANTAM DAERAH TARGET';
                storyMessageTimer = 80;
            }
        }
        a.timer = 32;
        screenShake = 18;
    }
    else if (a.hit) {
        if (a.timer <= 0) {
            vindexPowerAttack = null;
            scheduleNextLargeMeteor();
        }
    }
}
