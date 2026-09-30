
(function(){
  const overlay=document.getElementById('mobileLandscapeOverlay');
  const mobileQuery=window.matchMedia('(max-width: 900px)');
  function isMobile(){return mobileQuery.matches && ('ontouchstart' in window || navigator.maxTouchPoints>0);}
  function isLandscape(){return window.innerWidth > window.innerHeight;}
  function updateLandscape(){
    if(!overlay) return;
    const show=isMobile() && !isLandscape();
    overlay.style.display=show?'flex':'none';
    overlay.setAttribute('aria-hidden',show?'false':'true');
    document.documentElement.classList.toggle('mobile-portrait-lock',show);
    document.body.classList.toggle('mobile-portrait-lock',show);
  }
  async function tryLockLandscape(){
    try{
      if(document.documentElement.requestFullscreen && !document.fullscreenElement){
        await document.documentElement.requestFullscreen();
      }
      if(screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
      }
    }catch(e){}
    updateLandscape();
  }
  window.addEventListener('resize',updateLandscape,{passive:true});
  window.addEventListener('orientationchange',function(){setTimeout(updateLandscape,100);});
  document.addEventListener('fullscreenchange',updateLandscape);
  document.addEventListener('DOMContentLoaded',updateLandscape);
  if(overlay){
    overlay.addEventListener('click',tryLockLandscape);
    overlay.addEventListener('touchend',tryLockLandscape,{passive:true});
  }
  updateLandscape();
})();


/* =========================================================
   CANVAS
========================================================= */

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");


const WIDTH = 800;
const HEIGHT = 600;


/* =========================================================
   SPEED
========================================================= */

const PLAYER_SPEED = 4;


/* =========================================================
   GAME
========================================================= */

let gameState = "menu";

let level = "easy";

let score = 0;
const continuationMode = /sulit_lanjutan\.html$/i.test(location.pathname);
let continuationDeathRestart = false;

let lives = 3;

let paused = false;

let player = null;

let target = null;

let health = null;

let killers = [];

let gadflies = [];

let pressedKeys = new Set();

let hitCooldown = 0;

let targetSpawnTime = 0;

let healthSpawnTime = 0;

let powerup = null;

let powerupSpawnTime = 0;

let powerActive = 0;

let killerSpawnTime = 0;

let nextKillerSpawnDelay = 10000;

let endingIndex = 0;

let globalFreeze = 0;
let archers = [];
let archerNextSpawnTime = 0;
let archerWarningTimer = 0;
let archerWarningText = '';
let collectibleRelocateCooldown = 0;
let archerArrows = [];
let lordVindex = null;
let timeStop = 0;
let timeStopWave = 0;
let timeStopWavePulse = 0;
let timeStopOriginX = 0;
let timeStopOriginY = 0;
let vindexTimeStopMoveX = 0;
let vindexTimeStopMoveY = 0;
let vindexTimeStopMoveTimer = 0;
let timeStopPowerup = null;
let timeStopSpawnTime = 0;
let enemiesAwake = true;
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
let storyMessageTimer = 0;
let storyMessage = '';

let particleList = [];

let screenShake = 0;
let meteorShockwave = null;
let largeMeteorImpactState = null;
let largeMeteor = null;
let playerShockTimer = 0;
let playerShockX = 0;
let playerShockY = 0;
let playerDeathTimer = 0;
let playerDeathMax = 0;
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
let vindexPowerAttack = null;
let vindexMoveDelay = 0;
let endingDestroyIndex = 0;
let endingDestroyedCount = 0;
let endingWaitTimer = 0;
let endingRAF = 0;


/* =========================================================
   CONSTANT
========================================================= */

const KILLER_LOAD_TIME = 120;

const KILLER_KNOCKBACK_TIME = 35;

const KILLER_KNOCKBACK_POWER = 11;

const KILLER_COLLISION_COOLDOWN = 22;

const GADFLY_HIT_TIME = 28;

const GLOBAL_KILLER_FREEZE = 45;

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

const KILLER_FIRST_TIME = 9000;

const KILLER_NEXT_TIME = 9000;

const MAX_KILLERS = 12;

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
const LARGE_METEOR_CHANCE = 1.0;
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
const MAX_LEVEL = 100;
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
const TIME_STOP_DURATION = 300;
const TIME_STOP_SLOW = 0.18;
const VINDEX_MOVE_DELAY = 300;
const VINDEX_POWER_CHARGE_TIME = 150;
const VINDEX_POWER_BEAM_WIDTH = 82;
const VINDEX_POWER_DAMAGE = 2;
const TIME_STOP_FIRST_MIN = 18000;
const TIME_STOP_FIRST_MAX = 26000;
const TIME_STOP_RESPAWN_MIN = 26000;
const TIME_STOP_RESPAWN_MAX = 38000;
const LORD_SPEED = 2.5;
const LORD_EVADE_SPEED = 5.0;


/* =========================================================
   RANDOM
========================================================= */

function randomInt(min,max){

    return Math.floor(
        Math.random() *
        (max-min+1)
    ) + min;

}


function randomPosAwayFromPlayer(){

    let x;
    let y;

    let attempts = 0;

    do{

        x =
            randomInt(
                50,
                WIDTH-50
            );

        y =
            randomInt(
                50,
                HEIGHT-50
            );

        attempts++;

        if(!player){
            break;
        }

    }while(

        Math.abs(
            x-player.x
        ) < 120

        &&

        Math.abs(
            y-player.y
        ) < 120

        &&

        attempts < 100

    );

    return {
        x:x,
        y:y
    };

}


/* =========================================================
   CREATE GAME
========================================================= */

function createGameObjects(){

    player = {

        x:390,

        y:300,

        w:20,

        h:20

    };


    target = {

        x:350,

        y:250,

        w:20,

        h:20

    };


    health = {

        x:200,

        y:200,

        w:25,

        h:25,

        visible:false,
        pulse:0

    };


    powerup = {

        x:0,

        y:0,

        w:26,

        h:26,

        visible:true,

        pulse:0

    };

    powerActive = 0;
    meteors = [];
    meteorSessionActive = false;
    meteorSessionTimer = 0;
    meteorNextSpawn = performance.now() + randomInt(METEOR_FIRST_MIN,METEOR_FIRST_MAX);
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
    largeMeteorSpawnTimer = randomInt(LARGE_METEOR_RANDOM_MIN,LARGE_METEOR_RANDOM_MAX);
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
    timeStopPowerup = {x:0,y:0,w:28,h:28,visible:false,pulse:0};
    timeStopSpawnTime = performance.now() + randomInt(TIME_STOP_FIRST_MIN,TIME_STOP_FIRST_MAX);
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
    vindexTimeStopCooldown = continuationMode ? randomInt(180,300) : randomInt(420,720);
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
            name:"top",
            x:380,
            y:0,
            w:20,
            h:20,
            freeze:0,
            hitAnim:0,
            hitVX:0,
            hitVY:0,
            rotation:0,
            rotationSpeed:0
        },

        {
            name:"bottom",
            x:380,
            y:580,
            w:20,
            h:20,
            freeze:0,
            hitAnim:0,
            hitVX:0,
            hitVY:0,
            rotation:0,
            rotationSpeed:0
        },

        {
            name:"left",
            x:0,
            y:280,
            w:20,
            h:20,
            freeze:0,
            hitAnim:0,
            hitVX:0,
            hitVY:0,
            rotation:0,
            rotationSpeed:0
        },

        {
            name:"right",
            x:780,
            y:280,
            w:20,
            h:20,
            freeze:0,
            hitAnim:0,
            hitVX:0,
            hitVY:0,
            rotation:0,
            rotationSpeed:0
        }

    ];


    if(level==='normal' || level==='hard'){
        archerNextSpawnTime = performance.now() + randomInt(ARCHER_SPAWN_MIN, ARCHER_SPAWN_MAX);
        archerWarningTimer = 0;
        archerWarningText = '';
    }
    if(level==='hard'){
        spawnLordVindex();
        storyMessage='Lord Vindex: "Lihat baik-baik. Ini baru permulaan."'; storyMessageTimer=300;
    }

    spawnTarget();

    health.visible = false;
    healthSpawnTime = performance.now() + randomInt(HEALTH_FIRST_MIN,HEALTH_FIRST_MAX);

    powerup.visible = false;
    powerupSpawnTime = performance.now() + randomInt(POWER_FIRST_MIN,POWER_FIRST_MAX);

}


/* =========================================================
   TARGET
========================================================= */

function spawnTarget(){
    if(level==='hard' && hard25SequenceActive)return;

    const p =
        randomPosAwayFromPlayer();

    target.x = p.x;

    target.y = p.y;

    targetSpawnTime =
        performance.now();

}


/* =========================================================
   HEALTH
========================================================= */

function spawnHealth(){
    if(level==='hard' && hard25SequenceActive)return;

    const p =
        randomPosAwayFromPlayer();

    health.x = p.x;

    health.y = p.y;

    health.visible = true;
    health.pulse = 0;
    healthSpawnTime = performance.now();

}


function spawnPowerup(){
    if(level==='hard' && hard25SequenceActive)return;

    const p =
        randomPosAwayFromPlayer();

    powerup.x = p.x;

    powerup.y = p.y;

    powerup.visible = true;

    powerup.pulse = 0;

    powerupSpawnTime = performance.now();

}


/* =========================================================
   COLLISION
========================================================= */

function collide(a,b){

    return !(
        a.x+a.w < b.x ||
        a.x > b.x+b.w ||
        a.y+a.h < b.y ||
        a.y > b.y+b.h
    );

}


/* =========================================================
   WRAP
========================================================= */

function wrap(obj){

    if(
        obj.x+obj.w < 0
    ){

        obj.x = WIDTH;

    }

    if(
        obj.x > WIDTH
    ){

        obj.x = -obj.w;

    }

    if(
        obj.y+obj.h < 0
    ){

        obj.y = HEIGHT;

    }

    if(
        obj.y > HEIGHT
    ){

        obj.y = -obj.h;

    }

}


/* =========================================================
   MOVEMENT
========================================================= */

function moveHorizontal(
    obj,
    targetX,
    speed
){

    const center =
        obj.x+
        obj.w/2;

    if(
        center < targetX
    ){

        obj.x += speed;

    }

    else if(
        center > targetX
    ){

        obj.x -= speed;

    }

}


function moveVertical(
    obj,
    targetY,
    speed
){

    const center =
        obj.y+
        obj.h/2;

    if(
        center < targetY
    ){

        obj.y += speed;

    }

    else if(
        center > targetY
    ){

        obj.y -= speed;

    }

}


function moveTowards(
    obj,
    targetObj,
    speed
){

    const cx =
        obj.x+
        obj.w/2;

    const cy =
        obj.y+
        obj.h/2;

    const tx =
        targetObj.x+
        targetObj.w/2;

    const ty =
        targetObj.y+
        targetObj.h/2;


    if(cx < tx){

        obj.x += speed;

    }

    if(cx > tx){

        obj.x -= speed;

    }

    if(cy < ty){

        obj.y += speed;

    }

    if(cy > ty){

        obj.y -= speed;

    }

}


/* =========================================================
   KILLER SPEED
========================================================= */

function getKillerSpeed(){

    if(level==="easy"){

        return 2*enemySlowFactor();

    }

    if(level==="normal"){

        return 2.5*enemySlowFactor();

    }

    return 2.5*enemySlowFactor();

}


/* =========================================================
   ADD KILLER
========================================================= */

function addKiller(first=false){

    const p =
        randomPosAwayFromPlayer();


    const killer = {

        x:p.x,

        y:p.y,

        w:20,

        h:20,


        loading:
            first
                ? 90
                : KILLER_LOAD_TIME,


        pulse:
            Math.random()*
            Math.PI*2,


        knockbackX:0,

        knockbackY:0,

        knockbackTimer:0,


        elbowCooldown:0,


        tilt:0,

        targetTilt:0,


        scaleX:1,

        scaleY:1,


        hitFlash:0,


        disappointed:0,

        celebrating:0,

        celebratingPhase:0,

        panic:false,

        panicPhase:Math.random()*Math.PI*2,

        panicTimer:0,


        disappointedPhase:
            Math.random()*
            Math.PI*2,


        disintegrating:false,

        disintegrateTimer:0,


        phase:
            Math.random()*
            Math.PI*2

    };


    killers.push(
        killer
    );


    showSpawnWarning();

}


/* =========================================================
   SPAWN WARNING
========================================================= */

let warningTimer = null;


function showSpawnWarning(){

    const warning =
        document.getElementById(
            "spawnWarning"
        );


    warning.style.display =
        "block";


    clearTimeout(
        warningTimer
    );


    warningTimer =
        setTimeout(
            function(){

                warning.style.display =
                    "none";

            },
            900
        );

}


/* =========================================================
   UPDATE KILLERS
========================================================= */

function updateKillers(){

    const sf=worldSlowFactor();
    const speed =
        getKillerSpeed();


    killers.forEach(
        function(k){

            if(k.vindexKnockbackCooldown>0) k.vindexKnockbackCooldown-=sf;
            if(!k.loading && !k.disintegrating){
                relocateCollectibleFromEnemy(k);
            }

            /*
             * Jika sedang bersurai.
             */

            if(
                k.disintegrating
            ){

                updateDisintegratingKiller(
                    k
                );

                return;

            }


            /*
             * Cooldown.
             */

            if(
                k.elbowCooldown > 0
            ){

                k.elbowCooldown-=sf;

            }


            if(
                k.hitFlash > 0
            ){

                k.hitFlash-=sf;

            }


            k.pulse += .13*sf;


            /*
             * Merayakan setelah mengenai player.
             */

            if(
                k.celebrating > 0
            ){

                k.celebrating-=sf;

                k.celebratingPhase += .28*sf;

                k.targetTilt =
                    Math.sin(k.celebratingPhase)*.28;

                k.scaleX =
                    1 + Math.sin(k.celebratingPhase*2)*.12;

                k.scaleY =
                    1 - Math.sin(k.celebratingPhase*2)*.08;

                return;

            }


            /*
             * Kecewa.
             */

            if(
                k.disappointed > 0
            ){

                k.disappointed-=sf;

                k.disappointedPhase += .15*sf;

                /*
                 * Masih diam selama
                 * freeze global.
                 */

                return;

            }


            /*
             * Global freeze.
             */

            if(
                globalFreeze > 0
            ){

                return;

            }


            /*
             * POWER KILL:
             * Killer panik dan menjauh dari icon Power Kill.
             * Setelah icon diambil, mereka menjauh dari player.
             * Kecepatan tetap sama dengan kecepatan normal.
             */

            if(
                powerActive > 0 &&
                k.loading <= 0
            ){

                const dangerX = player.x + player.w/2;
                const dangerY = player.y + player.h/2;

                const kx = k.x + k.w/2;
                const ky = k.y + k.h/2;

                let dx = kx - dangerX;
                let dy = ky - dangerY;
                let dist = Math.hypot(dx,dy);

                if(dist < .001){
                    dx = k.x < WIDTH/2 ? -1 : 1;
                    dy = k.y < HEIGHT/2 ? -1 : 1;
                    dist = Math.hypot(dx,dy);
                }

                /*
                 * Steering ala NPC:
                 * jangan hanya bergerak lurus menjauh, tetapi juga
                 * membaca dinding/pojok agar bisa membelok sebelum mentok.
                 */
                let fleeX = dx / dist;
                let fleeY = dy / dist;

                const margin = POWER_SAFE_MARGIN;
                const cx = k.x + k.w / 2;
                const cy = k.y + k.h / 2;
                const leftGap = cx - margin;
                const rightGap = WIDTH - margin - cx;
                const topGap = cy - margin;
                const bottomGap = HEIGHT - margin - cy;
                const wallRange = 95;

                /* Dorongan menjauh dari dinding. Makin dekat dinding,
                 * makin kuat dorongannya sehingga NPC berbelok. */
                if(leftGap < wallRange){
                    fleeX += (1 - leftGap / wallRange) * 1.8;
                }
                if(rightGap < wallRange){
                    fleeX -= (1 - rightGap / wallRange) * 1.8;
                }
                if(topGap < wallRange){
                    fleeY += (1 - topGap / wallRange) * 1.8;
                }
                if(bottomGap < wallRange){
                    fleeY -= (1 - bottomGap / wallRange) * 1.8;
                }

                /* Kalau sudah sangat dekat sudut, prioritaskan keluar dari
                 * sudut dengan gerakan menyamping, bukan terus menabrak. */
                const cornerX = Math.min(leftGap, rightGap);
                const cornerY = Math.min(topGap, bottomGap);
                if(cornerX < 42 && cornerY < 42){
                    if(leftGap < rightGap) fleeX = Math.abs(fleeX) + .9;
                    else fleeX = -Math.abs(fleeX) - .9;
                    if(topGap < bottomGap) fleeY = Math.abs(fleeY) + .9;
                    else fleeY = -Math.abs(fleeY) - .9;
                }

                const steerDist = Math.hypot(fleeX, fleeY) || 1;
                fleeX /= steerDist;
                fleeY /= steerDist;

                const fleeSpeed = speed * POWER_FLEE_SPEED_MULTIPLIER;

                k.x += fleeX * fleeSpeed * sf;
                k.y += fleeY * fleeSpeed * sf;

                k.x = Math.max(margin, Math.min(WIDTH-k.w-margin, k.x));
                k.y = Math.max(margin, Math.min(HEIGHT-k.h-margin, k.y));

                /* Sedikit belokan visual mengikuti arah gerak. */
                k.targetTilt = Math.max(-.28, Math.min(.28, fleeX * .18));

                k.panicPhase += .55*sf;
                k.panicTimer = Math.max(k.panicTimer,3*sf);
                k.targetTilt = Math.sin(k.panicPhase*1.7) * .22;
                k.scaleX = .78 + Math.sin(k.panicPhase*2.1)*.06;
                k.scaleY = 1.16 + Math.abs(Math.sin(k.panicPhase*2.1))*.08;
                k.panic = true;

                return;

            }

            k.panic = false;


            /*
             * Loading spawn.
             */

            if(
                k.loading > 0
            ){

                k.loading-=sf;

                k.targetTilt *= .9;

                k.tilt +=
                    (
                        k.targetTilt-
                        k.tilt
                    )*.2;

                return;

            }


            /*
             * Knockback.
             */

            if(
                k.knockbackTimer > 0
            ){

                k.x +=
                    k.knockbackX;

                k.y +=
                    k.knockbackY;


                k.knockbackX *= Math.pow(.91,sf);

                k.knockbackY *= Math.pow(.91,sf);


                k.knockbackTimer-=sf;


                /*
                 * Tetap mengejar.
                 */

                moveTowards(
                    k,
                    player,
                    speed*.4*sf
                );

            }

            else{

                moveTowards(
                    k,
                    player,
                    speed*sf
                );

            }


            /*
             * Animasi badan kembali.
             */

            k.targetTilt *= Math.pow(.80,sf);

            k.tilt +=
                (
                    k.targetTilt-
                    k.tilt
                )*.17;


            k.scaleX +=
                (
                    1-k.scaleX
                )*.14;


            k.scaleY +=
                (
                    1-k.scaleY
                )*.14;


            wrap(k);


            /*
             * Killer mengenai item.
             */

            if(
                collide(k,target)
            ){

                spawnTarget();

            }


            if(
                health &&
                health.visible &&
                collide(k,health)
            ){

                spawnHealth();

            }

        }
    );

}


