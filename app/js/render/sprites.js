/**
 * Renderer karakter berbasis CSS.
 *
 * Logika game tetap memakai koordinat di kanvas 800x600. Setiap frame,
 * `Sprites.sync()` membaca state game (pemain, killer, Gadfly, Archer, item,
 * meteor, Lord Vindex) lalu memindahkan/memutar elemen DOM yang desainnya
 * ada di assets/css/characters/*.css. Tidak ada gambar kanvas untuk karakter.
 *
 * Elemen dipakai ulang (pool): dibuat saat entitas pertama kali muncul dan
 * dibuang ketika entitas hilang dari state.
 */
const Sprites = (() => {
    const layer = document.getElementById('spriteLayer');
    const live = new Map();   // entitas -> sprite
    let frame = 0;
    let cinematic = null;     // Vindex besar untuk adegan pembuka

    /* ── pembungkus sprite: hanya menulis ke DOM jika nilainya berubah ──── */
    function build(kind) {
        const el = document.createElement('div');
        el.className = `kg ${KG_CLASSES[kind]}`;
        el.innerHTML = KG_TEMPLATES[kind];
        layer.appendChild(el);
        const s = { el, kind, pose: el.querySelector('.kg-pose'), seen: 0, _tf: '', _pose: '', _f: {}, _v: {}, _q: {} };
        s.place = (x, y) => {
            const t = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
            if (t !== s._tf) { s._tf = t; el.style.transform = t; }
        };
        s.setPose = (t) => { if (t !== s._pose) { s._pose = t; s.pose.style.transform = t; } };
        s.flag = (name, on) => { on = !!on; if (s._f[name] !== on) { s._f[name] = on; el.classList.toggle(name, on); } };
        s.attr = (name, val) => { if (s._f[name] !== val) { s._f[name] = val; el.setAttribute(name, val); } };
        s.v = (target, name, val) => { // variabel CSS pada elemen target
            const key = (target === el ? '' : target.className) + name;
            if (s._v[key] !== val) { s._v[key] = val; target.style.setProperty(name, val); }
        };
        s.q = (sel) => s._q[sel] || (s._q[sel] = el.querySelector(sel));
        s.opacity = (o) => { if (s._f.opacity !== o) { s._f.opacity = o; el.style.opacity = o; } };
        return s;
    }

    function use(entity, kind) {
        let s = live.get(entity);
        if (!s) { s = build(kind); live.set(entity, s); }
        s.seen = frame;
        return s;
    }

    const center = (e) => [e.x + e.w / 2, e.y + e.h / 2];
    const f2 = (n) => Math.round(n * 100) / 100;

    /* ── pembaruan per jenis karakter ────────────────────────────────────── */
    function updatePlayerSprite(p) {
        if (level === 'hard' && hard25SequenceActive && hard25SequenceTimer >= 150 && hard25SequenceTimer < 245) return;
        const s = use(p, 'player');
        const [cx, cy] = center(p);
        s.place(cx, cy);
        const ring = s.q('.kg-player__ring');
        const prevX = s._q.px ?? cx, prevY = s._q.py ?? cy;
        s._q.px = cx; s._q.py = cy;

        if (playerDeathTimer > 0) {
            const progress = 1 - playerDeathTimer / Math.max(1, playerDeathMax);
            const scale = Math.max(.15, 1 - progress * .85);
            s.setPose(`rotate(${f2(progress * Math.PI * 3.5)}rad) scale(${f2(scale)})`);
            s.opacity(f2(Math.max(0, 1 - progress)));
            s.flag('is-flash', Math.sin(progress * Math.PI * 12) > 0);
            s.flag('is-dying', true);
            s.flag('is-power', false);
            s.flag('is-hurt', false);
            ring.hidden = false;
            s.v(ring, '--r', f2(14 + progress * 28));
            s.v(ring, '--o', f2(Math.max(0, 1 - progress * .7)));
            s.v(ring, '--bw', 2.5);
            s.v(ring, '--c', '#ef4444');
            return;
        }
        ring.hidden = true;
        s.setPose('');
        s.opacity('');
        s.flag('is-flash', false);
        s.flag('is-dying', false);
        s.flag('is-power', powerActive > 0);
        s.flag('is-hurt', hitCooldown > 0 && Math.floor(hitCooldown / 4) % 2 === 0);

        // mata melirik ke arah gerak (halus)
        const dx = cx - prevX, dy = cy - prevY;
        const tx = Math.max(-1, Math.min(1, dx)) * 5, ty = Math.max(-1, Math.min(1, dy)) * 5;
        s._q.lx = (s._q.lx ?? 0) + (tx - (s._q.lx ?? 0)) * .35;
        s._q.ly = (s._q.ly ?? 0) + (ty - (s._q.ly ?? 0)) * .35;
        // variabel diwariskan ke ::after pupil (dua mata)
        s.v(s.el, '--lx', `${f2(s._q.lx)}px`);
        s.v(s.el, '--ly', `${f2(s._q.ly)}px`);
    }

    function updateItemSprite(item, kind) {
        const s = use(item, kind);
        const [cx, cy] = center(item);
        s.place(cx, cy);
    }

    function updateGadflySprite(g) {
        const s = use(g, 'gadfly');
        const [cx, cy] = center(g);
        s.place(cx, cy);
        s.setPose(`rotate(${f2(g.rotation)}rad)`);
        s.flag('is-frozen', g.freeze > 0);
        s.flag('is-blink', g.hitAnim > 0 && Math.floor(g.hitAnim / 3) % 2 === 0);
    }

    function updateKillerSprite(k) {
        const s = use(k, 'killer');
        const [cx, cy] = center(k);
        s.place(cx, cy);
        const aura = s.q('.kg-killer__aura'), prog = s.q('.kg-killer__progress');
        s.flag('is-hit', k.hitFlash > 0);

        if (k.disintegrating) {
            const p = k.disintegrateTimer / 40;
            s.setPose(`rotate(${f2((1 - p) * 2)}rad) scale(${f2(p)})`);
            s.opacity(f2(p));
            s.flag('is-loading', false);
            s.flag('is-blink-off', false);
            s.attr('data-mood', '');
            s.flag('is-sad', false);
            return;
        }
        s.opacity('');

        if (k.loading > 0) {
            const progress = 1 - k.loading / KILLER_LOAD_TIME;
            const blink = Math.floor(k.loading / 8) % 2;
            const pulse = Math.sin(k.pulse) * 3;
            s.flag('is-loading', true);
            s.flag('is-blink-off', !blink);
            s.setPose('');
            s.attr('data-mood', '');
            s.flag('is-sad', false);
            s.v(aura, '--r', f2(15 + pulse + progress * 12));
            s.v(aura, '--c', blink ? '#ff1111' : 'rgba(120,0,0,.25)');
            s.v(prog, '--r', f2(23 + pulse));
            s.v(prog, '--p', f2(progress));
            return;
        }
        s.flag('is-loading', false);
        s.flag('is-blink-off', false);

        // pose: miring + skala (atau pose kecewa)
        if (k.disappointed > 0) {
            const sad = Math.sin(k.disappointedPhase) * .12;
            s.setPose(`rotate(${f2(k.tilt + .22 + sad)}rad) scale(.88,1.1)`);
        } else {
            s.setPose(`rotate(${f2(k.tilt)}rad) scale(${f2(k.scaleX)},${f2(k.scaleY)})`);
        }
        s.flag('is-sad', k.disappointed > 0);

        // suasana: panik "!" / tertawa "HA!" + percikan berputar
        const art = s.q('.kg-art');
        if (k.panic) {
            s.attr('data-mood', 'panic');
            s.v(art, '--bob', `${f2(Math.sin(k.panicPhase * 2.4) * 12)}px`);
            s.v(s.q('.kg-killer__sparks'), '--spin', f2(k.panicPhase));
        } else if (k.celebrating > 0) {
            s.attr('data-mood', 'celebrate');
            s.v(art, '--bob', `${f2(Math.sin(k.celebratingPhase) * 16)}px`);
            s.v(s.q('.kg-killer__sparks'), '--spin', f2(k.celebratingPhase));
        } else {
            s.attr('data-mood', '');
        }
    }

    function updateArcherSprite(a) {
        if (a.dead) return;
        const s = use(a, 'archer');
        const [cx, cy] = center(a);
        s.place(cx, cy);
        const spawnScale = .35 + .65 * (1 - a.spawnAnim);
        const teleportScale = 1 + a.teleportAnim * .45;
        s.setPose(`rotate(${f2(a.aim)}rad) scale(${f2(spawnScale * teleportScale)})`);
        s.flag('is-aiming', a.loading > 0);

        const rings = s._q.sr || (s._q.sr = s.el.querySelectorAll('.kg-archer__spawn'));
        for (let i = 0; i < rings.length; i++) {
            const r = 18 + 35 * (1 - a.spawnAnim) - i * 12;
            const on = a.spawnAnim > 0 && r > 8;
            rings[i].hidden = !on;
            if (on) {
                rings[i].style.setProperty('--r', f2(r + Math.sin(a.phase + r) * 3));
                rings[i].style.setProperty('--o', f2(.65 * (1 - a.spawnAnim)));
                rings[i].style.setProperty('--c', '#fb923c');
            }
        }
        const tele = s.q('.kg-archer__tele');
        tele.hidden = !(a.teleportAnim > 0);
        if (a.teleportAnim > 0) {
            s.v(tele, '--r', f2(14 + 30 * a.teleportAnim));
            s.v(tele, '--o', f2(a.teleportAnim * .7));
            s.v(tele, '--bw', 3);
            s.v(tele, '--c', '#f59e0b');
        }
    }

    function updateArrowSprite(q) {
        const s = use(q, 'arrow');
        s.place(q.x, q.y);
        s.setPose(`rotate(${f2(Math.atan2(q.vy, q.vx))}rad)`);
        s.flag('is-lord', !!q.lord);
    }

    function updateVindexSprite(l) {
        const s = use(l, 'vindex');
        const [cx, cy] = center(l);
        s.place(cx, cy);
        s.v(s.el, '--glow', f2(14 + Math.sin(l.phase) * 4 + (l.react > 0 ? 12 : 0)));
        const ring = s.q('.kg-vindex__react');
        ring.hidden = !(l.react > 0);
        if (l.react > 0) {
            s.v(ring, '--r', f2(30 + l.react * .35));
            s.v(ring, '--o', .35);
            s.v(ring, '--bw', 3);
            s.v(ring, '--c', '#e9d5ff');
        }
    }

    function updateMeteorSprite(m, kind) {
        const s = use(m, kind);
        const [cx, cy] = center(m);
        s.place(cx, cy);
        const big = kind === 'meteorBig';
        if (!s._q.sized) {
            s._q.sized = true;
            s.v(s.q('.kg-art'), '--sz', `${f2(m.w * (big ? 1.2 : 1.3) * 4)}px`);
            s.v(s.el, '--th', f2(big ? 46 : m.w * .5));
        }
        s.setPose(`rotate(${f2(m.rotation)}rad)`);
        const t0 = m.trail && m.trail[0];
        const tail = s.q(big ? '.kg-meteor-big__tail' : '.kg-meteor__tail');
        const dist = t0 ? Math.hypot(cx - t0.x, cy - t0.y) : 0;
        s.v(s.el, '--tl', f2(Math.max(big ? 30 : 8, dist * (big ? 1.4 : 1.1))));
        const ang = t0 && dist > .5 ? Math.atan2(cy - t0.y, cx - t0.x) : Math.atan2(m.vy, m.vx);
        const t = `rotate(${f2(ang)}rad)`;
        if (s._q.tt !== t) { s._q.tt = t; tail.style.transform = t; }
    }

    /* ── API publik ──────────────────────────────────────────────────────── */
    function begin() {
        frame++;
        layer.classList.toggle('is-paused', !!paused);
        layer.classList.toggle('is-timestop', timeStop > 0 || vindexTimeStop > 0);
        layer.classList.remove('is-hidden');
        if (cinematic) cinematic.el.hidden = true;
    }
    function end() {
        for (const [key, s] of live) {
            if (s.seen !== frame) { s.el.remove(); live.delete(key); }
        }
    }

    /** Sinkronkan seluruh karakter permainan dengan state game saat ini. */
    function sync() {
        begin();
        if (target) updateItemSprite(target, 'target');
        if (health && health.visible) updateItemSprite(health, 'health');
        if (powerup && powerup.visible) updateItemSprite(powerup, 'power');
        if (timeStopPowerup && timeStopPowerup.visible) updateItemSprite(timeStopPowerup, 'timestop');
        for (const m of meteors) updateMeteorSprite(m, 'meteor');
        if (level !== 'hard' && largeMeteor && largeMeteor.active) updateMeteorSprite(largeMeteor, 'meteorBig');
        gadflies.forEach(updateGadflySprite);
        killers.forEach(updateKillerSprite);
        archers.forEach(updateArcherSprite);
        archerArrows.forEach(updateArrowSprite);
        if (level === 'hard' && lordVindex && !lordVindex.dead) updateVindexSprite(lordVindex);
        if (player) updatePlayerSprite(player);
        end();
    }

    /** Hanya killer (adegan ending: killer dihapus satu per satu). */
    function syncKillers(list) {
        begin();
        list.forEach(updateKillerSprite);
        end();
    }

    /** Lord Vindex besar di tengah layar untuk adegan pembuka mode SULIT. */
    function showCinematicVindex(x, y, scale) {
        begin();
        end(); // sembunyikan semua karakter lain
        if (!cinematic) {
            cinematic = build('vindex');
            cinematic.el.classList.add('kg-vindex--cinematic');
        }
        cinematic.seen = Infinity;
        cinematic.el.hidden = false;
        cinematic.place(x, y);
        cinematic.v(cinematic.el, '--glow', 24);
        cinematic.v(cinematic.el, '--kg-s', f2(.25 * scale));
    }
    function hideCinematicVindex() { if (cinematic) cinematic.el.hidden = true; }

    function clear() {
        for (const s of live.values()) if (s !== cinematic) s.el.remove();
        live.clear();
        hideCinematicVindex();
    }

    return { sync, syncKillers, showCinematicVindex, hideCinematicVindex, clear, layer };
})();
