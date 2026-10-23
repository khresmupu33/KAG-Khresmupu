/**
 * Konfigurasi & konstanta gameplay.
 * Semua angka penyeimbang permainan ada di sini (satuan: frame @60FPS atau ms).
 */

// ── Arena ───────────────────────────────────────────────────────────────
const WIDTH = 800;
const HEIGHT = 600;

// ── Mode halaman (dibaca dari <body data-level data-phase>) ─────────────
const PAGE_LEVEL = document.body.dataset.level || null;            // easy | normal | hard
const continuationMode = document.body.dataset.phase === 'continuation'; // SULIT fase 26-100

// ── Tautan antar halaman (semua halaman ada di app/pages/) ──────────────
const PAGES = {
    menu: 'menu.html',
    rules: 'cara-main.html',
    hardContinuation: 'sulit-lanjutan.html',
};

// ── Pemain ────────────────────────────────────────────────────────────
const PLAYER_SPEED = 4;

// ── Killer ────────────────────────────────────────────────────────────
const KILLER_LOAD_TIME = 120;
const KILLER_KNOCKBACK_TIME = 35;
const KILLER_KNOCKBACK_POWER = 11;
const KILLER_COLLISION_COOLDOWN = 22;
const GLOBAL_KILLER_FREEZE = 45;
const KILLER_FIRST_TIME = 9000;
const KILLER_NEXT_TIME = 9000;
const MAX_KILLERS = 12;

// ── Gadfly ────────────────────────────────────────────────────────────
const GADFLY_HIT_TIME = 28;

// ── Item: power kill, nyawa ───────────────────────────────────────────
const POWER_DURATION = 600;
const POWER_FIRST_MIN = 30000;
const POWER_FIRST_MAX = 40000;
const POWER_RESPAWN_MIN = 30000;
const POWER_RESPAWN_MAX = 40000;
const POWER_FLEE_SPEED_MULTIPLIER = 1;
const POWER_SAFE_MARGIN = 32;
const HEALTH_FIRST_MIN = 20000;
const HEALTH_FIRST_MAX = 30000;
const HEALTH_RESPAWN_MIN = 20000;
const HEALTH_RESPAWN_MAX = 30000;

// ── Meteor besar ──────────────────────────────────────────────────────
const LARGE_METEOR_RANDOM_MIN = 2100;
const LARGE_METEOR_RANDOM_MAX = 3900;
const LARGE_METEOR_WARNING_TIME = 150;
const LARGE_METEOR_DELAY_MIN = 30;
const LARGE_METEOR_DELAY_MAX = 55;
const LARGE_METEOR_SPEED = 5.2;
const LARGE_METEOR_SIZE = 100;
const LARGE_METEOR_BLAST_RADIUS = 150;
const LARGE_METEOR_MAX_IMPACT_PARTICLES = 18;
const LARGE_METEOR_PLAYER_DAMAGE = 2;
const LARGE_METEOR_SHOCK_POWER = 18;
const LARGE_METEOR_DIRECT_RADIUS = 60;

// ── Meteor ────────────────────────────────────────────────────────────
const METEOR_FIRST_MIN = 1200;
const METEOR_FIRST_MAX = 1800;
const METEOR_SESSION_DURATION = 1080;
const METEOR_SPAWN_INTERVAL = 34;
const METEOR_SPEED_MIN = 5;
const METEOR_SPEED_MAX = 8;
const METEOR_PLAYER_COOLDOWN = 55;
const METEOR_SAFE_MARGIN = 8;
const METEOR_FIRST_BURST = 12;
const METEOR_SECOND_BURST = 10;
const METEOR_SECOND_BURST_TIME = 420;
const METEOR_BURST_COOLDOWN = 55;
const METEOR_NEXT_SESSION_MIN = 1500;
const METEOR_NEXT_SESSION_MAX = 2700;
const METEOR_TRIGGER_SCORE = 10;
const METEOR_PRE_SHOWER_MIN = 1200;
const METEOR_PRE_SHOWER_MAX = 1800;
const METEOR_PRE_SHOWER_SPAWN_INTERVAL_MIN = 150;
const METEOR_PRE_SHOWER_SPAWN_INTERVAL_MAX = 300;
const METEOR_PRE_SHOWER_MAX_METEORS = 5;

// ── Archer ────────────────────────────────────────────────────────────
const MAX_ARCHERS = 5;
const ARCHER_LOAD_TIME = 110;
const ARCHER_SPEED = 1.8;
const ARCHER_ARROW_SPEED = 5.2;
const ARCHER_FIRE_INTERVAL = 145;
const ARCHER_FIRST_SCORE = 5;
const ARCHER_SPAWN_MIN = 15000;
const ARCHER_SPAWN_MAX = 22000;
const ARCHER_POWER_EVADE_DISTANCE = 190;
const ARCHER_POWER_TELEPORT_DISTANCE = 260;
const ARCHER_ARROW_DAMAGE_COOLDOWN = 35;

// ── Time Stop ─────────────────────────────────────────────────────────
const TIME_STOP_DURATION = 300;
const TIME_STOP_SLOW = 0.18;
const TIME_STOP_FIRST_MIN = 18000;
const TIME_STOP_FIRST_MAX = 26000;
const TIME_STOP_RESPAWN_MIN = 26000;
const TIME_STOP_RESPAWN_MAX = 38000;

// ── Lord Vindex (SULIT) ───────────────────────────────────────────────
const VINDEX_MOVE_DELAY = 300;
const VINDEX_POWER_CHARGE_TIME = 150;
const VINDEX_POWER_BEAM_WIDTH = 82;
const VINDEX_POWER_DAMAGE = 2;
const LORD_SPEED = 2.5;
const LORD_EVADE_SPEED = 5.0;

// ── Lainnya ───────────────────────────────────────────────────────────
const MAX_LEVEL = 100;
