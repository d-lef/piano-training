# Piano Note Trainer

A simple app to practice reading music notes on the staff.

🎹 **[Try it live](https://d-lef.github.io/piano-training/)**

## Features

- Interactive piano keyboard (mouse, touch, or PC keyboard)
- Real grand piano sounds
- Treble and bass clef support
- Customizable note range (C3-B5)
- Smart repetition system that adapts to your mistakes
- Response time tracking
- Statistics panels (mistakes, slowest notes)
- Pause/continue with auto-pause on window switch
- Dark and light themes
- Russian note names support (Do, Re, Mi...)
- Fully portable - just copy the folder
- Works offline after first load (sounds cached)
- No installation required

## How to Run

| Option | Description |
|--------|-------------|
| `Start.vbs` | Double-click (recommended - silent launch) |
| `Start.bat` | Double-click (shows brief command window) |
| `index.html` | Open directly in browser |

**Requirements:**
- Any modern browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for music notation library and piano sounds)

## Creating a Desktop Shortcut

1. Right-click on `Start.vbs`
2. Select "Create shortcut"
3. Move the shortcut to your Desktop
4. (Optional) Rename it to "Piano Trainer"

## How to Play

1. Click **Start** to begin
2. A note appears on the staff
3. Press the correct key on the piano keyboard (click, touch, or PC keyboard)
4. **Correct** = green flash, moves to next note
5. **Wrong** = red flash, try again until correct

## PC Keyboard Controls

| Keys | Notes |
|------|-------|
| `Z X C V B N M` | White keys: C D E F G A B |
| `S D G H J` | Black keys: C# D# F# G# A# |
| `Q W E R T Y U` | Next octave white keys |
| `2 3 5 6 7` | Next octave black keys |
| `Arrow Up/Down` | Shift octave |

## Settings

| Setting | Description |
|---------|-------------|
| **Clef** | Treble, Bass, or Both |
| **Range** | Limit which notes appear |
| **Note hints** | Show note name below staff |
| **Key labels** | Show note names on piano keys |
| **Accidentals** | Include sharps/flats |
| **Smart** | Prioritize notes you struggle with (recommended) |
| **Timer** | Show/hide response time counter |
| **Sound** | Piano sound on/off |
| **Dark** | Dark/light theme |

## Smart Repetition

When enabled, the app learns which notes you struggle with:

- Notes you miss appear more often
- Slow responses get more practice
- Adjacent notes are less likely to repeat
- Resets when you click "Clear Stats"

## Statistics

- **Mistakes panel:** Shows most-missed notes
- **Slowest panel:** Shows notes with slowest response times
- Stats persist across sessions until you click "Clear Stats"
- "New Session" only resets correct/wrong counts

## Tips

- Start with a small range (e.g., C4-G4) and expand gradually
- Disable "Note hints" and "Key labels" as you improve
- Keep "Smart" enabled for efficient learning
- The app auto-pauses when you switch windows

## Portable

Copy this entire folder to any computer - it will work the same way.
Settings and statistics are stored in your browser (won't transfer).

## About

Developed by [Daniel Lefanov](https://www.linkedin.com/in/daniel-lefanov/)
