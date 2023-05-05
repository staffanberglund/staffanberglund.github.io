const { pitchClass, octave } = Tonal.Note;

const { midiToNoteName,  } = Tonal.Midi;

const { Scale, Chord, Note, Range, Key, Interval, Midi } = Tonal;

const { round, floor, random } = Math;

/*------------------------------*/
/* 	Spela upp ljud		*/
/*------------------------------*/

let voice;
const audioContext = new AudioContext();

let dropdownList = document.getElementById('select_box');
let sound = 'acoustic_grand_piano';//'voice_oohs'

//Promise.all([
//	Soundfont.instrument(audioContext, sound).then(function (x) {
//		voice = x;
//	}),
//]);

async function loadInstruments() {
    voice = await Soundfont.instrument(audioContext, sound);
}

loadInstruments();

let adjust;
let adjust2;

//const range = document.querySelector('.range');
//range.addEventListener('input', e => range.style.setProperty('--slider-percent', e.target.value));
//
//document.getElementById('slider').value = 1;

const slump = floor(random() + 1);
const negPos = slump == 0 ? -1 : 1 ;
adjust = negPos * round(random() * 50 )/100;
adjust2 = negPos * round(random() * 25 )/100;
let ack;
ack = [60, 64 - adjust, 67 - adjust2];

function sliderChange(index, val) {
	const adj = index == 1 ? adjust : adjust2;
	const ton = index == 1 ? 64 : 67 ;
	ack[index] = ton - adj + Number(val);
	console.log(ack[index]);
	visaAckord();
};

function intPlus(index) {
	const par = index == 1 ? 'slider' : 'sliderK';
	let t = Number(document.getElementById(par).value);
	let s = t + 0.01;
	document.getElementById(par).value = s;
	ack[index] = round((ack[index] + 0.01 ) * 100 ) / 100;
	visaAckord();
};

function intMinus(index) {
	const par = index == 1 ? 'slider' : 'sliderK';
	let t = Number(document.getElementById(par).value);
	let s = t - 0.01;
	document.getElementById(par).value = s;
	ack[index] = round((ack[index] - 0.01 ) * 100 ) / 100;
	visaAckord();
};

document.getElementById('slider' ).value = 0;
document.getElementById('sliderK').value = 0;

let ren;
let lik;

function visaAckord() {
	ren = [(ack[1] - ack[0]) * 100 - 386, (ack[2] - ack[0]) * 100 - 702].map(x => round(x));
	lik = [(ack[1] - ack[0]) * 100 - 400, (ack[2] - ack[0]) * 100 - 700].map(x => round(x));

	document.getElementById('renTers' ).innerHTML = ren[0];
	document.getElementById('renKvint').innerHTML = ren[1];
	document.getElementById('likTers' ).innerHTML = lik[0];
	document.getElementById('likKvint').innerHTML = lik[1];
};

visaAckord();

function togglePar() {
  let x = document.getElementById("visaAckord");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};

function toggleTemp() {
  let x = document.getElementById("ren");
  let y = document.getElementById("lik");
  if (x.style.display === "none") {
    x.style.display = "table-row";
    y.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "table-row";
  }
};

async function chord() {
//	if (!ack) {
////	await ackord();
//	}

        const playSound = ack.map(note => voice.play(note));

        await Promise.all(playSound);
};

function väljInstrument() {  
let instrumentLista = document.getElementById("instrumentLista");  
	sound = instrumentLista.options[instrumentLista.selectedIndex].text  ;
	loadInstruments();
}  

/*
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
}*/
