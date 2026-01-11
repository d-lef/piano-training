// Staff module - VexFlow staff rendering

const Staff = (function() {
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

    let renderer = null;
    let context = null;
    const containerElement = document.getElementById('staff');

    // Responsive staff dimensions
    function getStaffDimensions() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobileLandscape = isLandscape && window.innerHeight <= 500;

        if (isMobileLandscape) {
            return { width: 140, height: 80 };
        } else if (window.innerWidth <= 400) {
            return { width: 160, height: 120 };
        } else if (window.innerWidth <= 600) {
            return { width: 180, height: 140 };
        }
        return { width: 240, height: 180 };
    }

    function init() {
        // Clear any existing content
        containerElement.innerHTML = '';

        // Create SVG renderer with responsive dimensions
        const dims = getStaffDimensions();
        renderer = new Renderer(containerElement, Renderer.Backends.SVG);
        renderer.resize(dims.width, dims.height);
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

        // Get responsive dimensions
        const dims = getStaffDimensions();

        // Adjust stave y position for smaller displays
        const staveY = dims.height <= 100 ? 15 : 30;

        // Create stave
        const stave = new Stave(10, staveY, dims.width - 20);
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
        new Formatter().joinVoices([voice]).format([voice], dims.width - 80);
        voice.draw(context, stave);
    }

    // Show note label below staff (Latin + localized name)
    function showNoteLabel(noteName) {
        const labelElement = document.getElementById('note-label');
        const localName = Notes.getLocalizedName(noteName);
        labelElement.textContent = `${noteName} (${localName})`;
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
