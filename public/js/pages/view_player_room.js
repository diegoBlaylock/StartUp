import { setupKeyboard } from "./shared/keyboard.js";
import { musicSocket } from "./shared/room-ws.js";
import { setupPage, onNoteEvent } from "./shared/room.js";

async function onLoad() {
    await setupPage();
    setupKeyboard(true, (note)=>{
        musicSocket.sendNoteEvent(note);
        onNoteEvent(note);
    });
}

await onLoad();
