/**
 * Markup setiap karakter CSS (satu-satunya sumber kebenaran).
 * Dipakai oleh renderer gameplay (sprites.js) DAN halaman statis
 * (landing page & cara main) lewat assets/js/characters.js.
 * Desain visualnya ada di assets/css/characters/*.css.
 */
const KG_TEMPLATES = {
    player: `
        <div class="kg-ring kg-player__ring" hidden></div>
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-player__body"></i><i class="kg-player__shine"></i>
            <i class="kg-player__eye kg-player__eye--l"></i><i class="kg-player__eye kg-player__eye--r"></i>
            <i class="kg-player__mouth"></i>
        </div></div>`,
    target: `
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-target__tile kg-anim"></i><i class="kg-target__ring"></i><i class="kg-target__dot"></i>
        </div></div>`,
    health: `
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-health__orb kg-anim"></i><i class="kg-health__bar kg-health__bar--v"></i><i class="kg-health__bar kg-health__bar--h"></i>
        </div></div>`,
    power: `
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-power__orb kg-anim"></i><i class="kg-power__bolt"></i><b class="kg-power__label">KILL</b>
        </div></div>`,
    timestop: `
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-timestop__orb kg-anim"></i><i class="kg-timestop__glass kg-anim"></i><i class="kg-timestop__sand"></i>
        </div></div>`,
    gadfly: `
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-gadfly__wing kg-gadfly__wing--l kg-anim"></i><i class="kg-gadfly__wing kg-gadfly__wing--r kg-anim"></i>
            <i class="kg-gadfly__feeler kg-gadfly__feeler--l"></i><i class="kg-gadfly__feeler kg-gadfly__feeler--r"></i>
            <i class="kg-gadfly__body"></i>
            <i class="kg-gadfly__eye kg-gadfly__eye--l"></i><i class="kg-gadfly__eye kg-gadfly__eye--r"></i>
            <i class="kg-gadfly__mouth"></i>
        </div></div>`,
    killer: `
        <div class="kg-ring kg-killer__aura"></div><div class="kg-killer__progress"></div>
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-killer__shadow"></i><i class="kg-killer__body"></i><i class="kg-killer__head"></i>
            <i class="kg-killer__scratch kg-killer__scratch--l"></i><i class="kg-killer__scratch kg-killer__scratch--r"></i>
            <i class="kg-killer__eye kg-killer__eye--l kg-anim"></i><i class="kg-killer__eye kg-killer__eye--r kg-anim"></i>
            <i class="kg-killer__pupil kg-killer__pupil--l"></i><i class="kg-killer__pupil kg-killer__pupil--r"></i>
            <i class="kg-killer__mouth"></i>
            <span class="kg-killer__teeth"><i></i><i></i><i></i><i></i></span>
            <i class="kg-killer__blood kg-killer__blood--a"></i><i class="kg-killer__blood kg-killer__blood--b"></i>
            <i class="kg-killer__frown"></i><i class="kg-killer__flash"></i>
            <span class="kg-killer__sparks"><i style="--n:0"></i><i style="--n:1"></i><i style="--n:2"></i><i style="--n:3"></i></span>
            <b class="kg-killer__tag"></b>
        </div></div>`,
    archer: `
        <div class="kg-ring kg-archer__spawn"></div><div class="kg-ring kg-archer__spawn"></div><div class="kg-ring kg-archer__spawn"></div>
        <div class="kg-ring kg-archer__tele" hidden></div>
        <div class="kg-pose">
            <i class="kg-archer__aim"></i>
            <div class="kg-art">
                <i class="kg-archer__body kg-anim"></i><i class="kg-archer__bow"></i><i class="kg-archer__nock"></i>
            </div>
        </div>
        <b class="kg-archer__label"></b>`,
    arrow: `
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-arrow__fletch"></i><i class="kg-arrow__shaft"></i><i class="kg-arrow__head"></i>
        </div></div>`,
    vindex: `
        <div class="kg-ring kg-ring--dashed kg-vindex__react" hidden></div>
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-vindex__aura kg-anim"></i><i class="kg-vindex__orb"></i>
            <i class="kg-vindex__eye kg-vindex__eye--l"></i><i class="kg-vindex__eye kg-vindex__eye--r"></i>
            <i class="kg-vindex__pupil kg-vindex__pupil--l"></i><i class="kg-vindex__pupil kg-vindex__pupil--r"></i>
            <i class="kg-vindex__mouth"></i><i class="kg-vindex__crown"></i>
            <b class="kg-vindex__label"></b>
        </div></div>`,
    meteor: `
        <i class="kg-meteor__tail"></i>
        <div class="kg-pose"><div class="kg-art"><i class="kg-meteor__rock"></i><i class="kg-meteor__crater"></i></div></div>`,
    meteorBig: `
        <i class="kg-meteor-big__tail"></i>
        <div class="kg-pose"><div class="kg-art">
            <i class="kg-meteor-big__rock"></i>
            <i class="kg-meteor-big__crater kg-meteor-big__crater--a"></i><i class="kg-meteor-big__crater kg-meteor-big__crater--b"></i><i class="kg-meteor-big__crater kg-meteor-big__crater--c"></i>
            <i class="kg-meteor-big__crack"></i>
        </div></div>`,
};
const KG_CLASSES = {
    player: 'kg-player', target: 'kg-target', health: 'kg-health', power: 'kg-power', timestop: 'kg-timestop',
    gadfly: 'kg-gadfly', killer: 'kg-killer', archer: 'kg-archer', arrow: 'kg-arrow', vindex: 'kg-vindex',
    meteor: 'kg-meteor', meteorBig: 'kg-meteor-big',
};
