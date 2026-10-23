/**
 * HUD: skor, nyawa, status power, tombol pause.
 */

function updateHUD() {
    document.getElementById("scoreNumber").textContent = score;
    const lifeElements = document.querySelectorAll(".life");
    lifeElements.forEach(function (element, index) {
        if (index < lives) {
            element.classList.remove("dead");
        }
        else {
            element.classList.add("dead");
        }
    });
    const powerStatus = document.getElementById("powerStatus");
    const powerText = document.getElementById("powerText");
    if (powerActive > 0) {
        powerStatus.classList.remove("hidden");
        powerText.textContent = "KILL " + Math.ceil(powerActive / 60) + "s";
    }
    else if (timeStop > 0) {
        powerStatus.classList.remove("hidden");
        powerText.textContent = "TIME STOP " + Math.ceil(timeStop / 60) + "s";
    }
    else {
        powerStatus.classList.add("hidden");
    }
    /* Tombol pause berada di luar arena dan hanya tampil saat gameplay aktif. */
    const pauseButton = document.getElementById("pauseButton");
    if (pauseButton) {
        pauseButton.style.display = (gameState === "playing" || paused) ? "block" : "none";
    }
    if (paused) {
        pauseButton.textContent = "▶ LANJUT";
    }
    else {
        pauseButton.textContent = "⏸ PAUSE";
    }
}
