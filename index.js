function slump() {
	return Math.floor(Math.random() * 2); // 0 eller 1
};

function filter(set) {
  const isIncluded = Tonal.PcSet.isNoteIncludedIn(set);
  return function(notes) {
    return notes.filter(isIncluded);
  };
};

function scale(set, range) {
  if (arguments.length === 1) {
    return r => scale(set, r);
  } else {
    const notes = Tonal.Range.chromatic(range);
    const filtered = filter(set)(notes);
    return filtered;
  }
};

let grundton = 48 + Math.floor((Math.random() * 11) + 1);
let ters = grundton + slump() + 3;

let dur = ters - grundton - 3 // 1 om dur, 0 annars	//?	mix = mod9.map(Tonal.Scale.steps("B3 mixolydian")); 	?


const listaSkalor = ['lydian dominant', 'mixolydian', 'dorian', 'lydian'];

const skala = ' ' + listaSkalor[Math.floor(Math.random() * listaSkalor.length)];
const tonart = Tonal.Key.majorKey(Tonal.Note.pitchClass(Tonal.Midi.midiToNoteName(grundton))).alteration;
const bassNote = [grundton - 12];
const bastonNote = Tonal.Note.pitchClass(Tonal.Midi.midiToNoteName(grundton))

const interval34 = Tonal.Interval.distance(Tonal.Scale.get(Tonal.Midi.midiToNoteName(grundton) + skala).notes[2],Tonal.Scale.get(Tonal.Midi.midiToNoteName(grundton) + skala).notes[3]); // Intervall mellan ters och kvart


// Define the instrument and audio context as global variables
let piano;
let bass;
const audioContext = new AudioContext();

// Pre-load the instrument and save it to the global variable
Promise.all([
	Soundfont.instrument(audioContext, 'acoustic_grand_piano').then(function (x) {
		piano = x;
	}),
	
	Soundfont.instrument(audioContext, 'acoustic_bass').then(function (x) {
		bass = x;
	})
//	fetch('chords.json')
//		.then(response => response.json())
//		.then(notes => {
//			const listOfNotes = notes["sevenNotes"];
//			const index = Math.floor((Math.random() * listOfNotes.length));
//			const skala = listaSkalor[Math.floor(Math.random() * listaSkalor.length)];
//			const grundton = 48 + Math.floor((Math.random() * 11) + 1);
//			const ack = listOfNotes[index].map(note => Tonal.Note.pitchClass(note + Tonal.Interval.fromSemitones(grundton) + Tonal.Scale.get(skala).intervals[note % 7]));
//			ackord = ack;
//		})
]);

let ackordPromise = fetch('chords.json')
        .then(response => response.json())
        .then(notes => {
                const listOfNotes = notes["sevenNotes"];
                const index = Math.floor((Math.random() * listOfNotes.length));
		const ack2 = listOfNotes[index].map(Tonal.Scale.degrees( Tonal.Midi.midiToNoteName(grundton, {pitchClass: false}) + skala ));
		console.log(Tonal.Midi.midiToNoteName(grundton) + skala);
		console.log(listOfNotes[index]);
		console.log(ack2);
		console.log(interval34);

                return ack2;
        });

async function chord() {
        const ack = await ackordPromise;
        const playPiano = await ack.map(note => piano.play(note));
	const playBass = bassNote.map(note => bass.play(note));

        await Promise.all(playPiano,playBass);
};

async function visaAckord() {
        const ack = await ackordPromise;
	document.getElementById('midi').innerHTML = await bastonNote + ' ' + ack.map(Tonal.Note.pitchClass).join(' ');
}
