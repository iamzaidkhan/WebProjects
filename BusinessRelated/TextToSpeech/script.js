document.getElementById('speak-button').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    if (text.trim() !== '') {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN'; // Set the language
        window.speechSynthesis.speak(speech);
    } else {
        alert('Please enter some text to speak.');
    }
});
// en-US