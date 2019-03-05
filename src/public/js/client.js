//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var recordButton = document.getElementById('recordButton');
var stopButton = document.getElementById('stopButton');

var reconociendo = false;
var textoFinal = '';
var reconocimiento = null;
var textoIntermedio = '';

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

if (!('SpeechRecognition' in window)) {
	if (!('webkitSpeechRecognition' in window)) {
		console.log('No se logró iniciar webkitSpeechRecognition');
	} else {
		var reconocimiento = new window.webkitSpeechRecognition();
	}
} else {
	var reconocimiento = new window.SpeechRecognition();
}

function capitalizar(s) {
	return s.replace(`/\S/`, (m) => m.toUpperCase());
}

function quebrarLinea(s) {
	return s.replace(`/\n\n/g`, '<p></p>').replace(`/\n/g`, '<br>');
}

function startRecording() {
	/*
			Simple constraints object, for more advanced audio features see
			https://addpipe.com/blog/audio-constraints-getusermedia/
		*/

	var constraints = { audio: true, video: false };

	/*
	    	Disable the record button until we get a success or fail from getUserMedia()
		*/

	recordButton.disabled = true;
	stopButton.disabled = false;

	/*
	    	We're using the standard promise based getUserMedia()
	    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
		*/

	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function(stream) {
			/*
				create an audio context after getUserMedia is called
				sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
				the sampleRate defaults to the one set in your OS for your playback device

			*/
			audioContext = new AudioContext();

			//update the format
			document.getElementById('formats').innerHTML =
				'Format: 1 channel pcm @ ' + audioContext.sampleRate / 1000 + 'kHz';

			/*  assign to gumStream for later use  */
			gumStream = stream;

			/* use the stream */
			input = audioContext.createMediaStreamSource(stream);

			/*
				Create the Recorder object and configure to record mono sound (1 channel)
				Recording 2 channels  will double the file size
			*/
			rec = new Recorder(input, { numChannels: 1 });

			//start the recording process
			rec.record();
		})
		.catch(function(err) {
			//enable the record button if getUserMedia() fails
			recordButton.disabled = false;
			stopButton.disabled = true;
		});
}

function stopRecording() {
	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;

	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	link.href = url;
	originalname = filename + '.wav'; //download forces the browser to donwload the file using the  filename

	//add the new audio element to li
	li.appendChild(au);

	//add the filename to the li
	li.appendChild(document.createTextNode(filename + '.wav '));

	//upload link
	var upload = document.createElement('a');
	upload.innerHTML = 'Upload';
	upload.addEventListener('click', function(event) {
		var xhr = new window.XMLHttpRequest();
		xhr.onload = function(e) {
			if (this.readyState === 4) {
				console.log('Server returned: ', e.target.responseText);
			}
		};
		var fd = new FormData();
		fd.append('soundBlob', blob, originalname);
		xhr.open('POST', '/subir', true);
		xhr.send(fd);
	});
	li.appendChild(document.createTextNode(' ')); //add a space in between
	li.appendChild(upload); //add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li);
}

if (bowser.name == 'Chrome') {
	reconocimiento.continuous = true; // ideal para computador
	reconocimiento.interimResults = true;
	reconocimiento.lang = 'es-CO';

	recordButton.addEventListener('click', function() {
		reconocimiento.start();

		reconociendo = true;

		//startRecording();
	});

	stopButton.addEventListener('click', alFinalizarReconocimiento);

	reconocimiento.onend = alFinalizarReconocimiento();

	reconocimiento.onresult = async (evento) => {
		for (var i = evento.resultIndex; i < evento.results.length; ++i) {
			if (evento.results[i].isFinal) {
				textoFinal += event.results[i][0].transcript;
			} else {
				textoIntermedio += event.results[i][0].transcript;
			}
		}

		if (textoFinal !== '') {
			textoFinal = capitalizar(textoFinal);
			textoFinal = quebrarLinea(textoFinal);

			try {
				const response = await axios.post('/traducir', { data: textoFinal });
				console.log(response);
			} catch (e) {
				console.error(e); // 💩
			}
		} else {
			console.log('recibiendo...');
		}

		// console.log('alResultadoDelReconocimiento')
	};

	reconocimiento.onerror = (evento) => {
		if (evento.error === 'no-speech') {
			console.err(event.err);
		}
		if (evento.error === 'audio-capture') {
			console.err(event.err);
		}
	};

	function alFinalizarReconocimiento() {
		reconociendo = false;

		reconocimiento.stop();

		//stopRecording();
	}
} else if (bowser.name == 'Safari') {
	//add events to those 2 buttons
	recordButton.addEventListener('click', startRecording);
	stopButton.addEventListener('click', stopRecording);
}
