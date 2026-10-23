/**
 * State permainan (variabel global yang dipakai semua modul).
 * Modul dimuat sebagai <script> biasa (lihat boot.js), jadi semua `let`
 * di sini terlihat oleh modul lain tanpa import/export.
 */

// ── Alur permainan ────────────────────────────────────────────────────
let gameState = "menu";
let level = "easy";
let score = 0;
let lives = 3;
let paused = false;
let pressedKeys = new Set();
let globalFreeze = 0;
let enemiesAwake = true;

// ── Objek utama ───────────────────────────────────────────────────────
let player = null;
let target = null;
let health = null;
let killers = [];
let gadflies = [];
let hitCooldown = 0;
let targetSpawnTime = 0;
let healthSpawnTime = 0;
let playerShockTimer = 0;
let playerShockX = 0;
let playerShockY = 0;
let playerDeathTimer = 0;
let playerDeathMax = 0;

// ── Penghitung spawn ──────────────────────────────────────────────────
let powerup = null;
let powerupSpawnTime = 0;
let powerActive = 0;
let killerSpawnTime = 0;
let nextKillerSpawnDelay = 10000;
let endingIndex = 0;
let collectibleRelocateCooldown = 0;

// ── Archer ────────────────────────────────────────────────────────────
let archers = [];
let archerNextSpawnTime = 0;
let archerWarningTimer = 0;
let archerWarningText = '';
let archerArrows = [];

// ── Time Stop ─────────────────────────────────────────────────────────
let timeStop = 0;
let timeStopWave = 0;
let timeStopWavePulse = 0;
let timeStopOriginX = 0;
let timeStopOriginY = 0;
let timeStopPowerup = null;
let timeStopSpawnTime = 0;

// ── Lord Vindex ───────────────────────────────────────────────────────
let lordVindex = null;
let vindexTimeStopMoveX = 0;
let vindexTimeStopMoveY = 0;
let vindexTimeStopMoveTimer = 0;
let vindexTimeStop = 0;
let vindexTimeStopCooldown = 0;
let vindexLaserCountdown = 0;
let vindexLaserActive = false;
let vindexLaserX = 0;
let vindexLaserY = 0;
let vindexLaserAngle = 0;
let vindexLaserOriginX = 0;
let vindexLaserOriginY = 0;
let vindexLaserPulse = 0;
let vindexLaserFireTimer = 0;
let vindexLaserHasHit = false;
let vindexPowerAttack = null;
let vindexMoveDelay = 0;

// ── Mode SULIT: intro & urutan poin 25 ────────────────────────────────
let hardRevivalTimer = null;
let hardMeteorPermanent = false;
let hardFinaleTriggered = false;
let hard25Triggered = false;
let hard25Completed = false;
let hardIntroTimer = 0;
let hardIntroLastTime = 0;
let hardIntroReady = false;
let hardIntroMeteorList = [];
let hard25SequenceActive = false;
let hard25SequenceTimer = 0;
let hard25SequencePhase = 0;
let hard25ReadyForInput = false;
let hard25ArenaResumeRequested = false;
let hard25DialogueTimer = 0;

// ── Cerita, partikel, getaran ─────────────────────────────────────────
let storyMessageTimer = 0;
let storyMessage = '';
let particleList = [];
let screenShake = 0;

// ── Meteor ────────────────────────────────────────────────────────────
let meteorShockwave = null;
let largeMeteorImpactState = null;
let largeMeteor = null;
let meteors = [];
let meteorSessionActive = false;
let meteorSessionTimer = 0;
let meteorNextSpawn = 0;
let meteorSessionUsed = false;
let meteorNextSessionTimer = 0;
let meteorPreShowerActive = false;
let meteorPreShowerTimer = 0;
let meteorPreShowerNextSpawn = 0;
let meteorPreShowerSpawned = 0;
let meteorShowerUnlocked = false;
let meteorWarningTimer = 0;
let meteorPhase = 'idle';
let meteorPhaseTimer = 0;
let meteorBurstCooldown = 0;
let largeMeteorPending = false;
let largeMeteorSpawnTimer = 0;
let largeMeteorWarning = null;
let largeMeteorMilestones = new Set();

// ── Lainnya ───────────────────────────────────────────────────────────
let endingDestroyIndex = 0;
let endingDestroyedCount = 0;
let endingDestroyTimer = 0;
let endingWaitTimer = 0;
let endingRAF = 0;
