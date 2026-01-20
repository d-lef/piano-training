// Keyboard module - Piano keyboard UI and input handling

const Keyboard = (function() {
    const containerElement = document.getElementById('keyboard');

    // Keyboard range (3 octaves: C3 to B5)
    const START_OCTAVE = 3;
    const NUM_OCTAVES = 3;
    const START_MIDI = 48; // C3
    const END_MIDI = 83;   // B5

    // MIDI state
    let midiAccess = null;
    let midiInputs = [];

    // MIDI note names for converting MIDI number to note name
    const MIDI_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // PC keyboard mapping (QWERTY + number row only)
    // Current octave offset (0 = starting at C3)
    let octaveOffset = 0;

    // White keys: QWERTY row (piano-style layout)
    // Q W E R T Y U = C D E F G A B (first octave)
    // I O P [ ] = C D E F G (second octave)
    const WHITE_KEY_MAP = {
        'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5, 'u': 6,  // C D E F G A B
        'i': 7, 'o': 8, 'p': 9, '[': 10, ']': 11,  // Next octave C D E F G
    };

    // Black keys: Number row (above QWERTY gaps)
    // 2 3 = C# D#, 5 6 7 = F# G# A#, 9 0 - = C# D# F#
    const BLACK_KEY_MAP = {
        '2': 0, '3': 1, '5': 2, '6': 3, '7': 4,  // C# D# F# G# A#
        '9': 5, '0': 6, '-': 7,  // Next octave C# D# F#
    };

    // Callbacks
    let onNotePressed = null;
    let onPlaySound = null;

    // All key elements
    const keyElements = {};

    // White key pattern per octave
    const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    // Black key positions (relative to white key index)
    const BLACK_KEY_OFFSETS = [
        { note: 'C#', afterWhite: 0 },
        { note: 'D#', afterWhite: 1 },
        { note: 'F#', afterWhite: 3 },
        { note: 'G#', afterWhite: 4 },
        { note: 'A#', afterWhite: 5 }
    ];

    function init(noteCallback, soundCallback) {
        onNotePressed = noteCallback;
        onPlaySound = soundCallback;
        render();
        setupKeyboardListeners();
        setupMIDI();

        // Re-render on resize for responsive layout
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(render, 150);
        });
        // Also handle orientation change (iOS may not fire resize reliably)
        window.addEventListener('orientationchange', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(render, 350);
        });
    }

    // MIDI Setup
    function setupMIDI() {
        if (!navigator.requestMIDIAccess) {
            console.log('Web MIDI API not supported in this browser');
            updateMIDIStatus(false, 'Not supported');
            return;
        }

        navigator.requestMIDIAccess()
            .then(onMIDISuccess)
            .catch(onMIDIFailure);
    }

    function onMIDISuccess(access) {
        midiAccess = access;
        connectMIDIInputs();

        // Listen for device connect/disconnect
        midiAccess.onstatechange = (e) => {
            console.log('MIDI state change:', e.port.name, e.port.state);
            connectMIDIInputs();
        };
    }

    function onMIDIFailure(error) {
        console.log('MIDI access denied:', error);
        updateMIDIStatus(false, 'Access denied');
    }

    function connectMIDIInputs() {
        midiInputs = [];
        const inputs = midiAccess.inputs.values();

        for (let input of inputs) {
            if (input.state === 'connected') {
                input.onmidimessage = handleMIDIMessage;
                midiInputs.push(input.name);
                console.log('MIDI input connected:', input.name);
            }
        }

        if (midiInputs.length > 0) {
            updateMIDIStatus(true, midiInputs[0]);
        } else {
            updateMIDIStatus(false, 'No device');
        }
    }

    function handleMIDIMessage(event) {
        const [status, midiNote, velocity] = event.data;

        // Note On message (144-159) with velocity > 0
        const isNoteOn = (status >= 144 && status <= 159) && velocity > 0;

        if (isNoteOn) {
            // Check if note is within our keyboard range
            if (midiNote >= START_MIDI && midiNote <= END_MIDI) {
                const noteName = midiToNoteName(midiNote);
                if (noteName) {
                    handleKeyPress(noteName);
                }
            } else {
                // Note outside range - still play sound but don't register as answer
                if (onPlaySound) {
                    onPlaySound(midiNote);
                }
            }
        }
    }

    function midiToNoteName(midiNumber) {
        const octave = Math.floor(midiNumber / 12) - 1;
        const noteIndex = midiNumber % 12;
        const noteName = MIDI_NOTE_NAMES[noteIndex];
        return `${noteName}${octave}`;
    }

    function updateMIDIStatus(connected, deviceName) {
        const indicator = document.getElementById('midi-status');
        if (indicator) {
            const dot = indicator.querySelector('.midi-dot');
            const text = indicator.querySelector('.midi-text');

            if (connected) {
                dot.classList.add('connected');
                dot.classList.remove('disconnected');
                text.textContent = `MIDI: ${deviceName}`;
                indicator.title = `Connected to ${deviceName}`;
            } else {
                dot.classList.remove('connected');
                dot.classList.add('disconnected');
                text.textContent = `MIDI: ${deviceName}`;
                indicator.title = deviceName === 'Not supported'
                    ? 'Web MIDI not supported in this browser (try Chrome or Edge)'
                    : 'No MIDI device connected';
            }
        }
    }

    function render() {
        containerElement.innerHTML = '';

        // Responsive key width based on viewport
        let whiteKeyWidth = 50;
        const totalWhiteKeysNeeded = NUM_OCTAVES * 7; // 21 keys for 3 octaves

        // Mobile landscape: fit all keys to viewport
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobileLandscape = isLandscape && window.innerHeight <= 700;

        if (isMobileLandscape) {
            // Calculate width to fit all keys - must match CSS calc exactly (no rounding)
            whiteKeyWidth = (window.innerWidth - 20) / totalWhiteKeysNeeded;
        } else if (window.innerWidth <= 400) {
            whiteKeyWidth = 28;
        } else if (window.innerWidth <= 600) {
            whiteKeyWidth = 32;
        } else if (window.innerWidth <= 800) {
            whiteKeyWidth = 40;
        }

        let totalWhiteKeys = 0;

        // Create white keys first
        for (let oct = 0; oct < NUM_OCTAVES; oct++) {
            const octave = START_OCTAVE + oct;

            for (let i = 0; i < WHITE_NOTES.length; i++) {
                const noteName = WHITE_NOTES[i];
                const fullName = `${noteName}${octave}`;

                const key = document.createElement('div');
                key.className = 'white-key';
                key.dataset.note = fullName;
                key.dataset.midi = Notes.getMidiNumber(noteName, octave);

                // Add label (Latin + localized name if different)
                const label = document.createElement('span');
                label.className = 'key-label';
                const localName = Notes.getLocalizedName(fullName);
                // Don't show duplicate if localized name matches base note
                if (localName === noteName) {
                    label.innerHTML = fullName;
                } else {
                    label.innerHTML = `${fullName}<br>${localName}`;
                }
                key.appendChild(label);

                key.addEventListener('click', () => handleKeyPress(fullName));
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    handleKeyPress(fullName);
                }, { passive: false });

                containerElement.appendChild(key);
                keyElements[fullName] = key;
                totalWhiteKeys++;
            }
        }

        // Create black keys (positioned absolutely)
        let whiteKeyIndex = 0;

        for (let oct = 0; oct < NUM_OCTAVES; oct++) {
            const octave = START_OCTAVE + oct;

            for (const blackKey of BLACK_KEY_OFFSETS) {
                const fullName = `${blackKey.note}${octave}`;
                const key = document.createElement('div');
                key.className = 'black-key';
                key.dataset.note = fullName;
                key.dataset.midi = Notes.getMidiNumber(blackKey.note, octave);

                // Position: after the corresponding white key
                const whiteIndex = whiteKeyIndex + blackKey.afterWhite;
                // Black key width is roughly 60% of white key, center it between whites
                const blackKeyOffset = whiteKeyWidth * 0.3;
                const leftPos = (whiteIndex * whiteKeyWidth) + whiteKeyWidth - blackKeyOffset;
                key.style.left = `${leftPos}px`;

                key.addEventListener('click', () => handleKeyPress(fullName));
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    handleKeyPress(fullName);
                }, { passive: false });

                containerElement.appendChild(key);
                keyElements[fullName] = key;
            }

            whiteKeyIndex += WHITE_NOTES.length;
        }
    }

    function setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return; // Ignore key repeat

            const key = e.key.toLowerCase();

            // Octave shift with arrow keys
            if (e.key === 'ArrowUp' && octaveOffset < NUM_OCTAVES - 1) {
                octaveOffset++;
                return;
            }
            if (e.key === 'ArrowDown' && octaveOffset > 0) {
                octaveOffset--;
                return;
            }

            // Check white keys
            if (WHITE_KEY_MAP.hasOwnProperty(key)) {
                const noteIndex = WHITE_KEY_MAP[key];
                const octaveNum = Math.floor(noteIndex / 7);
                const noteInOctave = noteIndex % 7;
                const actualOctave = START_OCTAVE + octaveOffset + octaveNum;

                if (actualOctave <= START_OCTAVE + NUM_OCTAVES - 1) {
                    const noteName = WHITE_NOTES[noteInOctave];
                    const fullName = `${noteName}${actualOctave}`;
                    handleKeyPress(fullName);
                }
                return;
            }

            // Check black keys
            if (BLACK_KEY_MAP.hasOwnProperty(key)) {
                const blackIndex = BLACK_KEY_MAP[key];
                const octaveNum = Math.floor(blackIndex / 5);
                const blackInOctave = blackIndex % 5;
                const actualOctave = START_OCTAVE + octaveOffset + octaveNum;

                if (actualOctave <= START_OCTAVE + NUM_OCTAVES - 1) {
                    const noteName = BLACK_KEY_OFFSETS[blackInOctave].note;
                    const fullName = `${noteName}${actualOctave}`;
                    handleKeyPress(fullName);
                }
            }
        });
    }

    function handleKeyPress(noteName) {
        // Visual feedback - briefly highlight the key
        const keyEl = keyElements[noteName];
        if (keyEl) {
            keyEl.classList.add('pressed');
            setTimeout(() => keyEl.classList.remove('pressed'), 150);
        }

        // Play sound FIRST for instant feedback
        if (onPlaySound) {
            const midi = keyElements[noteName]?.dataset.midi;
            if (midi) onPlaySound(parseInt(midi));
        }
        // Then notify game logic
        if (onNotePressed) {
            onNotePressed(noteName);
        }
    }

    // Visual feedback
    function highlightKey(noteName, className, duration = 500) {
        const key = keyElements[noteName];
        if (key) {
            key.classList.add(className);
            setTimeout(() => {
                key.classList.remove(className);
            }, duration);
        }
    }

    function showCorrect(noteName) {
        highlightKey(noteName, 'correct', 600);
    }

    function showWrong(noteName) {
        highlightKey(noteName, 'wrong', 600);
    }

    function clearHighlights() {
        Object.values(keyElements).forEach(key => {
            key.classList.remove('correct', 'wrong', 'pressed');
        });
    }

    // Get the MIDI number for a displayed key
    function getMidiForNote(noteName) {
        const key = keyElements[noteName];
        return key ? parseInt(key.dataset.midi) : null;
    }

    // Show or hide key labels
    function setLabelsVisible(visible) {
        Object.values(keyElements).forEach(key => {
            const label = key.querySelector('.key-label');
            if (label) {
                label.style.display = visible ? 'block' : 'none';
            }
        });
    }

    // Update key labels with current naming style
    function updateNamingStyle() {
        Object.entries(keyElements).forEach(([noteName, key]) => {
            const label = key.querySelector('.key-label');
            if (label) {
                const localName = Notes.getLocalizedName(noteName);
                const base = noteName.replace(/\d+$/, '');
                // Don't show duplicate if localized name matches base note
                if (localName === base) {
                    label.innerHTML = noteName;
                } else {
                    label.innerHTML = `${noteName}<br>${localName}`;
                }
            }
        });
    }

    return {
        init,
        render,
        highlightKey,
        showCorrect,
        showWrong,
        setLabelsVisible,
        updateNamingStyle,
        clearHighlights,
        getMidiForNote
    };
})();
