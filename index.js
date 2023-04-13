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

let dur = ters - grundton - 3 // 1 om dur, 0 annars

const listOfNotes_old = [
//	[7,3,5],
//	[3,7,9],
//	[7,3,13],
//	[3,13,7,9],
//	[7,9,3,5],
//	[7,9,3,13],
//	[7,1,3,5],
//	[3,5,7,9],
	[4,8,11,15]
];

async function loadNotes(voicing) {
  const response = await fetch('chords.json');
  const notes = await response.json();
  return notes[voicing];
}

const listOfNotes = await loadNotes("sevenNotes");

	//?	mix = mod9.map(Tonal.Scale.steps("B3 mixolydian")); 	?

//const chNotes = listOfNotes[Math.floor((Math.random() * listOfNotes.length))].map(Tonal.Scale.degrees( Tonal.Midi.midiToNoteName(grundton, {pitchClass: true})+ " lydian dominant"));
const ack = listOfNotes[Math.floor((Math.random() * listOfNotes.length))].map(Tonal.Scale.degrees( Tonal.Midi.midiToNoteName(grundton, {pitchClass: false})+ " half-whole diminished"));
//const range = Range.chromatic([grundton, grundton + 12]);
//const ack =  
const tonart = Tonal.Key.majorKey(Tonal.Note.pitchClass(Tonal.Midi.midiToNoteName(grundton))).alteration;
const bassNote = [grundton - 12];

const bastonNote = Tonal.Note.pitchClass(Tonal.Midi.midiToNoteName(grundton))

// Define the instrument and audio context as global variables
let piano;
let bass;
const audioContext = new AudioContext();

// Pre-load the instrument and save it to the global variable
Soundfont.instrument(audioContext, 'acoustic_grand_piano').then(function (x) {
	piano = x;
});

Soundfont.instrument(audioContext, 'acoustic_bass').then(function (x) {
	bass = x;
});

async function chord() {
	const playPiano = ack.map(note => piano.play(note));
	const playBass = bassNote.map(note => bass.play(note));
	Promise.all(playPiano, playBass);
  };

function visaAckord() {
	document.getElementById('midi').innerHTML = /*filter(["C", "D", "E"])(["c2", "c#2", "d2", "c3", "c#3", "d3"]);// */bastonNote + ' ' + ack.map(Tonal.Note.pitchClass).join(' ');
};