/* =========================================================
   KILLER VS KILLER
========================================================= */

function updateKillerCollisions(){

    for(
        let i=0;
        i<killers.length;
        i++
    ){

        for(
            let j=i+1;
            j<killers.length;
            j++
        ){

            const k1 =
                killers[i];

            const k2 =
                killers[j];


            if(
                k1.disintegrating ||
                k2.disintegrating
            ){

                continue;

            }


            if(
                k1.loading>0 ||
                k2.loading>0
            ){

                continue;

            }


            if(
                k1.elbowCooldown>0 ||
                k2.elbowCooldown>0
            ){

                continue;

            }


            if(
                !collide(k1,k2)
            ){

                continue;

            }


            let dx =
                (
                    k2.x+
                    k2.w/2
                )
                -
                (
                    k1.x+
                    k1.w/2
                );


            let dy =
                (
                    k2.y+
                    k2.h/2
                )
                -
                (
                    k1.y+
                    k1.h/2
                );


            let distance =
                Math.hypot(
                    dx,
                    dy
                );


            if(
                distance<.01
            ){

                const angle =
                    Math.random()*
                    Math.PI*2;

                dx =
                    Math.cos(angle);

                dy =
                    Math.sin(angle);

                distance=1;

            }


            dx/=distance;

            dy/=distance;


            /*
             * SIKUTAN SANGAT JAUH.
             *
             * 11 px/frame selama 35 frame
             * lalu melambat.
             */

            k2.knockbackX =
                dx*
                KILLER_KNOCKBACK_POWER;

            k2.knockbackY =
                dy*
                KILLER_KNOCKBACK_POWER;


            k2.knockbackTimer =
                KILLER_KNOCKBACK_TIME;


            /*
             * Gerakan miring.
             */

            k2.targetTilt =
                Math.atan2(
                    dy,
                    dx
                )*.55;


            k2.scaleX =
                1.35;

            k2.scaleY =
                .68;


            k2.hitFlash =
                8;


            /*
             * Cooldown.
             */

            k1.elbowCooldown =
                KILLER_COLLISION_COOLDOWN;

            k2.elbowCooldown =
                KILLER_COLLISION_COOLDOWN;


            /*
             * Pisahkan.
             */

            k2.x +=
                dx*5;

            k2.y +=
                dy*5;


            k1.x -=
                dx*1.5;

            k1.y -=
                dy*1.5;

        }

    }

}


/* =========================================================
   GADFLY UPDATE
========================================================= */

function updateGadflies(){
    const sf=enemySlowFactor();

    const playerCenterX =
        player.x+
        player.w/2;

    const playerCenterY =
        player.y+
        player.h/2;


    gadflies.forEach(
        function(g){

            /*
             * ANIMASI TERKENA PLAYER
             */

            if(
                g.hitAnim>0
            ){

                g.hitAnim-=sf;

                g.x +=
                    g.hitVX*sf;

                g.y +=
                    g.hitVY*sf;


                g.hitVX *= .90;

                g.hitVY *= .90;


                g.rotation +=
                    g.rotationSpeed*sf;


                g.rotationSpeed *=
                    .96;


                /*
                 * Setelah animasi
                 * kembali ke posisi tepi.
                 */

                if(
                    g.hitAnim===0
                ){

                    if(
                        g.name==="top"
                    ){

                        g.y=0;

                    }

                    else if(
                        g.name==="bottom"
                    ){

                        g.y=HEIGHT-g.h;

                    }

                    else if(
                        g.name==="left"
                    ){

                        g.x=0;

                    }

                    else{

                        g.x=WIDTH-g.w;

                    }

                    g.rotation=0;

                }

                return;

            }


            if(
                g.freeze>0
            ){

                g.freeze-=sf;

                return;

            }


            /*
             * ATAS / BAWAH
             * HANYA HORIZONTAL.
             */

            if(
                g.name==="top" ||
                g.name==="bottom"
            ){

                moveHorizontal(
                    g,
                    playerCenterX,
                    3*sf
                );

            }

            /*
             * KIRI / KANAN
             * HANYA VERTIKAL.
             */

            else{

                moveVertical(
                    g,
                    playerCenterY,
                    3*sf
                );

            }


            /*
             * Menyentuh target.
             */

            if(
                collide(g,target)
            ){

                spawnTarget();

            }


            /*
             * Menyentuh health.
             */

            if(
                collide(g,health)
            ){

                spawnHealth();

            }

        }
    );

}


/* =========================================================
   PLAYER
========================================================= */

function updatePlayer(){

    const sf=worldSlowFactor();

    if(playerShockTimer>0 && playerDeathTimer<=0){
        player.x += playerShockX*sf;
        player.y += playerShockY*sf;
        playerShockX *= .86;
        playerShockY *= .86;
        player.x=Math.max(0,Math.min(WIDTH-player.w,player.x));
        player.y=Math.max(0,Math.min(HEIGHT-player.h,player.y));
    }

    pressedKeys.forEach(
        function(key){

            if(
                key==="ArrowUp"
            ){

                player.y -=
                    PLAYER_SPEED*sf;

            }

            if(
                key==="ArrowDown"
            ){

                player.y +=
                    PLAYER_SPEED*sf;

            }

            if(
                key==="ArrowLeft"
            ){

                player.x -=
                    PLAYER_SPEED*sf;

            }

            if(
                key==="ArrowRight"
            ){

                player.x +=
                    PLAYER_SPEED*sf;

            }

        }
    );


    wrap(player);

}


/* =========================================================
   TARGET
========================================================= */

function checkPlayerTarget(){

    if(
        !collide(
            player,
            target
        )
    ){

        return;

    }


    score++;
    checkLargeMeteorMilestone();

    if(score===METEOR_TRIGGER_SCORE){
        beginMeteorPreparation();
        scheduleNextLargeMeteor();
    }

    spawnTarget();


    /*
     * TRUE ENDING.
     */

    if(
        score>=100
    ){

        score=100;

        startEnding();

    }

}


/* =========================================================
   HEALTH
========================================================= */

function checkPlayerHealth(){

    if(
        !health ||
        !health.visible ||
        !collide(player,health)
    ){

        return;

    }


    if(lives<3){

        lives++;
        health.visible = false;
        healthSpawnTime = performance.now() + randomInt(HEALTH_RESPAWN_MIN,HEALTH_RESPAWN_MAX);
        screenShake = 5;

    }

}


function checkPlayerPowerup(){

    if(
        !powerup ||
        !powerup.visible ||
        !collide(player,powerup)
    ){

        return;

    }

    powerup.visible = false;

    powerActive = POWER_DURATION;

    powerupSpawnTime = performance.now() + randomInt(POWER_RESPAWN_MIN,POWER_RESPAWN_MAX);

    screenShake = 8;

}


/* =========================================================
   PLAYER VS GADFLY
========================================================= */

function checkPlayerGadflies(){

    gadflies.forEach(
        function(g){

            if(
                g.hitAnim>0
            ){

                return;

            }


            if(
                collide(
                    player,
                    g
                )
            ){

                if(
                    score>0
                ){

                    score--;

                }


                /*
                 * Tentukan arah
                 * Gadfly terpental.
                 */

                const gx =
                    g.x+
                    g.w/2;

                const gy =
                    g.y+
                    g.h/2;

                const px =
                    player.x+
                    player.w/2;

                const py =
                    player.y+
                    player.h/2;


                let dx =
                    gx-px;

                let dy =
                    gy-py;


                let distance =
                    Math.hypot(
                        dx,
                        dy
                    );


                if(
                    distance<.01
                ){

                    distance=1;

                    dx=1;

                    dy=0;

                }


                dx/=distance;

                dy/=distance;


                g.hitVX =
                    dx*9;

                g.hitVY =
                    dy*9;


                /*
                 * Animasi putar.
                 */

                g.rotationSpeed =
                    dx>0
                        ? .35
                        : -.35;


                g.hitAnim =
                    GADFLY_HIT_TIME;


                g.freeze=0;

            }

        }
    );

}


/* =========================================================
   ARCHER / LORD VINDEX / TIME STOP
========================================================= */
function spawnArcher(x=null,y=null){
    if(level==='easy') return;
    if(archers.length>=MAX_ARCHERS) return;
    const p=randomPosAwayFromPlayer();
    const a={x:x??p.x,y:y??p.y,w:22,h:22,loading:ARCHER_LOAD_TIME,aim:0,fire:35,phase:Math.random()*6.28,flash:0,dead:false,evadeCooldown:0,spawnAnim:1,teleportAnim:0};
    archers.push(a);
}
function spawnLordVindex(){
    lordVindex={x:389,y:45,w:42,h:42,phase:0,fire:45,attack:0,flash:0,dead:false,react:0,evadeCooldown:0,contactCooldown:0};
    vindexMoveDelay=VINDEX_MOVE_DELAY;
}
function spawnTimeStopPowerup(){
    if(level==='easy' || !timeStopPowerup || (level==='hard' && hard25SequenceActive)) return;
    const p=randomPosAwayFromPlayer();
    timeStopPowerup.x=p.x; timeStopPowerup.y=p.y; timeStopPowerup.visible=true; timeStopPowerup.pulse=0;
}
function checkTimeStopPowerup(){
    if(timeStopPowerup && timeStopPowerup.visible && collide(player,timeStopPowerup)){
        timeStopPowerup.visible=false; timeStop=TIME_STOP_DURATION; timeStopWave=0; timeStopOriginX=player.x+player.w/2; timeStopOriginY=player.y+player.h/2; screenShake=7;
        storyMessage='⏳ TIME STOP — DUNIA MELAMBAT 5 DETIK'; storyMessageTimer=130;
        timeStopSpawnTime=performance.now()+randomInt(TIME_STOP_RESPAWN_MIN,TIME_STOP_RESPAWN_MAX);
    }
    if(timeStopPowerup && !timeStopPowerup.visible && performance.now()>=timeStopSpawnTime && timeStop<=0) spawnTimeStopPowerup();
}
function updateTimeStop(){
    if(timeStop>0){
        timeStop--;
        timeStopWave=Math.min(TIME_STOP_DURATION,timeStopWave+1);
        timeStopWavePulse+=0.055;
    }else{
        timeStopWave=0;
        timeStopWavePulse=0;
    }
    if(timeStopPowerup&&timeStopPowerup.visible) timeStopPowerup.pulse+=.12*enemySlowFactor();
}
function enemySlowFactor(){return (timeStop>0 || vindexTimeStop>0) ? TIME_STOP_SLOW : 1;}
function worldSlowFactor(){return vindexTimeStop>0 ? TIME_STOP_SLOW : 1;}
function angleTo(a,b){return Math.atan2((b.y+b.h/2)-(a.y+a.h/2),(b.x+b.w/2)-(a.x+a.w/2));}
function relocateCollectibleFromEnemy(enemy){
    if(!player || collectibleRelocateCooldown>0) return;
    const items=[target,health,powerup,timeStopPowerup];
    let moved=false;
    for(const item of items){
        if(!item || !item.visible) continue;
        if(collide(enemy,item)){
            const p=randomPosAwayFromPlayer();
            item.x=p.x;
            item.y=p.y;
            item.pulse=0;
            moved=true;
        }
    }
    if(moved) collectibleRelocateCooldown=18;
}
function updateCollectibleRelocateCooldown(){
    if(collectibleRelocateCooldown>0) collectibleRelocateCooldown--;
}

function createTeleportParticles(x,y,amount=14){
    for(let i=0;i<amount;i++){
        const a=Math.random()*Math.PI*2;
        const speed=randomInt(2,6);
        particleList.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,size:randomInt(2,4),life:randomInt(18,32),maxLife:32});
    }
}

function updateArchers(){
    if(!player || level==='easy') return;
    const slow=enemySlowFactor();
    for(let i=archers.length-1;i>=0;i--){
        const a=archers[i];
        if(a.dead){archers.splice(i,1);continue;}
        if(a.vindexKnockbackCooldown>0) a.vindexKnockbackCooldown--;
        relocateCollectibleFromEnemy(a);
        a.phase+=.1*slow;
        a.spawnAnim=Math.max(0,a.spawnAnim-.045*slow);
        a.teleportAnim=Math.max(0,a.teleportAnim-.08*slow);
        a.flash=Math.max(0,a.flash-1*slow);
        a.aim=angleTo(a,player);
        if(a.evadeCooldown>0) a.evadeCooldown-=slow;
        if(a.loading>0){a.loading-=slow;continue;}

        const dx=player.x-a.x,dy=player.y-a.y,dist=Math.hypot(dx,dy)||1;

        /*
         * Power Kill membuat Archer panik dan berpindah INSTAN.
         * Ia tidak lari sedikit demi sedikit, sehingga player tidak
         * bisa sekadar mengejar dan menyentuhnya.
         * Jika player sudah benar-benar menyentuh Archer pada frame
         * sebelum teleport, collision tetap bisa membunuhnya.
         */
        if(powerActive>0 && dist<ARCHER_POWER_EVADE_DISTANCE && a.evadeCooldown<=0){
            let safe=null;
            for(let n=0;n<30;n++){
                const p=randomPosAwayFromPlayer();
                const d=Math.hypot(p.x-a.x,p.y-a.y);
                if(d>=ARCHER_POWER_TELEPORT_DISTANCE){safe=p;break;}
            }
            if(!safe) safe=randomPosAwayFromPlayer();
            const oldX=a.x+a.w/2, oldY=a.y+a.h/2;
            createTeleportParticles(oldX,oldY,18);
            a.x=safe.x;
            a.y=safe.y;
            createTeleportParticles(a.x+a.w/2,a.y+a.h/2,18);
            a.evadeCooldown=28;
            a.flash=10;
            a.teleportAnim=1;
            a.aim=angleTo(a,player);
        }else if(powerActive<=0){
            /* Di luar Power Kill, Archer menjaga jarak dan tidak mengejar cepat. */
            const desired=250;
            if(dist>desired){
                a.x+=(dx/dist)*ARCHER_SPEED*.28*slow;
                a.y+=(dy/dist)*ARCHER_SPEED*.28*slow;
            }else if(dist<170){
                a.x-=(dx/dist)*ARCHER_SPEED*.18*slow;
                a.y-=(dy/dist)*ARCHER_SPEED*.18*slow;
            }
        }

        a.x=Math.max(12,Math.min(WIDTH-a.w-12,a.x));
        a.y=Math.max(70,Math.min(HEIGHT-a.h-12,a.y));
        a.fire-=slow;
        if(a.fire<=0){
            const ang=a.aim;
            archerArrows.push({
                x:a.x+a.w/2,y:a.y+a.h/2,w:8,h:8,
                vx:Math.cos(ang)*ARCHER_ARROW_SPEED,
                vy:Math.sin(ang)*ARCHER_ARROW_SPEED,
                life:180
            });
            a.fire=ARCHER_FIRE_INTERVAL+randomInt(-25,30);
        }
    }

    /* Panah juga terkena efek Time Stop, tetapi tidak terkena slow dua kali. */
    const arrowSlow=enemySlowFactor();
    for(let i=archerArrows.length-1;i>=0;i--){
        const q=archerArrows[i];
        q.x+=q.vx*arrowSlow;
        q.y+=q.vy*arrowSlow;
        q.life-=arrowSlow;
        if(q.life<=0||q.x<-20||q.x>WIDTH+20||q.y<-20||q.y>HEIGHT+20){
            archerArrows.splice(i,1);
            continue;
        }
    }
}
function checkArcherCollisions(){
    if(level==='easy'||!player)return;
    for(const a of archers){
        if(a.dead)continue;
        if(collide(player,a)){
            if(powerActive>0 || timeStop>0){a.dead=true;createDisintegrationParticles(a);screenShake=8;continue;}
            if(hitCooldown<=0){lives--;hitCooldown=ARCHER_ARROW_DAMAGE_COOLDOWN;globalFreeze=20;screenShake=8;if(lives<=0){lives=0;playerDeathMax=100;playerDeathTimer=100;createPlayerDeathParticles();return;}}
        }
    }
    if(timeStop>0) return;
    if(hitCooldown>0)return;
    for(let i=archerArrows.length-1;i>=0;i--){
        if(collide(player,archerArrows[i])){
            lives--;hitCooldown=ARCHER_ARROW_DAMAGE_COOLDOWN;screenShake=9;archerArrows.splice(i,1);
            if(lives<=0){lives=0;playerDeathMax=100;playerDeathTimer=100;createPlayerDeathParticles();return;}
        }
    }
}
function lockVindexLaserTarget(){
    if(!player||!lordVindex)return;
    const sx=lordVindex.x+lordVindex.w/2;
    const sy=lordVindex.y+lordVindex.h/2;
    const px=player.x+player.w/2;
    const py=player.y+player.h/2;
    let ang=Math.atan2(py-sy,px-sx);
    if(!Number.isFinite(ang))ang=0;
    vindexLaserAngle=ang;

    /*
     * Jangan jadikan posisi player sebagai ujung laser.
     * Laser harus berupa jalur panjang dari Vindex sampai keluar arena,
     * sehingga player yang berada di jalurnya benar-benar terkena.
     */
    const dx=Math.cos(ang);
    const dy=Math.sin(ang);
    const distances=[];
    if(Math.abs(dx)>0.0001){
        distances.push((0-sx)/dx);
        distances.push((WIDTH-sx)/dx);
    }
    if(Math.abs(dy)>0.0001){
        distances.push((0-sy)/dy);
        distances.push((HEIGHT-sy)/dy);
    }
    const positive=distances.filter(d=>d>0&&Number.isFinite(d));
    const far=Math.max(...positive,Math.hypot(WIDTH,HEIGHT)*1.5);
    vindexLaserX=sx+dx*(far+40);
    vindexLaserY=sy+dy*(far+40);
}
function setVindexLaserCornerTarget(){
    if(!lordVindex||!player)return;
    const px=player.x+player.w/2;
    const py=player.y+player.h/2;
    const corners=[
        {x:90,y:75},
        {x:WIDTH-90,y:75},
        {x:90,y:HEIGHT-75},
        {x:WIDTH-90,y:HEIGHT-75}
    ];
    /* Pilih pojok yang paling jauh dari player agar arena serangan terasa lebih luas. */
    corners.sort((a,b)=>Math.hypot(b.x-px,b.y-py)-Math.hypot(a.x-px,a.y-py));
    vindexTimeStopMoveX=corners[0].x;
    vindexTimeStopMoveY=corners[0].y;
    vindexTimeStopMoveTimer=60;
}
function setVindexTimeStopEscapeTarget(){
    if(!lordVindex||!player)return;
    const px=player.x+player.w/2;
    const py=player.y+player.h/2;
    const corners=[
        {x:90,y:75},
        {x:WIDTH-90,y:75},
        {x:90,y:HEIGHT-75},
        {x:WIDTH-90,y:HEIGHT-75}
    ];
    corners.sort((a,b)=>Math.hypot(b.x-px,b.y-py)-Math.hypot(a.x-px,a.y-py));
    vindexTimeStopMoveX=corners[0].x;
    vindexTimeStopMoveY=corners[0].y;
    vindexTimeStopMoveTimer=300;
}

