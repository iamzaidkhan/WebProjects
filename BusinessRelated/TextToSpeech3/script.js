let currentSpeech = null;
let audioContext;
let mediaStreamDestination;
let mediaRecorder;
let audioChunks = [];

// Function to populate the voice dropdown
function populateVoiceList() {
    if (typeof speechSynthesis === 'undefined') {
        return;
    }

    const maleVoices = document.getElementById('male-voices');
    const femaleVoices = document.getElementById('female-voices');
    const otherVoices = document.getElementById('other-voices');
    const voices = speechSynthesis.getVoices();

    // Clear existing options
    maleVoices.innerHTML = '';
    femaleVoices.innerHTML = '';
    otherVoices.innerHTML = '';

    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;

        // Attempt to categorize voices by gender if possible
        if (voice.name.toLowerCase().includes("male") || voice.name.toLowerCase().includes("man")) {
            maleVoices.appendChild(option);
        } else if (voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman")) {
            femaleVoices.appendChild(option);
        } else {
            otherVoices.appendChild(option);
        }
    });
}

// Populate voices when they are loaded
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

document.getElementById('speak-button').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    if (text.trim() !== '') {
        if (currentSpeech) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
        }

        currentSpeech = new SpeechSynthesisUtterance(text);
        const selectedVoiceIndex = document.getElementById('voice-select').value;
        const voices = speechSynthesis.getVoices();

        if (selectedVoiceIndex) {
            currentSpeech.voice = voices[selectedVoiceIndex];
        }

        currentSpeech.lang = 'hi-IN'; // Ensure the language is set to Hindi

        // Setup audio context and media recorder
        audioContext = new AudioContext();
        mediaStreamDestination = audioContext.createMediaStreamDestination();
        const source = audioContext.createMediaStreamSource(mediaStreamDestination.stream);
        mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const a = document.createElement('a');
            a.href = audioUrl;
            a.download = 'speech.mp3';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(audioUrl);
            document.body.removeChild(a);
        };

        mediaRecorder.start();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[selectedVoiceIndex];
        utterance.onend = () => {
            mediaRecorder.stop();
        };

        const synth = window.speechSynthesis;
        const utteranceSource = audioContext.createMediaStreamSource(mediaStreamDestination.stream);
        utteranceSource.connect(audioContext.destination);

        synth.speak(utterance);
    } else {
        alert('कृपया बोलने के लिए कुछ टेक्स्ट दर्ज करें।');
    }
});

document.getElementById('pause-button').addEventListener('click', function() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        window.speechSynthesis.pause();
        mediaRecorder.pause();
    }
});

document.getElementById('resume-button').addEventListener('click', function() {
    if (speechSynthesis.speaking && speechSynthesis.paused) {
        window.speechSynthesis.resume();
        mediaRecorder.resume();
    }
});

document.getElementById('stop-button').addEventListener('click', function() {
    if (speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        mediaRecorder.stop();
    }
});

// Handle errors
window.addEventListener('error', function(event) {
    console.error('Error occurred:', event.error);
});

// Initial population of the voice list
populateVoiceList();
