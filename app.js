// App module - Main controller and game loop

const App = (function() {
    // State
    let currentNote = null;
    let noteStartTime = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let isWaitingForInput = false;
    let availableNotes = [];
    let audioContext = null;

    // DOM elements
    const correctCountEl = document.getElementById('correct-count');
    const wrongCountEl = document.getElementById('wrong-count');
    const accuracyEl = document.getElementById('accuracy');
    const streakEl = document.getElementById('streak');
    const feedbackEl = document.getElementById('feedback');
    const noteLabelEl = document.getElementById('note-label');

    // Settings elements
    const clefSelect = document.getElementById('clef-select');
    const rangeMinSelect = document.getElementById('range-min');
    const rangeMaxSelect = document.getElementById('range-max');
    const showNoteNamesCheckbox = document.getElementById('show-note-names');
    const accidentalsToggle = document.getElementById('accidentals-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const newSessionBtn = document.getElementById('new-session-btn');

    function init() {
        loadSettings();
        populateRangeSelectors();
        setupEventListeners();

        // Initialize keyboard with note callback
        Keyboard.init(handleNotePressed);

        // Initialize staff
        Staff.init();

        // Start first note
        nextNote();

        // Update streak display
        updateScoreDisplay();
    }

    function loadSettings() {
        const settings = Storage.getSettings();
        clefSelect.value = settings.clef;
        showNoteNamesCheckbox.checked = settings.showNoteNames;
        accidentalsToggle.checked = settings.includeAccidentals;
        soundToggle.checked = settings.soundEnabled;
    }

    function populateRangeSelectors() {
        const options = Notes.getAllNoteOptions();
        const settings = Storage.getSettings();

        rangeMinSelect.innerHTML = '';
        rangeMaxSelect.innerHTML = '';

        options.forEach(note => {
            const optMin = document.createElement('option');
            optMin.value = note;
            optMin.textContent = note;
            rangeMinSelect.appendChild(optMin);

            const optMax = document.createElement('option');
            optMax.value = note;
            optMax.textContent = note;
            rangeMaxSelect.appendChild(optMax);
        });

        rangeMinSelect.value = settings.rangeMin;
        rangeMaxSelect.value = settings.rangeMax;
    }

    function setupEventListeners() {
        clefSelect.addEventListener('change', onSettingsChange);
        rangeMinSelect.addEventListener('change', onSettingsChange);
        rangeMaxSelect.addEventListener('change', onSettingsChange);
        showNoteNamesCheckbox.addEventListener('change', onSettingsChange);
        accidentalsToggle.addEventListener('change', onSettingsChange);
        soundToggle.addEventListener('change', onSettingsChange);

        newSessionBtn.addEventListener('click', startNewSession);
    }

    function onSettingsChange() {
        const settings = {
            clef: clefSelect.value,
            rangeMin: rangeMinSelect.value,
            rangeMax: rangeMaxSelect.value,
            showNoteNames: showNoteNamesCheckbox.checked,
            includeAccidentals: accidentalsToggle.checked,
            soundEnabled: soundToggle.checked
        };

        Storage.saveSettings(settings);
        updateAvailableNotes();

        // Show/hide note label based on setting
        if (currentNote && settings.showNoteNames) {
            Staff.showNoteLabel(currentNote.fullName);
        } else {
            Staff.hideNoteLabel();
        }
    }

    function updateAvailableNotes() {
        const settings = Storage.getSettings();
        availableNotes = Notes.getNotesInRange(
            settings.rangeMin,
            settings.rangeMax,
            settings.includeAccidentals
        );
    }

    function startNewSession() {
        correctCount = 0;
        wrongCount = 0;
        Storage.resetStreak();
        updateScoreDisplay();
        nextNote();
    }

    function nextNote() {
        updateAvailableNotes();

        if (availableNotes.length === 0) {
            console.warn('No notes in selected range');
            return;
        }

        // Get random note (weighted by mistakes)
        const missedNotes = Storage.getMissedNotes();
        currentNote = Notes.getRandomNote(availableNotes, missedNotes);

        // Determine clef
        const settings = Storage.getSettings();
        let clef = settings.clef;
        if (clef === 'both') {
            clef = Notes.getClefForNote(currentNote);
        }

        // Render on staff
        Staff.renderNote(currentNote, clef);

        // Show/hide note label
        if (settings.showNoteNames) {
            Staff.showNoteLabel(currentNote.fullName);
        } else {
            Staff.hideNoteLabel();
        }

        // Ready for input
        noteStartTime = Date.now();
        isWaitingForInput = true;

        // Clear keyboard highlights
        Keyboard.clearHighlights();
    }

    function handleNotePressed(noteName) {
        if (!isWaitingForInput || !currentNote) return;

        isWaitingForInput = false;
        const responseTime = Date.now() - noteStartTime;

        // Parse pressed note
        const pressedNote = Notes.parseNote(noteName);
        if (!pressedNote) return;

        const pressedMidi = Notes.getMidiNumber(pressedNote.name, pressedNote.octave);
        const correctMidi = currentNote.midiNumber;

        const isCorrect = pressedMidi === correctMidi;

        // Record attempt
        Storage.recordAttempt(currentNote.fullName, isCorrect, responseTime);

        if (isCorrect) {
            correctCount++;
            Keyboard.showCorrect(noteName);
            showFeedback('correct');
            playSound(correctMidi);

            // Auto-advance after short delay
            setTimeout(() => {
                hideFeedback();
                nextNote();
            }, 400);
        } else {
            wrongCount++;
            Keyboard.showWrong(noteName);
            Keyboard.showCorrect(currentNote.fullName);
            showFeedback('wrong');

            // Show correct answer, then advance
            setTimeout(() => {
                hideFeedback();
                nextNote();
            }, 800);
        }

        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        const stats = Storage.getStats();
        correctCountEl.textContent = correctCount;
        wrongCountEl.textContent = wrongCount;

        const total = correctCount + wrongCount;
        const accuracy = total > 0 ? (correctCount / total * 100).toFixed(0) : '--';
        accuracyEl.textContent = accuracy + '%';

        streakEl.textContent = stats.currentStreak;
    }

    function showFeedback(type) {
        feedbackEl.textContent = type === 'correct' ? '\u2713' : '\u2717';
        feedbackEl.className = type;
    }

    function hideFeedback() {
        feedbackEl.className = 'hidden';
    }

    // Initialize audio context on first user interaction
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    // Listen for any click to init audio early
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    // Simple sound using Web Audio API
    async function playSound(midiNote) {
        if (!soundToggle.checked) return;

        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Resume if suspended (browser autoplay policy)
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Convert MIDI to frequency
            const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not available:', e);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init,
        startNewSession
    };
})();
