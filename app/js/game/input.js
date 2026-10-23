/**
 * Input: keyboard (panah/WASD/P) dan tombol layar sentuh.
 */

document.addEventListener("keydown", function (event) {
    const rawKey = event.key;
    const wasdMap = { w: "ArrowUp", a: "ArrowLeft", s: "ArrowDown", d: "ArrowRight" };
    const key = wasdMap[rawKey.toLowerCase()] || rawKey;
    if (level === 'hard' && !continuationMode && gameState === 'hardIntro') {
        if (key === ' ' && hardIntroReady) {
            event.preventDefault();
            beginPlay();
        }
        return;
    }
    if (level === 'hard' && hard25ReadyForInput) {
        event.preventDefault();
        continueAfterHard25();
        return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
        event.preventDefault();
    }
    /*
     * P = PAUSE
     */
    if (key.toLowerCase() === "p") {
        if (gameState === "ready") {
            beginPlay();
            return;
        }
        if (gameState === "playing") {
            togglePause();
            return;
        }
    }
    /*
     * READY.
     */
    if (gameState === "ready") {
        beginPlay();
        return;
    }
    /*
     * PLAY.
     */
    if (gameState === "playing" && !paused) {
        pressedKeys.add(key);
    }
});

document.addEventListener("keyup", function (event) {
    const rawKey = event.key;
    const wasdMap = { w: "ArrowUp", a: "ArrowLeft", s: "ArrowDown", d: "ArrowRight" };
    pressedKeys.delete(wasdMap[rawKey.toLowerCase()] || rawKey);
});

document.querySelectorAll(".controlButton").forEach(function (button) {
    const key = button.dataset.key;
    button.addEventListener("touchstart", function (event) {
        event.preventDefault();
        if (level === 'hard' && hard25ReadyForInput) {
            continueAfterHard25();
            return;
        }
        if (gameState === "ready") {
            beginPlay();
        }
        if (gameState === "playing" && !paused) {
            pressedKeys.add(key);
        }
    }, { passive: false });
    button.addEventListener("touchend", function (event) {
        event.preventDefault();
        pressedKeys.delete(key);
    }, { passive: false });
    button.addEventListener("touchcancel", function (event) {
        event.preventDefault();
        pressedKeys.delete(key);
    }, { passive: false });
    button.addEventListener("mousedown", function () {
        if (gameState === "ready") {
            beginPlay();
        }
        if (gameState === "playing" && !paused) {
            pressedKeys.add(key);
        }
    });
    button.addEventListener("mouseup", function () {
        pressedKeys.delete(key);
    });
    button.addEventListener("mouseleave", function () {
        pressedKeys.delete(key);
    });
});
