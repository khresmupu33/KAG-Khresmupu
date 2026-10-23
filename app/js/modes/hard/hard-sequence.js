/**
 * Urutan poin 25: kematian palsu -> transisi ke fase lanjutan.
 */

function hideHard25Collectibles() {
    if (target) {
        target.visible = false;
        target.x = -100;
        target.y = -100;
    }
    if (health) {
        health.visible = false;
        health.x = -100;
        health.y = -100;
    }
    if (powerup) {
        powerup.visible = false;
        powerup.x = -100;
        powerup.y = -100;
    }
    if (timeStopPowerup) {
        timeStopPowerup.visible = false;
        timeStopPowerup.x = -100;
        timeStopPowerup.y = -100;
    }
}

function triggerHard25Sequence() {
    if (hard25SequenceActive || hard25Triggered)
        return;
    hard25Triggered = true;
    hard25SequenceActive = true;
    hard25SequenceTimer = 0;
    hard25SequencePhase = 0;
    hardMeteorPermanent = true;
    meteorSessionActive = false;
    meteors.length = 0;
    largeMeteor = null;
    largeMeteorWarning = null;
    largeMeteorPending = false;
    hideHard25Collectibles();
    screenShake = 12;
    storyMessage = 'LORD VINDEX: "Oh... terlalu besar. Aku salah mengukurnya."';
    storyMessageTimer = 180;
}

function updateHard25Sequence() {
    hard25SequenceTimer++;
    const t = hard25SequenceTimer;
    /* 0-10 detik: aftermath / jeda panjang setelah ledakan. */
    if (t < 600)
        hard25SequencePhase = 0;
    /* 10-15 detik: dialog Vindex. */
    else if (t < 900)
        hard25SequencePhase = 1;
    /* Setelah dialog: transisi otomatis menuju halaman lanjutan. */
    else
        hard25SequencePhase = 2;
    if (t >= 1080) {
        transitionToContinuation();
        return;
    }
    if (t === 150) {
        lives = 0;
        playerDeathTimer = 0;
        createPlayerDeathParticles();
        screenShake = 28;
    }
    if (t === 205) {
        const title = document.querySelector('#endScreen .endTitle');
        const msg = document.getElementById('hardDeathMessage');
        document.getElementById('finalScore').textContent = 'Poin : ' + score;
        if (title)
            title.textContent = 'GAME OVER';
        if (msg) {
            msg.textContent = 'Lord Vindex: "..."';
            msg.style.display = 'block';
        }
        document.querySelectorAll('#endScreen .endButtons button').forEach(b => b.style.display = 'none');
        showOnly('endScreen');
    }
    if (t === 600) {
        const msg = document.getElementById('hardDeathMessage');
        if (msg)
            msg.style.display = 'none';
        document.getElementById('readyOverlay').style.display = 'none';
        showOnly('gameScreen');
        lives = 3;
        playerDeathTimer = 0;
        playerDeathMax = 0;
        hitCooldown = 100;
        globalFreeze = 0;
        player.x = 390;
        player.y = 300;
        if (lordVindex) {
            lordVindex.x = player.x + 150;
            lordVindex.y = player.y - 100;
        }
        hard25DialogueTimer = 300;
        storyMessage = 'LORD VINDEX: "OH TIDAK... AKU TERLALU KUAT."';
        storyMessageTimer = 300;
        screenShake = 16;
    }
    if (t === 900) {
        hard25ReadyForInput = true;
        storyMessage = 'LORD VINDEX: "Ini yang membedakan diriku dengan yang lain, kesempatan."';
        storyMessageTimer = 260;
    }
}

function transitionToContinuation() {
    if (!hard25SequenceActive)
        return;
    hard25SequenceActive = false;
    hard25Completed = true;
    localStorage.setItem('rinfisHardContinueScore', '25');
    /* Pastikan efek ledakan selesai terlihat sebelum browser berpindah halaman. */
    gameState = 'transition';
    window.location.replace(PAGES.hardContinuation);
}

function continueAfterHard25() {
    if (level !== 'hard' || !hard25SequenceActive || !hard25ReadyForInput)
        return;
    hard25ReadyForInput = false;
    hard25SequenceActive = false;
    hard25Completed = true;
    transitionToContinuation();
}
