/**
 * Membuat objek awal permainan (pemain, target, Gadfly, killer pertama, mode).
 */

function createGameObjects() {
    player = { x: 390, y: 300, w: 20, h: 20 };
    target = { x: 350, y: 250, w: 20, h: 20 };
    health = { x: 200, y: 200, w: 25, h: 25, visible: false, pulse: 0 };
    powerup = { x: 0, y: 0, w: 26, h: 26, visible: true, pulse: 0 };
    powerActive = 0;
    meteors = [];
    meteorSessionActive = false;
    meteorSessionTimer = 0;
    meteorNextSpawn = performance.now() + randomInt(METEOR_FIRST_MIN, METEOR_FIRST_MAX);
    meteorSessionUsed = false;
    meteorNextSessionTimer = 0;
    meteorPreShowerActive = false;
    meteorPreShowerTimer = 0;
    meteorPreShowerNextSpawn = 0;
    meteorPreShowerSpawned = 0;
    meteorShowerUnlocked = false;
    meteorWarningTimer = 0;
    meteorPhase = 'idle';
    meteorPhaseTimer = 0;
    meteorBurstCooldown = 0;
    largeMeteorPending = false;
    largeMeteorSpawnTimer = 0;
    largeMeteorWarning = null;
    largeMeteorMilestones = new Set();
    largeMeteorSpawnTimer = randomInt(LARGE_METEOR_RANDOM_MIN, LARGE_METEOR_RANDOM_MAX);
    meteorShockwave = null;
    largeMeteorImpactState = null;
    largeMeteor = null;
    vindexPowerAttack = null;
    vindexMoveDelay = 0;
    playerShockTimer = 0;
    archers = [];
    archerArrows = [];
    lordVindex = null;
    timeStop = 0;
    timeStopWave = 0;
    timeStopOriginX = 0;
    timeStopOriginY = 0;
    timeStopPowerup = { x: 0, y: 0, w: 28, h: 28, visible: false, pulse: 0 };
    timeStopSpawnTime = performance.now() + randomInt(TIME_STOP_FIRST_MIN, TIME_STOP_FIRST_MAX);
    enemiesAwake = true;
    hardMeteorPermanent = false;
    hardFinaleTriggered = false;
    hard25Triggered = false;
    hard25Completed = false;
    hard25SequenceActive = false;
    hard25SequenceTimer = 0;
    hard25SequencePhase = 0;
    hard25ReadyForInput = false;
    hard25ArenaResumeRequested = false;
    hard25DialogueTimer = 0;
    hardIntroLastTime = 0;
    vindexTimeStop = 0;
    // hanya mode SULIT yang memakai Time Stop Vindex (tidak mengonsumsi RNG di mode lain)
    vindexTimeStopCooldown = level !== 'hard' ? 0 : continuationMode ? randomInt(180, 300) : randomInt(420, 720);
    vindexLaserCountdown = 0;
    vindexLaserActive = false;
    vindexLaserX = 0;
    vindexLaserY = 0;
    vindexLaserAngle = 0;
    vindexLaserOriginX = 0;
    vindexLaserOriginY = 0;
    vindexLaserPulse = 0;
    vindexLaserFireTimer = 0;
    vindexLaserHasHit = false;
    storyMessageTimer = 0;
    storyMessage = '';
    killerSpawnTime = performance.now() + KILLER_FIRST_TIME;
    nextKillerSpawnDelay = KILLER_NEXT_TIME;
    killers = [];
    gadflies = [];
    particleList = [];
    globalFreeze = 0;
    screenShake = 0;
    /*
     * Killer pertama.
     */
    addKiller(true);
    /*
     * GADFLY
     *
     * Sama dengan pola file awal:
     *
     * TOP/BOTTOM = horizontal
     * LEFT/RIGHT = vertical
     */
    gadflies = [
        {
            name: "top",
            x: 380,
            y: 0,
            w: 20,
            h: 20,
            freeze: 0,
            hitAnim: 0,
            hitVX: 0,
            hitVY: 0,
            rotation: 0,
            rotationSpeed: 0
        },
        {
            name: "bottom",
            x: 380,
            y: 580,
            w: 20,
            h: 20,
            freeze: 0,
            hitAnim: 0,
            hitVX: 0,
            hitVY: 0,
            rotation: 0,
            rotationSpeed: 0
        },
        {
            name: "left",
            x: 0,
            y: 280,
            w: 20,
            h: 20,
            freeze: 0,
            hitAnim: 0,
            hitVX: 0,
            hitVY: 0,
            rotation: 0,
            rotationSpeed: 0
        },
        {
            name: "right",
            x: 780,
            y: 280,
            w: 20,
            h: 20,
            freeze: 0,
            hitAnim: 0,
            hitVX: 0,
            hitVY: 0,
            rotation: 0,
            rotationSpeed: 0
        }
    ];
    if (level === 'normal' || level === 'hard') {
        archerNextSpawnTime = performance.now() + randomInt(ARCHER_SPAWN_MIN, ARCHER_SPAWN_MAX);
        archerWarningTimer = 0;
        archerWarningText = '';
    }
    if (level === 'hard') {
        spawnLordVindex();
        storyMessage = 'Lord Vindex: "Lihat baik-baik. Ini baru permulaan."';
        storyMessageTimer = 300;
    }
    spawnTarget();
    health.visible = false;
    healthSpawnTime = performance.now() + randomInt(HEALTH_FIRST_MIN, HEALTH_FIRST_MAX);
    powerup.visible = false;
    powerupSpawnTime = performance.now() + randomInt(POWER_FIRST_MIN, POWER_FIRST_MAX);
}
