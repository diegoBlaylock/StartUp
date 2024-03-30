import {setupKeyboard} from "/js/pages/shared/keyboard.js"
import { setupPage } from "./shared/room.js";

async function onLoad() {
    await setupPage();
    setupKeyboard();
}

await onLoad();