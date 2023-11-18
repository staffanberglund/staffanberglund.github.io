const { pitchClass, octave } = Tonal.Note;

const { midiToNoteName,  } = Tonal.Midi;

const { Scale, Chord, Note, Range, Key, Interval, Midi } = Tonal;

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
    const notes = Range.chromatic(range);
    const filtered = filterTonal(set)(notes);
    return filtered;
  }
};

let renderedBool;

Tonal.ScaleType.add(["1P", "2m", "3M", "4P", "5P", "6M", "7m"], "mixolydian b2");
Tonal.ScaleType.add(["1P", "2A", "3M", "4P", "5P", "6M", "7m"], "mixolydian #2");
Tonal.ScaleType.add(["1P", "2m", "3M", "4P", "5P", "6m", "7m"], "mixolydian b2 b6");
Tonal.ScaleType.add(["1P", "2A", "3M", "4A", "5P", "6M", "7m"], "lydian dominant #2");


let bassNote;
let bastonNote;
let bassNoteName;
let grundton;
let ack;
let ackVisa;
let skalaVar;

/*------------------------------*/
/* Slumpa fram ackord och skala	*/
/*------------------------------*/
async function ackord() {
	document.getElementById('visaAckord').innerHTML = '';
	document.getElementById('visaSkala').innerHTML = '';

	vf.context.clear();
	renderedBool = 0;

	grundton = 48 + Math.floor((Math.random() * 11) + 1);
	const tonart = Key.majorKey(pitchClass(midiToNoteName(grundton))).alteration;
	bassNote = [grundton - 12];
	bastonNote = Note.pitchClass(midiToNoteName(grundton));
	bassNoteName = Midi.midiToNoteName(bassNote);

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
	const interval34 = Interval.distance(Scale.get(Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[2],Scale.get(Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[3]); // Intervall mellan ters och kvart
	voicings[index2] = voicings[index2].filter(x => interval34 == "2m" ? x != 11 : x ) ; // Om durters & ren kvart, ta bort 11 från ackordet
	const interval12 = Interval.distance(Scale.get(Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[0],Scale.get(Midi.midiToNoteName(grundton) + ' ' + skalaVar).notes[1]); // Intervall mellan grundton & nia (tvåa)
	voicings[index2] = voicings[index2].filter(x => interval12 == "2m" ? x != 9 : x ) ; // Om moll och b9, ta bort nia
	ackPC = voicings[index2].map(Scale.degrees( Midi.midiToNoteName(grundton, {sharps: tonart > 0, pitchClass: true}) + ' ' + skalaVar));
	voicingFirst = Scale.degrees(Midi.midiToNoteName(grundton, {sharps: tonart > 0, pitchClass: false}) + ' ' + skalaVar)(voicings[index2][0]);
	ack = Scale.rangeOf(ackPC)(voicingFirst,Note.transpose(voicingFirst,'7M'));
	ackVisa = ack.join(' ');

	return [ack, skalaVar];
};


/*------------------------------*/
/* 	Spela upp ljud		*/
/*------------------------------*/
let piano;
let bass;
const audioContext = new AudioContext();

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

	document.getElementById('visaAckord').innerHTML = await '<br>' + Chord.detect([bastonNote].concat(ack),{assumePerfectFifth: true}).join(', ');
	document.getElementById('visaSkala').innerHTML = await '(slumpad skala: ' + bastonNote + ' ' + skalaVar + ')';
	if (renderedBool == 0) {
		visaNoter();
		renderedBool = 1;
	}

};

/*----------------------*/
/* 	Rita noter	*/
/*----------------------*/

const { System, Factory, EasyScore } = Vex.Flow;

const vf = new Factory({
	renderer: {
		elementId: 'output',
		width: 250,
		height: 250
	},
});

async function visaNoter() {
	if (!ack) {
	await ackord();
	}
	

	const score = vf.EasyScore();
	const system = vf.System({x:15,y:0,width: 180});
	system
		.addStave({
			voices: [
				score.voice(score.notes('(' + ackVisa + ')' + '/w', {
					stem: 'up',
					clef: 'treble'
				})),
			],
		})
		.addClef('treble')
		.addTimeSignature('4/4')

	system
		.addStave({
			voices: [
				score.voice(score.notes(bassNoteName +'/w', {
					stem: 'up',
					clef: 'bass'
				})),
			],
		})
		.addClef('bass')
		.addTimeSignature('4/4');
		
	system.addConnector('singleLeft');
	system.addConnector('brace');
	system.addConnector('singleRight');
	
	vf.draw();
};
