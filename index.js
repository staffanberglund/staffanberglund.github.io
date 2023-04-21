function slump() {
	return Math.floor(Math.random() * 2); // 0 eller 1
};

function filterTonal(set) {
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
    const filtered = filterTonal(set)(notes);
    return filtered;
  }
};

Tonal.ScaleType.add(["1P", "2m", "3M", "4P", "5P", "6M", "7m"], "mixolydian b2");
Tonal.ScaleType.add(["1P", "2A", "3M", "4P", "5P", "6M", "7m"], "mixolydian #2");
Tonal.ScaleType.add(["1P", "2A", "3M", "4A", "5P", "6M", "7m"], "lydian dominant #2");

const commonScales = 
	[
	"ionian",
	"aeolian",
	"melodic minor",
	"harmonic minor",
	"diminished",
	"dorian",
	"lydian",
	"mixolydian",
	"phrygian",
	"locrian"
	];

let bassNote;
let bastonNote;
let grundton;
let ack;
let skalaVar;

async function ackord() {Tonal
	document.getElementById('visaAckord').innerHTML = '';
	document.getElementById('visaSkala').innerHTML = '';

	grundton = 48 + Math.floor((Math.random() * 11) + 1);
	const tonart = Tonal.Key.majorKey(Tonal.Note.pitchClass(Tonal.Midi.midiToNoteName(grundton))).alteration;
	bassNote = [grundton - 12];
	bastonNote = Tonal.Note.pitchClass(Tonal.Midi.midiToNoteName(grundton));

	const [skalaResponse, ackordResponse] = await Promise.all([
		fetch('scales.json'),
		fetch('chords.json')
	]);
	
	const skala = await skalaResponse.json();			
	const ackord = await ackordResponse.json();
        const index1 = Math.floor((Math.random() * skala.length));
	skalaVar = skala[index1];


        let voicings = ackord["sevenNotes"];
        const index2 = Math.floor((Math.random() * voicings.length));	
	const interval34 = Tonal.Interval.distance(Tonal.Scale.get(Tonal.Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[2],Tonal.Scale.get(Tonal.Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[3]); // Intervall mellan ters och kvart
	voicings[index2] = voicings[index2].filter(x => interval34 == "2m" ? x != 11 : x ) ; // Om durters & ren kvart, ta bort 11 från ackordet
	const interval12 = Tonal.Interval.distance(Tonal.Scale.get(Tonal.Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[0],Tonal.Scale.get(Tonal.Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[1]); // Intervall mellan grundton & nia (tvåa)
	voicings[index2] = voicings[index2].filter(x => interval12 == "2m" ? x != 9 : x ) ; // Om moll och b9, ta bort nia
	ackPC = voicings[index2].map(Tonal.Scale.degrees( Tonal.Midi.midiToNoteName(grundton, {sharps: tonart > 0, pitchClass: true}) + ' ' + skalaVar));
	voicingFirst = Tonal.Scale.degrees(Tonal.Midi.midiToNoteName(grundton, {sharps: tonart > 0, pitchClass: false}) + ' ' + skalaVar)(voicings[index2][0]);
	ack = Tonal.Scale.rangeOf(ackPC)(voicingFirst,Tonal.Note.transpose(voicingFirst,'7M'));
	//chromScale = Tonal.Range.chromatic([voicingFirst,Tonal.Note.transpose(voicingFirst,'7M')]);
	//ack = filterTonal(ackPC)(chromScale);
	//console.log(voicings[index2]);
	//ack = voicings[index2].map(Tonal.Scale.degrees( Tonal.Midi.midiToNoteName(grundton, {pitchClass: false}) + ' ' + skalaVar ));
	return [ack, skalaVar];
};

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
]);


async function chord() {
	if (!ack) {
	await ackord();
	}

        const playPiano = ack.map(note => piano.play(note));
	const playBass = bassNote.map(note => bass.play(note));

        await Promise.all(playPiano,playBass);
};

async function visaAckord() {
	if (!ack) {
	await ackord();
	}

	const possibleScales = Tonal.Scale.detect(ack,{tonic: bastonNote});
	const psTypes = possibleScales.map(x => Tonal.Scale.get(x).type);
	const likelyScale = psTypes.filter(x => commonScales.includes(x));

	document.getElementById('visaAckord').innerHTML = await /*Tonal.Scale.detect([Tonal.Midi.midiToNoteName(grundton)].concat(ack) )[0] + '  ' +[Tonal.Midi.midiToNoteName(grundton)].concat(ack) ;*/ Tonal.Midi.midiToNoteName(grundton) + ' ' + ack./*map(Tonal.Note.pitchClass).*/join(' ');
	document.getElementById('visaSkala').innerHTML = await Tonal.Chord.detect([bastonNote].concat(ack),{assumePerfectFifth: true}).join(', ') + '<br><br> (slumpad skala: ' + bastonNote + ' ' + skalaVar + ')';
};
