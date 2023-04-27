const { pitchClass, octave } = Tonal.Note;

const { midiToNoteName,  } = Tonal.Midi;

const { Scale, Chord, Note, Range, Key, Interval, Midi } = Tonal;

/*------------------------------*/
/* 	Spela upp ljud		*/
/*------------------------------*/

let voice;
const audioContext = new AudioContext();

Promise.all([
	Soundfont.instrument(audioContext, 'voice_oohs').then(function (x) {
		voice = x;
	}),
]);

let adjust;

//const range = document.querySelector('.range');
//range.addEventListener('input', e => range.style.setProperty('--slider-percent', e.target.value));
//
//document.getElementById('slider').value = 1;

adjust = Math.round(Math.random() * 50 )/100;
let ack;
ack = [60, 64 - adjust];

function sliderChange(val) {
	//document.getElementById('output').innerHTML = val; // get
	//adjust = val;
	//ack = [60, 64 - adjust];
	ack[1] = 64 - adjust + Number(val);
	console.log(ack[1]);
};

function intPlus() {
	ack[1] = ack[1] + 0.01;
	console.log(ack[1]);
};

function intMinus() {
	ack[1] = ack[1] -  0.01;
	console.log(ack[1]);
};

document.getElementById('slider').value = 0; // set


const slump = Math.floor(Math.random() + 1);

async function chord() {
//	if (!ack) {
////	await ackord();
//	}

        const playSound = ack.map(note => voice.play(note));

        await Promise.all(playSound);
};
