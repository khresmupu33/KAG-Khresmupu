/**
 * Alur permainan: mulai, jeda, ending, game over, ulang.
 */

function startGame(lv, initialScore = null) {
    level = lv;
    score = initialScore === null ? (continuationMode ? 25 : 0) : initialScore;
    lives = 3;
    paused = false;
    if (hardRevivalTimer) {
        clearTimeout(hardRevivalTimer);
        hardRevivalTimer = null;
    }
    hitCooldown = 0;
    globalFreeze = 0;
    powerActive = 0;
    killerSpawnTime = 0;
    particleList = [];
    screenShake = 0;
    playerDeathTimer = 0;
    playerDeathMax = 0;
    meteors = [];
    meteorSessionActive = false;
    meteorSessionTimer = 0;
    meteorNextSpawn = 0;
    meteorSessionUsed = false;
    meteorWarningTimer = 0;
    meteorPreShowerActive = false;
    meteorPreShowerTimer = 0;
    meteorPreShowerNextSpawn = 0;
    meteorPreShowerSpawned = 0;
    meteorShowerUnlocked = false;
    gameState = continuationMode ? 'ready' : (level === 'hard' ? 'hardIntro' : 'ready');
    createGameObjects();
    if (level === 'hard' && !continuationMode)
        initHardIntro();
    showOnly("gameScreen");
    document.getElementById("readyOverlay").style.display = (level === 'hard' && !continuationMode) ? 'none' : 'flex';
    document.getElementById("pauseText").style.display = "none";
    document.getElementById("spawnWarning").style.display = "none";
    updateHUD();
    if (level === 'hard' && !continuationMode) {
        drawHardIntro();
        requestAnimationFrame(runHardIntro);
    }
    else {
        drawGame();
    }
}

function beginPlay() {
    if (level === 'hard' && !continuationMode && gameState === 'hardIntro') {
        if (!hardIntroReady)
            return;
        gameState = 'playing';
        fixedAccumulator = 0;
        lastFrameTime = 0;
        storyMessage = 'LORD VINDEX: "Permainan dimulai."';
        storyMessageTimer = 140;
        document.getElementById('readyOverlay').style.display = 'none';
        requestAnimationFrame(runGame);
        return;
    }
    if (gameState !== "ready") {
        return;
    }
    gameState = "playing";
    fixedAccumulator = 0;
    lastFrameTime = 0;
    document.getElementById("readyOverlay").style.display = "none";
    requestAnimationFrame(runGame);
}

function togglePause() {
    if (gameState !== "playing") {
        return;
    }
    paused = !paused;
    updateHUD();
}

function startEnding() {
    if (gameState === "ending")
        return;
    if (level === 'hard') {
        hardMeteorPermanent = false;
        meteorSessionActive = false;
        archerArrows = [];
        vindexTimeStop = 0;
        vindexLaserActive = false;
        vindexLaserCountdown = 0;
        vindexLaserFireTimer = 0;
        vindexLaserHasHit = false;
        storyMessage = 'Lord Vindex: "Aku mengaku kalah. Aku yang mengakhiri permainan ini."';
        storyMessageTimer = 180;
    }
    gameState = "ending";
    endingIndex = 0;
    endingDestroyIndex = 0;
    endingDestroyedCount = 0;
    endingDestroyTimer = 0;
    endingWaitTimer = 0;
    fixedAccumulator = 0;
    particleList = [];
    if (endingRAF)
        cancelAnimationFrame(endingRAF);
    endingRAF = requestAnimationFrame(runEndingAnimation);
}

function showTrueEnding() {
    gameState = "end";
    showOnly("trueEndingScreen");
}

