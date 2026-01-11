// Notes module - note data, mapping, utilities

const Notes = (function() {
    // All natural notes from C2 to C6
    const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const ACCIDENTALS = ['C#', 'D#', 'F#', 'G#', 'A#'];

    // Note naming systems (solfege styles)
    const NAMING_SYSTEMS = {
        'abc': {
            label: 'ABC (International)',
            names: {
                'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F',
                'G': 'G', 'A': 'A', 'B': 'B',
                'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#'
            }
        },
        'romance': {
            label: 'Do-Re-Mi (Romance)',
            names: {
                'C': 'Do', 'D': 'Re', 'E': 'Mi', 'F': 'Fa',
                'G': 'Sol', 'A': 'La', 'B': 'Si',
                'C#': 'Do#', 'D#': 'Re#', 'F#': 'Fa#', 'G#': 'Sol#', 'A#': 'La#'
            }
        },
        'german': {
            label: 'German (C-D-E-H)',
            names: {
                'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F',
                'G': 'G', 'A': 'A', 'B': 'H',
                'C#': 'Cis', 'D#': 'Dis', 'F#': 'Fis', 'G#': 'Gis', 'A#': 'Ais'
            }
        },
        'russian': {
            label: 'Russian (До-Ре-Ми)',
            names: {
                'C': 'До', 'D': 'Ре', 'E': 'Ми', 'F': 'Фа',
                'G': 'Соль', 'A': 'Ля', 'B': 'Си',
                'C#': 'До#', 'D#': 'Ре#', 'F#': 'Фа#', 'G#': 'Соль#', 'A#': 'Ля#'
            }
        },
        'japanese': {
            label: 'Japanese (ド-レ-ミ)',
            names: {
                'C': 'ド', 'D': 'レ', 'E': 'ミ', 'F': 'ファ',
                'G': 'ソ', 'A': 'ラ', 'B': 'シ',
                'C#': 'ド#', 'D#': 'レ#', 'F#': 'ファ#', 'G#': 'ソ#', 'A#': 'ラ#'
            }
        },
        'indian': {
            label: 'Indian (Sa-Re-Ga)',
            names: {
                'C': 'Sa', 'D': 'Re', 'E': 'Ga', 'F': 'Ma',
                'G': 'Pa', 'A': 'Dha', 'B': 'Ni',
                'C#': 'Sa#', 'D#': 'Re#', 'F#': 'Ma#', 'G#': 'Pa#', 'A#': 'Dha#'
            }
        }
    };

    // Current naming system (default: abc)
    let currentNamingSystem = 'abc';

    // Set the current naming system
    function setNamingSystem(system) {
        if (NAMING_SYSTEMS[system]) {
            currentNamingSystem = system;
        }
    }

    // Get localized name for a note
    function getLocalizedName(noteName, system = null) {
        const useSystem = system || currentNamingSystem;
        const base = noteName.replace(/\d+$/, '');
        const systemData = NAMING_SYSTEMS[useSystem];
        if (!systemData) return base;
        return systemData.names[base] || base;
    }

    // Legacy function - get Russian name (for backwards compatibility)
    function getRussianName(noteName) {
        return getLocalizedName(noteName, 'russian');
    }

    // Get available naming systems for UI
    function getNamingSystems() {
        return Object.entries(NAMING_SYSTEMS).map(([key, data]) => ({
            value: key,
            label: data.label
        }));
    }

    // Generate all notes for a given octave range
    function generateNotes(minOctave, maxOctave, includeAccidentals = false) {
        const notes = [];

        for (let octave = minOctave; octave <= maxOctave; octave++) {
            for (const name of NOTE_NAMES) {
                notes.push({
                    name: name,
                    octave: octave,
                    fullName: `${name}${octave}`,
                    vexflowKey: `${name.toLowerCase()}/${octave}`,
                    midiNumber: getMidiNumber(name, octave),
                    isAccidental: false
                });

                // Add sharp after C, D, F, G, A (not after E and B)
                if (includeAccidentals && ['C', 'D', 'F', 'G', 'A'].includes(name)) {
                    notes.push({
                        name: `${name}#`,
                        octave: octave,
                        fullName: `${name}#${octave}`,
                        vexflowKey: `${name.toLowerCase()}#/${octave}`,
                        midiNumber: getMidiNumber(name, octave) + 1,
                        isAccidental: true
                    });
                }
            }
        }

        return notes;
    }

    // Get MIDI number for a note
    function getMidiNumber(name, octave) {
        const noteOffsets = {
            'C': 0, 'C#': 1, 'Db': 1,
            'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4,
            'F': 5, 'F#': 6, 'Gb': 6,
            'G': 7, 'G#': 8, 'Ab': 8,
            'A': 9, 'A#': 10, 'Bb': 10,
            'B': 11
        };
        return (octave + 1) * 12 + (noteOffsets[name] || 0);
    }

    // Parse note string like "C4" or "F#3"
    function parseNote(noteStr) {
        const match = noteStr.match(/^([A-G]#?)(\d)$/);
        if (!match) return null;
        return {
            name: match[1],
            octave: parseInt(match[2]),
            fullName: noteStr
        };
    }

    // Get all notes in range
    function getNotesInRange(minNote, maxNote, includeAccidentals = false) {
        const min = parseNote(minNote);
        const max = parseNote(maxNote);
        if (!min || !max) return [];

        const allNotes = generateNotes(min.octave, max.octave, includeAccidentals);
        const minMidi = getMidiNumber(min.name, min.octave);
        const maxMidi = getMidiNumber(max.name, max.octave);

        return allNotes.filter(n => n.midiNumber >= minMidi && n.midiNumber <= maxMidi);
    }

    // Get random note from array, with optional weighting for missed notes
    function getRandomNote(notes, missedNotes = {}) {
        if (notes.length === 0) return null;

        // Build weighted array - missed notes appear more often
        const weighted = [];
        for (const note of notes) {
            const missCount = missedNotes[note.fullName] || 0;
            const weight = 1 + Math.min(missCount, 3); // Max 4x weight for missed notes
            for (let i = 0; i < weight; i++) {
                weighted.push(note);
            }
        }

        const index = Math.floor(Math.random() * weighted.length);
        return weighted[index];
    }

    // Compare two notes for equality
    function notesEqual(note1, note2) {
        if (!note1 || !note2) return false;
        return note1.midiNumber === note2.midiNumber;
    }

    // Get recommended clef for a note
    function getClefForNote(note) {
        // Middle C (C4) is MIDI 60
        // Generally: bass clef for notes below middle C, treble for above
        if (note.midiNumber < 60) return 'bass';
        return 'treble';
    }

    // Default ranges for clefs
    const TREBLE_RANGE = { min: 'C4', max: 'C6' };
    const BASS_RANGE = { min: 'C2', max: 'C4' };
    const KEYBOARD_RANGE = { min: 'C3', max: 'B5' }; // 3 octaves for on-screen keyboard

    // Get all possible notes for range selectors
    function getAllNoteOptions() {
        const notes = [];
        for (let octave = 2; octave <= 6; octave++) {
            for (const name of NOTE_NAMES) {
                notes.push(`${name}${octave}`);
            }
        }
        return notes;
    }

    return {
        NOTE_NAMES,
        ACCIDENTALS,
        NAMING_SYSTEMS,
        TREBLE_RANGE,
        BASS_RANGE,
        KEYBOARD_RANGE,
        generateNotes,
        getMidiNumber,
        parseNote,
        getNotesInRange,
        getRandomNote,
        notesEqual,
        getClefForNote,
        getAllNoteOptions,
        getRussianName,
        getLocalizedName,
        setNamingSystem,
        getNamingSystems
    };
})();
