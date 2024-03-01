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

let renderedBool;

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


const { System, Factory, EasyScore } = Vex.Flow;

const vf = new Factory({
	renderer: {
		elementId: 'output',
		width: 250,
		height: 250
	},
});

let ackordtyper = ['maj7', 'm7', '7', 'm7b5' ];

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

function ackord() {
	document.getElementById('visaAckord').innerHTML = '';
	document.getElementById('visaSkala').innerHTML = '';

	vf.context.clear();
	renderedBool = 0;

	const a = Math.floor(Math.random() * 4 );
	grundton = 55 + Math.floor((Math.random() * 11) + 1);
	const tonart = Key.majorKey(pitchClass(midiToNoteName(grundton))).alteration;

	let selectedTypes = Array.from(document.querySelectorAll('input[name="ackordtyp"]:checked')).map(checkbox => checkbox.value);

	let typ = selectedTypes[Math.floor(Math.random()*selectedTypes.length)];

	let brutetAckord = [ Note.fromMidi(grundton) , typ];

	ack =  Range.numeric([a, a + 3 * ( Math.floor(random()*2) == 0 ? -1 : 1 )]).map(Chord.steps(brutetAckord));  
  /*Scale.rangeOf(ackPC)(voicingFirst,Note.transpose(voicingFirst,'7M'));*/
	ack_1 = [ack[0] + '/q', ack[1], ack[2], ack[3]];
  	ackVisa = ack_1.join(', ');
 

	const score = vf.EasyScore();
	const system = vf.System({x:15,y:0,width: 250});
	system
		.addStave({
			voices: [
				score.voice(score.notes( ackVisa, {
			//		stem: 'up',
					clef: 'treble'
				})),
			],
		})
		.addClef('treble')
		.addTimeSignature('4/4')

	
	vf.draw();


	document.getElementById('visaAckord').innerHTML = '<br>' + Midi.midiToNoteName(grundton,{pitchClass: true}) + typ

	return [ack];
};


/*------------------------------*/
/* 	Spela upp ljud		*/
/*------------------------------*/
let piano;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

  Soundfont.instrument(audioContext, 'acoustic_grand_piano').then(function (x) {
    piano = x;
  });

function firstNote() {
	  piano.play(ack[0])
}


function chord() {
	if (!ack) {
	ackord();
	}
  piano.schedule(0, [ { time: 0, note: ack[0]}, { time: 0.5, note: ack[1]},{ time: 1, note: ack[2]},{ time: 1.5, note: ack[3]}])

	//ack.map(note => piano.play(note));
//piano.play(ack[0],0)
//piano.play(ack[1],0.5)
//piano.play(ack[2],1)
//piano.play(ack[3],1.5)
//piano.stop(o§)
//    const playPiano = ack.map((note,index) => piano.play(note,index));
//	Promise.all(playPiano);
};

/*--------------*/
/* 	Rita noter	*/
/*----------------------*/



//async function visaNoter() {
//	if (!ack) {
//	ackord();
//	}
//
//
//};

window.onload = function() {
	check();
    ackord();
	//visaNoter();
};

document.getElementById('chordButton').addEventListener('click', chord);
document.getElementById('firstNote').addEventListener('click', firstNote);
document.getElementById('reloadButton').addEventListener('click', ackord);
}
main();
