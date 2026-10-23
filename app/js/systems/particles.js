/**
 * Pembaruan partikel.
 */

function updateParticles() {
    const sf = enemySlowFactor();
    let write = 0;
    for (let i = 0; i < particleList.length; i++) {
        const p = particleList[i];
        p.x += p.vx * sf;
        p.y += p.vy * sf;
        p.vx *= Math.pow(.97, sf);
        p.vy = p.vy * Math.pow(.97, sf) + .08 * sf;
        p.life -= sf;
        if (p.life > 0) {
            particleList[write++] = p;
        }
    }
    particleList.length = write;
    if (particleList.length > 300)
        particleList.length = 300;
}