function triggerVindexTimeStop(){
    if(level!=='hard'||!lordVindex||lordVindex.dead||!player||vindexTimeStop>0||vindexLaserCountdown>0||(!continuationMode&&score<25)||hard25SequenceActive)return;
    const dx=player.x-lordVindex.x,dy=player.y-lordVindex.y,dist=Math.hypot(dx,dy)||1;
    if(dist<190 || dist>520)return;

    /* TIME STOP terlebih dahulu. Laser BELUM menyerang. */
    vindexTimeStop=300;
    vindexTimeStopCooldown=randomInt(2100,3000);
    vindexLaserActive=true;
    vindexLaserCountdown=0;
    vindexLaserPulse=0;
    /* Wave dikunci di titik Vindex saat Time Stop DIAKTIFKAN. */
    timeStopOriginX=lordVindex.x+lordVindex.w/2;
    timeStopOriginY=lordVindex.y+lordVindex.h/2;
    /* Saat Time Stop dimulai, tentukan pojok terjauh. Vindex bergerak ke sana, TANPA teleport. */
    setVindexTimeStopEscapeTarget();
    /* Daerah target mulai mengejar player PERSIS saat Time Stop dimulai. */
    lockVindexLaserTarget();
    lordVindex.react=40;
    storyMessage='LORD VINDEX: "TIME STOP. SEMUANYA MELAMBAT... KECUALI AKU."';
    storyMessageTimer=190;
    screenShake=8;
}
function vindexLaserHitsPlayer(){
    if(!player||!lordVindex)return false;
    const sx=vindexLaserOriginX, sy=vindexLaserOriginY;
    const ex=vindexLaserX, ey=vindexLaserY;
    const px=player.x+player.w/2, py=player.y+player.h/2;
    const vx=ex-sx, vy=ey-sy;
    const len2=vx*vx+vy*vy||1;
    /* Laser dimulai dari Vindex dan membentang jauh melewati arena. */
    const t=((px-sx)*vx+(py-sy)*vy)/len2;
    if(t<0)return false;
    const qx=sx+vx*t, qy=sy+vy*t;
    return Math.hypot(px-qx,py-qy)<=VINDEX_POWER_BEAM_WIDTH/2+Math.max(player.w,player.h)*.35;
}

