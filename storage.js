// Storage module - LocalStorage for progress tracking

const Storage = (function() {
    const STORAGE_KEY = 'piano_trainer_data';

    // Default data structure
    function getDefaultData() {
        return {
            settings: {
                clef: 'treble',
                rangeMin: 'C4',
                rangeMax: 'B5',
                showNoteNames: false,
                showKeyboardLabels: false,
                includeAccidentals: false,
                soundEnabled: true,
                darkMode: true
            },
            noteStats: {},  // { "C4": { attempts: 0, misses: 0, totalTime: 0 } }
            sessions: [],   // [{ date, correct, wrong, duration }]
            currentStreak: 0,
            bestStreak: 0
        };
    }

    // Load data from localStorage
    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                // Merge with defaults to handle new fields
                return { ...getDefaultData(), ...data };
            }
        } catch (e) {
            console.error('Error loading storage:', e);
        }
        return getDefaultData();
    }

    // Save data to localStorage
    function save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving storage:', e);
        }
    }

    // Get current data
    let currentData = load();

    // Settings
    function getSettings() {
        return { ...currentData.settings };
    }

    function saveSettings(settings) {
        currentData.settings = { ...currentData.settings, ...settings };
        save(currentData);
    }

    // Record a note attempt
    function recordAttempt(noteName, correct, responseTime) {
        if (!currentData.noteStats[noteName]) {
            currentData.noteStats[noteName] = {
                attempts: 0,
                misses: 0,
                totalTime: 0
            };
        }

        const stat = currentData.noteStats[noteName];
        stat.attempts++;
        stat.totalTime += responseTime;

        if (!correct) {
            stat.misses++;
        }

        // Update streak
        if (correct) {
            currentData.currentStreak++;
            if (currentData.currentStreak > currentData.bestStreak) {
                currentData.bestStreak = currentData.currentStreak;
            }
        } else {
            currentData.currentStreak = 0;
        }

        save(currentData);
    }

    // Get missed notes map for weighted random
    function getMissedNotes() {
        const missed = {};
        for (const [note, stats] of Object.entries(currentData.noteStats)) {
            if (stats.misses > 0) {
                missed[note] = stats.misses;
            }
        }
        return missed;
    }

    // Get most missed notes (for display)
    function getMostMissedNotes(limit = 5) {
        const notes = Object.entries(currentData.noteStats)
            .filter(([_, stats]) => stats.misses > 0)
            .map(([note, stats]) => ({
                note,
                misses: stats.misses,
                attempts: stats.attempts,
                missRate: (stats.misses / stats.attempts * 100).toFixed(1)
            }))
            .sort((a, b) => b.misses - a.misses)
            .slice(0, limit);

        return notes;
    }

    // Save session
    function saveSession(correct, wrong, duration) {
        currentData.sessions.push({
            date: new Date().toISOString(),
            correct,
            wrong,
            duration
        });

        // Keep only last 100 sessions
        if (currentData.sessions.length > 100) {
            currentData.sessions = currentData.sessions.slice(-100);
        }

        save(currentData);
    }

    // Get stats
    function getStats() {
        const totalAttempts = Object.values(currentData.noteStats)
            .reduce((sum, s) => sum + s.attempts, 0);
        const totalMisses = Object.values(currentData.noteStats)
            .reduce((sum, s) => sum + s.misses, 0);

        return {
            totalAttempts,
            totalCorrect: totalAttempts - totalMisses,
            totalMisses,
            accuracy: totalAttempts > 0
                ? ((totalAttempts - totalMisses) / totalAttempts * 100).toFixed(1)
                : 0,
            currentStreak: currentData.currentStreak,
            bestStreak: currentData.bestStreak,
            sessionsCount: currentData.sessions.length
        };
    }

    // Reset streak (for new session)
    function resetStreak() {
        currentData.currentStreak = 0;
        save(currentData);
    }

    // Clear all data
    function clearAll() {
        currentData = getDefaultData();
        save(currentData);
    }

    return {
        getSettings,
        saveSettings,
        recordAttempt,
        getMissedNotes,
        getMostMissedNotes,
        saveSession,
        getStats,
        resetStreak,
        clearAll
    };
})();
