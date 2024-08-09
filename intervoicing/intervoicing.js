function main() {

const { pitchClass, octave } = Tonal.Note;

const { midiToNoteName,  } = Tonal.Midi;

const { Scale, Chord, Note, Range, Key, Interval, Midi } = Tonal;

const { floor, random } = Math;

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

let ack;
let ackordtyper = ['maj7', 'm7', '7', 'm7b5' ];
let ackVisa;
let ackVisa2;
let brutetAckord;

let skala = ['mixolydian', 'ionian', 'dorian', 'locrian'];

let voicings = [
	[0, 2, 1+4, 3+4],
	[0, 3, 1+4, 2+4],
	[0, 1, 2, 3],
	[1-4, 3-4, 0, 2],
	[2-4, 0, 1, 3],
	[2-4-4, 1-4, 3-4, 0],
	[3-4-4, 1-4, 2-4, 0],
	[3-4-4, 1-4, 0, 2]
];

function check() {
	var form = document.getElementById('ackordtyperForm');

	for (var i = 0; i < ackordtyper.length; i++) {
		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.name = "ackordtyp";
		checkbox.value = ackordtyper[i];
		checkbox.id = "ackordtyp" + i;
		checkbox.checked = true; // Set the checkbox to be checked by default

		var label = document.createElement('label')
		label.htmlFor = "ackordtyp" + i;
		label.appendChild(document.createTextNode(ackordtyper[i]));

		form.appendChild(checkbox);
		form.appendChild(label);
		form.appendChild(document.createElement("br"));    
	}
}

async function ackord() {
	document.getElementById('visaAckord').innerHTML = '';
	document.getElementById('visaSkala').innerHTML = '';

	vf.context.clear();
	renderedBool = 0;
	noteCount = 1;

	const a = Math.floor(Math.random() * 4 );
	grundton = 55 + Math.floor((Math.random() * 11) + 1);
	const tonart = Key.majorKey(pitchClass(midiToNoteName(grundton))).alteration;

	let selectedTypes = Array.from(document.querySelectorAll('input[name="ackordtyp"]:checked')).map(checkbox => checkbox.value);

	let typ = selectedTypes[Math.floor(Math.random()*selectedTypes.length)];

	brutetAckord = [ Note.fromMidi(grundton) , typ];

	let chrd = Chord.steps(brutetAckord);

    const index2 = Math.floor((Math.random() * voicings.length));	

	ack = voicings[index2].map(chrd)
	ack = Midi.toMidi(ack[0]) < 43 ? ack = ack.map(x => Note.transpose(x, '8P') ) : ack;
	ack = Midi.toMidi(ack[0]) > 59 ? ack = ack.map(x => Note.transpose(x, '-8P')) : ack;
 
  	ackVisa = [ack[0], ack[1]].join(' ');
  	ackVisa2 = [ack[2], ack[3]].join(' ');

	const score = vf.EasyScore();
	const system = vf.System({x:15,y:0,width: 180});
	system
		.addStave({
			voices: [
				score.voice(score.notes('B9/w/r', {
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
				score.voice(score.notes( ack[0] +'/w', {
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

	[i,j] =  [ack, brutetAckord];
	
	return [ack, brutetAckord];
};


/*------------------------------*/
/* 	Spela upp ljud		*/
/*------------------------------*/
let piano;
let bass;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

Promise.all([
	Soundfont.instrument(audioContext, 'acoustic_grand_piano').then(function (x) {
		piano = x;
	}),
	
	Soundfont.instrument(audioContext, 'acoustic_bass').then(function (x) {
		bass = x;
	})
]);

let noteCount = 1; // Initialize noteCount to 1

async function chord() {
	if (!ack) {
		await ackord();
	}

	const playPiano = ack.slice(0, noteCount).map(note => piano.play(note)); // Play only the first noteCount notes
	await Promise.all(playPiano);
};

function next() {
	noteCount = Math.min(noteCount + 1, ack.length); // Increment noteCount, but don't let it exceed the number of notes in ack
	chord();
};


async function visaAckord() {
	if (!ack || !brutetAckord) {
	await ackord();
	}
	

	let [ack_1, brutetAckord_] = [i,j];
	ack_ = ack_1.map(Note.pitchClass);
	brutetAckord_ = [Note.pitchClass(brutetAckord_[0]), brutetAckord_[1]];

	let grnd = brutetAckord_[0] == ack_[0] ? '' : '/' + ack_[0];

	document.getElementById('visaAckord').innerHTML = brutetAckord_[0] + brutetAckord_[1] + grnd;

//	document.getElementById('visaSkala').innerHTML = await '(slumpad skala: ' + bastonNote + ' ' + skalaVar + ')';
	if (renderedBool == 0) {
		vf.context.clear();
		visaNoter();
		renderedBool = 1;
	}
};

/*----------------------*/
/* 		Rita noter		*/
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
				score.voice(score.notes('(' + ackVisa2 + ')' + '/w', {
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
				score.voice(score.notes('(' + ackVisa + ')' +'/w', {
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
let i;
let j;

window.onload = async function() {
	check();
    [i,j] = await ackord();
	//visaNoter();
};

document.getElementById('chordButton').addEventListener('click', chord);
document.getElementById('chordButtonNext').addEventListener('click', next);
document.getElementById('visaButton').addEventListener('click', visaAckord);
document.getElementById('reloadButton').addEventListener('click', ackord);
}
main();