function vindexLaserHitsRect(entity){
    if(!entity)return false;
    const sx=vindexLaserOriginX,sy=vindexLaserOriginY;
    const ex=vindexLaserX,ey=vindexLaserY;
    const cx=entity.x+entity.w/2,cy=entity.y+entity.h/2;
    const vx=ex-sx,vy=ey-sy;
    const len2=vx*vx+vy*vy||1;
    const t=Math.max(0,Math.min(1,((cx-sx)*vx+(cy-sy)*vy)/len2));
    const qx=sx+vx*t,qy=sy+vy*t;
    const radius=VINDEX_POWER_BEAM_WIDTH/2+Math.hypot(entity.w,entity.h)*.42;
    return Math.hypot(cx-qx,cy-qy)<=radius;
}
function destroyEnemyByVindexLaser(enemy){
    if(!enemy)return;
    if(enemy.disintegrating||enemy.dead)return;
    enemy.disintegrating=true;
    enemy.disintegrateTimer=38;
    enemy.hitFlash=18;
    enemy.panic=false;
    createDisintegrationParticles(enemy);
}
function killEnemiesByVindexLaser(){
    if(!lordVindex)return;
    for(const k of killers){
        if(k && k.loading<=0 && !k.disintegrating && vindexLaserHitsRect(k)){
            destroyEnemyByVindexLaser(k);
        }
    }
    for(const a of archers){
        if(a && !a.dead && vindexLaserHitsRect(a)){
            a.dead=true;
            createDisintegrationParticles(a);
        }
    }
}
function updateVindexTimeStop(){
    if(level!=='hard')return;

    /* =========================
       1. TIME STOP
       Mekanik Time Stop tetap seperti sebelumnya.
       Vindex bergerak sendiri, bukan mengejar player.
    ========================= */
    if(vindexTimeStop>0){
        vindexTimeStop--;
        vindexLaserPulse+=.18;

        if(lordVindex && vindexTimeStopMoveTimer>0) vindexTimeStopMoveTimer--;

        if(lordVindex){
            const tx=vindexTimeStopMoveX-(lordVindex.x+lordVindex.w/2);
            const ty=vindexTimeStopMoveY-(lordVindex.y+lordVindex.h/2);
            const td=Math.hypot(tx,ty)||1;
            lordVindex.x+=tx/td*LORD_EVADE_SPEED*1.15;
            lordVindex.y+=ty/td*LORD_EVADE_SPEED*1.15;
            lordVindex.x=Math.max(35,Math.min(WIDTH-lordVindex.w-35,lordVindex.x));
            lordVindex.y=Math.max(25,Math.min(HEIGHT-lordVindex.h-35,lordVindex.y));
        }

        /* Daerah target benar-benar mengikuti arah player selama Time Stop. */
        lockVindexLaserTarget();

        if(vindexTimeStop<=0){
            /* Time Stop selesai: target sudah mendapat arah player terakhir, lalu DIKUNCI. */
            lockVindexLaserTarget();
            vindexLaserCountdown=60;
            /* Selama countdown Vindex TIDAK bergerak. */
            vindexLaserFireTimer=0;
            vindexLaserHasHit=false;
            storyMessage='LORD VINDEX: "TARGET TERKUNCI. SATU DETIK SEBELUM LASER..."';
            storyMessageTimer=100;
        }
        return;
    }

    /* =========================
       2. INDIKATOR / TARGETING
       Hanya garis/daerah peringatan yang mengikuti player.
       Laser BELUM ditembakkan.
    ========================= */
    if(vindexLaserCountdown>0){
        /* 1 detik terakhir: daerah target sudah TERKUNCI, tidak mengejar player. */
        vindexLaserCountdown--;
        vindexLaserPulse+=.32;

        if(vindexLaserCountdown<=0 && player && lordVindex && lives>0){
            /*
             * DETIK TEMBAK:
             * Ambil target terakhir sekali.
             * Simpan posisi Vindex + arah + ujung laser.
             * Setelah blok ini TIDAK ADA lagi lockVindexLaserTarget()
             * sampai serangan selesai.
             */
            /* Tidak relock di sini: arah/daerah sudah dikunci selama 1 detik. */
            vindexLaserOriginX=lordVindex.x+lordVindex.w/2;
            vindexLaserOriginY=lordVindex.y+lordVindex.h/2;
            vindexLaserFireTimer=42;
            vindexLaserHasHit=false;
            vindexLaserActive=true;

            /* Damage hanya dihitung sekali ketika laser benar-benar menembak. */
            killEnemiesByVindexLaser();
            if(vindexLaserHitsPlayer()){
                vindexLaserHasHit=true;
                lives=Math.max(0,lives-VINDEX_POWER_DAMAGE);
                hitCooldown=50;
                screenShake=16;
                storyMessage='⚡ LASER VINDEX — 2 NYAWA HILANG';
                storyMessageTimer=130;
                createMeteorImpactParticles(vindexLaserX,vindexLaserY);
                if(lives<=0){
                    lives=0;
                    playerDeathMax=100;
                    playerDeathTimer=100;
                    createPlayerDeathParticles();
                }
            }else{
                storyMessage='⚡ LASER VINDEX — MENGHANCURKAN AREA';
                storyMessageTimer=90;
            }
        }
        return;
    }

    /* =========================
       3. LASER SEDANG MENEMBAK
       Arah dan posisi TETAP. Tidak mengejar player.
    ========================= */
    if(vindexLaserFireTimer>0){
        vindexLaserFireTimer--;
        vindexLaserPulse+=.48;

        if(vindexLaserFireTimer<=0){
            vindexLaserActive=false;
            vindexLaserHasHit=false;
            vindexMoveDelay=0;
        }
        return;
    }

    /* =========================
       4. COOLDOWN
    ========================= */
    if(vindexTimeStopCooldown>0)vindexTimeStopCooldown--;
    if(vindexTimeStopCooldown<=0)triggerVindexTimeStop();
}
function updateLordVindex(){
    if(level!=='hard'||!lordVindex||lordVindex.dead||!player)return;
    const l=lordVindex;
    relocateCollectibleFromEnemy(l);
    l.phase+=.07;
    l.flash=Math.max(0,l.flash-1);
    const dx=player.x-l.x,dy=player.y-l.y,dist=Math.hypot(dx,dy)||1,ang=Math.atan2(dy,dx);

    if(l.contactCooldown>0) l.contactCooldown--;
    if(vindexTimeStop>0 || vindexLaserCountdown>0 || vindexLaserFireTimer>0){
        l.fire=Math.max(l.fire,30);
        l.react=Math.max(l.react,1);
        return;
    }

    if(vindexMoveDelay>0){
        vindexMoveDelay--;
        l.fire=Math.max(l.fire,30);
        l.react=Math.max(l.react,1);
        return;
    }

    if(vindexTimeStop>0){
        /* Gerak random Time Stop ditangani updateVindexTimeStop(). */
    }else if(powerActive>0){
        if(l.evadeCooldown>0) l.evadeCooldown--;
        if(dist<ARCHER_POWER_EVADE_DISTANCE && l.evadeCooldown<=0){
            let safe=null;
            for(let n=0;n<30;n++){
                const p=randomPosAwayFromPlayer();
                const d=Math.hypot(p.x-l.x,p.y-l.y);
                if(d>=ARCHER_POWER_TELEPORT_DISTANCE){safe=p;break;}
            }
            if(!safe) safe=randomPosAwayFromPlayer();
            const oldX=l.x+l.w/2,oldY=l.y+l.h/2;
            createTeleportParticles(oldX,oldY,22);
            l.x=safe.x;
            l.y=safe.y;
            createTeleportParticles(l.x+l.w/2,l.y+l.h/2,22);
            l.evadeCooldown=vindexTimeStop>0 ? 12 : 24;
            l.flash=12;
            l.react=36;
            l.attack+=.3;
        }else{
            l.x-=Math.cos(ang)*LORD_EVADE_SPEED*(vindexTimeStop>0?1.25:1.0);
            l.y-=Math.sin(ang)*LORD_EVADE_SPEED*(vindexTimeStop>0?1.25:1.0);
            l.react=24;
        }
    }else{
        l.x+=Math.cos(ang)*LORD_SPEED;
        l.y+=Math.sin(ang)*LORD_SPEED;
    }

    l.x=Math.max(35,Math.min(WIDTH-l.w-35,l.x));
    l.y=Math.max(25,Math.min(HEIGHT-l.h-35,l.y));
    l.fire--;
    if(l.fire<=0){
        archerArrows.push({x:l.x+l.w/2,y:l.y+l.h/2,w:11,h:11,vx:Math.cos(ang)*4.2,vy:Math.sin(ang)*4.2,life:190,lord:true});
        l.fire=145;
    }
    l.attack+=.045;
    l.react=Math.max(0,l.react-.5);
}
function pushEnemyByVindex(enemy,force=42){
    if(!enemy||enemy.dead||enemy.disintegrating)return;
    if(enemy.vindexKnockbackCooldown>0)return;
    enemy.vindexKnockbackCooldown=14;
    const vx=enemy.x+enemy.w/2-(lordVindex.x+lordVindex.w/2);
    const vy=enemy.y+enemy.h/2-(lordVindex.y+lordVindex.h/2);
    let d=Math.hypot(vx,vy);
    let nx,ny;
    if(d<.001){
        const a=Math.random()*Math.PI*2;
        nx=Math.cos(a);ny=Math.sin(a);d=1;
    }else{
        nx=vx/d;ny=vy/d;
    }
    const oldX=enemy.x+enemy.w/2,oldY=enemy.y+enemy.h/2;
    enemy.x+=nx*force;
    enemy.y+=ny*force;
    const margin=enemy.w<=22 ? 12 : 18;
    enemy.x=Math.max(margin,Math.min(WIDTH-enemy.w-margin,enemy.x));
    enemy.y=Math.max(70,Math.min(HEIGHT-enemy.h-margin,enemy.y));
    enemy.hitFlash=10;
    enemy.flash=10;
    enemy.knockbackX=nx*4;
    enemy.knockbackY=ny*4;
    enemy.knockbackTimer=12;
    if(enemy.panicTimer!==undefined) enemy.panicTimer=12;
    createTeleportParticles(oldX,oldY,10);
    createTeleportParticles(enemy.x+enemy.w/2,enemy.y+enemy.h/2,10);
}
function checkVindexEnemyCollisions(){
    if(level!=='hard'||!lordVindex||lordVindex.dead)return;
    for(const k of killers){
        if(k.loading>0||k.disintegrating)continue;
        if(collide(lordVindex,k)) pushEnemyByVindex(k,46);
    }
    for(const a of archers){
        if(a.dead)continue;
        if(collide(lordVindex,a)) pushEnemyByVindex(a,46);
    }
}
function separatePlayerAndVindex(push=7){
    if(!player||!lordVindex)return;
    const pcx=player.x+player.w/2, pcy=player.y+player.h/2;
    const vcx=lordVindex.x+lordVindex.w/2, vcy=lordVindex.y+lordVindex.h/2;
    let dx=pcx-vcx,dy=pcy-vcy;
    const dist=Math.hypot(dx,dy);
    if(dist<0.001){
        dx=1;dy=0;
    }else{
        dx/=dist;dy/=dist;
    }
    const playerPush=push*.58;
    const vindexPush=push*.42;
    player.x+=dx*playerPush;
    player.y+=dy*playerPush;
    lordVindex.x-=dx*vindexPush;
    lordVindex.y-=dy*vindexPush;
    player.x=Math.max(10,Math.min(WIDTH-player.w-10,player.x));
    player.y=Math.max(70,Math.min(HEIGHT-player.h-10,player.y));
    lordVindex.x=Math.max(35,Math.min(WIDTH-lordVindex.w-35,lordVindex.x));
    lordVindex.y=Math.max(25,Math.min(HEIGHT-lordVindex.h-35,lordVindex.y));
}
function checkLordCollision(){
    if(level!=='hard'||!lordVindex||lordVindex.dead||!player)return;
    if(collide(player,lordVindex)){
        /* Saat bersentuhan, keduanya saling terpental sedikit agar tidak menempel. */
        separatePlayerAndVindex(lordVindex.contactCooldown<=0?9:4);
        lordVindex.contactCooldown=8;
        lordVindex.react=28;
        if(powerActive>0 || timeStop>0 || vindexTimeStop>0){
            if(powerActive>0){
                lordVindex.evadeCooldown=0;
                createTeleportParticles(lordVindex.x+lordVindex.w/2,lordVindex.y+lordVindex.h/2,12);
            }
            if(powerActive>0 && timeStop>0){
                storyMessage='LORD VINDEX: "TIME STOP TIDAK BERFUNGSI PADAKU."';
                storyMessageTimer=95;
            }
            return;
        }
        if(hitCooldown<=0){
            lives=Math.max(0,lives-1);
            hitCooldown=45;
            globalFreeze=28;
            screenShake=10;
            storyMessage='LORD VINDEX MENYENTUHMU — 1 NYAWA HILANG';
            storyMessageTimer=90;
            if(lives<=0){lives=0;playerDeathMax=100;playerDeathTimer=100;createPlayerDeathParticles();}
        }
    }
}
function drawArchers(){
    for(const a of archers){
        if(a.dead)continue;
        const cx=a.x+a.w/2,cy=a.y+a.h/2;
        const spawnScale=0.35+0.65*(1-a.spawnAnim);
        const teleportScale=1+a.teleportAnim*.45;
        ctx.save();
        ctx.translate(cx,cy);
        if(a.spawnAnim>0){
            ctx.globalAlpha=Math.min(1,(1-a.spawnAnim)*1.5);
            for(let r=18+35*(1-a.spawnAnim);r>8;r-=12){
                ctx.strokeStyle='#fb923c';ctx.lineWidth=2;ctx.globalAlpha=.65*(1-a.spawnAnim);
                ctx.beginPath();ctx.arc(0,0,r+Math.sin(a.phase+r)*3,0,Math.PI*2);ctx.stroke();
            }
        }
        ctx.globalAlpha=1;
        ctx.rotate(a.aim);
        ctx.scale(spawnScale*teleportScale,spawnScale*teleportScale);
        ctx.strokeStyle=timeStop>0?'#93c5fd':'#f97316';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(115,0);ctx.stroke();
        ctx.fillStyle='#7c2d12';ctx.beginPath();ctx.arc(0,0,11+Math.sin(a.phase)*1.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fdba74';ctx.stroke();
        ctx.strokeStyle='#f8fafc';ctx.lineWidth=2;ctx.beginPath();ctx.arc(2,0,8,-1.2,1.2);ctx.stroke();ctx.fillStyle='#fee2e2';ctx.fillRect(2,-3,5,6);ctx.restore();
        if(a.loading>0){ctx.save();ctx.fillStyle='#fbbf24';ctx.font='900 11px Arial';ctx.textAlign='center';ctx.fillText('AIM',cx,cy-17);ctx.restore();}
        if(a.teleportAnim>0){ctx.save();ctx.globalAlpha=a.teleportAnim*.7;ctx.strokeStyle='#f59e0b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,14+30*a.teleportAnim,0,Math.PI*2);ctx.stroke();ctx.restore();}
    }
    for(const q of archerArrows){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(q.vy,q.vx));ctx.fillStyle=q.lord?'#a78bfa':'#fde68a';ctx.fillRect(-6,-2,12,4);ctx.fillRect(4,-4,3,8);ctx.restore();}
}

function drawLordVindex(){
    if(level!=='hard'||!lordVindex||lordVindex.dead)return;const l=lordVindex,cx=l.x+l.w/2,cy=l.y+l.h/2;ctx.save();ctx.translate(cx,cy);
    if(l.react>0){ctx.globalAlpha=.35;ctx.strokeStyle='#e9d5ff';ctx.lineWidth=3;ctx.setLineDash([8,7]);ctx.beginPath();ctx.arc(0,0,30+l.react*.35,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    const glow=14+Math.sin(l.phase)*4+(l.react>0?12:0);ctx.shadowBlur=glow;ctx.shadowColor='#a855f7';ctx.fillStyle='#3b0764';ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#c084fc';ctx.fillRect(-12,-8,8,7);ctx.fillRect(4,-8,8,7);ctx.fillStyle='#111827';ctx.fillRect(-9,-6,3,3);ctx.fillRect(6,-6,3,3);ctx.fillStyle='#fef3c7';ctx.fillRect(-10,7,20,4);
    ctx.fillStyle='#f5d0fe';ctx.font='900 10px Arial';ctx.textAlign='center';ctx.fillText('VINDEX',0,36);ctx.restore();
}
function drawTimeStopWave(){
    if(timeStop<=0 && timeStopWave<=0) return;
    const progress=Math.min(1,timeStopWave/TIME_STOP_DURATION);
    const slowProgress=1-Math.pow(1-progress,0.72);
    const cx=timeStopOriginX || (player ? player.x+player.w/2 : WIDTH/2);
    const cy=timeStopOriginY || (player ? player.y+player.h/2 : HEIGHT/2);
    const maxR=Math.hypot(WIDTH,HEIGHT)*.72;
    ctx.save();
    ctx.globalCompositeOperation='screen';
    for(let i=0;i<3;i++){
        const offset=i*.14;
        const waveProgress=Math.min(1,Math.max(0,slowProgress-offset));
        const r=25+waveProgress*maxR;
        const alpha=(1-waveProgress)*.22;
        ctx.globalAlpha=alpha;
        ctx.strokeStyle='#7dd3fc';
        ctx.lineWidth=3-i*.55;
        ctx.beginPath();
        ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.stroke();
    }
    ctx.globalAlpha=.10+Math.sin(timeStopWavePulse)*.025;
    ctx.fillStyle='#38bdf8';
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.restore();
}

function drawTimeStopPowerup(){
    if(!timeStopPowerup||!timeStopPowerup.visible)return;const p=timeStopPowerup,cx=p.x+p.w/2,cy=p.y+p.h/2,r=14+Math.sin(p.pulse)*2;ctx.save();ctx.shadowBlur=18;ctx.shadowColor='#60a5fa';ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#e0f2fe';ctx.font='900 17px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⏳',cx,cy);ctx.restore();
}
function drawArcherWarning(){
    if(level!=='normal' || archerWarningTimer<=0) return;
    const pulse=0.72+Math.sin(performance.now()*0.018)*0.28;
    ctx.save();
    ctx.globalAlpha=pulse;
    ctx.fillStyle='rgba(127,29,29,.88)';
    ctx.strokeStyle='#fb923c';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.roundRect(180,18,440,42,12);
    ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff7ed';
    ctx.font='900 15px Arial';
    ctx.textAlign='center';
    ctx.fillText(archerWarningText,WIDTH/2,45);
    ctx.restore();
}

function drawStoryMessage(){
    if(storyMessageTimer<=0||!storyMessage)return;ctx.save();ctx.globalAlpha=Math.min(1,storyMessageTimer/25);ctx.fillStyle='rgba(2,3,5,.88)';ctx.strokeStyle='rgba(168,85,247,.7)';ctx.lineWidth=1;ctx.roundRect(115,HEIGHT-70,570,44,12);ctx.fill();ctx.stroke();ctx.fillStyle='#f8fafc';ctx.font='700 14px Arial';ctx.textAlign='center';ctx.fillText(storyMessage,WIDTH/2,HEIGHT-43);ctx.restore();storyMessageTimer--;
}
function updateStoryTriggers(){
    const now=performance.now();
    updateCollectibleRelocateCooldown();

    /* Normal: Archer diberi warning sebelum benar-benar spawn. */
    if((level==='normal' || level==='hard') && score>=ARCHER_FIRST_SCORE && archers.length<MAX_ARCHERS){
        if(archerWarningTimer<=0 && now>=archerNextSpawnTime){
            archerWarningTimer=180;
            archerWarningText='⚠ ARCHER AKAN MUNCUL! SIAP-SIAP!';
        }
        if(archerWarningTimer>0){
            archerWarningTimer--;
            if(archerWarningTimer<=0){
                spawnArcher();
                archerNextSpawnTime=now+randomInt(ARCHER_SPAWN_MIN,ARCHER_SPAWN_MAX);
            }
        }
    }

    if(level==='hard' && score===1 && storyMessageTimer<=0){
        storyMessage='Lord Vindex: "Aku adalah Vindex. Dan kau tidak akan keluar hidup-hidup."';
        storyMessageTimer=300;
    }
    if(level==='hard' && !continuationMode && score>=25 && !hard25Triggered && !hard25Completed){
        triggerHard25Sequence();
    }
}

/* =========================================================
   PLAYER VS KILLER
========================================================= */

function checkPlayerKillers(){

    if(
        powerActive>0
    ){

        for(
            let i=0;
            i<killers.length;
            i++
        ){

            const k = killers[i];

            if(
                k.loading>0 ||
                k.disintegrating
            ){

                continue;

            }

            if(
                collide(player,k)
            ){

                k.disintegrating = true;
                k.disintegrateTimer = 32;
                createDisintegrationParticles(k);
                k.hitFlash = 12;
                screenShake = 9;
            }

        }

        return;

    }


    if(
        hitCooldown>0
    ){

        hitCooldown--;

        return;

    }


    for(
        let i=0;
        i<killers.length;
        i++
    ){

        const k =
            killers[i];

        if(
            k.loading>0 ||
            k.disintegrating
        ){

            continue;

        }

        if(
            collide(player,k)
        ){

            lives--;

            hitCooldown = 30;

            globalFreeze = GLOBAL_KILLER_FREEZE;

            /* Killer yang menyerang MERAYAKAN. */
            k.celebrating = GLOBAL_KILLER_FREEZE + 20;
            k.celebratingPhase = 0;
            k.targetTilt = 0;
            k.scaleX = 1.12;
            k.scaleY = .90;

            /* Killer lain kecewa dengan timing yang sama. */
            killers.forEach(
                function(other){

                    if(
                        other!==k &&
                        !other.disintegrating
                    ){

                        other.disappointed =
                            GLOBAL_KILLER_FREEZE + 20;

                        other.targetTilt = .35;
                        other.scaleX = .85;
                        other.scaleY = 1.15;

                    }

                }
            );

            screenShake = 12;

            if(
                lives<=0
            ){

                lives=0;
                playerDeathMax = 100;
                playerDeathTimer = playerDeathMax;
                globalFreeze = playerDeathMax;
                hitCooldown = playerDeathMax;
                createPlayerDeathParticles();
                screenShake = 18;

                return;

            }

            break;

        }

    }

}


/* =========================================================
   PLAYER DEATH ANIMATION
========================================================= */

function createPlayerDeathParticles(){

    const cx = player.x + player.w/2;
    const cy = player.y + player.h/2;

    for(let i=0;i<30;i++){
        const angle = Math.random()*Math.PI*2;
        const speed = 1.5 + Math.random()*5.5;

        particleList.push({
            x:cx,
            y:cy,
            vx:Math.cos(angle)*speed,
            vy:Math.sin(angle)*speed - 1,
            size:2+Math.random()*4,
            life:35+Math.random()*45,
            maxLife:80,
            deathParticle:true
        });
    }
}


/* =========================================================
   DISINTEGRATING KILLER
========================================================= */

function updateDisintegratingKiller(k){

    if(
        k.disintegrateTimer>0
    ){

        k.disintegrateTimer--;

    }


    if(
        k.disintegrateTimer===0
    ){

        const index =
            killers.indexOf(k);


        if(
            index!==-1
        ){

            killers.splice(
                index,
                1
            );

        }

    }

}


/* =========================================================
   PARTICLES
========================================================= */

function createDisintegrationParticles(k){

    const cx =
        k.x+
        k.w/2;

    const cy =
        k.y+
        k.h/2;


    for(
        let i=0;
        i<18;
        i++
    ){

        const angle =
            Math.random()*
            Math.PI*2;


        const speed =
            randomInt(
                2,
                7
            );


        particleList.push({

            x:cx,

            y:cy,

            vx:
                Math.cos(angle)*
                speed,

            vy:
                Math.sin(angle)*
                speed,

            size:
                randomInt(
                    2,
                    5
                ),

            life:
                randomInt(
                    25,
                    50
                ),

            maxLife:
                50

        });

    }

}


/* =========================================================
   UPDATE PARTICLES
========================================================= */

function updateParticles(){
    const sf=enemySlowFactor();
    let write=0;
    for(let i=0;i<particleList.length;i++){
        const p=particleList[i];
        p.x+=p.vx*sf; p.y+=p.vy*sf;
        p.vx*=Math.pow(.97,sf); p.vy=p.vy*Math.pow(.97,sf)+.08*sf;
        p.life-=sf;
        if(p.life>0){ particleList[write++]=p; }
    }
    particleList.length=write;
    if(particleList.length>300) particleList.length=300;
}


/* =========================================================
   GLOBAL FREEZE
========================================================= */

function updateGlobalFreeze(){

    if(meteorShockwave && meteorShockwave.life>0) meteorShockwave.life--;
    else if(meteorShockwave) meteorShockwave=null;
    if(playerShockTimer>0){ playerShockTimer--; playerShockX*=.9; playerShockY*=.9; }

    if(
        globalFreeze>0
    ){

        globalFreeze--;

    }


    if(
        screenShake>0
    ){

        screenShake--;

    }

}


/* =========================================================
   BACKGROUND
   HANYA KOTAK-KOTAK SAAT MAIN
========================================================= */

function drawGameBackground(){

    /*
     * Background hitam.
     */

    ctx.fillStyle =
        "#080808";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /*
     * Kotak-kotak besar.
     */

    const cell = 40;


    for(
        let y=0;
        y<HEIGHT;
        y+=cell
    ){

        for(
            let x=0;
            x<WIDTH;
            x+=cell
        ){

            const checker =
                (
                    x/cell+
                    y/cell
                )%2;


            ctx.fillStyle =
                checker===0
                    ? "#101010"
                    : "#171717";


            ctx.fillRect(
                x,
                y,
                cell,
                cell
            );


            /*
             * Garis tipis.
             */

            ctx.strokeStyle =
                "#222222";

            ctx.lineWidth=1;

            ctx.strokeRect(
                x,
                y,
                cell,
                cell
            );

        }

    }


    /*
     * Vignette ringan.
     */

    const vignette =
        ctx.createRadialGradient(
            WIDTH/2,
            HEIGHT/2,
            150,
            WIDTH/2,
            HEIGHT/2,
            550
        );


    vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    vignette.addColorStop(
        1,
        "rgba(0,0,0,.45)"
    );


    ctx.fillStyle =
        vignette;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer(){

    if(level==='hard' && hard25SequenceActive && hard25SequenceTimer>=150 && hard25SequenceTimer<245){
        return;
    }

    if(playerDeathTimer>0){

        const progress = 1 - playerDeathTimer / Math.max(1,playerDeathMax);
        const cx = player.x + player.w/2;
        const cy = player.y + player.h/2;
        const scale = Math.max(.15,1 - progress*.85);
        const spin = progress * Math.PI * 3.5;
        const alpha = Math.max(0,1-progress);
        const flash = Math.sin(progress*Math.PI*12) > 0 ? 1 : 0;

        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(spin);
        ctx.scale(scale,scale);
        ctx.globalAlpha = alpha;

        ctx.fillStyle = flash ? "#ffffff" : "#16a34a";
        ctx.fillRect(-10,-10,20,20);

        ctx.fillStyle = "#86efac";
        ctx.fillRect(-7,-7,5,5);

        ctx.restore();

        ctx.save();
        ctx.globalAlpha = Math.max(0,1-progress*.7);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx,cy,14 + progress*28,0,Math.PI*2);
        ctx.stroke();
        ctx.restore();

        return;
    }

    ctx.fillStyle =
        "#16a34a";

    ctx.fillRect(
        player.x,
        player.y,
        player.w,
        player.h
    );


    ctx.fillStyle =
        "#86efac";

    ctx.fillRect(
        player.x+3,
        player.y+3,
        5,
        5
    );

}


/* =========================================================
   TARGET
========================================================= */

function drawTarget(){

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        target.x,
        target.y,
        target.w,
        target.h
    );


    ctx.strokeStyle =
        "#d1d5db";

    ctx.lineWidth=2;

    ctx.strokeRect(
        target.x,
        target.y,
        target.w,
        target.h
    );

}


/* =========================================================
   HEALTH
========================================================= */

function drawPowerup(){

    if(!powerup || !powerup.visible){

        return;

    }

    powerup.pulse += .12;

    const cx = powerup.x + powerup.w/2;
    const cy = powerup.y + powerup.h/2;
    const pulse = Math.sin(powerup.pulse)*3;

    ctx.save();

    ctx.shadowColor = "rgba(250,204,21,.9)";
    ctx.shadowBlur = 14 + pulse;

    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(cx,cy,12+pulse*.25,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff7ae";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#3b2200";
    ctx.beginPath();
    ctx.moveTo(cx+2,cy-9);
    ctx.lineTo(cx-6,cy+1);
    ctx.lineTo(cx-1,cy+1);
    ctx.lineTo(cx-4,cy+10);
    ctx.lineTo(cx+7,cy-3);
    ctx.lineTo(cx+2,cy-3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "900 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("KILL",cx,cy+22+pulse);

    ctx.restore();

}


function drawHealth(){

    if(!health || !health.visible){
        return;
    }

    health.pulse += .08;

    const cx =
        health.x+
        health.w/2;

    const cy =
        health.y+
        health.h/2;


    ctx.save();


    ctx.shadowColor =
        "rgba(34,197,94,.7)";

    ctx.shadowBlur=10;


    ctx.fillStyle =
        "#22c55e";


    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        health.w/2,
        0,
        Math.PI*2
    );

    ctx.fill();


    ctx.shadowBlur=0;


    ctx.strokeStyle =
        "#bbf7d0";

    ctx.lineWidth=2;

    ctx.stroke();


    /*
     * PLUS.
     */

    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        cx-2,
        cy-8,
        4,
        16
    );


    ctx.fillRect(
        cx-8,
        cy-2,
        16,
        4
    );


    ctx.restore();

}


/* =========================================================
   GADFLY
========================================================= */

function drawGadfly(g){

    ctx.save();


    const cx =
        g.x+
        g.w/2;

    const cy =
        g.y+
        g.h/2;


    ctx.translate(
        cx,
        cy
    );


    ctx.rotate(
        g.rotation
    );


    /*
     * Flash ketika terkena.
     */

    if(
        g.hitAnim>0 &&
        Math.floor(
            g.hitAnim/3
        )%2===0
    ){

        ctx.globalAlpha=.45;

    }


    /*
     * Sayap.
     */

    ctx.fillStyle =
        "rgba(255,255,255,.7)";


    ctx.fillRect(
        -14,
        -7,
        7,
        14
    );


    ctx.fillRect(
        7,
        -7,
        7,
        14
    );


    /*
     * Badan.
     */

    ctx.fillStyle =
        g.freeze>0
            ? "#64748b"
            : "#ef4444";


    ctx.fillRect(
        -10,
        -10,
        20,
        20
    );


    /*
     * Mata.
     */

    ctx.fillStyle =
        "#111827";


    ctx.fillRect(
        -6,
        -5,
        4,
        4
    );


    ctx.fillRect(
        2,
        -5,
        4,
        4
    );


    /*
     * Mata putih kecil.
     */

    ctx.fillStyle =
        "#f8fafc";


    ctx.fillRect(
        -5,
        -4,
        1,
        1
    );

    ctx.fillRect(
        3,
        -4,
        1,
        1
    );


    /*
     * Mulut.
     */

    ctx.fillStyle =
        "#111827";

    ctx.fillRect(
        -5,
        3,
        10,
        3
    );


    ctx.restore();

}


/* =========================================================
   KILLER
========================================================= */

function drawKiller(k){

    /*
     * BERSURAI
     */

    if(
        k.disintegrating
    ){

        drawDisintegratingKiller(
            k
        );

        return;

    }


    const cx =
        k.x+
        k.w/2;

    const cy =
        k.y+
        k.h/2;


    /*
     * LOADING
     */

    if(
        k.loading>0
    ){

        const progress =
            1-
            (
                k.loading/
                KILLER_LOAD_TIME
            );


        const blink =
            Math.floor(
                k.loading/8
            )%2;


        const pulse =
            Math.sin(
                k.pulse
            )*3;


        ctx.save();


        /*
         * Aura.
         */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            15+
            pulse+
            progress*12,
            0,
            Math.PI*2
        );


        ctx.strokeStyle =
            blink
                ? "#ff1111"
                : "rgba(120,0,0,.25)";

        ctx.lineWidth=2;

        ctx.stroke();


        /*
         * Loading circle.
         */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            23+
            pulse,
            -Math.PI/2,
            -Math.PI/2+
            Math.PI*2*
            progress
        );


        ctx.strokeStyle =
            "#ef4444";

        ctx.lineWidth=3;

        ctx.stroke();


        /*
         * Badan blink.
         */

        if(
            blink
        ){

            drawScaryKillerBody(
                k,
                cx,
                cy,
                .95
            );

        }


        ctx.restore();

        return;

    }


    /*
     * NORMAL
     */

    ctx.save();


    ctx.translate(
        cx,
        cy
    );


    ctx.rotate(
        k.tilt
    );


    /*
     * Animasi kecewa.
     */

    if(
        k.disappointed>0
    ){

        const sad =
            Math.sin(
                k.disappointedPhase
            )*.12;

        ctx.rotate(
            .22+
            sad
        );

        ctx.scale(
            .88,
            1.10
        );

    }
    else{

        ctx.scale(
            k.scaleX,
            k.scaleY
        );

    }


    drawScaryKillerBody(
        k,
        0,
        0,
        1
    );


    if(
        k.panic
    ){

        const panicBob = Math.sin(k.panicPhase*2.4)*3;

        ctx.fillStyle = "#facc15";
        ctx.font = "900 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("!",0,-19+panicBob);

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;

        for(let c=0;c<4;c++){
            const a = k.panicPhase + c*Math.PI/2;
            const rx = Math.cos(a)*15;
            const ry = Math.sin(a)*15;
            ctx.beginPath();
            ctx.moveTo(rx,ry);
            ctx.lineTo(rx+Math.cos(a)*5,ry+Math.sin(a)*5);
            ctx.stroke();
        }

    }


    if(
        k.celebrating>0
    ){

        const bounce =
            Math.sin(k.celebratingPhase)*4;

        ctx.fillStyle = "#facc15";
        ctx.font = "900 11px Arial";
        ctx.textAlign = "center";
        ctx.fillText("HA!",0,-19+bounce);

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;

        for(let c=0;c<4;c++){
            const a = k.celebratingPhase + c*Math.PI/2;
            const rx = Math.cos(a)*16;
            const ry = Math.sin(a)*14;
            ctx.beginPath();
            ctx.moveTo(rx,ry);
            ctx.lineTo(rx+Math.cos(a)*4,ry+Math.sin(a)*4);
            ctx.stroke();
        }

    }


    /*
     * Jika kecewa,
     * gambar simbol sedih.
     */

    if(
        k.disappointed>0
    ){

        ctx.strokeStyle =
            "#fca5a5";

        ctx.lineWidth=1.5;


        ctx.beginPath();

        ctx.arc(
            0,
            4,
            4,
            Math.PI,
            0
        );

        ctx.stroke();

    }


    ctx.restore();

}


