/**
 * Titik masuk: mulai level sesuai <body data-level="easy|normal|hard">.
 */
if (PAGE_LEVEL) {
    startGame(PAGE_LEVEL);
} else {
    showMenu();
}
