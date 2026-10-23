/**
 * Gadfly (4 sisi arena): gerak mengikuti pemain + tabrakan.
 */

function updateGadflies() {
    const sf = enemySlowFactor();
    const playerCenterX = player.x + player.w / 2;
    const playerCenterY = player.y + player.h / 2;
    gadflies.forEach(function (g) {
        /*
         * ANIMASI TERKENA PLAYER
         */
        if (g.hitAnim > 0) {
            g.hitAnim -= sf;
            g.x += g.hitVX * sf;
            g.y += g.hitVY * sf;
            g.hitVX *= .90;
            g.hitVY *= .90;
            g.rotation += g.rotationSpeed * sf;
            g.rotationSpeed *= .96;
            /*
             * Setelah animasi
             * kembali ke posisi tepi.
             */
            if (g.hitAnim === 0) {
                if (g.name === "top") {
                    g.y = 0;
                }
                else if (g.name === "bottom") {
                    g.y = HEIGHT - g.h;
                }
                else if (g.name === "left") {
                    g.x = 0;
                }
                else {
                    g.x = WIDTH - g.w;
                }
                g.rotation = 0;
            }
            return;
        }
        if (g.freeze > 0) {
            g.freeze -= sf;
            return;
        }
        /*
         * ATAS / BAWAH
         * HANYA HORIZONTAL.
         */
        if (g.name === "top" || g.name === "bottom") {
            moveHorizontal(g, playerCenterX, 3 * sf);
        }
        /*
         * KIRI / KANAN
         * HANYA VERTIKAL.
         */
        else {
            moveVertical(g, playerCenterY, 3 * sf);
        }
        /*
         * Menyentuh target.
         */
        if (collide(g, target)) {
            spawnTarget();
        }
        /*
         * Menyentuh health.
         */
        if (collide(g, health)) {
            spawnHealth();
        }
    });
}

function checkPlayerGadflies() {
    gadflies.forEach(function (g) {
        if (g.hitAnim > 0) {
            return;
        }
        if (collide(player, g)) {
            if (score > 0) {
                score--;
            }
            /*
             * Tentukan arah
             * Gadfly terpental.
             */
            const gx = g.x + g.w / 2;
            const gy = g.y + g.h / 2;
            const px = player.x + player.w / 2;
            const py = player.y + player.h / 2;
            let dx = gx - px;
            let dy = gy - py;
            let distance = Math.hypot(dx, dy);
            if (distance < .01) {
                distance = 1;
                dx = 1;
                dy = 0;
            }
            dx /= distance;
            dy /= distance;
            g.hitVX = dx * 9;
            g.hitVY = dy * 9;
            /*
             * Animasi putar.
             */
            g.rotationSpeed = dx > 0 ? .35 : -.35;
            g.hitAnim = GADFLY_HIT_TIME;
            g.freeze = 0;
        }
    });
}