function showEnd() {
    if (continuationMode) {
        score = 0;
    }
    if (level === 'hard' && score < 100) {
        if (hardRevivalTimer) {
            clearTimeout(hardRevivalTimer);
            hardRevivalTimer = null;
        }
        gameState = 'hardDeath';
        document.getElementById('finalScore').textContent = 'Poin : ' + score;
        const title = document.querySelector('#endScreen .endTitle');
        if (title)
            title.textContent = 'GAME OVER';
        const msg = document.getElementById('hardDeathMessage');
        if (msg) {
            msg.textContent = hard25Triggered
                ? 'Lord Vindex: "Oh tidak... aku tidak sengaja mengeluarkan kekuatan begitu besar. Aku terlalu jauh memaksakan kekuatanku."'
                : 'Lord Vindex: "Kali ini permainan benar-benar berakhir."';
            msg.style.display = 'block';
        }
        document.querySelectorAll('#endScreen .endButtons button').forEach(b => b.style.display = '');
        showOnly('endScreen');
        return;
    }
    gameState = 'end';
    document.getElementById('finalScore').textContent = 'Poin : ' + score;
    const msg = document.getElementById('hardDeathMessage');
    if (msg)
        msg.style.display = 'none';
    document.querySelectorAll('#endScreen .endButtons button').forEach(b => b.style.display = '');
    showOnly('endScreen');
}

function restartGame() {
    if (continuationMode) {
        startGame(level, 0);
        return;
    }
    startGame(level);
}

function showOnly(id) {
    document.querySelectorAll(".screen").forEach(function (screen) {
        screen.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

/** Kembali ke halaman menu. */
function showMenu() {
    location.href = PAGES.menu;
}

/** Animasi ending: setiap killer dihancurkan satu per satu. */
function runEndingAnimation() {
    if (gameState !== "ending")
        return;
    if (level === 'hard' && lordVindex && !lordVindex.dead) {
        lordVindex.dead = true;
        for (const a of archers)
            a.dead = true;
        archers = [];
        archerArrows = [];
        storyMessage = 'LORD VINDEX TERJATUH — SEMUA PEMBURU HANCUR';
        storyMessageTimer = 220;
    }
    // latar + judul (kanvas bawah)
    ctx = bgCtx;
    ctx.fillStyle = "#030305";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#facc15";
    ctx.font = "900 36px Arial";
    ctx.fillText("LEVEL " + MAX_LEVEL, WIDTH / 2, HEIGHT / 2 - 105);
    ctx.fillStyle = "#ef4444";
    ctx.font = "900 25px Arial";
    ctx.fillText("SEMUA KILLER DIHAPUS...", WIDTH / 2, HEIGHT / 2 - 65);

    let allGone = false;
    if (endingDestroyIndex < killers.length) {
        const k = killers[endingDestroyIndex];
        if (!k._endingTriggered) {
            k._endingTriggered = true;
            k.disintegrating = true;
            k.disintegrateTimer = 40;
            createDisintegrationParticles(k);
            screenShake = 7;
        }
        k.disintegrateTimer = Math.max(0, k.disintegrateTimer - 1);
    }
    else {
        allGone = true;
    }

    // karakter: semua killer yang tersisa (sprite CSS), termasuk yang sedang bersurai
    Sprites.syncKillers(killers);

    // efek (kanvas atas)
    ctx = fxCtx;
    Stage.clearFx();
    drawParticles();
    if (!allGone) {
        const k = killers[endingDestroyIndex];
        if (k.disintegrateTimer <= 0) {
            killers.splice(endingDestroyIndex, 1);
            endingDestroyedCount++;
            endingWaitTimer = 16;
        }
    }
    else {
        endingWaitTimer--;
        if (endingWaitTimer <= -35) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#22c55e";
            ctx.font = "900 22px Arial";
            ctx.fillText("SEMUA KILLER HANCUR", WIDTH / 2, HEIGHT / 2 + 10);
            endingRAF = requestAnimationFrame(runEndingAnimation);
            setTimeout(showTrueEnding, 700);
            return;
        }
    }
    updateParticles();
    endingRAF = requestAnimationFrame(runEndingAnimation);
}
