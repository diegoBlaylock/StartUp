const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const oscillators = new Map;
const compressor = new DynamicsCompressorNode(audioContext, {ratio: 12, threshold: -100, knee: 1});
const gain = audioContext.createGain();
gain.gain.value = 5;
compressor.connect(gain).connect(audioContext.destination); 

function midiToFreq(note){
    return 440 * Math.pow(2, (note-69)/12)
}


export function createNote(note) {
    const freq = midiToFreq(note);
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime); // value in hertz
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.connect(compressor);
    oscillator.connect(gain);
    oscillators.set(note, {
        oscillator: oscillator,
        gain: gain,
        note: note
    });
    oscillator.start();
}

export function playNote(midiNote) {
    audioContext.resume();
    const note = oscillators.get(midiNote);
    note.gain.gain.cancelAndHoldAtTime(audioContext.currentTime);
    note.gain.gain.setValueAtTime(1, audioContext.currentTime);
    note.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime+5);
}

export function stopNote(midiNote) {
    const note = oscillators.get(midiNote);
    note.gain.gain.cancelAndHoldAtTime(audioContext.currentTime);
    note.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime+0.1);
}




