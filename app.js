// App module - Main controller and game loop

const App = (function() {
    // State
    let currentNote = null;
    let noteStartTime = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let isWaitingForInput = false;
    let sessionMisses = {};  // Track misses per note this session
    let availableNotes = [];
    let audioContext = null;
    let timerInterval = null;

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
    const keyboardLabelsToggle = document.getElementById('keyboard-labels-toggle');
    const accidentalsToggle = document.getElementById('accidentals-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const newSessionBtn = document.getElementById('new-session-btn');

    // Apply theme
    function applyTheme(isDark) {
        document.body.classList.toggle('light-theme', !isDark);
    }

    function init() {
        loadSettings();
        populateRangeSelectors();
        setupEventListeners();

        // Load persisted session counts
        const session = Storage.getCurrentSession();
        correctCount = session.correct;
        wrongCount = session.wrong;
        sessionMisses = session.misses || {};

        // Initialize keyboard with note callback and sound callback
        Keyboard.init(handleNotePressed, playSound);

        // Apply initial keyboard labels visibility
        const settings = Storage.getSettings();
        Keyboard.setLabelsVisible(settings.showKeyboardLabels);

        // Apply initial theme
        applyTheme(settings.darkMode !== false);

        // Initialize staff
        Staff.init();

        // Start first note
        nextNote();

        // Update displays
        updateScoreDisplay();
        updateMissesPanel();
    }

    function loadSettings() {
        const settings = Storage.getSettings();
        clefSelect.value = settings.clef;
        showNoteNamesCheckbox.checked = settings.showNoteNames;
        keyboardLabelsToggle.checked = settings.showKeyboardLabels;
        accidentalsToggle.checked = settings.includeAccidentals;
        soundToggle.checked = settings.soundEnabled;
        themeToggle.checked = settings.darkMode !== false;
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
        keyboardLabelsToggle.addEventListener('change', onSettingsChange);
        accidentalsToggle.addEventListener('change', onSettingsChange);
        soundToggle.addEventListener('change', onSettingsChange);
        themeToggle.addEventListener('change', onSettingsChange);

        newSessionBtn.addEventListener('click', startNewSession);
    }

    function onSettingsChange() {
        const settings = {
            clef: clefSelect.value,
            rangeMin: rangeMinSelect.value,
            rangeMax: rangeMaxSelect.value,
            showNoteNames: showNoteNamesCheckbox.checked,
            showKeyboardLabels: keyboardLabelsToggle.checked,
            includeAccidentals: accidentalsToggle.checked,
            soundEnabled: soundToggle.checked,
            darkMode: themeToggle.checked
        };

        Storage.saveSettings(settings);
        updateAvailableNotes();

        // Show/hide note label based on setting
        if (currentNote && settings.showNoteNames) {
            Staff.showNoteLabel(currentNote.fullName);
        } else {
            Staff.hideNoteLabel();
        }

        // Update keyboard labels
        Keyboard.setLabelsVisible(settings.showKeyboardLabels);

        // Update theme
        applyTheme(settings.darkMode);
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
        sessionMisses = {};
        Storage.resetStreak();
        Storage.resetCurrentSession();
        updateScoreDisplay();
        updateMissesPanel();
        nextNote();
    }

    function nextNote() {
        updateAvailableNotes();

        if (availableNotes.length === 0) {
            console.warn('No notes in selected range');
            return;
        }

        // Filter out current note to avoid repeats (if more than 1 note available)
        const previousNote = currentNote;
        let candidates = availableNotes;
        if (previousNote && availableNotes.length > 1) {
            candidates = availableNotes.filter(n => n.fullName !== previousNote.fullName);
        }

        // Get random note (weighted by mistakes)
        const missedNotes = Storage.getMissedNotes();
        currentNote = Notes.getRandomNote(candidates, missedNotes);

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

        // Start timer display
        startTimer();

        // Clear keyboard highlights
        Keyboard.clearHighlights();
    }

    function startTimer() {
        const timerEl = document.getElementById('timer');
        if (timerInterval) clearInterval(timerInterval);
        timerEl.textContent = '0.0s';

        timerInterval = setInterval(() => {
            const elapsed = (Date.now() - noteStartTime) / 1000;
            timerEl.textContent = elapsed.toFixed(1) + 's';
        }, 100);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
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
            stopTimer();  // Stop timer on correct
            Keyboard.showCorrect(noteName);
            showFeedback('correct');

            // Auto-advance after short delay
            setTimeout(() => {
                hideFeedback();
                nextNote();
            }, 400);
        } else {
            wrongCount++;
            // Track miss for this note
            sessionMisses[currentNote.fullName] = (sessionMisses[currentNote.fullName] || 0) + 1;

            Keyboard.showWrong(noteName);
            showFeedback('wrong');

            // Stay on same note - allow retry
            setTimeout(() => {
                hideFeedback();
                Keyboard.clearHighlights();
                isWaitingForInput = true;  // Allow another attempt
            }, 400);
        }

        // Save session and update displays
        Storage.updateCurrentSession(correctCount, wrongCount, sessionMisses);
        updateScoreDisplay();
        updateMissesPanel();
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

    function updateMissesPanel() {
        const panel = document.getElementById('misses-panel');
        if (!panel) return;

        // Sort notes by miss count descending
        const sorted = Object.entries(sessionMisses)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);  // Top 10

        if (sorted.length === 0) {
            panel.innerHTML = '<div class="panel-title">Mistakes</div><div class="panel-empty">None yet</div>';
            return;
        }

        let html = '<div class="panel-title">Mistakes</div>';
        for (const [note, count] of sorted) {
            const russianName = Notes.getRussianName(note);
            html += `<div class="miss-item"><span>${note} (${russianName})</span><span class="miss-count">${count}</span></div>`;
        }
        panel.innerHTML = html;
    }

    function showFeedback(type) {
        feedbackEl.textContent = type === 'correct' ? '\u2713' : '\u2717';
        feedbackEl.className = type;
    }

    function hideFeedback() {
        feedbackEl.className = 'hidden';
    }

    // Initialize audio context and preload samples on first user interaction
    async function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        // Preload samples in background
        if (!samplesLoaded) {
            preloadSamples();
        }
    }

    // Listen for any click to init audio early
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    // Also start preloading when page loads (will wait for user gesture to actually decode)
    window.addEventListener('load', () => {
        // Start preloading after a short delay
        setTimeout(initAudio, 100);
    });

    // Piano samples cache and base URL
    const pianoSamples = {};
    const SAMPLE_URL = 'https://gleitz.github.io/midi-js-soundfonts/FatBoy/acoustic_grand_piano-mp3/';
    let samplesLoaded = false;

    // Preload all samples for the keyboard range
    async function preloadSamples() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Preload C3 to B5 (full keyboard range)
        const startMidi = 48; // C3
        const endMidi = 83;   // B5

        const loadPromises = [];
        for (let midi = startMidi; midi <= endMidi; midi++) {
            loadPromises.push(loadSample(midi));
        }

        await Promise.all(loadPromises);
        samplesLoaded = true;
        console.log('Piano samples loaded');
    }

    // Convert MIDI note to sample name (e.g., 60 -> "C4", 61 -> "Db4")
    function midiToSampleName(midi) {
        const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        const octave = Math.floor(midi / 12) - 1;
        const noteIndex = midi % 12;
        return noteNames[noteIndex] + octave;
    }

    // Load a piano sample
    async function loadSample(midiNote) {
        const sampleName = midiToSampleName(midiNote);
        if (pianoSamples[sampleName]) {
            return pianoSamples[sampleName];
        }

        try {
            const url = SAMPLE_URL + sampleName + '.mp3';
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            pianoSamples[sampleName] = audioBuffer;
            return audioBuffer;
        } catch (e) {
            console.log('Failed to load sample:', sampleName, e);
            return null;
        }
    }

    // Play a buffer immediately (no async)
    function playBuffer(buffer) {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = buffer;
        gainNode.gain.value = 0.7;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
    }

    // Play piano sound using samples
    function playSound(midiNote) {
        if (!soundToggle.checked) return;
        if (!audioContext) return;

        try {
            // Check cache first for instant playback
            const sampleName = midiToSampleName(midiNote);
            const cachedBuffer = pianoSamples[sampleName];

            if (cachedBuffer) {
                // Play immediately from cache
                playBuffer(cachedBuffer);
            } else {
                // Load and play (will have delay, but only for uncached notes)
                loadSample(midiNote).then(buffer => {
                    if (buffer) playBuffer(buffer);
                });
            }
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
