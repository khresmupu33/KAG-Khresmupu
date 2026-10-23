/**
 * Item & target: spawn, relokasi dari musuh.
 */

function spawnTarget() {
    if (level === 'hard' && hard25SequenceActive)
        return;
    const p = randomPosAwayFromPlayer();
    target.x = p.x;
    target.y = p.y;
    targetSpawnTime = performance.now();
}

function spawnHealth() {
    if (level === 'hard' && hard25SequenceActive)
        return;
    const p = randomPosAwayFromPlayer();
    health.x = p.x;
    health.y = p.y;
    health.visible = true;
    health.pulse = 0;
    healthSpawnTime = performance.now();
}

function spawnPowerup() {
    if (level === 'hard' && hard25SequenceActive)
        return;
    const p = randomPosAwayFromPlayer();
    powerup.x = p.x;
    powerup.y = p.y;
    powerup.visible = true;
    powerup.pulse = 0;
    powerupSpawnTime = performance.now();
}

function spawnTimeStopPowerup() {
    if (level === 'easy' || !timeStopPowerup || (level === 'hard' && hard25SequenceActive))
        return;
    const p = randomPosAwayFromPlayer();
    timeStopPowerup.x = p.x;
    timeStopPowerup.y = p.y;
    timeStopPowerup.visible = true;
    timeStopPowerup.pulse = 0;
}

function relocateCollectibleFromEnemy(enemy) {
    if (!player || collectibleRelocateCooldown > 0)
        return;
    const items = [target, health, powerup, timeStopPowerup];
    let moved = false;
    for (const item of items) {
        if (!item || !item.visible)
            continue;
        if (collide(enemy, item)) {
            const p = randomPosAwayFromPlayer();
            item.x = p.x;
            item.y = p.y;
            item.pulse = 0;
            moved = true;
        }
    }
    if (moved)
        collectibleRelocateCooldown = 18;
}

function updateCollectibleRelocateCooldown() {
    if (collectibleRelocateCooldown > 0)
        collectibleRelocateCooldown--;
}
