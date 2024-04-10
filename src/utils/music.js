class StoredBuffer {
    constructor(note, buffer) {
        this.note = note;
        this.buffer = buffer;
    }
}

export default class AudioPlayer {
    #sustain
    #activeNotes
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.oscillators = new Map();
        this.compressor = new DynamicsCompressorNode(this.audioContext, {ratio: 6, threshold: 0, knee: 12});
        this.gain = this.audioContext.createGain();
        this.gain.gain.value = 3;
        this.compressor.connect(this.gain).connect(this.audioContext.destination);
        this.sources = [];
        this.#sustain = false;
        this.#activeNotes = new Set();
    }

    #midiToFreq(note){
        return 440 * Math.pow(2, (note-69)/12)
    }

    #calcGain(note) {
        const a=1
        const b=0.99
        const r=36
        return a * Math.pow(b, note-r)
    }

    #findIndex(arr, note, lo=0, hi=arr.length) {
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          const midNote = arr[mid].note;
          if (midNote < note) lo = mid + 1;
          else if (midNote > note) hi = mid;
          else return mid;
        }
        return lo;
      }

    async seed(note, buffer) {
        const sample = await this.audioContext.decodeAudioData(buffer);
        const source = new StoredBuffer(note, sample);
        const index = this.#findIndex(this.sources, note);
        this.sources.splice(index, 0, source);
    }

    sustain(val) {
        this.#sustain = val;
        if(!val)
            this.oscillators.keys().forEach((note)=>{
                if(!this.#activeNotes.has(note)) this.stopNote(note)
        });
    }

    createNote(note) {
        const index = this.#findIndex(this.sources, note);
        let sample;
        if (index === 0) {
            sample = this.sources[0];
        } else if (index >= this.sources.length-1) {
            sample = this.sources[index-1];
        } else {
            const prev = this.sources[index-1]; 
            const next = this.sources[index];
            sample = (note - prev.note < next.note-note+3)? prev:next;
        }


        const offset = note-sample.note;
        
        const source = this.audioContext.createBufferSource();
        source.buffer = sample.buffer;
        source.detune.value = offset * 100;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(this.#calcGain(note), this.audioContext.currentTime);
        gain.connect(this.compressor);
        source.connect(gain);
        
        this.oscillators.set(note, {
            oscillator: source,
            gain: gain,
            note: note,
            gVal: this.#calcGain(note)
        });

        source.start(0);
    }

    playNote(midiNote) {
        this.audioContext.resume();
        const note = this.oscillators.get(midiNote);

        note?.gain.gain.cancelAndHoldAtTime(this.audioContext.currentTime);
        note?.gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.01);
        // if(note)
        //     note.oscillator.buffer = null;

        this.createNote(midiNote);
        this.#activeNotes.add(midiNote);
    }

    stopNote(midiNote) {
        if (!this.#sustain) {
            const note = this.oscillators.get(midiNote);
            note?.gain.gain.cancelAndHoldAtTime(this.audioContext.currentTime);
            note?.gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
        }
        this.#activeNotes.delete(midiNote);
    }

    destroy() {
        if(this.audioContext.state !== "closed")
        this.audioContext.close();
    }
}