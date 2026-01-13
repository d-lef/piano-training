// Staff module - VexFlow staff rendering

const Staff = (function() {
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

    let renderer = null;
    let context = null;
    const containerElement = document.getElementById('staff');

    // Responsive staff dimensions
    function getStaffDimensions() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobileLandscape = isLandscape && window.innerHeight <= 700;

        if (isMobileLandscape) {
            // VexFlow needs minimum space: ~30px above staff for clef, ~40px for staff lines, ~40px below for ledger lines
            // Render at 133x122 internally, display at 120x110 (scale 0.9)
            return { width: 120, height: 110, scale: 0.9 };
        } else if (window.innerWidth <= 400) {
            return { width: 160, height: 120 };
        } else if (window.innerWidth <= 600) {
            return { width: 180, height: 140 };
        }
        return { width: 240, height: 180 };
    }

    function init() {
        // Clear any existing content and reset container styles
        containerElement.innerHTML = '';
        containerElement.style.width = '';
        containerElement.style.height = '';
        containerElement.style.overflow = '';

        // Create SVG renderer with responsive dimensions
        const dims = getStaffDimensions();
        renderer = new Renderer(containerElement, Renderer.Backends.SVG);

        // If scale is provided, render at larger internal size then use CSS to scale down
        const scale = dims.scale || 1;
        const internalWidth = Math.round(dims.width / scale);
        const internalHeight = Math.round(dims.height / scale);

        renderer.resize(internalWidth, internalHeight);
        context = renderer.getContext();

        // Use CSS transform to scale down the SVG (not context.scale which causes issues)
        if (scale !== 1) {
            const svg = containerElement.querySelector('svg');
            if (svg) {
                svg.style.transform = `scale(${scale})`;
                svg.style.transformOrigin = 'top left';
            }
            // Set container size to match scaled output
            containerElement.style.width = dims.width + 'px';
            containerElement.style.height = dims.height + 'px';
            containerElement.style.overflow = 'hidden';
        }

        context.setFont('Arial', 10);
    }

    // Re-initialize on orientation change or resize
    function handleResize() {
        // Force re-creation of renderer with new dimensions
        renderer = null;
        context = null;
        init();
    }

    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
        // Small delay to let the browser settle
        setTimeout(handleResize, 100);
    });

    // Also listen for resize events (covers rotation on some browsers)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

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

        // Use internal (pre-scale) dimensions for stave positioning
        const scale = dims.scale || 1;
        const internalWidth = Math.round(dims.width / scale);
        const internalHeight = Math.round(dims.height / scale);

        // Adjust stave y position - need ~30px above for clef
        const staveY = internalHeight <= 120 ? 28 : 30;

        // Create stave using internal dimensions
        const stave = new Stave(10, staveY, internalWidth - 20);
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

        // Format and draw using internal dimensions
        new Formatter().joinVoices([voice]).format([voice], internalWidth - 80);
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
