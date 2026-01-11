// App module - Main controller and game loop

const App = (function() {
    // State
    let currentNote = null;
    let noteStartTime = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let isWaitingForInput = false;
    let isPaused = false;
    let pausedElapsed = 0;  // Time elapsed when paused
    let sessionMisses = {};  // Track misses per note this session
    let sessionTimes = {};   // Track response times per note { note: [time1, time2, ...] }
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
    const namingStyleSelect = document.getElementById('naming-style-select');
    const clefSelect = document.getElementById('clef-select');
    const rangeMinSelect = document.getElementById('range-min');
    const rangeMaxSelect = document.getElementById('range-max');
    const showNoteNamesCheckbox = document.getElementById('show-note-names');
    const keyboardLabelsToggle = document.getElementById('keyboard-labels-toggle');
    const accidentalsToggle = document.getElementById('accidentals-toggle');
    const timerToggle = document.getElementById('timer-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const themeBtn = document.getElementById('theme-btn');
    const newSessionBtn = document.getElementById('new-session-btn');

    // Apply theme
    function applyTheme(isDark) {
        document.body.classList.toggle('light-theme', !isDark);
        // Update theme button icon (monochrome symbols)
        if (themeBtn) {
            themeBtn.textContent = isDark ? '☾' : '☀';
        }
    }

    // Populate naming style selector
    function populateNamingStyleSelector() {
        const systems = Notes.getNamingSystems();
        namingStyleSelect.innerHTML = '';
        for (const { value, label } of systems) {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = label;
            namingStyleSelect.appendChild(opt);
        }
    }

    function init() {
        populateNamingStyleSelector();
        loadSettings();
        populateRangeSelectors();
        setupEventListeners();

        // Load persisted session counts
        const session = Storage.getCurrentSession();
        correctCount = session.correct;
        wrongCount = session.wrong;
        sessionMisses = session.misses || {};
        sessionTimes = session.times || {};

        // Initialize keyboard with note callback and sound callback
        Keyboard.init(handleNotePressed, playSound);

        // Apply initial keyboard labels visibility
        const settings = Storage.getSettings();
        Keyboard.setLabelsVisible(settings.showKeyboardLabels);

        // Initialize staff
        Staff.init();

        // Setup start button
        const startBtn = document.getElementById('start-btn');
        startBtn.addEventListener('click', startGame);

        // Setup pause/continue toggle button
        document.getElementById('pause-toggle-btn').addEventListener('click', togglePause);

        // Setup clear stats button
        document.getElementById('clear-stats-btn').addEventListener('click', clearStatistics);

        // Setup mobile settings modal
        setupSettingsModal();

        // Auto-pause when window loses focus
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && isWaitingForInput && !isPaused) {
                togglePause();
            }
        });

        // Update displays (but don't start game yet)
        updateScoreDisplay();
        updateMissesPanel();
        updateSlowestPanel();
    }

    function startGame() {
        const overlay = document.getElementById('start-overlay');
        overlay.classList.add('hidden');
        const toggleBtn = document.getElementById('pause-toggle-btn');
        toggleBtn.classList.remove('hidden', 'paused');
        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2z"/></svg>';
        isPaused = false;
        pausedElapsed = 0;
        nextNote();
    }

    function togglePause() {
        const toggleBtn = document.getElementById('pause-toggle-btn');

        if (isPaused) {
            // Continue
            isPaused = false;
            noteStartTime = Date.now() - pausedElapsed;
            isWaitingForInput = true;
            startTimer();
            toggleBtn.classList.remove('paused');
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2z"/></svg>';
        } else {
            // Pause
            isPaused = true;
            isWaitingForInput = false;
            pausedElapsed = Date.now() - noteStartTime;
            stopTimer();
            toggleBtn.classList.add('paused');
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/></svg>';
        }
    }

    function loadSettings() {
        const settings = Storage.getSettings();
        namingStyleSelect.value = settings.namingStyle || 'abc';
        clefSelect.value = settings.clef;
        showNoteNamesCheckbox.checked = settings.showNoteNames;
        keyboardLabelsToggle.checked = settings.showKeyboardLabels;
        accidentalsToggle.checked = settings.includeAccidentals;
        timerToggle.checked = settings.showTimer !== false;
        soundToggle.checked = settings.soundEnabled;

        // Apply naming style
        Notes.setNamingSystem(settings.namingStyle || 'abc');

        // Apply initial timer visibility
        updateTimerVisibility(settings.showTimer !== false);

        // Apply initial theme
        const isDark = settings.darkMode !== false;
        applyTheme(isDark);
    }

    function updateTimerVisibility(visible) {
        const timerEl = document.getElementById('timer');
        timerEl.style.visibility = visible ? 'visible' : 'hidden';
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
        namingStyleSelect.addEventListener('change', onSettingsChange);
        clefSelect.addEventListener('change', onSettingsChange);
        rangeMinSelect.addEventListener('change', onSettingsChange);
        rangeMaxSelect.addEventListener('change', onSettingsChange);
        showNoteNamesCheckbox.addEventListener('change', onSettingsChange);
        keyboardLabelsToggle.addEventListener('change', onSettingsChange);
        accidentalsToggle.addEventListener('change', onSettingsChange);
        timerToggle.addEventListener('change', onSettingsChange);
        soundToggle.addEventListener('change', onSettingsChange);

        // Theme button click handler
        themeBtn.addEventListener('click', toggleTheme);

        newSessionBtn.addEventListener('click', startNewSession);
    }

    function toggleTheme() {
        const settings = Storage.getSettings();
        const newDarkMode = !(settings.darkMode !== false);
        settings.darkMode = newDarkMode;
        Storage.saveSettings(settings);
        applyTheme(newDarkMode);
    }

    function onSettingsChange() {
        // Preserve current darkMode setting
        const currentSettings = Storage.getSettings();
        const settings = {
            namingStyle: namingStyleSelect.value,
            clef: clefSelect.value,
            rangeMin: rangeMinSelect.value,
            rangeMax: rangeMaxSelect.value,
            showNoteNames: showNoteNamesCheckbox.checked,
            showKeyboardLabels: keyboardLabelsToggle.checked,
            includeAccidentals: accidentalsToggle.checked,
            showTimer: timerToggle.checked,
            soundEnabled: soundToggle.checked,
            darkMode: currentSettings.darkMode
        };

        Storage.saveSettings(settings);

        // Apply naming style
        Notes.setNamingSystem(settings.namingStyle);

        updateAvailableNotes();

        // Show/hide note label based on setting
        if (currentNote && settings.showNoteNames) {
            Staff.showNoteLabel(currentNote.fullName);
        } else {
            Staff.hideNoteLabel();
        }

        // Update keyboard labels
        Keyboard.setLabelsVisible(settings.showKeyboardLabels);
        Keyboard.updateNamingStyle();

        // Update timer visibility
        updateTimerVisibility(settings.showTimer);

        // Update side panels with new naming style
        updateMissesPanel();
        updateSlowestPanel();
    }

    function updateAvailableNotes() {
        const settings = Storage.getSettings();
        availableNotes = Notes.getNotesInRange(
            settings.rangeMin,
            settings.rangeMax,
            settings.includeAccidentals
        );
    }

    // Smart repetition: weighted note selection based on mistakes, response time, and distance
    // Miss weights decay by 0.7x on each correct answer, so struggled notes gradually normalize
    function getSmartNote(candidates, previousNote) {
        const weights = [];
        const BASE_WEIGHT = 1;
        const MISS_WEIGHT = 3;      // Each miss adds this much weight (decays on correct)
        const TIME_WEIGHT = 0.002;  // Per millisecond above 1 second
        const DISTANCE_PENALTY = 0.7;  // Multiplier for adjacent notes (closer = lower)

        for (const note of candidates) {
            let weight = BASE_WEIGHT;

            // Add weight for mistakes in this session
            const misses = sessionMisses[note.fullName] || 0;
            weight += misses * MISS_WEIGHT;

            // Add weight for slow response times
            const times = sessionTimes[note.fullName];
            if (times && times.length > 0) {
                const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
                // Notes taking more than 1 second get extra weight
                if (avgTime > 1000) {
                    weight += (avgTime - 1000) * TIME_WEIGHT;
                }
            } else {
                // Notes never answered get a slight boost (need practice)
                weight += 0.5;
            }

            // Apply distance penalty for notes close to previous note
            if (previousNote) {
                const distance = Math.abs(note.midiNumber - previousNote.midiNumber);
                // Distance 0-2 semitones: heavy penalty
                // Distance 3-4 semitones: medium penalty
                // Distance 5+ semitones: no penalty
                if (distance <= 2) {
                    weight *= DISTANCE_PENALTY * DISTANCE_PENALTY;  // ~0.49x
                } else if (distance <= 4) {
                    weight *= DISTANCE_PENALTY;  // 0.7x
                }
                // 5+ semitones: no penalty (full weight)
            }

            weights.push({ note, weight });
        }

        // Weighted random selection
        const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
        let random = Math.random() * totalWeight;

        for (const { note, weight } of weights) {
            random -= weight;
            if (random <= 0) {
                return note;
            }
        }

        // Fallback to last note
        return weights[weights.length - 1].note;
    }

    function startNewSession() {
        correctCount = 0;
        wrongCount = 0;
        // Note: sessionMisses and sessionTimes are preserved across sessions
        // Use "Clear Stats" button to reset them
        Storage.resetStreak();
        Storage.resetCurrentSession();
        updateScoreDisplay();

        // Reset pause state
        isPaused = false;
        pausedElapsed = 0;

        // Show start overlay, hide pause button, stop timer
        stopTimer();
        const timerEl = document.getElementById('timer');
        timerEl.textContent = '0.0s';
        document.getElementById('start-overlay').classList.remove('hidden');
        document.getElementById('pause-toggle-btn').classList.add('hidden');
        isWaitingForInput = false;
    }

    function clearStatistics() {
        sessionMisses = {};
        sessionTimes = {};
        Storage.clearStatistics();
        updateMissesPanel();
        updateSlowestPanel();
    }

    // Mobile settings modal
    function setupSettingsModal() {
        const settingsBtn = document.getElementById('settings-btn');
        const modal = document.getElementById('settings-modal');
        const closeBtn = document.getElementById('close-settings-btn');
        const mobileContainer = document.getElementById('mobile-settings-container');
        const settingsPanel = document.getElementById('settings-panel');

        if (!settingsBtn || !modal || !closeBtn) return;

        // Open modal
        settingsBtn.addEventListener('click', () => {
            // Clone settings into modal
            mobileContainer.innerHTML = '';
            const settingGroups = settingsPanel.querySelectorAll('.setting-group');
            settingGroups.forEach(group => {
                const clone = group.cloneNode(true);
                mobileContainer.appendChild(clone);
            });

            // Re-attach event listeners to cloned elements
            attachModalSettingsListeners();

            modal.classList.remove('hidden');
        });

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Attach event listeners to modal settings
    function attachModalSettingsListeners() {
        const mobileContainer = document.getElementById('mobile-settings-container');

        // Naming style
        const modalNamingStyle = mobileContainer.querySelector('#naming-style-select');
        if (modalNamingStyle) {
            modalNamingStyle.id = 'modal-naming-style-select';
            modalNamingStyle.value = namingStyleSelect.value;
            modalNamingStyle.addEventListener('change', () => {
                namingStyleSelect.value = modalNamingStyle.value;
                onSettingsChange();
            });
        }

        // Clef
        const modalClef = mobileContainer.querySelector('#clef-select');
        if (modalClef) {
            modalClef.id = 'modal-clef-select';
            modalClef.value = clefSelect.value;
            modalClef.addEventListener('change', () => {
                clefSelect.value = modalClef.value;
                onSettingsChange();
            });
        }

        // Range min
        const modalRangeMin = mobileContainer.querySelector('#range-min');
        if (modalRangeMin) {
            modalRangeMin.id = 'modal-range-min';
            modalRangeMin.value = rangeMinSelect.value;
            modalRangeMin.addEventListener('change', () => {
                rangeMinSelect.value = modalRangeMin.value;
                onSettingsChange();
            });
        }

        // Range max
        const modalRangeMax = mobileContainer.querySelector('#range-max');
        if (modalRangeMax) {
            modalRangeMax.id = 'modal-range-max';
            modalRangeMax.value = rangeMaxSelect.value;
            modalRangeMax.addEventListener('change', () => {
                rangeMaxSelect.value = modalRangeMax.value;
                onSettingsChange();
            });
        }

        // Show note names
        const modalShowNotes = mobileContainer.querySelector('#show-note-names');
        if (modalShowNotes) {
            modalShowNotes.id = 'modal-show-note-names';
            modalShowNotes.checked = showNoteNamesCheckbox.checked;
            modalShowNotes.addEventListener('change', () => {
                showNoteNamesCheckbox.checked = modalShowNotes.checked;
                onSettingsChange();
            });
        }

        // Keyboard labels
        const modalKeyboardLabels = mobileContainer.querySelector('#keyboard-labels-toggle');
        if (modalKeyboardLabels) {
            modalKeyboardLabels.id = 'modal-keyboard-labels-toggle';
            modalKeyboardLabels.checked = keyboardLabelsToggle.checked;
            modalKeyboardLabels.addEventListener('change', () => {
                keyboardLabelsToggle.checked = modalKeyboardLabels.checked;
                onSettingsChange();
            });
        }

        // Accidentals
        const modalAccidentals = mobileContainer.querySelector('#accidentals-toggle');
        if (modalAccidentals) {
            modalAccidentals.id = 'modal-accidentals-toggle';
            modalAccidentals.checked = accidentalsToggle.checked;
            modalAccidentals.addEventListener('change', () => {
                accidentalsToggle.checked = modalAccidentals.checked;
                onSettingsChange();
            });
        }

        // Timer
        const modalTimer = mobileContainer.querySelector('#timer-toggle');
        if (modalTimer) {
            modalTimer.id = 'modal-timer-toggle';
            modalTimer.checked = timerToggle.checked;
            modalTimer.addEventListener('change', () => {
                timerToggle.checked = modalTimer.checked;
                onSettingsChange();
            });
        }

        // Sound
        const modalSound = mobileContainer.querySelector('#sound-toggle');
        if (modalSound) {
            modalSound.id = 'modal-sound-toggle';
            modalSound.checked = soundToggle.checked;
            modalSound.addEventListener('change', () => {
                soundToggle.checked = modalSound.checked;
                onSettingsChange();
            });
        }
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

        // Get random note using smart repetition (always enabled)
        currentNote = getSmartNote(candidates, previousNote);
        const settings = Storage.getSettings();

        // Determine clef
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

            // Track response time for this note
            if (!sessionTimes[currentNote.fullName]) {
                sessionTimes[currentNote.fullName] = [];
            }
            sessionTimes[currentNote.fullName].push(responseTime);

            // Decay miss weight on correct answer (smart learning improvement)
            // Multiplying by 0.7 means gradual reduction - need multiple corrects to "clear" mistakes
            if (sessionMisses[currentNote.fullName]) {
                sessionMisses[currentNote.fullName] *= 0.7;
                // Remove from tracking if negligible (< 0.1)
                if (sessionMisses[currentNote.fullName] < 0.1) {
                    delete sessionMisses[currentNote.fullName];
                }
            }

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
        Storage.updateCurrentSession(correctCount, wrongCount, sessionMisses, sessionTimes);
        updateScoreDisplay();
        updateMissesPanel();
        updateSlowestPanel();
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
            const localName = Notes.getLocalizedName(note);
            html += `<div class="miss-item"><span>${note} (${localName})</span><span class="miss-count">${count}</span></div>`;
        }
        panel.innerHTML = html;
    }

    function updateSlowestPanel() {
        const panel = document.getElementById('slowest-panel');
        if (!panel) return;

        // Calculate average time per note
        const avgTimes = [];
        for (const [note, times] of Object.entries(sessionTimes)) {
            if (times.length > 0) {
                const avg = times.reduce((a, b) => a + b, 0) / times.length;
                avgTimes.push({ note, avg, count: times.length });
            }
        }

        // Sort by average time descending (slowest first)
        avgTimes.sort((a, b) => b.avg - a.avg);
        const top10 = avgTimes.slice(0, 10);

        if (top10.length === 0) {
            panel.innerHTML = '<div class="panel-title">Slowest</div><div class="panel-empty">None yet</div>';
            return;
        }

        let html = '<div class="panel-title">Slowest</div>';
        for (const { note, avg } of top10) {
            const localName = Notes.getLocalizedName(note);
            const timeStr = (avg / 1000).toFixed(1) + 's';
            html += `<div class="miss-item"><span>${note} (${localName})</span><span class="time-badge">${timeStr}</span></div>`;
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
