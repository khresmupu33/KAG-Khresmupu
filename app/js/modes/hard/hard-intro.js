/**
 * Adegan pembuka mode SULIT.
 */

function initHardIntro() {
    hardIntroTimer = 0;
    hardIntroReady = false;
    hardIntroMeteorList = [];
    for (let i = 0; i < 18; i++)
        hardIntroMeteorList.push({ x: randomInt(20, WIDTH - 20), y: -randomInt(30, 500), speed: randomInt(3, 7), size: randomInt(10, 24), drift: (Math.random() - .5) * 1.5, rot: Math.random() * 6.28 });
}

function drawHardIntro() {
    ctx = bgCtx;
    ctx.fillStyle = '#05010a';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const g = ctx.createRadialGradient(400, 260, 20, 400, 300, 560);
    g.addColorStop(0, 'rgba(126,34,206,.22)');
    g.addColorStop(1, 'rgba(2,3,5,.96)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const t = hardIntroTimer;
    if (t < 270) {
        for (const m of hardIntroMeteorList) {
            const fallY = m.y + t * m.speed;
            if (fallY > HEIGHT + 40)
                continue;
            let x = m.x + m.drift * t * .2, y = fallY;
            if (t > 150) {
                const blow = Math.min(1, (t - 150) / 90);
                x += blow * 430 + Math.sin(m.rot + t * .03) * 35;
                y -= blow * 150;
            }
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(m.rot + t * .04);
            ctx.fillStyle = '#7e22ce';
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#c084fc';
            ctx.beginPath();
            ctx.moveTo(0, -m.size);
            ctx.lineTo(m.size * .55, 0);
            ctx.lineTo(0, m.size);
            ctx.lineTo(-m.size * .55, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }
    // Lord Vindex = sprite CSS (di atas latar, di bawah kilat/tint/teks)
    Sprites.showCinematicVindex(400, 235 + Math.sin(t * .025) * 4, 38 / 22);
    ctx = fxCtx;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (t > 80 && t < 255) {
        ctx.save();
        ctx.strokeStyle = 'rgba(216,180,254,.7)';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#a855f7';
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo(55 + i * 16, 95 + i * 18);
            ctx.quadraticCurveTo(250, 245, 380, 235);
            ctx.stroke();
        }
        ctx.restore();
    }
    if (t >= 150 && t < 280) {
        ctx.save();
        ctx.globalAlpha = .15 + .35 * Math.min(1, (t - 150) / 80);
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.restore();
    }
    if (t >= 255 && t < 360) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (t - 255) / 40);
        ctx.fillStyle = 'rgba(126,34,206,.32)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.restore();
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 28px Arial';
    ctx.fillText('LORD VINDEX', WIDTH / 2, 385);
    ctx.font = '700 15px Arial';
    ctx.fillStyle = '#d8b4fe';
    if (t < 90)
        ctx.fillText('AKU YANG BERTANGGUNG JAWAB ATAS SIAPA YANG MENANG.', WIDTH / 2, 415);
    else if (t < 255)
        ctx.fillText('"LIHAT BAIK-BAIK. METEOR PUN TUNDUK PADAKU."', WIDTH / 2, 415);
    else
        ctx.fillText('"KALI INI PERMAINAN DI TANGANKU."', WIDTH / 2, 415);
    if (t >= 360) {
        ctx.fillStyle = '#fff';
        ctx.font = '900 18px Arial';
        ctx.fillText('TEKAN SPASI UNTUK MEMULAI', WIDTH / 2, 475);
        ctx.font = '700 12px Arial';
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('Kali ini tidak ada yang mengatur jalanku selain Vindex.', WIDTH / 2, 500);
    }
}

function runHardIntro(now = performance.now()) {
    if (gameState !== 'hardIntro')
        return;
    if (!hardIntroLastTime)
        hardIntroLastTime = now;
    let elapsed = now - hardIntroLastTime;
    hardIntroLastTime = now;
    if (elapsed > 100)
        elapsed = 100;
    hardIntroTimer = Math.min(420, hardIntroTimer + elapsed / FIXED_STEP_MS);
    drawHardIntro();
    if (hardIntroTimer >= 360)
        hardIntroReady = true;
    requestAnimationFrame(runHardIntro);
}
