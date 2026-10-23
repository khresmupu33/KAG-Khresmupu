/**
 * Pemicu cerita/dialog & spawn Archer berdasarkan skor.
 */

function updateStoryTriggers() {
    const now = performance.now();
    updateCollectibleRelocateCooldown();
    /* Normal: Archer diberi warning sebelum benar-benar spawn. */
    if ((level === 'normal' || level === 'hard') && score >= ARCHER_FIRST_SCORE && archers.length < MAX_ARCHERS) {
        if (archerWarningTimer <= 0 && now >= archerNextSpawnTime) {
            archerWarningTimer = 180;
            archerWarningText = '⚠ ARCHER AKAN MUNCUL! SIAP-SIAP!';
        }
        if (archerWarningTimer > 0) {
            archerWarningTimer--;
            if (archerWarningTimer <= 0) {
                spawnArcher();
                archerNextSpawnTime = now + randomInt(ARCHER_SPAWN_MIN, ARCHER_SPAWN_MAX);
            }
        }
    }
    if (level === 'hard' && score === 1 && storyMessageTimer <= 0) {
        storyMessage = 'Lord Vindex: "Aku adalah Vindex. Dan kau tidak akan keluar hidup-hidup."';
        storyMessageTimer = 300;
    }
    if (level === 'hard' && !continuationMode && score >= 25 && !hard25Triggered && !hard25Completed) {
        triggerHard25Sequence();
    }
}
