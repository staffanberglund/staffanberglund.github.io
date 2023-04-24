const { pitchClass, octave } = Tonal.Note;

const { midiToNoteName,  } = Tonal.Midi;

const { Scale, Chord, Note, Range, Key, Interval, Midi } = Tonal;

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
    const notes = Range.chromatic(range);
    const filtered = filterTonal(set)(notes);
    return filtered;
  }
};

function slash(note) {
	const x = pitchClass(note) + '/' + octave(note);
	return x; 
};

function vexArray(ch) {
	const x = ch.map(x => slash(x) );
	return x;
};

let renderedBool;

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
let bassNoteName;
let grundton;
let ack;
let ackVisa;
let skalaVar;

async function ackord() {
	document.getElementById('visaAckord').innerHTML = '';
	document.getElementById('visaSkala').innerHTML = '';
	//renderer.resize(0, 0);
	//renderer.getContext().clear();
//	if ( renderedBool == 1 ) {
//		await visaNoter();
//	}
	//await visaNoter();
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
	//chromScale = Range.chromatic([voicingFirst,Note.transpose(voicingFirst,'7M')]);
	//ack = filterTonal(ackPC)(chromScale);
	//console.log(voicings[index2]);
	//ack = voicings[index2].map(Scale.degrees( Midi.midiToNoteName(grundton, {pitchClass: false}) + ' ' + skalaVar ));
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

	const possibleScales = Scale.detect(ack,{tonic: bastonNote});
	const psTypes = possibleScales.map(x => Scale.get(x).type);
	const likelyScale = psTypes.filter(x => commonScales.includes(x));

	document.getElementById('visaAckord').innerHTML = await /*Midi.midiToNoteName(bassNote) + ' ' + ack.join(' ') +*/ '<br>' + Chord.detect([bastonNote].concat(ack),{assumePerfectFifth: true}).join(', ');
	document.getElementById('visaSkala').innerHTML = await '(slumpad skala: ' + bastonNote + ' ' + skalaVar + ')';
	if (renderedBool == 0) {
		visaNoter();
		renderedBool = 1;
	}

};

//const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter, Factory, EasyScore } = Vex.Flow;
const { System, Factory, EasyScore } = Vex.Flow;

/*
// Create an SVG renderer and attach it to the DIV element named "boo".
const div = document.getElementById("output");
const renderer = new Renderer(div, Renderer.Backends.SVG);


async function visaNoter() {
	if (!ack) {
	await ackord();
	}

	// Configure the rendering context.
	renderer.resize(500, 500);
	const context = renderer.getContext();
	
	// Create a stave of width 400 at position 10, 40 on the canvas.
	const stave = new Stave(15, 40, 170);
	
	const stave2 = new Stave(15, 140, 170);

	const staveC = new StaveConnector(stave, stave2).setType('singleLeft');
	const staveB = new StaveConnector(stave, stave2).setType('brace');
	const staveE = new StaveConnector(stave, stave2).setType('boldDoubleRight');
	
	// Add a clef and time signature.
	stave.addClef("treble").addTimeSignature("4/4");
	stave2.addClef("bass").addTimeSignature("4/4");
	
	// Connect it to the rendering context and draw!
	stave.setContext(context).draw();
	stave2.setContext(context).draw();
	staveC.setContext(context).draw();
	staveB.setContext(context).draw();
	staveE.setContext(context).draw();


	const notes = [
	    // A C-Major chord.
	    new StaveNote({ clef:"treble", keys: vexArray(ack), duration: "w" }),
	];

	const notesBass = [
	    // A C-Major chord.
	    new StaveNote({ clef:"bass", keys: vexArray([midiToNoteName(bassNote)]), duration: "w" }),
	];

	// Create a voice in 4/4 and add above notes
	const voice = new Voice({ num_beats: 4, beat_value: 4 });
	voice.addTickables(notesBass);
	
	const voiceBass = new Voice({ num_beats: 4, beat_value: 4 });
	voiceBass.addTickables(notesBass);

	// Format and justify the notes to 400 pixels.
	new Formatter().joinVoices([voice]).format([voice], 350);
	new Formatter().joinVoices([voiceBass]).format([voiceBass], 350);
	

	// Render voice
	voice.draw(context, stave);
	voiceBass.draw(context, stave2);
};
*/
	const vf = new Factory({
	  renderer: {
	    elementId: 'output',
	    width: 500,
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

/*
async function res() {
	await visaNoter();
	vf.context.clear();
};
*/
