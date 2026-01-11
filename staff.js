// Staff module - VexFlow staff rendering

const Staff = (function() {
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

    let renderer = null;
    let context = null;
    const containerElement = document.getElementById('staff');

    const STAFF_WIDTH = 200;
    const STAFF_HEIGHT = 150;

    function init() {
        // Clear any existing content
        containerElement.innerHTML = '';

        // Create SVG renderer
        renderer = new Renderer(containerElement, Renderer.Backends.SVG);
        renderer.resize(STAFF_WIDTH, STAFF_HEIGHT);
        context = renderer.getContext();
        context.setFont('Arial', 10);
    }

    function clear() {
        if (context) {
            context.clear();
        }
    }

    // Render a single note on the staff
    function renderNote(note, clef = 'treble') {
        if (!renderer) init();
        clear();

        // Create stave
        const stave = new Stave(10, 30, STAFF_WIDTH - 20);
        stave.addClef(clef);
        stave.setContext(context).draw();

        // Create note
        // VexFlow format: "c/4" for middle C
        const vexKey = note.vexflowKey;
        const keys = [vexKey];

        // Determine duration (whole note looks cleaner for flashcards)
        const staveNote = new StaveNote({
            keys: keys,
            duration: 'w', // whole note
            clef: clef
        });

        // Add accidental if needed
        if (note.isAccidental && note.name.includes('#')) {
            staveNote.addModifier(new Accidental('#'), 0);
        } else if (note.isAccidental && note.name.includes('b')) {
            staveNote.addModifier(new Accidental('b'), 0);
        }

        // Create voice and add note
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables([staveNote]);

        // Format and draw
        new Formatter().joinVoices([voice]).format([voice], STAFF_WIDTH - 80);
        voice.draw(context, stave);
    }

    // Show note label below staff
    function showNoteLabel(noteName) {
        const labelElement = document.getElementById('note-label');
        labelElement.textContent = noteName;
        labelElement.classList.add('visible');
    }

    function hideNoteLabel() {
        const labelElement = document.getElementById('note-label');
        labelElement.classList.remove('visible');
    }

    return {
        init,
        clear,
        renderNote,
        showNoteLabel,
        hideNoteLabel
    };
})();