/* =========================================================
   SCARY BODY
========================================================= */

function drawScaryKillerBody(
    k,
    cx,
    cy,
    opacity
){

    ctx.save();


    ctx.translate(
        cx,
        cy
    );


    ctx.globalAlpha =
        opacity;


    /*
     * Shadow.
     */

    ctx.fillStyle =
        "#210307";

    ctx.fillRect(
        -12,
        -11,
        24,
        23
    );


    /*
     * Body gradient.
     */

    const gradient =
        ctx.createLinearGradient(
            -10,
            -10,
            10,
            10
        );


    gradient.addColorStop(
        0,
        "#991b1b"
    );

    gradient.addColorStop(
        .45,
        "#450a0a"
    );

    gradient.addColorStop(
        1,
        "#130205"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        -9,
        -9,
        18,
        19
    );


    /*
     * Kepala runcing.
     */

    ctx.fillStyle =
        "#200306";


    ctx.beginPath();

    ctx.moveTo(
        -9,
        -8
    );

    ctx.lineTo(
        -6,
        -14
    );

    ctx.lineTo(
        -2,
        -9
    );

    ctx.lineTo(
        2,
        -14
    );

    ctx.lineTo(
        7,
        -8
    );

    ctx.closePath();

    ctx.fill();


    /*
     * Mata.
     */

    ctx.fillStyle =
        "#ff1111";


    ctx.shadowColor =
        "#ff0000";

    ctx.shadowBlur=8;


    ctx.fillRect(
        -7,
        -3,
        5,
        3
    );


    ctx.fillRect(
        2,
        -3,
        5,
        3
    );


    ctx.shadowBlur=0;


    /*
     * Pupil.
     */

    ctx.fillStyle =
        "#050000";


    ctx.fillRect(
        -4,
        -3,
        2,
        3
    );

    ctx.fillRect(
        2,
        -3,
        2,
        3
    );


    /*
     * Mulut.
     */

    ctx.fillStyle =
        "#020000";


    ctx.beginPath();

    ctx.moveTo(
        -7,
        3
    );

    ctx.lineTo(
        7,
        3
    );

    ctx.lineTo(
        5,
        8
    );

    ctx.lineTo(
        -5,
        8
    );

    ctx.closePath();

    ctx.fill();


    /*
     * Gigi.
     */

    ctx.fillStyle =
        "#f8fafc";


    for(
        let i=0;
        i<4;
        i++
    ){

        const toothX =
            -5+
            i*3.2;


        ctx.beginPath();

        ctx.moveTo(
            toothX,
            3
        );

        ctx.lineTo(
            toothX+1.6,
            3
        );

        ctx.lineTo(
            toothX+.8,
            6
        );

        ctx.closePath();

        ctx.fill();

    }


    /*
     * Goresan.
     */

    ctx.strokeStyle =
        "#dc2626";

    ctx.lineWidth=1;


    ctx.beginPath();

    ctx.moveTo(
        -8,
        -8
    );

    ctx.lineTo(
        -5,
        -4
    );

    ctx.lineTo(
        -8,
        -1
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        8,
        -7
    );

    ctx.lineTo(
        5,
        -3
    );

    ctx.lineTo(
        8,
        0
    );

    ctx.stroke();


    /*
     * Darah.
     */

    ctx.fillStyle =
        "#dc2626";


    ctx.fillRect(
        -9,
        7,
        2,
        3
    );


    ctx.fillRect(
        7,
        8,
        2,
        2
    );


    /*
     * Flash.
     */

    if(
        k.hitFlash>0
    ){

        ctx.strokeStyle =
            "#fca5a5";

        ctx.lineWidth=2;

        ctx.strokeRect(
            -13,
            -13,
            26,
            26
        );

    }


    ctx.restore();

}


/* =========================================================
   DISINTEGRATING KILLER
========================================================= */

function drawDisintegratingKiller(k){

    const cx =
        k.x+
        k.w/2;

    const cy =
        k.y+
        k.h/2;


    const progress =
        k.disintegrateTimer/
        40;


    ctx.save();


    ctx.globalAlpha =
        progress;


    ctx.translate(
        cx,
        cy
    );


    ctx.rotate(
        (1-progress)*2
    );


    ctx.scale(
        progress,
        progress
    );


    drawScaryKillerBody(
        k,
        0,
        0,
        1
    );


    ctx.restore();

}


/* =========================================================
   PARTICLES DRAW
========================================================= */

function drawParticles(){
    ctx.save();
    for(let i=0;i<particleList.length;i++){
        const p=particleList[i];
        const alpha=Math.max(0,p.life/p.maxLife);
        ctx.globalAlpha=alpha;
        ctx.fillStyle=p.deathParticle?"#f472b6":(p.meteorParticle?"#f97316":"#ef4444");
        ctx.fillRect(p.x,p.y,p.size,p.size);
    }
    ctx.restore();
}


/* =========================================================
   GAME DRAW
========================================================= */

function drawGame(){

    ctx.save();


    /*
     * Screen shake.
     */

    if(
        screenShake>0
    ){

        const shake =
            Math.random()*4;


        ctx.translate(
            randomInt(
                -shake,
                shake
            ),
            randomInt(
                -shake,
                shake
            )
        );

    }


    /*
     * Background kotak.
     */

    drawGameBackground();


    /*
     * Target.
     */

    if(target){

        drawTarget();

    }


    /*
     * Health.
     */

    if(health){

        drawHealth();

    }


    drawPowerup();


    drawMeteors();


    /*
     * Gadfly.
     */

    gadflies.forEach(
        drawGadfly
    );


    /*
     * Killer.
     */

    killers.forEach(
        drawKiller
    );
    drawArcherWarning();
    drawArchers();
    drawLordVindex();
    drawVindexTimeStopWave();
    drawVindexLaser();
    drawHard25SequenceOverlay();
    drawTimeStopWave();
    drawTimeStopPowerup();
    drawStoryMessage();


    /*
     * Partikel.
     */

    drawParticles();


    /*
     * Player.
     */

    if(player){

        drawPlayer();

    }


    ctx.restore();

}


/* =========================================================
   HUD
========================================================= */

function updateHUD(){

    document.getElementById(
        "scoreNumber"
    ).textContent =
        score;


    const lifeElements =
        document.querySelectorAll(
            ".life"
        );


    lifeElements.forEach(
        function(element,index){

            if(
                index<lives
            ){

                element.classList.remove(
                    "dead"
                );

            }

            else{

                element.classList.add(
                    "dead"
                );

            }

        }
    );


    const powerStatus =
        document.getElementById("powerStatus");

    const powerText =
        document.getElementById("powerText");

    if(powerActive>0){
        powerStatus.classList.remove("hidden");
        powerText.textContent = "KILL " + Math.ceil(powerActive/60) + "s";
    }
    else if(timeStop>0){
        powerStatus.classList.remove("hidden");
        powerText.textContent = "TIME STOP " + Math.ceil(timeStop/60) + "s";
    }
    else{
        powerStatus.classList.add("hidden");
    }


    /*
     * Tombol pause.
     */

    const pauseButton =
        document.getElementById(
            "pauseButton"
        );


    if(paused){

        pauseButton.textContent =
            "▶ LANJUT";

    }

    else{

        pauseButton.textContent =
            "⏸ PAUSE";

    }

}


/* =========================================================
   METEOR SHOWER
========================================================= */

function startMeteorSession(){
    if(meteorSessionActive || gameState!=="playing") return;
    meteorSessionUsed=true;
    meteorSessionActive=true;
    meteorSessionTimer=METEOR_SESSION_DURATION;
    meteorNextSpawn=randomInt(150,300);
    meteorWarningTimer=120;
    meteorPhase='firstBurst';
    meteorPhaseTimer=0;
    meteorBurstCooldown=METEOR_BURST_COOLDOWN;
    screenShake=6;
    for(let i=0;i<METEOR_FIRST_BURST;i++) spawnMeteor(-i*55,true);
}

function spawnMeteor(offsetY=0,forceDiagonal=false){
    const size=randomInt(12,20);
    const x=randomInt(METEOR_SAFE_MARGIN,WIDTH-size-METEOR_SAFE_MARGIN);
    const diagonal=forceDiagonal || Math.random()<.72;
    const direction=Math.random()<.5?-1:1;
    meteors.push({x:x,y:-size-20+offsetY,w:size,h:size,vx:diagonal?direction*randomInt(2,4):(Math.random()-.5)*1.4,vy:randomInt(METEOR_SPEED_MIN,METEOR_SPEED_MAX),rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.18,life:180,trail:[],large:false,impacted:false});
}

function spawnLargeMeteor(){
    if(largeMeteor || gameState!=="playing") return;
    const size=LARGE_METEOR_SIZE;
    const targetX=largeMeteorWarning ? largeMeteorWarning.x : randomInt(60,WIDTH-60);
    const targetY=largeMeteorWarning ? largeMeteorWarning.y : randomInt(150,HEIGHT-100);
    const startX=Math.max(0,Math.min(WIDTH-size,targetX-size/2+randomInt(-170,170)));
    const startY=-size-45;
    const dx=targetX-(startX+size/2);
    const dy=targetY-(startY+size/2);
    const dist=Math.hypot(dx,dy)||1;
    largeMeteor={x:startX,y:startY,w:size,h:size,vx:dx/dist*LARGE_METEOR_SPEED,vy:dy/dist*LARGE_METEOR_SPEED,rotation:Math.random()*Math.PI*2,rotationSpeed:.08*(Math.random()<.5?-1:1),targetX,targetY,trail:[],active:true};
    largeMeteorWarning=null;
}

