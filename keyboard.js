// Keyboard module - Piano keyboard UI and input handling

const Keyboard = (function() {
    const containerElement = document.getElementById('keyboard');

    // Keyboard range (3 octaves: C3 to B5)
    const START_OCTAVE = 3;
    const NUM_OCTAVES = 3;

    // PC keyboard mapping
    // Current octave offset (0 = starting at C3)
    let octaveOffset = 0;

    // White keys: Z X C V B N M (lower row)
    const WHITE_KEY_MAP = {
        'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 4, 'n': 5, 'm': 6,  // C D E F G A B
        'q': 7, 'w': 8, 'e': 9, 'r': 10, 't': 11, 'y': 12, 'u': 13, // Next octave
    };

    // Black keys: S D  G H J (between white keys)
    const BLACK_KEY_MAP = {
        's': 0, 'd': 1, 'g': 2, 'h': 3, 'j': 4,  // C# D# F# G# A#
        '2': 5, '3': 6, '5': 7, '6': 8, '7': 9,  // Next octave sharps
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
    }

    function render() {
        containerElement.innerHTML = '';

        const whiteKeyWidth = 50;
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

                // Add label (Latin + Russian)
                const label = document.createElement('span');
                label.className = 'key-label';
                const russianName = Notes.getRussianName(fullName);
                label.innerHTML = `${fullName}<br>${russianName}`;
                key.appendChild(label);

                key.addEventListener('click', () => handleKeyPress(fullName));
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    handleKeyPress(fullName);
                });

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
                const leftPos = (whiteIndex * whiteKeyWidth) + whiteKeyWidth - 15;
                key.style.left = `${leftPos}px`;

                key.addEventListener('click', () => handleKeyPress(fullName));
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    handleKeyPress(fullName);
                });

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

    return {
        init,
        render,
        highlightKey,
        showCorrect,
        showWrong,
        setLabelsVisible,
        clearHighlights,
        getMidiForNote
    };
})();
