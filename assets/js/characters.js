/**
 * Mengisi elemen [data-kg="<karakter>"] dengan karakter CSS yang sama persis
 * dengan yang dipakai gameplay (markup dari app/js/render/sprite-templates.js).
 *
 *   <div data-kg="killer"></div>                    karakter statis
 *   <div data-kg="killer" data-mood="panic"></div>  suasana killer (panic | celebrate | sad)
 *   <div data-kg="archer" data-aim="0.3"></div>     arah bidik (radian)
 *
 * Kontainer [data-kg-fit] menyesuaikan --kg-s dengan lebar arena (800px = skala 1).
 */
(function () {
    function mount(host) {
        const kind = host.dataset.kg;
        if (!KG_TEMPLATES[kind]) return;
        const el = document.createElement('div');
        el.className = 'kg ' + KG_CLASSES[kind];
        el.innerHTML = KG_TEMPLATES[kind];
        el.querySelectorAll('.kg-ring').forEach(r => { r.hidden = true; });

        const art = el.querySelector('.kg-art');
        if (kind === 'meteor') {
            art.style.setProperty('--sz', '84px');
            el.style.setProperty('--tl', '16'); el.style.setProperty('--th', '9');
            el.querySelector('.kg-pose').style.transform = 'rotate(.4rad)';
        }
        if (kind === 'meteorBig') {
            art.style.setProperty('--sz', '480px');
            el.style.setProperty('--tl', '40'); el.style.setProperty('--th', '46');
        }
        if (kind === 'killer' && host.dataset.mood) {
            el.setAttribute('data-mood', host.dataset.mood);
            if (host.dataset.mood === 'sad') el.classList.add('is-sad');
            const sparks = el.querySelector('.kg-killer__sparks');
            if (sparks) sparks.style.setProperty('--spin', '.5');
        }
        if (kind === 'archer') {
            const aim = parseFloat(host.dataset.aim || '0');
            el.querySelector('.kg-pose').style.transform = `rotate(${aim}rad)`;
        }
        if (kind === 'gadfly') {
            el.querySelector('.kg-pose').style.transform = `rotate(${host.dataset.rot || 0}rad)`;
        }
        host.appendChild(el);
    }

    function fit(container) {
        const boost = parseFloat(container.dataset.kgBoost || '1');
        container.style.setProperty('--kg-s', (container.clientWidth / 800) * .25 * boost);
    }

    document.querySelectorAll('[data-kg]').forEach(mount);
    document.querySelectorAll('[data-kg-fit]').forEach(c => {
        fit(c);
        if ('ResizeObserver' in window) new ResizeObserver(() => fit(c)).observe(c);
    });
})();
