let currentSpeech = null;

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
        window.speechSynthesis.speak(currentSpeech);
    } else {
        alert('कृपया बोलने के लिए कुछ टेक्स्ट दर्ज करें।');
    }
});

document.getElementById('pause-button').addEventListener('click', function() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        window.speechSynthesis.pause();
    }
});

document.getElementById('resume-button').addEventListener('click', function() {
    if (speechSynthesis.speaking && speechSynthesis.paused) {
        window.speechSynthesis.resume();
    }
});

document.getElementById('stop-button').addEventListener('click', function() {
    if (speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
});

document.getElementById('download-button').addEventListener('click', function() {
    if (currentSpeech) {
        const blob = new Blob([currentSpeech]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'speech.wav'; // You can change the file name and extension as needed
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        alert('कृपया पहले बोलने के लिए कुछ टेक्स्ट बोलें।');
    }
});

// Initial population of the voice list
populateVoiceList();