function triggerVindexPowerAttack(){
    if(level!=='hard'||!lordVindex||lordVindex.dead||gameState!=='playing'||vindexPowerAttack)return;
    const targetX=randomInt(80,WIDTH-80);
    const targetY=randomInt(120,HEIGHT-100);
    const dx=targetX-(lordVindex.x+lordVindex.w/2);
    const dy=targetY-(lordVindex.y+lordVindex.h/2);
    const angle=Math.atan2(dy,dx);
    vindexPowerAttack={timer:VINDEX_POWER_CHARGE_TIME,x:targetX,y:targetY,angle,hit:false};
    lordVindex.react=VINDEX_POWER_CHARGE_TIME;
    screenShake=5;
    storyMessage='LORD VINDEX: "KALI INI, KEKUATANKU MENUJU DAERAH ITU."';
    storyMessageTimer=150;
}
function updateVindexPowerAttack(){
    if(level!=='hard'||!vindexPowerAttack)return;
    const a=vindexPowerAttack;
    a.timer--;
    if(a.timer<=0 && !a.hit){
        a.hit=true;
        const sx=lordVindex.x+lordVindex.w/2,sy=lordVindex.y+lordVindex.h/2;
        const ex=sx+Math.cos(a.angle)*Math.hypot(WIDTH,HEIGHT);
        const ey=sy+Math.sin(a.angle)*Math.hypot(WIDTH,HEIGHT);
        if(player){
            const px=player.x+player.w/2,py=player.y+player.h/2,vx=ex-sx,vy=ey-sy,len2=vx*vx+vy*vy||1;
            const t=Math.max(0,Math.min(1,((px-sx)*vx+(py-sy)*vy)/len2));
            const qx=sx+vx*t,qy=sy+vy*t;
            if(Math.hypot(px-qx,py-qy)<=VINDEX_POWER_BEAM_WIDTH/2+Math.max(player.w,player.h)*.35 && hitCooldown<=0){
                lives=Math.max(0,lives-VINDEX_POWER_DAMAGE);
                hitCooldown=55;screenShake=22;
                storyMessage='⚡ SERANGAN KEKUATAN VINDEX — 2 NYAWA HILANG';storyMessageTimer=120;
                createMeteorImpactParticles(a.x,a.y);
                if(lives<=0){lives=0;playerDeathMax=100;playerDeathTimer=100;createPlayerDeathParticles();}
            }else{
                storyMessage='⚡ SERANGAN VINDEX MENGHANTAM DAERAH TARGET';storyMessageTimer=80;
            }
        }
        a.timer=32;
        screenShake=18;
    }else if(a.hit){
        if(a.timer<=0){vindexPowerAttack=null;scheduleNextLargeMeteor();}
    }
}
function drawVindexPowerAttack(){
    if(level!=='hard'||!vindexPowerAttack||!lordVindex)return;
    const a=vindexPowerAttack;
    const cx=lordVindex.x+lordVindex.w/2,cy=lordVindex.y+lordVindex.h/2;
    const len=Math.hypot(WIDTH,HEIGHT)*1.1;
    ctx.save();ctx.translate(cx,cy);
    if(!a.hit){
        const p=1-a.timer/VINDEX_POWER_CHARGE_TIME;
        ctx.globalAlpha=.28+.55*p;ctx.fillStyle='#a855f7';ctx.beginPath();ctx.arc(0,0,24+p*32+Math.sin(p*30)*4,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=.9;ctx.strokeStyle='#e9d5ff';ctx.lineWidth=3+p*4;ctx.beginPath();ctx.arc(0,0,30+p*18,0,Math.PI*2);ctx.stroke();
        ctx.rotate(a.angle);ctx.globalAlpha=.18+.32*p;ctx.fillStyle='#c084fc';ctx.fillRect(0,-VINDEX_POWER_BEAM_WIDTH/2,len,VINDEX_POWER_BEAM_WIDTH);
        ctx.globalAlpha=.95;ctx.fillStyle='#f5d0fe';ctx.font='900 15px Arial';ctx.textAlign='center';ctx.fillText('VINDEX MENGISI KEKUATAN...',0,-48);
    }else{
        ctx.rotate(a.angle);const p=a.timer/32;ctx.globalAlpha=.18+.6*p;ctx.fillStyle='#c084fc';ctx.fillRect(0,-VINDEX_POWER_BEAM_WIDTH/2,len,VINDEX_POWER_BEAM_WIDTH);ctx.globalAlpha=.95;ctx.fillStyle='#f5d0fe';ctx.fillRect(0,-7,len,14);ctx.globalAlpha=.7;ctx.fillStyle='#fff';ctx.fillRect(0,-3,len,6);
    }
    ctx.restore();
    ctx.save();ctx.globalAlpha=.9;ctx.strokeStyle='#d8b4fe';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(a.x,a.y,45+Math.sin(a.timer*.18)*7,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
}

function triggerRareLargeMeteor(){
    if(gameState==="playing" && level==='hard'){
        triggerVindexPowerAttack();
        return;
    }
    if(largeMeteorPending || largeMeteorWarning || gameState!=="playing") return;
    largeMeteorPending=true;
    largeMeteorSpawnTimer=LARGE_METEOR_WARNING_TIME;
    largeMeteorWarning={
        x:randomInt(80,WIDTH-80),
        y:randomInt(130,HEIGHT-100),
        targetX:randomInt(80,WIDTH-80),
        targetY:randomInt(130,HEIGHT-100),
        radius:LARGE_METEOR_SIZE*.62,
        life:LARGE_METEOR_WARNING_TIME,
        phase:Math.random()*Math.PI*2
    };
    screenShake=3;
}

function checkLargeMeteorMilestone(){
    if(score< METEOR_TRIGGER_SCORE || largeMeteorMilestones.has(score)) return;
    largeMeteorMilestones.add(score);
}

function scheduleNextLargeMeteor(){
    if(score < METEOR_TRIGGER_SCORE){
        largeMeteorSpawnTimer = 999999;
        return;
    }
    largeMeteorSpawnTimer=randomInt(LARGE_METEOR_RANDOM_MIN,LARGE_METEOR_RANDOM_MAX);
}

function beginMeteorPreparation(){
    if(meteorPreShowerActive || meteorSessionActive || gameState!=="playing" || score<METEOR_TRIGGER_SCORE) return;
    meteorShowerUnlocked=true;
    meteorPreShowerActive=true;
    meteorPreShowerTimer=randomInt(METEOR_PRE_SHOWER_MIN,METEOR_PRE_SHOWER_MAX);
    meteorPreShowerNextSpawn=randomInt(45,90);
    meteorPreShowerSpawned=0;
    meteorWarningTimer=0;
    screenShake=3;
}

function updateMeteorPreparation(){
    if(!meteorPreShowerActive) return;
    if(gameState!=="playing") return;
    meteorPreShowerTimer--;
    if(meteorPreShowerSpawned<METEOR_PRE_SHOWER_MAX_METEORS){
        if(meteorPreShowerNextSpawn<=0){
            spawnMeteor(0,false);
            meteorPreShowerSpawned++;
            meteorPreShowerNextSpawn=randomInt(METEOR_PRE_SHOWER_SPAWN_INTERVAL_MIN,METEOR_PRE_SHOWER_SPAWN_INTERVAL_MAX);
        }else{
            meteorPreShowerNextSpawn--;
        }
    }
    if(meteorPreShowerTimer<=0){
        meteorPreShowerActive=false;
        meteorSessionUsed=false;
        startMeteorSession();
    }
}

function updateLargeMeteorRandomEvent(){
    if(gameState!=="playing" || score<METEOR_TRIGGER_SCORE || !meteorShowerUnlocked || meteorPreShowerActive) return;
    if(level==='hard'){
        if(vindexPowerAttack)return;
        largeMeteorSpawnTimer--;
        if(largeMeteorSpawnTimer<=0) triggerVindexPowerAttack();
        return;
    }
    if(largeMeteorPending){
        if(largeMeteorWarning){
            largeMeteorWarning.life--;
            largeMeteorWarning.phase+=.14;
            const progress=1-largeMeteorWarning.life/LARGE_METEOR_WARNING_TIME;
            const nx=largeMeteorWarning.x+(largeMeteorWarning.targetX-largeMeteorWarning.x)*.035;
            const ny=largeMeteorWarning.y+(largeMeteorWarning.targetY-largeMeteorWarning.y)*.035;
            largeMeteorWarning.x=nx+Math.sin(largeMeteorWarning.phase)*5;
            largeMeteorWarning.y=ny+Math.cos(largeMeteorWarning.phase*1.3)*3;
            if(largeMeteorWarning.life<=0){
                largeMeteorPending=false;
                spawnLargeMeteor();
                screenShake=8;
            }
        }
        return;
    }
    largeMeteorSpawnTimer--;
    if(largeMeteorSpawnTimer<=0) triggerRareLargeMeteor();
}

function updateLargeMeteor(){
    if(largeMeteor && largeMeteor.active){
        const m=largeMeteor;
        m.trail.push({x:m.x+m.w/2,y:m.y+m.h/2});
        if(m.trail.length>4) m.trail.shift();
        m.x+=m.vx; m.y+=m.vy; m.rotation+=m.rotationSpeed;
        if(m.x<0){m.x=0;m.vx=Math.abs(m.vx);}
        if(m.x+m.w>WIDTH){m.x=WIDTH-m.w;m.vx=-Math.abs(m.vx);}
        const cx=m.x+m.w/2,cy=m.y+m.h/2;
        if(Math.hypot(m.targetX-cx,m.targetY-cy)<=Math.max(8,m.w*.13) || m.y>HEIGHT+80){
            m.active=false;
            queueLargeMeteorImpact(m.targetX,m.targetY);
            largeMeteor=null;
            screenShake=12;
        }
    }
}

function updateMeteors(){
    const worldSlow=enemySlowFactor();
    if(level === 'hard' && score >= 25){
        hardMeteorPermanent = true;
        meteorShowerUnlocked = true;
        if(!meteorSessionActive && !meteorPreShowerActive){
            meteorSessionActive = true;
            meteorSessionTimer = 999999;
            meteorPhase = 'random2';
            meteorNextSpawn = Math.min(meteorNextSpawn || 1, 8);
        }
    }
    updateLargeMeteorRandomEvent();
    if(level==='hard') updateVindexPowerAttack();
    else { updateLargeMeteor(); processLargeMeteorImpact(); }

    if(score>=METEOR_TRIGGER_SCORE && !meteorShowerUnlocked){
        beginMeteorPreparation();
    }

    updateMeteorPreparation();

    if(!meteorSessionActive && !meteorPreShowerActive){
        if(meteorShowerUnlocked && meteorSessionUsed){
            if(meteorNextSessionTimer>0) meteorNextSessionTimer-=worldSlow;
            if(meteorNextSessionTimer<=0) startMeteorSession();
        }
    }else if(meteorSessionActive){
        meteorSessionTimer-=worldSlow;
        meteorPhaseTimer+=worldSlow;
        if(meteorBurstCooldown>0) meteorBurstCooldown=Math.max(0,meteorBurstCooldown-worldSlow);
        if(meteorPhase==='firstBurst' && meteorPhaseTimer>75){
            meteorPhase='random'; meteorPhaseTimer=0; meteorNextSpawn=randomInt(150,300);
        }else if(meteorPhase==='random'){
            if(meteorPhaseTimer>=METEOR_SECOND_BURST_TIME){
                meteorPhase='secondBurst'; meteorPhaseTimer=0; meteorBurstCooldown=METEOR_BURST_COOLDOWN;
                for(let i=0;i<METEOR_SECOND_BURST;i++) spawnMeteor(-i*62,true);
            }else if(meteorNextSpawn<=0){
                spawnMeteor(); meteorNextSpawn=randomInt(150,300);
            }else meteorNextSpawn-=worldSlow;
        }else if(meteorPhase==='secondBurst' && meteorPhaseTimer>70){
            meteorPhase='random2'; meteorPhaseTimer=0; meteorNextSpawn=randomInt(150,300);
        }else if(meteorPhase==='random2'){
            if(meteorNextSpawn<=0){spawnMeteor(); meteorNextSpawn=randomInt(180,330);}
            else meteorNextSpawn-=worldSlow;
        }
        if(meteorSessionTimer<=0 && !hardMeteorPermanent){
            meteorSessionActive=false; meteorPhase='idle';
            meteorNextSessionTimer=randomInt(METEOR_NEXT_SESSION_MIN,METEOR_NEXT_SESSION_MAX);
            meteors.length=0;
        }
    }
    for(let i=meteors.length-1;i>=0;i--){
        const m=meteors[i];
        m.trail.push({x:m.x+m.w/2,y:m.y+m.h/2});
        if(m.trail.length>3)m.trail.shift();
        m.x+=m.vx*worldSlow;m.y+=m.vy*worldSlow;m.rotation+=m.rotationSpeed*worldSlow;
        if(m.x<0){m.x=0;m.vx=Math.abs(m.vx);} if(m.x+m.w>WIDTH){m.x=WIDTH-m.w;m.vx=-Math.abs(m.vx);}
        if(m.y>HEIGHT+70) meteors.splice(i,1);
    }
}

function queueLargeMeteorImpact(x,y){
    if(largeMeteorImpactState || gameState!=="playing") return;
    largeMeteorImpactState={x,y,stage:0,playerDirect:false};
    screenShake=12;
}

function processLargeMeteorImpact(){
    const state=largeMeteorImpactState;
    if(!state) return;
    if(gameState!=="playing"){largeMeteorImpactState=null;return;}
    if(state.stage===0){
        const box={x:state.x-LARGE_METEOR_SIZE/2,y:state.y-LARGE_METEOR_SIZE/2,w:LARGE_METEOR_SIZE,h:LARGE_METEOR_SIZE};
        state.playerDirect=!!(player && collide(player,box));
        if(state.playerDirect && hitCooldown<=0 && lives>0){
            lives=Math.max(0,lives-LARGE_METEOR_PLAYER_DAMAGE);
            hitCooldown=METEOR_PLAYER_COOLDOWN;
            screenShake=20;
            if(lives<=0){lives=0;playerDeathMax=100;playerDeathTimer=playerDeathMax;globalFreeze=playerDeathMax;hitCooldown=playerDeathMax;}
        }
        for(let i=killers.length-1;i>=0;i--){
            const k=killers[i];
            if(!k||k.loading>0||k.disintegrating)continue;
            if(collide(k,box)){k.disintegrating=true;k.disintegrateTimer=38;k.hitFlash=18;k.panic=false;createDisintegrationParticles(k);}
        }
        state.stage=1;
        return;
    }
    if(state.stage===1){
        createLargeMeteorImpactParticles(state.x,state.y);
        state.stage=2;
        return;
    }
    if(state.stage===2){
        if(!state.playerDirect && player && playerDeathTimer<=0){
            const dx=player.x+player.w/2-state.x,dy=player.y+player.h/2-state.y,d=Math.hypot(dx,dy)||1;
            const f=Math.max(.18,1-Math.min(d/(Math.hypot(WIDTH,HEIGHT)/2),1)*.72);
            playerShockTimer=34;playerShockX=(dx/d)*(5+LARGE_METEOR_SHOCK_POWER*f);playerShockY=(dy/d)*(5+LARGE_METEOR_SHOCK_POWER*f);
        }
        const maxDist=Math.hypot(WIDTH,HEIGHT)/2;
        for(let i=0;i<killers.length;i++){
            const k=killers[i]; if(!k||k.loading>0||k.disintegrating)continue;
            const dx=k.x+k.w/2-state.x,dy=k.y+k.h/2-state.y,d=Math.hypot(dx,dy)||1;
            const f=Math.max(.18,1-Math.min(d/maxDist,1)*.72),power=5+LARGE_METEOR_SHOCK_POWER*f;
            k.knockbackX=(dx/d)*power;k.knockbackY=(dy/d)*power;k.knockbackTimer=34;k.hitFlash=16;
        }
        largeMeteorShockwave(state.x,state.y);
        scheduleNextLargeMeteor();
        largeMeteorImpactState=null;
    }
}

function createLargeMeteorImpactParticles(x,y){
    const count=8;
    for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,sp=2+Math.random()*4;particleList.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,size:2+Math.random()*3,life:20+Math.random()*18,maxLife:40,meteorParticle:true});}
}

function largeMeteorShockwave(x,y){meteorShockwave={x,y,r:8,max:Math.hypot(WIDTH,HEIGHT)*.72,life:42};}

function checkMeteorCollisions(){
    if(!meteors.length) return;
    if(hitCooldown>0) hitCooldown--;
    for(let i=meteors.length-1;i>=0;i--){
        const m=meteors[i]; if(m.large) continue;
        if(collide(player,m)){
            meteors.splice(i,1); createMeteorImpactParticles(m.x+m.w/2,m.y+m.h/2); screenShake=14;
            if(hitCooldown<=0 && lives>0){
                lives--; hitCooldown=METEOR_PLAYER_COOLDOWN;
                if(lives<=0){ lives=0; playerDeathMax=100; playerDeathTimer=playerDeathMax; globalFreeze=playerDeathMax; hitCooldown=playerDeathMax; createPlayerDeathParticles(); screenShake=18; return; }
            }
        }
        for(let k=killers.length-1;k>=0;k--){
            const killer=killers[k]; if(killer.loading>0 || killer.disintegrating) continue;
            if(collide(killer,m)){ killer.disintegrating=true;killer.disintegrateTimer=32;createDisintegrationParticles(killer);killer.hitFlash=12;screenShake=8;meteors.splice(i,1);break; }
        }
    }
}

function createMeteorImpactParticles(x,y){
    for(let i=0;i<8;i++){ const a=Math.random()*Math.PI*2,sp=1.5+Math.random()*4; particleList.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,size:2+Math.random()*3,life:18+Math.random()*22,maxLife:40,meteorParticle:true}); }
}

