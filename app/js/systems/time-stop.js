/**
 * Time Stop: faktor perlambatan dunia/musuh + item.
 */

function enemySlowFactor() { return (timeStop > 0 || vindexTimeStop > 0) ? TIME_STOP_SLOW : 1; }

function worldSlowFactor() { return vindexTimeStop > 0 ? TIME_STOP_SLOW : 1; }

function checkTimeStopPowerup() {
    // Level mudah tidak menggunakan mekanik Time Stop sama sekali.
    if (level === 'easy') {
        timeStop = 0;
        timeStopWave = 0;
        if (timeStopPowerup)
            timeStopPowerup.visible = false;
        return;
    }
    if (timeStopPowerup && timeStopPowerup.visible && collide(player, timeStopPowerup)) {
        timeStopPowerup.visible = false;
        timeStop = TIME_STOP_DURATION;
        timeStopWave = 0;
        timeStopOriginX = player.x + player.w / 2;
        timeStopOriginY = player.y + player.h / 2;
        screenShake = 7;
        storyMessage = '⏳ TIME STOP — DUNIA MELAMBAT 5 DETIK';
        storyMessageTimer = 130;
        timeStopSpawnTime = performance.now() + randomInt(TIME_STOP_RESPAWN_MIN, TIME_STOP_RESPAWN_MAX);
    }
    if (timeStopPowerup && !timeStopPowerup.visible && performance.now() >= timeStopSpawnTime && timeStop <= 0)
        spawnTimeStopPowerup();
}

function updateTimeStop() {
    if (level === 'easy') {
        timeStop = 0;
        timeStopWave = 0;
        timeStopWavePulse = 0;
        if (timeStopPowerup)
            timeStopPowerup.visible = false;
        return;
    }
    if (timeStop > 0) {
        timeStop--;
        timeStopWave = Math.min(TIME_STOP_DURATION, timeStopWave + 1);
        timeStopWavePulse += 0.055;
    }
    else {
        timeStopWave = 0;
        timeStopWavePulse = 0;
    }
    if (timeStopPowerup && timeStopPowerup.visible)
        timeStopPowerup.pulse += .12 * enemySlowFactor();
}
