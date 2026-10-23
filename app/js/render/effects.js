/**
 * Efek kanvas di atas karakter: partikel, gelombang Time Stop, laser, banner, overlay.
 */

function drawParticles() {
    ctx.save();
    for (let i = 0; i < particleList.length; i++) {
        const p = particleList[i];
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.deathParticle ? "#f472b6" : (p.meteorParticle ? "#f97316" : "#ef4444");
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.restore();
}

function drawTimeStopWave() {
    if (timeStop <= 0 && timeStopWave <= 0)
        return;
    const progress = Math.min(1, timeStopWave / TIME_STOP_DURATION);
    const slowProgress = 1 - Math.pow(1 - progress, 0.72);
    const cx = timeStopOriginX || (player ? player.x + player.w / 2 : WIDTH / 2);
    const cy = timeStopOriginY || (player ? player.y + player.h / 2 : HEIGHT / 2);
    const maxR = Math.hypot(WIDTH, HEIGHT) * .72;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 3; i++) {
        const offset = i * .14;
        const waveProgress = Math.min(1, Math.max(0, slowProgress - offset));
        const r = 25 + waveProgress * maxR;
        const alpha = (1 - waveProgress) * .22;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 3 - i * .55;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.globalAlpha = .10 + Math.sin(timeStopWavePulse) * .025;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
}

function drawArcherWarning() {
    if (level !== 'normal' || archerWarningTimer <= 0)
        return;
    const pulse = 0.72 + Math.sin(performance.now() * 0.018) * 0.28;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = 'rgba(127,29,29,.88)';
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(180, 18, 440, 42, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff7ed';
    ctx.font = '900 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(archerWarningText, WIDTH / 2, 45);
    ctx.restore();
}

function drawStoryMessage() {
    if (storyMessageTimer <= 0 || !storyMessage)
        return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, storyMessageTimer / 25);
    ctx.fillStyle = 'rgba(2,3,5,.88)';
    ctx.strokeStyle = 'rgba(168,85,247,.7)';
    ctx.lineWidth = 1;
    ctx.roundRect(115, HEIGHT - 70, 570, 44, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(storyMessage, WIDTH / 2, HEIGHT - 43);
    ctx.restore();
    storyMessageTimer--;
}

function drawVindexPowerAttack() {
    if (level !== 'hard' || !vindexPowerAttack || !lordVindex)
        return;
    const a = vindexPowerAttack;
    const cx = lordVindex.x + lordVindex.w / 2, cy = lordVindex.y + lordVindex.h / 2;
    const len = Math.hypot(WIDTH, HEIGHT) * 1.1;
    ctx.save();
    ctx.translate(cx, cy);
    if (!a.hit) {
        const p = 1 - a.timer / VINDEX_POWER_CHARGE_TIME;
        ctx.globalAlpha = .28 + .55 * p;
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(0, 0, 24 + p * 32 + Math.sin(p * 30) * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = .9;
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 3 + p * 4;
        ctx.beginPath();
        ctx.arc(0, 0, 30 + p * 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.rotate(a.angle);
        ctx.globalAlpha = .18 + .32 * p;
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(0, -VINDEX_POWER_BEAM_WIDTH / 2, len, VINDEX_POWER_BEAM_WIDTH);
        ctx.globalAlpha = .95;
        ctx.fillStyle = '#f5d0fe';
        ctx.font = '900 15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('VINDEX MENGISI KEKUATAN...', 0, -48);
    }
    else {
        ctx.rotate(a.angle);
        const p = a.timer / 32;
        ctx.globalAlpha = .18 + .6 * p;
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(0, -VINDEX_POWER_BEAM_WIDTH / 2, len, VINDEX_POWER_BEAM_WIDTH);
        ctx.globalAlpha = .95;
        ctx.fillStyle = '#f5d0fe';
        ctx.fillRect(0, -7, len, 14);
        ctx.globalAlpha = .7;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, -3, len, 6);
    }
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = .9;
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(a.x, a.y, 45 + Math.sin(a.timer * .18) * 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
}

function drawHard25SequenceOverlay() {
    if (level !== 'hard' || !hard25SequenceActive)
        return;
    const t = hard25SequenceTimer;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (t < 150) {
        const p = Math.min(1, t / 150);
        const ease = 1 - Math.pow(1 - p, 3);
        ctx.globalAlpha = .10 + .82 * p;
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = .95 * (1 - p * .35);
        ctx.fillStyle = '#f5d0fe';
        ctx.beginPath();
        ctx.arc(400, 300, 28 + ease * 82, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 18; i++) {
            const a = i * Math.PI * 2 / 18;
            const r = 45 + ease * (95 + (i % 5) * 22);
            const x = 400 + Math.cos(a) * r, y = 300 + Math.sin(a) * r;
            ctx.globalAlpha = .9 * (1 - p);
            ctx.strokeStyle = '#e9d5ff';
            ctx.lineWidth = 4 + (i % 3);
            ctx.beginPath();
            ctx.moveTo(400 + Math.cos(a) * (r - 25), 300 + Math.sin(a) * (r - 25));
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        for (let ring = 0; ring < 4; ring++) {
            ctx.globalAlpha = (.8 - ring * .15) * (1 - p);
            ctx.strokeStyle = ring % 2 ? '#c084fc' : '#f5d0fe';
            ctx.lineWidth = 7 - ring;
            ctx.beginPath();
            ctx.arc(400, 300, 60 + ease * (70 + ring * 70), 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    else if (t < 600) {
        ctx.globalAlpha = .94;
        ctx.fillStyle = 'rgba(3,3,8,.94)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '900 34px Arial';
        ctx.fillText('GAME OVER', 400, 245);
        ctx.fillStyle = '#d8b4fe';
        ctx.font = '700 16px Arial';
        ctx.fillText('Poin : ' + score, 400, 285);
        const remain = Math.max(0, Math.ceil((600 - t) / 60));
        ctx.fillStyle = '#a78bfa';
        ctx.font = '700 14px Arial';
        ctx.fillText('Vindex sedang menyiapkan sesuatu... ' + remain, 400, 325);
    }
    else if (t < 900) {
        const p = (t - 600) / 300;
        ctx.globalAlpha = .18 + .18 * Math.sin(p * Math.PI);
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#f8fafc';
        ctx.font = '900 30px Arial';
        ctx.fillText('LORD VINDEX', 400, 245);
        ctx.fillStyle = '#d8b4fe';
        ctx.font = '700 18px Arial';
        ctx.fillText('"OH TIDAK... AKU TERLALU KUAT."', 400, 285);
        ctx.font = '700 15px Arial';
        ctx.fillStyle = '#c4b5fd';
        ctx.fillText('"Tapi aku akan memberimu kesempatan sekali lagi."', 400, 320);
    }
    else if (t < 1080) {
        ctx.globalAlpha = .96;
        ctx.fillStyle = 'rgba(3,3,8,.72)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '900 30px Arial';
        ctx.fillText('KEMBALI KE ARENA', 400, 245);
        ctx.fillStyle = '#d8b4fe';
        ctx.font = '700 16px Arial';
        ctx.fillText('"Ini yang membedakan diriku dengan yang lain, kesempatan."', 400, 292);
        ctx.fillStyle = '#fff';
        ctx.font = '900 19px Arial';
        ctx.fillText('BERSIAP... MENUJU FASE LANJUTAN', 400, 355);
        ctx.fillStyle = '#a78bfa';
        ctx.font = '700 12px Arial';
        ctx.fillText('Lord Vindex menunggumu di arena berikutnya.', 400, 382);
    }
    else {
        const p = Math.min(1, (t - 1080) / 90);
        ctx.globalAlpha = .35 + .65 * p;
        ctx.fillStyle = '#05020a';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = .9 * (1 - p);
        ctx.fillStyle = '#d8b4fe';
        ctx.font = '900 24px Arial';
        ctx.fillText('FASE LANJUTAN', 400, 300);
    }
    ctx.restore();
}

function drawVindexTimeStopWave() {
    if (level !== 'hard' || vindexTimeStop <= 0 || !lordVindex || lordVindex.dead)
        return;
    const progress = 1 - (vindexTimeStop / 300);
    const eased = 1 - Math.pow(1 - progress, .72);
    const cx = timeStopOriginX || (lordVindex.x + lordVindex.w / 2);
    const cy = timeStopOriginY || (lordVindex.y + lordVindex.h / 2);
    const maxR = Math.hypot(WIDTH, HEIGHT) * .72;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 3; i++) {
        const offset = i * .14;
        const waveProgress = Math.min(1, Math.max(0, eased - offset));
        const r = 25 + waveProgress * maxR;
        ctx.globalAlpha = (1 - waveProgress) * .22;
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3 - i * .55;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.globalAlpha = .08 + Math.sin(vindexLaserPulse) * .035;
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
}

function drawVindexLaser() {
    if (level !== 'hard' || !vindexLaserActive || !lordVindex || lordVindex.dead)
        return;
    const targeting = vindexLaserCountdown > 0;
    const timeStopping = vindexTimeStop > 0;
    const chasingTarget = timeStopping || targeting;
    const firing = vindexLaserFireTimer > 0;
    if (!chasingTarget && !firing)
        return;
    /*
     * TARGETING: pusat visual boleh mengikuti Vindex karena ini hanya indikator.
     * FIRING: gunakan origin yang sudah disimpan ketika laser ditembakkan.
     * Dengan demikian posisi/arah laser tidak pernah mengikuti player lagi.
     */
    const cx = firing ? vindexLaserOriginX : (lordVindex.x + lordVindex.w / 2);
    const cy = firing ? vindexLaserOriginY : (lordVindex.y + lordVindex.h / 2);
    const pulse = .65 + .35 * Math.sin(vindexLaserPulse);
    const beamLen = Math.hypot(WIDTH, HEIGHT) * 1.1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(vindexLaserAngle);
    if (chasingTarget) {
        /* Selama Time Stop target mengejar player; setelah Time Stop target tetap diam 1 detik. */
        ctx.globalAlpha = .10 + .08 * Math.sin(vindexLaserPulse * 1.4);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(0, -VINDEX_POWER_BEAM_WIDTH / 2, beamLen, VINDEX_POWER_BEAM_WIDTH);
        ctx.globalAlpha = .65 + .2 * Math.sin(vindexLaserPulse * 1.4);
        ctx.strokeStyle = '#f5d0fe';
        ctx.lineWidth = 2;
        ctx.setLineDash([18, 12]);
        ctx.beginPath();
        ctx.moveTo(0, -VINDEX_POWER_BEAM_WIDTH / 2);
        ctx.lineTo(beamLen, -VINDEX_POWER_BEAM_WIDTH / 2);
        ctx.moveTo(0, VINDEX_POWER_BEAM_WIDTH / 2);
        ctx.lineTo(beamLen, VINDEX_POWER_BEAM_WIDTH / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    else if (firing) {
        /* Laser aktif: posisi dan arah sudah FROZEN. */
        ctx.globalAlpha = .22 + .12 * pulse;
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(0, -VINDEX_POWER_BEAM_WIDTH / 2, beamLen, VINDEX_POWER_BEAM_WIDTH);
        ctx.globalAlpha = .92;
        ctx.fillStyle = '#f5d0fe';
        ctx.fillRect(0, -Math.max(3, VINDEX_POWER_BEAM_WIDTH * .22), beamLen, Math.max(6, VINDEX_POWER_BEAM_WIDTH * .44));
        ctx.globalAlpha = .75;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 + pulse * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(beamLen, 0);
        ctx.stroke();
    }
    ctx.restore();
    /*
     * Garis menuju player HANYA ditampilkan saat targeting.
     * Saat laser aktif, tidak ada lagi garis yang bergerak menuju player.
     */
    if (chasingTarget) {
        ctx.save();
        ctx.globalAlpha = .9;
        ctx.strokeStyle = '#d8b4fe';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(vindexLaserX, vindexLaserY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = .9;
    ctx.fillStyle = '#f5d0fe';
    ctx.font = '900 13px Arial';
    ctx.textAlign = 'center';
    if (timeStopping) {
        ctx.fillText('TIME STOP VINDEX — DUNIA MELAMBAT', WIDTH / 2, 82);
    }
    else if (targeting) {
        ctx.fillText('LASER DALAM ' + Math.ceil(vindexLaserCountdown / 60) + 's — TARGET TERKUNCI', WIDTH / 2, 82);
    }
    else if (firing) {
        ctx.fillText('⚡ LASER VINDEX — TARGET TERKUNCI', WIDTH / 2, 82);
    }
    ctx.restore();
}

/** Efek meteor di atas karakter: serangan Vindex, peringatan, gelombang kejut, banner. */
function drawMeteorEffects() {
    if (level === 'hard')
        drawVindexPowerAttack();
    if (meteorShockwave && meteorShockwave.life > 0) {
        ctx.save();
        ctx.globalAlpha = meteorShockwave.life / 42;
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(meteorShockwave.x, meteorShockwave.y, meteorShockwave.r + (meteorShockwave.max - meteorShockwave.r) * (1 - meteorShockwave.life / 42), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    if (largeMeteorWarning) {
        ctx.save();
        const w = largeMeteorWarning, p = 1 + Math.sin(w.phase * 2) * .06;
        ctx.globalAlpha = .25;
        ctx.fillStyle = level === 'hard' ? "#7e22ce" : "#ef4444";
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius * p, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = .9;
        ctx.strokeStyle = level === 'hard' ? "#d8b4fe" : "#fca5a5";
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius * p, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.textAlign = "center";
        ctx.font = "900 16px Arial";
        ctx.fillStyle = "#fee2e2";
        ctx.fillText(level === 'hard' ? '⚠ KEKUATAN VINDEX SEDANG MENGISI' : '⚠ METEOR BATU BESAR', w.x, w.y - w.radius - 12);
        ctx.restore();
    }
    if (meteorPreShowerActive) {
        ctx.save();
        ctx.globalAlpha = .95;
        ctx.textAlign = "center";
        ctx.font = "bold 17px Arial";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("☄ METEOR AKAN DATANG ☄", WIDTH / 2, 42);
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = "#fde68a";
        ctx.fillText("Persiapan...", WIDTH / 2, 61);
        ctx.restore();
    }
    else if (meteorWarningTimer > 0) {
        ctx.save();
        ctx.globalAlpha = .95;
        ctx.textAlign = "center";
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#fb923c";
        ctx.fillText("☄ HUJAN METEOR ☄", WIDTH / 2, 42);
        ctx.restore();
    }
}