function drawLargeMeteor(){
    if(largeMeteor && largeMeteor.active){
        const m=largeMeteor,cx=m.x+m.w/2,cy=m.y+m.h/2;
        ctx.save();
        for(let i=0;i<m.trail.length;i++){const t=m.trail[i];ctx.globalAlpha=(i+1)/m.trail.length*.22;ctx.fillStyle=level==='hard'?"#a855f7":"#ef4444";ctx.beginPath();ctx.arc(t.x,t.y,Math.max(2,m.w*.08*(i+1)/m.trail.length),0,Math.PI*2);ctx.fill();}
        ctx.globalAlpha=1;ctx.translate(cx,cy);ctx.rotate(m.rotation);
        ctx.fillStyle="#3f281f";ctx.beginPath();const pts=[[0,-.5],[.38,-.4],[.53,-.05],[.43,.38],[.1,.53],[-.4,.46],[-.55,.08],[-.43,-.34]];pts.forEach((p,i)=>{const x=p[0]*m.w,y=p[1]*m.h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.fill();
        ctx.fillStyle="#6b3f2b";ctx.beginPath();ctx.arc(-20,-17,13,0,Math.PI*2);ctx.arc(22,-8,10,0,Math.PI*2);ctx.arc(-8,22,15,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle=level==='hard'?"#c084fc":"#f97316";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-25,-5);ctx.lineTo(-4,8);ctx.lineTo(10,-10);ctx.lineTo(27,12);ctx.stroke();
        ctx.restore();
    }
}

function drawMeteors(){
    for(let i=0;i<meteors.length;i++){
        const m=meteors[i],cx=m.x+m.w/2,cy=m.y+m.h/2;ctx.save();
        for(let j=0;j<m.trail.length;j++){const t=m.trail[j];ctx.globalAlpha=(j+1)/m.trail.length*.28;ctx.fillStyle=level==='hard'?"#a855f7":"#f59e0b";ctx.beginPath();ctx.arc(t.x,t.y,Math.max(1,m.w*(j+1)/m.trail.length*.22),0,Math.PI*2);ctx.fill();}
        ctx.globalAlpha=1;ctx.translate(cx,cy);ctx.rotate(m.rotation);ctx.fillStyle=level==='hard'?"#7e22ce":"#fb923c";ctx.beginPath();ctx.moveTo(0,-m.h*.65);ctx.lineTo(m.w*.48,-m.h*.1);ctx.lineTo(m.w*.3,m.h*.55);ctx.lineTo(-m.w*.42,m.h*.5);ctx.lineTo(-m.w*.58,-m.h*.15);ctx.closePath();ctx.fill();ctx.fillStyle="#fef3c7";ctx.beginPath();ctx.arc(-m.w*.12,-m.h*.12,m.w*.18,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    if(level!=='hard') drawLargeMeteor();
    if(level==='hard') drawVindexPowerAttack();
    if(meteorShockwave&&meteorShockwave.life>0){ctx.save();ctx.globalAlpha=meteorShockwave.life/42;ctx.strokeStyle="#fef08a";ctx.lineWidth=5;ctx.beginPath();ctx.arc(meteorShockwave.x,meteorShockwave.y,meteorShockwave.r+(meteorShockwave.max-meteorShockwave.r)*(1-meteorShockwave.life/42),0,Math.PI*2);ctx.stroke();ctx.restore();}
    if(largeMeteorWarning){ctx.save();const w=largeMeteorWarning,p=1+Math.sin(w.phase*2)*.06;ctx.globalAlpha=.25;ctx.fillStyle=level==='hard'?"#7e22ce":"#ef4444";ctx.beginPath();ctx.arc(w.x,w.y,w.radius*p,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.9;ctx.strokeStyle=level==='hard'?"#d8b4fe":"#fca5a5";ctx.lineWidth=3;ctx.setLineDash([10,8]);ctx.beginPath();ctx.arc(w.x,w.y,w.radius*p,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;ctx.textAlign="center";ctx.font="900 16px Arial";ctx.fillStyle="#fee2e2";ctx.fillText(level==='hard'?'⚠ KEKUATAN VINDEX SEDANG MENGISI':'⚠ METEOR BATU BESAR',w.x,w.y-w.radius-12);ctx.restore();}
    if(meteorPreShowerActive){ctx.save();ctx.globalAlpha=.95;ctx.textAlign="center";ctx.font="bold 17px Arial";ctx.fillStyle="#fbbf24";ctx.fillText("☄ METEOR AKAN DATANG ☄",WIDTH/2,42);ctx.font="bold 12px Arial";ctx.fillStyle="#fde68a";ctx.fillText("Persiapan...",WIDTH/2,61);ctx.restore();}
    else if(meteorWarningTimer>0){ctx.save();ctx.globalAlpha=.95;ctx.textAlign="center";ctx.font="bold 18px Arial";ctx.fillStyle="#fb923c";ctx.fillText("☄ HUJAN METEOR ☄",WIDTH/2,42);ctx.restore();}
}

/* =========================================================
   UPDATE GAME
========================================================= */

function updateGame(){

    const now =
        performance.now();



    if(level==='hard' && hard25SequenceActive){
        updateHard25Sequence();
        return;
    }

    if(playerDeathTimer>0){

        playerDeathTimer--;

        updateParticles();

        if(playerDeathTimer<=0){
            showEnd();
            return;
        }

        return;

    }


    /*
     * Otomatis pindah.
     */

    if(
        now-
        targetSpawnTime >
        10000
    ){

        spawnTarget();

    }


    if(
        health &&
        !health.visible &&
        now >= healthSpawnTime &&
        lives < 3
    ){

        spawnHealth();

    }


    if(
        powerup &&
        !powerup.visible &&
        now >= powerupSpawnTime &&
        powerActive <= 0
    ){

        spawnPowerup();

    }


    if(
        now>=killerSpawnTime &&
        killers.length < MAX_KILLERS
    ){

        addKiller();

        killerSpawnTime =
            now + nextKillerSpawnDelay;

    }


    /*
     * Player tetap bisa bergerak
     * hanya saat tidak pause.
     */

    updatePlayer();


    /*
     * Power-up pickup happens before Killer movement so the panic/flee
     * behavior starts on the exact frame the player gets Power Kill.
     */

    checkPlayerPowerup();
    checkTimeStopPowerup();
    updateTimeStop();
    updateVindexTimeStop();


    /*
     * Hujan meteor.
     */

    updateMeteors();
    checkMeteorCollisions();

    if(playerDeathTimer>0){
        return;
    }


    /*
     * Killer.
     */

    updateKillers();
    updateArchers();
    updateLordVindex();
    checkVindexEnemyCollisions();


    /*
     * Killer collision.
     */

    updateKillerCollisions();
    checkArcherCollisions();
    checkLordCollision();


    /*
     * Gadfly.
     */

    updateGadflies();


    /*
     * Player target.
     */

    checkPlayerTarget();
    updateStoryTriggers();


    if(
        gameState!=="playing"
    ){

        return;

    }


    /*
     * Health.
     */

    checkPlayerHealth();


    /*
     * Gadfly.
     */

    checkPlayerGadflies();


    /*
     * Killer.
     */

    checkPlayerKillers();


    /*
     * Power timer.
     */

    if(powerActive>0){
        powerActive-=worldSlowFactor();
        if(powerActive<0)powerActive=0;
    }


    /*
     * Freeze.
     */

    updateGlobalFreeze();


    /*
     * Partikel.
     */

    updateParticles();

}


/* =========================================================
   LOOP
========================================================= */

const FIXED_STEP_MS = 1000 / 60;
let fixedAccumulator = 0;
let lastFrameTime = 0;

function runGame(frameTime){

    if(
        gameState!=="playing"
    ){

        return;

    }


    if(!lastFrameTime){
        lastFrameTime = frameTime;
    }

    let elapsed = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    /*
     * Semua logika game berjalan pada fixed timestep 60 FPS.
     * Jadi komputer 30 FPS, 60 FPS, 120 FPS, dst tetap mendapatkan
     * kecepatan gerak dan durasi yang sama dalam waktu nyata.
     */
    if(elapsed > 120) elapsed = 120;


    if(
        paused
    ){

        fixedAccumulator = 0;

        document.getElementById(
            "pauseText"
        ).style.display =
            "block";

        updateHUD();

        drawGame();

        requestAnimationFrame(
            runGame
        );

        return;

    }


    document.getElementById(
        "pauseText"
    ).style.display =
        "none";


    fixedAccumulator += elapsed;

    let steps = 0;

    /* Maksimal 8 tick per frame agar komputer yang sempat lag tidak
       menyebabkan game meloncat terlalu jauh atau CPU tersedot. */
    while(
        fixedAccumulator >= FIXED_STEP_MS &&
        steps < 4
    ){

        updateGame();

        fixedAccumulator -= FIXED_STEP_MS;
        steps++;

        if(gameState!=="playing"){
            fixedAccumulator = 0;
            break;
        }
    }

    if(steps >= 4){
        fixedAccumulator = 0;
    }


    drawGame();
    updateHUD();


    requestAnimationFrame(
        runGame
    );

}


/* =========================================================
   HARD INTRO / VINDEX EVENTS
========================================================= */
function initHardIntro(){
    hardIntroTimer=0;hardIntroReady=false;hardIntroMeteorList=[];
    for(let i=0;i<18;i++)hardIntroMeteorList.push({x:randomInt(20,WIDTH-20),y:-randomInt(30,500),speed:randomInt(3,7),size:randomInt(10,24),drift:(Math.random()-.5)*1.5,rot:Math.random()*6.28});
}
function drawHardIntro(){
    ctx.fillStyle='#05010a';ctx.fillRect(0,0,WIDTH,HEIGHT);
    const g=ctx.createRadialGradient(400,260,20,400,300,560);g.addColorStop(0,'rgba(126,34,206,.22)');g.addColorStop(1,'rgba(2,3,5,.96)');ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT);
    const t=hardIntroTimer;
    if(t<270){
        for(const m of hardIntroMeteorList){
            const fallY=m.y+t*m.speed;
            if(fallY>HEIGHT+40)continue;
            let x=m.x+m.drift*t*.2,y=fallY;
            if(t>150){
                const blow=Math.min(1,(t-150)/90);
                x += blow*430 + Math.sin(m.rot+t*.03)*35;
                y -= blow*150;
            }
            ctx.save();ctx.translate(x,y);ctx.rotate(m.rot+t*.04);
            ctx.fillStyle='#7e22ce';ctx.shadowBlur=14;ctx.shadowColor='#c084fc';
            ctx.beginPath();ctx.moveTo(0,-m.size);ctx.lineTo(m.size*.55,0);ctx.lineTo(0,m.size);ctx.lineTo(-m.size*.55,0);ctx.closePath();ctx.fill();ctx.restore();
        }
    }
    const cx=400,cy=235+Math.sin(t*.025)*4;ctx.save();ctx.translate(cx,cy);ctx.shadowBlur=28;ctx.shadowColor='#a855f7';ctx.fillStyle='#3b0764';ctx.beginPath();ctx.arc(0,0,38,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#d8b4fe';ctx.fillRect(-21,-13,13,10);ctx.fillRect(8,-13,13,10);ctx.fillStyle='#111827';ctx.fillRect(-17,-10,5,5);ctx.fillRect(12,-10,5,5);ctx.fillStyle='#f5d0fe';ctx.fillRect(-17,12,34,5);ctx.restore();
    if(t>80&&t<255){ctx.save();ctx.strokeStyle='rgba(216,180,254,.7)';ctx.lineWidth=5;ctx.shadowBlur=18;ctx.shadowColor='#a855f7';for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(55+i*16,95+i*18);ctx.quadraticCurveTo(250,245,380,235);ctx.stroke();}ctx.restore();}
    if(t>=150&&t<280){ctx.save();ctx.globalAlpha=.15+.35*Math.min(1,(t-150)/80);ctx.fillStyle='#a855f7';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.restore();}
    if(t>=255&&t<360){ctx.save();ctx.globalAlpha=Math.min(1,(t-255)/40);ctx.fillStyle='rgba(126,34,206,.32)';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.restore();}
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f8fafc';ctx.font='900 28px Arial';ctx.fillText('LORD VINDEX',WIDTH/2,385);ctx.font='700 15px Arial';ctx.fillStyle='#d8b4fe';
    if(t<90)ctx.fillText('AKU YANG BERTANGGUNG JAWAB ATAS SIAPA YANG MENANG.',WIDTH/2,415);
    else if(t<255)ctx.fillText('"LIHAT BAIK-BAIK. METEOR PUN TUNDUK PADAKU."',WIDTH/2,415);
    else ctx.fillText('"KALI INI PERMAINAN DI TANGANKU."',WIDTH/2,415);
    if(t>=360){ctx.fillStyle='#fff';ctx.font='900 18px Arial';ctx.fillText('TEKAN SPASI UNTUK MEMULAI',WIDTH/2,475);ctx.font='700 12px Arial';ctx.fillStyle='#a78bfa';ctx.fillText('Kali ini tidak ada yang mengatur jalanku selain Vindex.',WIDTH/2,500);}
}
function runHardIntro(now=performance.now()){
    if(gameState!=='hardIntro')return;
    if(!hardIntroLastTime)hardIntroLastTime=now;
    let elapsed=now-hardIntroLastTime;
    hardIntroLastTime=now;
    if(elapsed>100)elapsed=100;
    hardIntroTimer=Math.min(420,hardIntroTimer+elapsed/FIXED_STEP_MS);
    drawHardIntro();
    if(hardIntroTimer>=360)hardIntroReady=true;
    requestAnimationFrame(runHardIntro);
}
function hideHard25Collectibles(){
    if(target){target.visible=false;target.x=-100;target.y=-100;}
    if(health){health.visible=false;health.x=-100;health.y=-100;}
    if(powerup){powerup.visible=false;powerup.x=-100;powerup.y=-100;}
    if(timeStopPowerup){timeStopPowerup.visible=false;timeStopPowerup.x=-100;timeStopPowerup.y=-100;}
}
function restoreHard25Collectibles(){
    const now=performance.now();
    /* Semua collectible diaktifkan kembali setelah arena benar-benar dibuka. */
    if(target){spawnTarget();targetSpawnTime=now;}
    if(health){const p=randomPosAwayFromPlayer();health.x=p.x;health.y=p.y;health.visible=true;health.pulse=0;healthSpawnTime=now;}
    if(powerup){const p=randomPosAwayFromPlayer();powerup.x=p.x;powerup.y=p.y;powerup.visible=true;powerup.pulse=0;powerupSpawnTime=now;}
    if(timeStopPowerup){const p=randomPosAwayFromPlayer();timeStopPowerup.x=p.x;timeStopPowerup.y=p.y;timeStopPowerup.visible=true;timeStopPowerup.pulse=0;timeStopSpawnTime=now;}
}
function beginVindexTimeStopAfterRevival(){
    if(!lordVindex||lordVindex.dead||!player)return;
    /* Setelah revival, beri jarak waktu jauh. Jangan langsung Time Stop. */
    vindexTimeStop=0;
    vindexLaserCountdown=0;
    vindexLaserActive=false;
    vindexTimeStopCooldown=randomInt(2400,3300);
    vindexLaserPulse=0;
    vindexLaserFireTimer=0;
    vindexLaserHasHit=false;
    storyMessage='LORD VINDEX: "Yang membedakan diriku dengan yang lain-lain... adalah kesempatan."';
    storyMessageTimer=170;
}
function triggerHard25Sequence(){
    if(hard25SequenceActive||hard25Triggered)return;
    hard25Triggered=true;hard25SequenceActive=true;hard25SequenceTimer=0;hard25SequencePhase=0;
    hardMeteorPermanent=true;meteorSessionActive=false;meteors.length=0;largeMeteor=null;largeMeteorWarning=null;largeMeteorPending=false;
    hideHard25Collectibles();
    screenShake=12;
    storyMessage='LORD VINDEX: "Oh... terlalu besar. Aku salah mengukurnya."';storyMessageTimer=180;
}
function updateHard25Sequence(){
    hard25SequenceTimer++;
    const t=hard25SequenceTimer;

    /* 0-10 detik: aftermath / jeda panjang setelah ledakan. */
    if(t<600) hard25SequencePhase=0;
    /* 10-15 detik: dialog Vindex. */
    else if(t<900) hard25SequencePhase=1;
    /* Setelah dialog: transisi otomatis menuju halaman lanjutan. */
    else hard25SequencePhase=2;

    if(t>=1080){
        transitionToContinuation();
        return;
    }

    if(t===150){
        lives=0;
        playerDeathTimer=0;
        createPlayerDeathParticles();
        screenShake=28;
    }

    if(t===205){
        const title=document.querySelector('#endScreen .endTitle');
        const msg=document.getElementById('hardDeathMessage');
        document.getElementById('finalScore').textContent='Poin : '+score;
        if(title)title.textContent='GAME OVER';
        if(msg){msg.textContent='Lord Vindex: "..."';msg.style.display='block';}
        document.querySelectorAll('#endScreen .endButtons button').forEach(b=>b.style.display='none');
        showOnly('endScreen');
    }

    if(t===600){
        const msg=document.getElementById('hardDeathMessage');
        if(msg)msg.style.display='none';
        document.getElementById('readyOverlay').style.display='none';
        showOnly('gameScreen');
        lives=3;
        playerDeathTimer=0;playerDeathMax=0;hitCooldown=100;globalFreeze=0;
        player.x=390;player.y=300;
        if(lordVindex){lordVindex.x=player.x+150;lordVindex.y=player.y-100;}
        hard25DialogueTimer=300;
        storyMessage='LORD VINDEX: "OH TIDAK... AKU TERLALU KUAT."';
        storyMessageTimer=300;
        screenShake=16;
    }

    if(t===900){
        hard25ReadyForInput=true;
        storyMessage='LORD VINDEX: "Ini yang membedakan diriku dengan yang lain, kesempatan."';
        storyMessageTimer=260;
    }
}
function transitionToContinuation(){
    if(!hard25SequenceActive)return;
    hard25SequenceActive=false;
    hard25Completed=true;
    localStorage.setItem('rinfisHardContinueScore','25');
    /* Pastikan efek ledakan selesai terlihat sebelum browser berpindah halaman. */
    gameState='transition';
    window.location.replace('sulit_lanjutan.html');
}
function continueAfterHard25(){
    if(level!=='hard'||!hard25SequenceActive||!hard25ReadyForInput)return;
    hard25ReadyForInput=false;
    hard25SequenceActive=false;
    hard25Completed=true;
    transitionToContinuation();
}
function drawHard25SequenceOverlay(){
    if(level!=='hard'||!hard25SequenceActive)return;
    const t=hard25SequenceTimer;ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
    if(t<150){
        const p=Math.min(1,t/150);
        const ease=1-Math.pow(1-p,3);
        ctx.globalAlpha=.10+.82*p;ctx.fillStyle='#7e22ce';ctx.fillRect(0,0,WIDTH,HEIGHT);
        ctx.globalAlpha=.95*(1-p*.35);ctx.fillStyle='#f5d0fe';ctx.beginPath();ctx.arc(400,300,28+ease*82,0,Math.PI*2);ctx.fill();
        for(let i=0;i<18;i++){
            const a=i*Math.PI*2/18;
            const r=45+ease*(95+(i%5)*22);
            const x=400+Math.cos(a)*r, y=300+Math.sin(a)*r;
            ctx.globalAlpha=.9*(1-p);ctx.strokeStyle='#e9d5ff';ctx.lineWidth=4+(i%3);
            ctx.beginPath();ctx.moveTo(400+Math.cos(a)*(r-25),300+Math.sin(a)*(r-25));ctx.lineTo(x,y);ctx.stroke();
        }
        for(let ring=0;ring<4;ring++){
            ctx.globalAlpha=(.8-ring*.15)*(1-p);ctx.strokeStyle=ring%2?'#c084fc':'#f5d0fe';ctx.lineWidth=7-ring;
            ctx.beginPath();ctx.arc(400,300,60+ease*(70+ring*70),0,Math.PI*2);ctx.stroke();
        }
    }else if(t<600){
        ctx.globalAlpha=.94;ctx.fillStyle='rgba(3,3,8,.94)';ctx.fillRect(0,0,WIDTH,HEIGHT);
        ctx.fillStyle='#f8fafc';ctx.font='900 34px Arial';ctx.fillText('GAME OVER',400,245);
        ctx.fillStyle='#d8b4fe';ctx.font='700 16px Arial';ctx.fillText('Poin : '+score,400,285);
        const remain=Math.max(0,Math.ceil((600-t)/60));
        ctx.fillStyle='#a78bfa';ctx.font='700 14px Arial';ctx.fillText('Vindex sedang menyiapkan sesuatu... '+remain,400,325);
    }else if(t<900){
        const p=(t-600)/300;
        ctx.globalAlpha=.18+.18*Math.sin(p*Math.PI);ctx.fillStyle='#7e22ce';ctx.fillRect(0,0,WIDTH,HEIGHT);
        ctx.globalAlpha=1;ctx.fillStyle='#f8fafc';ctx.font='900 30px Arial';ctx.fillText('LORD VINDEX',400,245);
        ctx.fillStyle='#d8b4fe';ctx.font='700 18px Arial';ctx.fillText('"OH TIDAK... AKU TERLALU KUAT."',400,285);
        ctx.font='700 15px Arial';ctx.fillStyle='#c4b5fd';ctx.fillText('"Tapi aku akan memberimu kesempatan sekali lagi."',400,320);
    }else if(t<1080){
        ctx.globalAlpha=.96;ctx.fillStyle='rgba(3,3,8,.72)';ctx.fillRect(0,0,WIDTH,HEIGHT);
        ctx.fillStyle='#f8fafc';ctx.font='900 30px Arial';ctx.fillText('KEMBALI KE ARENA',400,245);
        ctx.fillStyle='#d8b4fe';ctx.font='700 16px Arial';ctx.fillText('"Ini yang membedakan diriku dengan yang lain, kesempatan."',400,292);
        ctx.fillStyle='#fff';ctx.font='900 19px Arial';ctx.fillText('BERSIAP... MENUJU FASE LANJUTAN',400,355);
        ctx.fillStyle='#a78bfa';ctx.font='700 12px Arial';ctx.fillText('Lord Vindex menunggumu di arena berikutnya.',400,382);
    }else{
        const p=Math.min(1,(t-1080)/90);
        ctx.globalAlpha=.35+.65*p;
        ctx.fillStyle='#05020a';
        ctx.fillRect(0,0,WIDTH,HEIGHT);
        ctx.globalAlpha=.9*(1-p);
        ctx.fillStyle='#d8b4fe';
        ctx.font='900 24px Arial';
        ctx.fillText('FASE LANJUTAN',400,300);
    }
    ctx.restore();
}

function drawVindexTimeStopWave(){
    if(level!=='hard'||vindexTimeStop<=0||!lordVindex||lordVindex.dead)return;
    const progress=1-(vindexTimeStop/300);
    const eased=1-Math.pow(1-progress,.72);
    const cx=timeStopOriginX || (lordVindex.x+lordVindex.w/2);
    const cy=timeStopOriginY || (lordVindex.y+lordVindex.h/2);
    const maxR=Math.hypot(WIDTH,HEIGHT)*.72;
    ctx.save();
    ctx.globalCompositeOperation='screen';
    for(let i=0;i<3;i++){
        const offset=i*.14;
        const waveProgress=Math.min(1,Math.max(0,eased-offset));
        const r=25+waveProgress*maxR;
        ctx.globalAlpha=(1-waveProgress)*.22;
        ctx.strokeStyle='#c084fc';
        ctx.lineWidth=3-i*.55;
        ctx.beginPath();
        ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.stroke();
    }
    ctx.globalAlpha=.08+Math.sin(vindexLaserPulse)*.035;
    ctx.fillStyle='#a855f7';
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.restore();
}
function drawVindexLaser(){
    if(level!=='hard'||!vindexLaserActive||!lordVindex||lordVindex.dead)return;

    const targeting=vindexLaserCountdown>0;
    const timeStopping=vindexTimeStop>0;
    const chasingTarget=timeStopping||targeting;
    const firing=vindexLaserFireTimer>0;
    if(!chasingTarget&&!firing)return;

    /*
     * TARGETING: pusat visual boleh mengikuti Vindex karena ini hanya indikator.
     * FIRING: gunakan origin yang sudah disimpan ketika laser ditembakkan.
     * Dengan demikian posisi/arah laser tidak pernah mengikuti player lagi.
     */
    const cx=firing?vindexLaserOriginX:(lordVindex.x+lordVindex.w/2);
    const cy=firing?vindexLaserOriginY:(lordVindex.y+lordVindex.h/2);
    const pulse=.65+.35*Math.sin(vindexLaserPulse);
    const beamLen=Math.hypot(WIDTH,HEIGHT)*1.1;

    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(vindexLaserAngle);

    if(chasingTarget){
        /* Selama Time Stop target mengejar player; setelah Time Stop target tetap diam 1 detik. */
        ctx.globalAlpha=.10+.08*Math.sin(vindexLaserPulse*1.4);
        ctx.fillStyle='#c084fc';
        ctx.fillRect(0,-VINDEX_POWER_BEAM_WIDTH/2,beamLen,VINDEX_POWER_BEAM_WIDTH);

        ctx.globalAlpha=.65+.2*Math.sin(vindexLaserPulse*1.4);
        ctx.strokeStyle='#f5d0fe';
        ctx.lineWidth=2;
        ctx.setLineDash([18,12]);
        ctx.beginPath();
        ctx.moveTo(0,-VINDEX_POWER_BEAM_WIDTH/2);
        ctx.lineTo(beamLen,-VINDEX_POWER_BEAM_WIDTH/2);
        ctx.moveTo(0,VINDEX_POWER_BEAM_WIDTH/2);
        ctx.lineTo(beamLen,VINDEX_POWER_BEAM_WIDTH/2);
        ctx.stroke();
        ctx.setLineDash([]);
    }else if(firing){
        /* Laser aktif: posisi dan arah sudah FROZEN. */
        ctx.globalAlpha=.22+.12*pulse;
        ctx.fillStyle='#c084fc';
        ctx.fillRect(0,-VINDEX_POWER_BEAM_WIDTH/2,beamLen,VINDEX_POWER_BEAM_WIDTH);

        ctx.globalAlpha=.92;
        ctx.fillStyle='#f5d0fe';
        ctx.fillRect(0,-Math.max(3,VINDEX_POWER_BEAM_WIDTH*.22),beamLen,Math.max(6,VINDEX_POWER_BEAM_WIDTH*.44));

        ctx.globalAlpha=.75;
        ctx.strokeStyle='#ffffff';
        ctx.lineWidth=2+pulse*2;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(beamLen,0);
        ctx.stroke();
    }
    ctx.restore();

    /*
     * Garis menuju player HANYA ditampilkan saat targeting.
     * Saat laser aktif, tidak ada lagi garis yang bergerak menuju player.
     */
    if(chasingTarget){
        ctx.save();
        ctx.globalAlpha=.9;
        ctx.strokeStyle='#d8b4fe';
        ctx.lineWidth=2;
        ctx.setLineDash([10,8]);
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.lineTo(vindexLaserX,vindexLaserY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha=.9;
    ctx.fillStyle='#f5d0fe';
    ctx.font='900 13px Arial';
    ctx.textAlign='center';
    if(timeStopping){
        ctx.fillText('TIME STOP VINDEX — DUNIA MELAMBAT',WIDTH/2,82);
    }else if(targeting){
        ctx.fillText('LASER DALAM '+Math.ceil(vindexLaserCountdown/60)+'s — TARGET TERKUNCI',WIDTH/2,82);
    }else if(firing){
        ctx.fillText('⚡ LASER VINDEX — TARGET TERKUNCI',WIDTH/2,82);
    }
    ctx.restore();
}


/* =========================================================
   START
========================================================= */

function startGame(lv, initialScore=null){

    level=lv;

    score=initialScore===null ? (continuationMode ? 25 : 0) : initialScore;

    lives=3;

    paused=false;
    if(hardRevivalTimer){ clearTimeout(hardRevivalTimer); hardRevivalTimer=null; }

    hitCooldown=0;

    globalFreeze=0;

    powerActive=0;

    killerSpawnTime=0;

    particleList=[];

    screenShake=0;
    playerDeathTimer=0;
    playerDeathMax=0;
    meteors=[];
    meteorSessionActive=false;
    meteorSessionTimer=0;
    meteorNextSpawn=0;
    meteorSessionUsed=false;
    meteorWarningTimer=0;
    meteorPreShowerActive=false;
    meteorPreShowerTimer=0;
    meteorPreShowerNextSpawn=0;
    meteorPreShowerSpawned=0;
    meteorShowerUnlocked=false;

    gameState=continuationMode ? 'ready' : (level==='hard'?'hardIntro':'ready');


    createGameObjects();
    if(level==='hard' && !continuationMode)initHardIntro();


    showOnly(
        "gameScreen"
    );


    document.getElementById(
        "readyOverlay"
    ).style.display = (level==='hard' && !continuationMode) ? 'none' : 'flex';


    document.getElementById(
        "pauseText"
    ).style.display =
        "none";


    document.getElementById(
        "spawnWarning"
    ).style.display =
        "none";


    updateHUD();


    if(level==='hard' && !continuationMode){
        drawHardIntro();
        requestAnimationFrame(runHardIntro);
    }else{
        drawGame();
    }

}


/* =========================================================
   BEGIN
========================================================= */

function beginPlay(){

    if(level==='hard' && !continuationMode && gameState==='hardIntro'){
        if(!hardIntroReady)return;
        gameState='playing';fixedAccumulator=0;lastFrameTime=0;
        storyMessage='LORD VINDEX: "Permainan dimulai."';storyMessageTimer=140;
        document.getElementById('readyOverlay').style.display='none';
        requestAnimationFrame(runGame);return;
    }

    if(
        gameState!=="ready"
    ){

        return;

    }


    gameState="playing";

    fixedAccumulator = 0;
    lastFrameTime = 0;


    document.getElementById(
        "readyOverlay"
    ).style.display =
        "none";


    requestAnimationFrame(
        runGame
    );

}


function togglePause(){

    if(
        gameState!=="playing"
    ){

        return;

    }


    paused =
        !paused;


    updateHUD();

}


/* =========================================================
   ENDING
========================================================= */

function startEnding(){
    if(gameState==="ending") return;
    if(level==='hard'){ hardMeteorPermanent=false; meteorSessionActive=false; archerArrows=[]; vindexTimeStop=0; vindexLaserActive=false; vindexLaserCountdown=0; vindexLaserFireTimer=0; vindexLaserHasHit=false; storyMessage='Lord Vindex: "Aku mengaku kalah. Aku yang mengakhiri permainan ini."'; storyMessageTimer=180; }
    gameState="ending"; endingIndex=0; endingDestroyIndex=0; endingDestroyedCount=0; endingDestroyTimer=0; endingWaitTimer=0; fixedAccumulator=0; particleList=[];
    if(endingRAF) cancelAnimationFrame(endingRAF);
    endingRAF=requestAnimationFrame(runEndingAnimation);
}

function drawEndingKiller(k){
    ctx.save();const cx=k.x+k.w/2,cy=k.y+k.h/2;ctx.translate(cx,cy);ctx.fillStyle="#7f1d1d";ctx.fillRect(-10,-10,20,20);ctx.fillStyle="#ef4444";ctx.fillRect(-6,-4,4,4);ctx.fillRect(2,-4,4,4);ctx.fillStyle="#111827";ctx.fillRect(-7,4,14,3);ctx.restore();
}

function runEndingAnimation(){
    if(gameState!=="ending") return;
    if(level==='hard' && lordVindex && !lordVindex.dead){
        lordVindex.dead=true;
        for(const a of archers)a.dead=true;
        archers=[]; archerArrows=[];
        storyMessage='LORD VINDEX TERJATUH — SEMUA PEMBURU HANCUR'; storyMessageTimer=220;
    }
    ctx.fillStyle="#030305";ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#facc15";ctx.font="900 36px Arial";ctx.fillText("LEVEL "+MAX_LEVEL,WIDTH/2,HEIGHT/2-105);ctx.fillStyle="#ef4444";ctx.font="900 25px Arial";ctx.fillText("SEMUA KILLER DIHAPUS...",WIDTH/2,HEIGHT/2-65);
    for(let i=endingDestroyIndex+1;i<killers.length;i++) drawEndingKiller(killers[i]);
    if(endingDestroyIndex<killers.length){
        const k=killers[endingDestroyIndex];
        if(!k._endingTriggered){k._endingTriggered=true;k.disintegrating=true;k.disintegrateTimer=40;createDisintegrationParticles(k);screenShake=7;}
        k.disintegrateTimer=Math.max(0,k.disintegrateTimer-1);drawKiller(k);drawParticles();
        if(k.disintegrateTimer<=0){killers.splice(endingDestroyIndex,1);endingDestroyedCount++;endingWaitTimer=16;}
    } else {
        drawParticles();endingWaitTimer--;
        if(endingWaitTimer<=-35){ctx.fillStyle="#22c55e";ctx.font="900 22px Arial";ctx.fillText("SEMUA KILLER HANCUR",WIDTH/2,HEIGHT/2+10);endingRAF=requestAnimationFrame(runEndingAnimation);setTimeout(showTrueEnding,700);return;}
    }
    updateParticles();endingRAF=requestAnimationFrame(runEndingAnimation);
}

function endingSequence(){ if(gameState==="ending" && !endingRAF) endingRAF=requestAnimationFrame(runEndingAnimation); }

/* =========================================================
   TRUE ENDING
========================================================= */

function showTrueEnding(){

    gameState="end";

    showOnly(
        "trueEndingScreen"
    );

}


/* =========================================================
   GAME OVER
========================================================= */

function showEnd(){
    if(continuationMode){
        score=0;
    }
    if(level === 'hard' && score < 100){
        if(hardRevivalTimer){
            clearTimeout(hardRevivalTimer);
            hardRevivalTimer=null;
        }
        gameState='hardDeath';
        document.getElementById('finalScore').textContent='Poin : '+score;
        const title=document.querySelector('#endScreen .endTitle');
        if(title) title.textContent='GAME OVER';
        const msg=document.getElementById('hardDeathMessage');
        if(msg){
            msg.textContent=hard25Triggered
                ? 'Lord Vindex: "Oh tidak... aku tidak sengaja mengeluarkan kekuatan begitu besar. Aku terlalu jauh memaksakan kekuatanku."'
                : 'Lord Vindex: "Kali ini permainan benar-benar berakhir."';
            msg.style.display='block';
        }
        document.querySelectorAll('#endScreen .endButtons button').forEach(b=>b.style.display='');
        showOnly('endScreen');
        return;
    }
    gameState='end';
    document.getElementById('finalScore').textContent='Poin : '+score;
    const msg=document.getElementById('hardDeathMessage');
    if(msg) msg.style.display='none';
    document.querySelectorAll('#endScreen .endButtons button').forEach(b=>b.style.display='');
    showOnly('endScreen');
}

/* =========================================================
   RESTART
========================================================= */

function restartGame(){
    if(continuationMode){
        startGame(level, 0);
        return;
    }
    startGame(level);
}


/* =========================================================
   MENU
========================================================= */

function showMenu(){
    if(location.pathname.split('/').pop() !== 'menu.html'){ location.href='menu.html'; return; }
    gameState="menu";

    paused=false;

    powerActive=0;

    pressedKeys.clear();

    clearTimeout(
        warningTimer
    );


    showOnly(
        "menuScreen"
    );

}


/* =========================================================
   RULES
========================================================= */

function showRules(){
    location.href='cara_main.html';
    return;
    gameState="rules";

    showOnly(
        "rulesScreen"
    );

}


/* =========================================================
   SHOW ONLY
========================================================= */

function showOnly(id){

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            function(screen){

                screen.classList.add(
                    "hidden"
                );

            }
        );


    document
        .getElementById(id)
        .classList.remove(
            "hidden"
        );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function(event){

        const key =
            event.key;

        if(level==='hard' && !continuationMode && gameState==='hardIntro'){
            if(key===' ' && hardIntroReady){event.preventDefault();beginPlay();}
            return;
        }

        if(level==='hard' && hard25ReadyForInput){
            event.preventDefault();
            continueAfterHard25();
            return;
        }

        if(
            [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                " "
            ].includes(key)
        ){

            event.preventDefault();

        }


        /*
         * P = PAUSE
         */

        if(
            key.toLowerCase()==="p"
        ){

            if(
                gameState==="ready"
            ){

                beginPlay();

                return;

            }


            if(
                gameState==="playing"
            ){

                togglePause();

                return;

            }

        }


        /*
         * READY.
         */

        if(
            gameState==="ready"
        ){

            beginPlay();

            return;

        }


        /*
         * PLAY.
         */

        if(
            gameState==="playing" &&
            !paused
        ){

            pressedKeys.add(
                key
            );

        }

    }
);


/* =========================================================
   KEY UP
========================================================= */

document.addEventListener(
    "keyup",
    function(event){

        pressedKeys.delete(
            event.key
        );

    }
);


/* =========================================================
   MOBILE
========================================================= */

document
    .querySelectorAll(
        ".controlButton"
    )
    .forEach(
        function(button){

            const key =
                button.dataset.key;


            button.addEventListener(
                "touchstart",
                function(event){

                    event.preventDefault();

                    if(level==='hard' && hard25ReadyForInput){
                        continueAfterHard25();
                        return;
                    }

                    if(
                        gameState==="ready"
                    ){

                        beginPlay();

                    }


                    if(
                        gameState==="playing" &&
                        !paused
                    ){

                        pressedKeys.add(
                            key
                        );

                    }

                },
                {
                    passive:false
                }
            );


            button.addEventListener(
                "touchend",
                function(event){

                    event.preventDefault();

                    pressedKeys.delete(
                        key
                    );

                },
                {
                    passive:false
                }
            );


            button.addEventListener(
                "touchcancel",
                function(event){

                    event.preventDefault();

                    pressedKeys.delete(
                        key
                    );

                },
                {
                    passive:false
                }
            );


            button.addEventListener(
                "mousedown",
                function(){

                    if(
                        gameState==="ready"
                    ){

                        beginPlay();

                    }


                    if(
                        gameState==="playing" &&
                        !paused
                    ){

                        pressedKeys.add(
                            key
                        );

                    }

                }
            );


            button.addEventListener(
                "mouseup",
                function(){

                    pressedKeys.delete(
                        key
                    );

                }
            );


            button.addEventListener(
                "mouseleave",
                function(){

                    pressedKeys.delete(
                        key
                    );

                }
            );

        }
    );


/* =========================================================
   QUIT
========================================================= */

function quitGame(){

    alert(
        "Game selesai. Kamu bisa menutup tab/browser ini."
    );

}


/* =========================================================
   INITIAL
========================================================= */

const PAGE_LEVEL = document.body && document.body.dataset ? document.body.dataset.level : null;
if(PAGE_LEVEL){ startGame(PAGE_LEVEL); } else { showMenu(); }

