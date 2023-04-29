const { pitchClass, octave } = Tonal.Note;

const { midiToNoteName,  } = Tonal.Midi;

const { Scale, Chord, Note, Range, Key, Interval, Midi } = Tonal;

/*------------------------------*/
/* 	Spela upp ljud		*/
/*------------------------------*/

let voice;
const audioContext = new AudioContext();

let dropdownList = document.getElementById('select_box');
let sound = 'acoustic_grand_piano';//'voice_oohs'
dropdownList.onchange = (ev) => {
	sound = dropdownList.value;
};

Promise.all([
	Soundfont.instrument(audioContext, sound).then(function (x) {
		voice = x;
	}),
]);

let adjust;
let adjust2;

//const range = document.querySelector('.range');
//range.addEventListener('input', e => range.style.setProperty('--slider-percent', e.target.value));
//
//document.getElementById('slider').value = 1;

const slump = Math.floor(Math.random() + 1);
const negPos = slump == 0 ? -1 : 1 ;
adjust = negPos * Math.round(Math.random() * 50 )/100;
adjust2 = negPos * Math.round(Math.random() * 25 )/100;
let ack;
ack = [60, 64 - adjust, 67 - adjust2];


function sliderChange(note, val) {
	//document.getElementById('output').innerHTML = val; // get
	//adjust = val;
	//ack = [60, 64 - adjust];
	const adj = note == 64 ? adjust : adjust2;
	const index = note == 64 ? 1 : 2;
	ack[index] = note - adj + Number(val);
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
document.getElementById('sliderK').value = 0; // set

function visaAckord() {
	document.getElementById('visaAckord').innerHTML = [(ack[1] - ack[0]) * 100 - 386, (ack[2] - ack[0]) * 100 - 702].map(x => Math.round(x)); // set
};

async function chord() {
//	if (!ack) {
////	await ackord();
//	}

        const playSound = ack.map(note => voice.play(note));

        await Promise.all(playSound);
};

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
