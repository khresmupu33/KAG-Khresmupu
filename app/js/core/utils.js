/**
 * Utilitas umum: angka acak, tabrakan (AABB), wrap & pergerakan dasar.
 */

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPosAwayFromPlayer() {
    let x;
    let y;
    let attempts = 0;
    do {
        x = randomInt(50, WIDTH - 50);
        y = randomInt(50, HEIGHT - 50);
        attempts++;
        if (!player) {
            break;
        }
    } while (Math.abs(x - player.x) < 120 && Math.abs(y - player.y) < 120 && attempts < 100);
    return { x: x, y: y };
}

function collide(a, b) {
    return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

function wrap(obj) {
    if (obj.x + obj.w < 0) {
        obj.x = WIDTH;
    }
    if (obj.x > WIDTH) {
        obj.x = -obj.w;
    }
    if (obj.y + obj.h < 0) {
        obj.y = HEIGHT;
    }
    if (obj.y > HEIGHT) {
        obj.y = -obj.h;
    }
}

function moveHorizontal(obj, targetX, speed) {
    const center = obj.x + obj.w / 2;
    if (center < targetX) {
        obj.x += speed;
    }
    else if (center > targetX) {
        obj.x -= speed;
    }
}

function moveVertical(obj, targetY, speed) {
    const center = obj.y + obj.h / 2;
    if (center < targetY) {
        obj.y += speed;
    }
    else if (center > targetY) {
        obj.y -= speed;
    }
}

function moveTowards(obj, targetObj, speed) {
    const cx = obj.x + obj.w / 2;
    const cy = obj.y + obj.h / 2;
    const tx = targetObj.x + targetObj.w / 2;
    const ty = targetObj.y + targetObj.h / 2;
    if (cx < tx) {
        obj.x += speed;
    }
    if (cx > tx) {
        obj.x -= speed;
    }
    if (cy < ty) {
        obj.y += speed;
    }
    if (cy > ty) {
        obj.y -= speed;
    }
}

function angleTo(a, b) { return Math.atan2((b.y + b.h / 2) - (a.y + a.h / 2), (b.x + b.w / 2) - (a.x + a.w / 2)); }
