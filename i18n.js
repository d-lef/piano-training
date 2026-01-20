// i18n module - UI Localization

const I18n = (function() {
    // Supported languages
    const LANGUAGES = {
        en: { code: 'en', name: 'English', flag: 'EN' },
        ru: { code: 'ru', name: 'Русский', flag: 'RU' },
        de: { code: 'de', name: 'Deutsch', flag: 'DE' },
        es: { code: 'es', name: 'Español', flag: 'ES' },
        fr: { code: 'fr', name: 'Français', flag: 'FR' },
        zh: { code: 'zh', name: '中文', flag: 'ZH' }
    };

    // Current language
    let currentLang = 'en';

    // Translations
    const translations = {
        en: {
            // Modal titles
            settings: 'Settings',
            statistics: 'Statistics',

            // Settings labels
            notes: 'Notes:',
            clef: 'Clef:',
            range: 'Range:',
            to: 'to',
            noteHints: 'Note hints',
            keyLabels: 'Key labels',
            accidentals: 'Accidentals',
            timer: 'Timer',
            sound: 'Sound',

            // Clef options
            treble: 'Treble',
            bass: 'Bass',
            both: 'Both',

            // Score labels
            correct: 'Correct:',
            wrong: 'Wrong:',
            accuracy: 'Accuracy:',
            streak: 'Streak:',

            // Panel titles
            mistakes: 'Mistakes',
            slowest: 'Slowest',
            noneYet: 'None yet',

            // Buttons
            clearStats: 'Clear Stats',
            newSession: 'New Session',

            // Tooltips
            helpTooltip: 'Help & Instructions',
            coffeeTooltip: 'Buy me a coffee',
            settingsTooltip: 'Settings',
            statisticsTooltip: 'Statistics',
            themeTooltip: 'Toggle dark/light theme',
            languageTooltip: 'Change language',
            notesStyleTooltip: 'Note naming style/language',
            clefTooltip: 'Which clef to display notes on',
            clefSelectTooltip: 'Treble (G clef), Bass (F clef), or both randomly',
            rangeTooltip: 'Limit which notes appear in training',
            rangeMinTooltip: 'Lowest note to practice',
            rangeMaxTooltip: 'Highest note to practice',
            noteHintsTooltip: 'Show the note name below the staff',
            keyLabelsTooltip: 'Show note names on piano keys',
            accidentalsTooltip: 'Include sharps and flats (C#, D#, etc.)',
            timerTooltip: 'Show response time counter (still tracks in background when hidden)',
            soundTooltip: 'Play piano sound when keys are pressed',
            clearStatsTooltip: 'Clear mistakes and slowest statistics (resets smart repetition)',
            newSessionTooltip: 'Reset all scores and start fresh',
            pauseTooltip: 'Pause/Continue session',

            // Keyboard hints
            keyboardHints: 'PC Keyboard: Q W E R T Y U I O P = white keys | 2 3 5 6 7 9 0 = black keys | Arrow Up/Down = octave',

            // MIDI status
            midiNoDevice: 'MIDI: No device',
            midiConnected: 'MIDI:',
            midiNotSupported: 'MIDI not supported',
            noMidiDevice: 'No MIDI device connected',
            connectedTo: 'Connected to',

            // Mobile stats
            session: 'Session',

            // Rotate overlay
            rotatePhone: 'Rotate your phone to landscape',

            // Help page
            helpTitle: 'Piano Note Trainer',
            helpSubtitle: 'Learn to read music notes on the staff',
            backToTraining: 'Back to Training',

            aboutMe: 'About Me',
            developedBy: 'Developed by',

            features: 'Features',
            feature1: 'Interactive piano keyboard (mouse, touch, PC keyboard, or MIDI keyboard)',
            feature2: 'USB MIDI keyboard support with auto-detection',
            feature3: 'Real grand piano sounds',
            feature4: 'Treble and bass clef support',
            feature5: 'Customizable note range (C3-B5)',
            feature6: 'Smart repetition system that adapts to your mistakes',
            feature7: 'Response time tracking',
            feature8: 'Statistics panels (mistakes, slowest notes)',
            feature9: 'Pause/continue with auto-pause on window switch',
            feature10: 'Dark and light themes',
            feature11: 'Multiple note naming systems (ABC, Do-Re-Mi, German, Russian, Japanese, Indian)',
            feature12: 'Fully portable - just copy the folder',
            feature13: 'No installation required',

            howToPlay: 'How to Play',
            step1: 'Click <strong>Start</strong> to begin',
            step2: 'A note appears on the staff',
            step3: 'Press the correct key on the piano keyboard',
            step4: '<strong>Correct</strong> = key flashes, moves to next note',
            step5: '<strong>Wrong</strong> = key flashes, try again until correct',

            keyboardControls: 'PC Keyboard Controls',
            whiteKeys: 'White keys:',
            blackKeys: 'Black keys:',
            nextOctave: 'Next octave:',
            white: 'white',
            black: 'black',
            octaveShift: 'Octave shift:',
            arrowKeys: 'Arrow keys',

            settingsTitle: 'Settings',
            settingCol: 'Setting',
            descriptionCol: 'Description',
            clefDesc: 'Treble, Bass, or Both (random)',
            rangeDesc: 'Limit which notes appear in training',
            noteHintsDesc: 'Show note name below the staff',
            keyLabelsDesc: 'Show note names on piano keys',
            accidentalsDesc: 'Include sharps and flats (C#, D#, etc.)',
            timerDesc: 'Show/hide response time counter',
            soundDesc: 'Piano sound on/off',
            darkDesc: 'Dark/light theme toggle',

            smartRepetition: 'Smart Repetition',
            smartRepIntro: 'The app automatically learns which notes you struggle with:',
            smartRep1: 'Notes you miss appear more often',
            smartRep2: 'Slow responses get more practice',
            smartRep3: 'Adjacent notes are less likely to repeat (forces bigger jumps)',
            smartRep4: 'Resets when you click "Clear Stats"',

            statisticsTitle: 'Statistics',
            stats1: '<strong>Mistakes panel:</strong> Shows most-missed notes',
            stats2: '<strong>Slowest panel:</strong> Shows notes with slowest response times',
            stats3: 'Stats persist across sessions until you click "Clear Stats"',
            stats4: '"New Session" only resets correct/wrong counts',

            midiKeyboard: 'MIDI Keyboard',
            midiIntro: 'Connect a USB MIDI keyboard for the most realistic practice experience:',
            midi1: 'Plug in your MIDI keyboard via USB',
            midi2: 'The app auto-detects connected devices',
            midi3: 'Look for the MIDI status indicator below the keyboard',
            midi4: 'Green dot = connected and ready',
            midi5: 'Gray dot = no device or not supported',
            browserSupport: '<strong>Browser Support:</strong> MIDI works in Chrome, Edge, and Opera. Firefox and Safari do not support Web MIDI - use mouse or PC keyboard instead.',

            tipsTitle: 'Tips for Learning',
            tip1: 'Start with a small range (e.g., C4-G4) and expand gradually',
            tip2: 'Disable "Note hints" and "Key labels" as you improve',
            tip3: 'The app auto-pauses when you switch windows',
            tip4: 'Use the pause button (top-right) when you need a break',
            portableNote: '<strong>Portable:</strong> Copy this entire folder to any computer - it will work the same way. Settings and statistics are stored in your browser and won\'t transfer.'
        },

        ru: {
            // Modal titles
            settings: 'Настройки',
            statistics: 'Статистика',

            // Settings labels
            notes: 'Ноты:',
            clef: 'Ключ:',
            range: 'Диапазон:',
            to: 'до',
            noteHints: 'Подсказки нот',
            keyLabels: 'Названия клавиш',
            accidentals: 'Знаки альтерации',
            timer: 'Таймер',
            sound: 'Звук',

            // Clef options
            treble: 'Скрипичный',
            bass: 'Басовый',
            both: 'Оба',

            // Score labels
            correct: 'Верно:',
            wrong: 'Ошибки:',
            accuracy: 'Точность:',
            streak: 'Серия:',

            // Panel titles
            mistakes: 'Ошибки',
            slowest: 'Медленные',
            noneYet: 'Пока нет',

            // Buttons
            clearStats: 'Очистить',
            newSession: 'Новая сессия',

            // Tooltips
            helpTooltip: 'Помощь и инструкции',
            coffeeTooltip: 'Угостить кофе',
            settingsTooltip: 'Настройки',
            statisticsTooltip: 'Статистика',
            themeTooltip: 'Переключить тёмную/светлую тему',
            languageTooltip: 'Сменить язык',
            notesStyleTooltip: 'Стиль названия нот',
            clefTooltip: 'На каком ключе отображать ноты',
            clefSelectTooltip: 'Скрипичный, басовый или оба случайно',
            rangeTooltip: 'Ограничить диапазон нот для практики',
            rangeMinTooltip: 'Самая низкая нота',
            rangeMaxTooltip: 'Самая высокая нота',
            noteHintsTooltip: 'Показывать название ноты под нотным станом',
            keyLabelsTooltip: 'Показывать названия нот на клавишах',
            accidentalsTooltip: 'Включить диезы и бемоли (C#, D# и т.д.)',
            timerTooltip: 'Показывать таймер ответа (отслеживается и когда скрыт)',
            soundTooltip: 'Воспроизводить звук при нажатии клавиш',
            clearStatsTooltip: 'Очистить статистику ошибок и медленных ответов',
            newSessionTooltip: 'Сбросить счёт и начать заново',
            pauseTooltip: 'Пауза/Продолжить',

            // Keyboard hints
            keyboardHints: 'Клавиатура: Q W E R T Y U I O P = белые клавиши | 2 3 5 6 7 9 0 = чёрные | Стрелки вверх/вниз = октава',

            // MIDI status
            midiNoDevice: 'MIDI: Нет устройства',
            midiConnected: 'MIDI:',
            midiNotSupported: 'MIDI не поддерживается',
            noMidiDevice: 'MIDI устройство не подключено',
            connectedTo: 'Подключено к',

            // Mobile stats
            session: 'Сессия',

            // Rotate overlay
            rotatePhone: 'Поверните телефон горизонтально',

            // Help page
            helpTitle: 'Тренажёр нот для фортепиано',
            helpSubtitle: 'Научитесь читать ноты на нотном стане',
            backToTraining: 'Вернуться к тренировке',

            aboutMe: 'Об авторе',
            developedBy: 'Разработано',

            features: 'Возможности',
            feature1: 'Интерактивная клавиатура (мышь, сенсор, клавиатура ПК или MIDI)',
            feature2: 'Поддержка USB MIDI клавиатуры с автоопределением',
            feature3: 'Реалистичные звуки рояля',
            feature4: 'Поддержка скрипичного и басового ключей',
            feature5: 'Настраиваемый диапазон нот (C3-B5)',
            feature6: 'Умная система повторений, адаптирующаяся к вашим ошибкам',
            feature7: 'Отслеживание времени ответа',
            feature8: 'Панели статистики (ошибки, самые медленные ноты)',
            feature9: 'Пауза/продолжение с автопаузой при переключении окна',
            feature10: 'Тёмная и светлая темы',
            feature11: 'Несколько систем наименования нот (ABC, До-Ре-Ми, Немецкая, Русская, Японская, Индийская)',
            feature12: 'Полностью портативное — просто скопируйте папку',
            feature13: 'Не требует установки',

            howToPlay: 'Как играть',
            step1: 'Нажмите <strong>Старт</strong> для начала',
            step2: 'На нотном стане появляется нота',
            step3: 'Нажмите правильную клавишу на клавиатуре',
            step4: '<strong>Правильно</strong> = клавиша мигает зелёным, переход к следующей ноте',
            step5: '<strong>Неправильно</strong> = клавиша мигает красным, пробуйте снова',

            keyboardControls: 'Управление с клавиатуры ПК',
            whiteKeys: 'Белые клавиши:',
            blackKeys: 'Чёрные клавиши:',
            nextOctave: 'Следующая октава:',
            white: 'белые',
            black: 'чёрные',
            octaveShift: 'Сдвиг октавы:',
            arrowKeys: 'Стрелки',

            settingsTitle: 'Настройки',
            settingCol: 'Настройка',
            descriptionCol: 'Описание',
            clefDesc: 'Скрипичный, Басовый или Оба (случайно)',
            rangeDesc: 'Ограничить ноты для тренировки',
            noteHintsDesc: 'Показывать название ноты под нотным станом',
            keyLabelsDesc: 'Показывать названия нот на клавишах',
            accidentalsDesc: 'Включить диезы и бемоли (C#, D# и т.д.)',
            timerDesc: 'Показать/скрыть счётчик времени ответа',
            soundDesc: 'Звук фортепиано вкл/выкл',
            darkDesc: 'Переключение тёмной/светлой темы',

            smartRepetition: 'Умное повторение',
            smartRepIntro: 'Приложение автоматически определяет, с какими нотами у вас трудности:',
            smartRep1: 'Ноты с ошибками появляются чаще',
            smartRep2: 'Медленные ответы получают больше практики',
            smartRep3: 'Соседние ноты реже повторяются (вынуждая делать большие прыжки)',
            smartRep4: 'Сбрасывается при нажатии "Очистить"',

            statisticsTitle: 'Статистика',
            stats1: '<strong>Панель ошибок:</strong> Показывает ноты с наибольшим количеством ошибок',
            stats2: '<strong>Панель медленных:</strong> Показывает ноты с самым долгим временем ответа',
            stats3: 'Статистика сохраняется между сессиями до нажатия "Очистить"',
            stats4: '"Новая сессия" сбрасывает только счётчики правильных/неправильных',

            midiKeyboard: 'MIDI клавиатура',
            midiIntro: 'Подключите USB MIDI клавиатуру для максимально реалистичной практики:',
            midi1: 'Подключите MIDI клавиатуру через USB',
            midi2: 'Приложение автоматически определит устройство',
            midi3: 'Следите за индикатором MIDI под клавиатурой',
            midi4: 'Зелёная точка = подключено и готово',
            midi5: 'Серая точка = нет устройства или не поддерживается',
            browserSupport: '<strong>Поддержка браузеров:</strong> MIDI работает в Chrome, Edge и Opera. Firefox и Safari не поддерживают Web MIDI — используйте мышь или клавиатуру ПК.',

            tipsTitle: 'Советы по обучению',
            tip1: 'Начните с небольшого диапазона (например, C4-G4) и постепенно расширяйте',
            tip2: 'Отключите "Подсказки нот" и "Названия клавиш" по мере улучшения',
            tip3: 'Приложение автоматически ставится на паузу при переключении окон',
            tip4: 'Используйте кнопку паузы (вверху справа) когда нужен перерыв',
            portableNote: '<strong>Портативность:</strong> Скопируйте эту папку на любой компьютер — всё будет работать так же. Настройки и статистика хранятся в браузере и не переносятся.'
        },

        de: {
            // Modal titles
            settings: 'Einstellungen',
            statistics: 'Statistik',

            // Settings labels
            notes: 'Noten:',
            clef: 'Schlüssel:',
            range: 'Bereich:',
            to: 'bis',
            noteHints: 'Notenhinweise',
            keyLabels: 'Tastenbeschriftung',
            accidentals: 'Vorzeichen',
            timer: 'Timer',
            sound: 'Ton',

            // Clef options
            treble: 'Violinschlüssel',
            bass: 'Bassschlüssel',
            both: 'Beide',

            // Score labels
            correct: 'Richtig:',
            wrong: 'Falsch:',
            accuracy: 'Genauigkeit:',
            streak: 'Serie:',

            // Panel titles
            mistakes: 'Fehler',
            slowest: 'Langsamste',
            noneYet: 'Noch keine',

            // Buttons
            clearStats: 'Löschen',
            newSession: 'Neue Sitzung',

            // Tooltips
            helpTooltip: 'Hilfe & Anleitung',
            coffeeTooltip: 'Spendiere mir einen Kaffee',
            settingsTooltip: 'Einstellungen',
            statisticsTooltip: 'Statistik',
            themeTooltip: 'Dunkles/helles Design umschalten',
            languageTooltip: 'Sprache ändern',
            notesStyleTooltip: 'Notenbenennung',
            clefTooltip: 'Welcher Notenschlüssel angezeigt wird',
            clefSelectTooltip: 'Violin-, Bass- oder beide zufällig',
            rangeTooltip: 'Notenbereich für das Training begrenzen',
            rangeMinTooltip: 'Tiefste Note',
            rangeMaxTooltip: 'Höchste Note',
            noteHintsTooltip: 'Notennamen unter dem Notensystem anzeigen',
            keyLabelsTooltip: 'Notennamen auf Tasten anzeigen',
            accidentalsTooltip: 'Kreuze und Bs einschließen (C#, D# usw.)',
            timerTooltip: 'Reaktionszeitzähler anzeigen (läuft auch versteckt)',
            soundTooltip: 'Klavierton bei Tastendruck abspielen',
            clearStatsTooltip: 'Fehler- und Langsamste-Statistik löschen',
            newSessionTooltip: 'Punktestand zurücksetzen und neu beginnen',
            pauseTooltip: 'Pause/Fortsetzen',

            // Keyboard hints
            keyboardHints: 'Tastatur: Q W E R T Y U I O P = weiße Tasten | 2 3 5 6 7 9 0 = schwarze | Pfeiltasten = Oktave',

            // MIDI status
            midiNoDevice: 'MIDI: Kein Gerät',
            midiConnected: 'MIDI:',
            midiNotSupported: 'MIDI nicht unterstützt',
            noMidiDevice: 'Kein MIDI-Gerät verbunden',
            connectedTo: 'Verbunden mit',

            // Mobile stats
            session: 'Sitzung',

            // Rotate overlay
            rotatePhone: 'Bitte Telefon ins Querformat drehen',

            // Help page
            helpTitle: 'Klavier-Notentrainer',
            helpSubtitle: 'Lernen Sie, Noten auf dem Notensystem zu lesen',
            backToTraining: 'Zurück zum Training',

            aboutMe: 'Über mich',
            developedBy: 'Entwickelt von',

            features: 'Funktionen',
            feature1: 'Interaktive Klaviertastatur (Maus, Touch, PC-Tastatur oder MIDI)',
            feature2: 'USB-MIDI-Tastatur-Unterstützung mit automatischer Erkennung',
            feature3: 'Echte Flügelklänge',
            feature4: 'Violin- und Bassschlüssel-Unterstützung',
            feature5: 'Anpassbarer Notenbereich (C3-B5)',
            feature6: 'Intelligentes Wiederholungssystem, das sich an Ihre Fehler anpasst',
            feature7: 'Reaktionszeit-Tracking',
            feature8: 'Statistik-Panels (Fehler, langsamste Noten)',
            feature9: 'Pause/Fortsetzen mit Auto-Pause beim Fensterwechsel',
            feature10: 'Dunkles und helles Design',
            feature11: 'Mehrere Notenbenennung-Systeme (ABC, Do-Re-Mi, Deutsch, Russisch, Japanisch, Indisch)',
            feature12: 'Vollständig portabel - einfach den Ordner kopieren',
            feature13: 'Keine Installation erforderlich',

            howToPlay: 'Spielanleitung',
            step1: 'Klicken Sie auf <strong>Start</strong> um zu beginnen',
            step2: 'Eine Note erscheint auf dem Notensystem',
            step3: 'Drücken Sie die richtige Taste auf der Klaviertastatur',
            step4: '<strong>Richtig</strong> = Taste blinkt grün, weiter zur nächsten Note',
            step5: '<strong>Falsch</strong> = Taste blinkt rot, versuchen Sie es erneut',

            keyboardControls: 'PC-Tastatursteuerung',
            whiteKeys: 'Weiße Tasten:',
            blackKeys: 'Schwarze Tasten:',
            nextOctave: 'Nächste Oktave:',
            white: 'weiß',
            black: 'schwarz',
            octaveShift: 'Oktavverschiebung:',
            arrowKeys: 'Pfeiltasten',

            settingsTitle: 'Einstellungen',
            settingCol: 'Einstellung',
            descriptionCol: 'Beschreibung',
            clefDesc: 'Violin-, Bass- oder beide (zufällig)',
            rangeDesc: 'Notenbereich für das Training begrenzen',
            noteHintsDesc: 'Notennamen unter dem Notensystem anzeigen',
            keyLabelsDesc: 'Notennamen auf Tasten anzeigen',
            accidentalsDesc: 'Kreuze und Bs einschließen (C#, D# usw.)',
            timerDesc: 'Reaktionszeitzähler ein-/ausblenden',
            soundDesc: 'Klavierton ein/aus',
            darkDesc: 'Dunkles/helles Design umschalten',

            smartRepetition: 'Intelligente Wiederholung',
            smartRepIntro: 'Die App lernt automatisch, mit welchen Noten Sie Schwierigkeiten haben:',
            smartRep1: 'Verfehlte Noten erscheinen häufiger',
            smartRep2: 'Langsame Antworten werden mehr geübt',
            smartRep3: 'Benachbarte Noten wiederholen sich seltener (erzwingt größere Sprünge)',
            smartRep4: 'Wird zurückgesetzt, wenn Sie "Löschen" klicken',

            statisticsTitle: 'Statistik',
            stats1: '<strong>Fehler-Panel:</strong> Zeigt am häufigsten verfehlte Noten',
            stats2: '<strong>Langsamste-Panel:</strong> Zeigt Noten mit längster Reaktionszeit',
            stats3: 'Statistiken bleiben sitzungsübergreifend bis Sie "Löschen" klicken',
            stats4: '"Neue Sitzung" setzt nur die Richtig/Falsch-Zähler zurück',

            midiKeyboard: 'MIDI-Tastatur',
            midiIntro: 'Verbinden Sie eine USB-MIDI-Tastatur für das realistischste Übungserlebnis:',
            midi1: 'Schließen Sie Ihre MIDI-Tastatur per USB an',
            midi2: 'Die App erkennt verbundene Geräte automatisch',
            midi3: 'Achten Sie auf die MIDI-Statusanzeige unter der Tastatur',
            midi4: 'Grüner Punkt = verbunden und bereit',
            midi5: 'Grauer Punkt = kein Gerät oder nicht unterstützt',
            browserSupport: '<strong>Browser-Unterstützung:</strong> MIDI funktioniert in Chrome, Edge und Opera. Firefox und Safari unterstützen Web MIDI nicht - verwenden Sie Maus oder PC-Tastatur.',

            tipsTitle: 'Tipps zum Lernen',
            tip1: 'Beginnen Sie mit einem kleinen Bereich (z.B. C4-G4) und erweitern Sie schrittweise',
            tip2: 'Deaktivieren Sie "Notenhinweise" und "Tastenbeschriftung" wenn Sie besser werden',
            tip3: 'Die App pausiert automatisch beim Fensterwechsel',
            tip4: 'Verwenden Sie die Pause-Taste (oben rechts) wenn Sie eine Pause brauchen',
            portableNote: '<strong>Portabel:</strong> Kopieren Sie diesen Ordner auf jeden Computer - er funktioniert genauso. Einstellungen und Statistiken werden im Browser gespeichert und werden nicht übertragen.'
        },

        es: {
            // Modal titles
            settings: 'Ajustes',
            statistics: 'Estadísticas',

            // Settings labels
            notes: 'Notas:',
            clef: 'Clave:',
            range: 'Rango:',
            to: 'a',
            noteHints: 'Pistas de notas',
            keyLabels: 'Etiquetas de teclas',
            accidentals: 'Alteraciones',
            timer: 'Cronómetro',
            sound: 'Sonido',

            // Clef options
            treble: 'Sol',
            bass: 'Fa',
            both: 'Ambas',

            // Score labels
            correct: 'Correctas:',
            wrong: 'Errores:',
            accuracy: 'Precisión:',
            streak: 'Racha:',

            // Panel titles
            mistakes: 'Errores',
            slowest: 'Más lentas',
            noneYet: 'Ninguna aún',

            // Buttons
            clearStats: 'Borrar',
            newSession: 'Nueva sesión',

            // Tooltips
            helpTooltip: 'Ayuda e instrucciones',
            coffeeTooltip: 'Invítame a un café',
            settingsTooltip: 'Ajustes',
            statisticsTooltip: 'Estadísticas',
            themeTooltip: 'Cambiar tema oscuro/claro',
            languageTooltip: 'Cambiar idioma',
            notesStyleTooltip: 'Estilo de nomenclatura de notas',
            clefTooltip: 'Qué clave mostrar',
            clefSelectTooltip: 'Sol, Fa o ambas aleatoriamente',
            rangeTooltip: 'Limitar qué notas aparecen en el entrenamiento',
            rangeMinTooltip: 'Nota más baja',
            rangeMaxTooltip: 'Nota más alta',
            noteHintsTooltip: 'Mostrar nombre de la nota bajo el pentagrama',
            keyLabelsTooltip: 'Mostrar nombres de notas en las teclas',
            accidentalsTooltip: 'Incluir sostenidos y bemoles (C#, D#, etc.)',
            timerTooltip: 'Mostrar cronómetro de respuesta (sigue funcionando oculto)',
            soundTooltip: 'Reproducir sonido de piano al pulsar teclas',
            clearStatsTooltip: 'Borrar estadísticas de errores y más lentas',
            newSessionTooltip: 'Reiniciar puntuación y empezar de nuevo',
            pauseTooltip: 'Pausar/Continuar',

            // Keyboard hints
            keyboardHints: 'Teclado: Q W E R T Y U I O P = teclas blancas | 2 3 5 6 7 9 0 = negras | Flechas arriba/abajo = octava',

            // MIDI status
            midiNoDevice: 'MIDI: Sin dispositivo',
            midiConnected: 'MIDI:',
            midiNotSupported: 'MIDI no soportado',
            noMidiDevice: 'No hay dispositivo MIDI conectado',
            connectedTo: 'Conectado a',

            // Mobile stats
            session: 'Sesión',

            // Rotate overlay
            rotatePhone: 'Gira tu teléfono a horizontal',

            // Help page
            helpTitle: 'Entrenador de Notas de Piano',
            helpSubtitle: 'Aprende a leer notas musicales en el pentagrama',
            backToTraining: 'Volver al entrenamiento',

            aboutMe: 'Sobre mí',
            developedBy: 'Desarrollado por',

            features: 'Características',
            feature1: 'Teclado de piano interactivo (ratón, táctil, teclado de PC o MIDI)',
            feature2: 'Soporte de teclado MIDI USB con detección automática',
            feature3: 'Sonidos reales de piano de cola',
            feature4: 'Soporte para clave de sol y clave de fa',
            feature5: 'Rango de notas personalizable (C3-B5)',
            feature6: 'Sistema de repetición inteligente que se adapta a tus errores',
            feature7: 'Seguimiento del tiempo de respuesta',
            feature8: 'Paneles de estadísticas (errores, notas más lentas)',
            feature9: 'Pausa/continuar con auto-pausa al cambiar de ventana',
            feature10: 'Temas claro y oscuro',
            feature11: 'Múltiples sistemas de nomenclatura (ABC, Do-Re-Mi, Alemán, Ruso, Japonés, Indio)',
            feature12: 'Totalmente portable - solo copia la carpeta',
            feature13: 'No requiere instalación',

            howToPlay: 'Cómo jugar',
            step1: 'Haz clic en <strong>Iniciar</strong> para comenzar',
            step2: 'Aparece una nota en el pentagrama',
            step3: 'Pulsa la tecla correcta en el teclado del piano',
            step4: '<strong>Correcto</strong> = la tecla parpadea verde, pasa a la siguiente nota',
            step5: '<strong>Incorrecto</strong> = la tecla parpadea rojo, inténtalo de nuevo',

            keyboardControls: 'Controles del teclado de PC',
            whiteKeys: 'Teclas blancas:',
            blackKeys: 'Teclas negras:',
            nextOctave: 'Siguiente octava:',
            white: 'blancas',
            black: 'negras',
            octaveShift: 'Cambio de octava:',
            arrowKeys: 'Teclas de flecha',

            settingsTitle: 'Ajustes',
            settingCol: 'Ajuste',
            descriptionCol: 'Descripción',
            clefDesc: 'Sol, Fa o Ambas (aleatorio)',
            rangeDesc: 'Limitar qué notas aparecen en el entrenamiento',
            noteHintsDesc: 'Mostrar nombre de la nota bajo el pentagrama',
            keyLabelsDesc: 'Mostrar nombres de notas en las teclas',
            accidentalsDesc: 'Incluir sostenidos y bemoles (C#, D#, etc.)',
            timerDesc: 'Mostrar/ocultar contador de tiempo de respuesta',
            soundDesc: 'Sonido del piano on/off',
            darkDesc: 'Cambiar tema oscuro/claro',

            smartRepetition: 'Repetición inteligente',
            smartRepIntro: 'La app aprende automáticamente con qué notas tienes dificultades:',
            smartRep1: 'Las notas falladas aparecen más a menudo',
            smartRep2: 'Las respuestas lentas reciben más práctica',
            smartRep3: 'Las notas adyacentes se repiten menos (fuerza saltos más grandes)',
            smartRep4: 'Se reinicia cuando haces clic en "Borrar"',

            statisticsTitle: 'Estadísticas',
            stats1: '<strong>Panel de errores:</strong> Muestra las notas más falladas',
            stats2: '<strong>Panel de más lentas:</strong> Muestra notas con tiempos de respuesta más lentos',
            stats3: 'Las estadísticas persisten entre sesiones hasta que hagas clic en "Borrar"',
            stats4: '"Nueva sesión" solo reinicia los contadores de correctas/incorrectas',

            midiKeyboard: 'Teclado MIDI',
            midiIntro: 'Conecta un teclado MIDI USB para la experiencia de práctica más realista:',
            midi1: 'Conecta tu teclado MIDI por USB',
            midi2: 'La app detecta automáticamente los dispositivos conectados',
            midi3: 'Busca el indicador de estado MIDI debajo del teclado',
            midi4: 'Punto verde = conectado y listo',
            midi5: 'Punto gris = sin dispositivo o no soportado',
            browserSupport: '<strong>Soporte de navegadores:</strong> MIDI funciona en Chrome, Edge y Opera. Firefox y Safari no soportan Web MIDI - usa ratón o teclado de PC.',

            tipsTitle: 'Consejos para aprender',
            tip1: 'Empieza con un rango pequeño (ej. C4-G4) y amplía gradualmente',
            tip2: 'Desactiva "Pistas de notas" y "Etiquetas de teclas" a medida que mejores',
            tip3: 'La app se pausa automáticamente cuando cambias de ventana',
            tip4: 'Usa el botón de pausa (arriba a la derecha) cuando necesites un descanso',
            portableNote: '<strong>Portable:</strong> Copia esta carpeta a cualquier ordenador - funcionará igual. Los ajustes y estadísticas se guardan en tu navegador y no se transfieren.'
        },

        fr: {
            // Modal titles
            settings: 'Paramètres',
            statistics: 'Statistiques',

            // Settings labels
            notes: 'Notes :',
            clef: 'Clé :',
            range: 'Étendue :',
            to: 'à',
            noteHints: 'Indices de notes',
            keyLabels: 'Noms des touches',
            accidentals: 'Altérations',
            timer: 'Chronomètre',
            sound: 'Son',

            // Clef options
            treble: 'Sol',
            bass: 'Fa',
            both: 'Les deux',

            // Score labels
            correct: 'Correct :',
            wrong: 'Erreurs :',
            accuracy: 'Précision :',
            streak: 'Série :',

            // Panel titles
            mistakes: 'Erreurs',
            slowest: 'Plus lentes',
            noneYet: 'Aucune',

            // Buttons
            clearStats: 'Effacer',
            newSession: 'Nouvelle session',

            // Tooltips
            helpTooltip: 'Aide et instructions',
            coffeeTooltip: 'Offrez-moi un café',
            settingsTooltip: 'Paramètres',
            statisticsTooltip: 'Statistiques',
            themeTooltip: 'Basculer thème sombre/clair',
            languageTooltip: 'Changer de langue',
            notesStyleTooltip: 'Style de notation',
            clefTooltip: 'Quelle clé afficher',
            clefSelectTooltip: 'Sol, Fa ou les deux aléatoirement',
            rangeTooltip: 'Limiter les notes pour l\'entraînement',
            rangeMinTooltip: 'Note la plus basse',
            rangeMaxTooltip: 'Note la plus haute',
            noteHintsTooltip: 'Afficher le nom de la note sous la portée',
            keyLabelsTooltip: 'Afficher les noms des notes sur les touches',
            accidentalsTooltip: 'Inclure dièses et bémols (C#, D#, etc.)',
            timerTooltip: 'Afficher le chronomètre (continue en arrière-plan)',
            soundTooltip: 'Jouer le son du piano lors de l\'appui',
            clearStatsTooltip: 'Effacer les statistiques d\'erreurs et temps',
            newSessionTooltip: 'Réinitialiser les scores et recommencer',
            pauseTooltip: 'Pause/Continuer',

            // Keyboard hints
            keyboardHints: 'Clavier : Q W E R T Y U I O P = touches blanches | 2 3 5 6 7 9 0 = noires | Flèches haut/bas = octave',

            // MIDI status
            midiNoDevice: 'MIDI : Aucun appareil',
            midiConnected: 'MIDI :',
            midiNotSupported: 'MIDI non supporté',
            noMidiDevice: 'Aucun appareil MIDI connecté',
            connectedTo: 'Connecté à',

            // Mobile stats
            session: 'Session',

            // Rotate overlay
            rotatePhone: 'Tournez votre téléphone en paysage',

            // Help page
            helpTitle: 'Entraîneur de Notes de Piano',
            helpSubtitle: 'Apprenez à lire les notes sur la portée',
            backToTraining: 'Retour à l\'entraînement',

            aboutMe: 'À propos',
            developedBy: 'Développé par',

            features: 'Fonctionnalités',
            feature1: 'Clavier de piano interactif (souris, tactile, clavier PC ou MIDI)',
            feature2: 'Support du clavier MIDI USB avec détection automatique',
            feature3: 'Sons de piano à queue authentiques',
            feature4: 'Support des clés de sol et de fa',
            feature5: 'Plage de notes personnalisable (C3-B5)',
            feature6: 'Système de répétition intelligent qui s\'adapte à vos erreurs',
            feature7: 'Suivi du temps de réponse',
            feature8: 'Panneaux de statistiques (erreurs, notes les plus lentes)',
            feature9: 'Pause/reprise avec auto-pause lors du changement de fenêtre',
            feature10: 'Thèmes sombre et clair',
            feature11: 'Plusieurs systèmes de notation (ABC, Do-Ré-Mi, Allemand, Russe, Japonais, Indien)',
            feature12: 'Entièrement portable - copiez simplement le dossier',
            feature13: 'Aucune installation requise',

            howToPlay: 'Comment jouer',
            step1: 'Cliquez sur <strong>Démarrer</strong> pour commencer',
            step2: 'Une note apparaît sur la portée',
            step3: 'Appuyez sur la bonne touche du clavier de piano',
            step4: '<strong>Correct</strong> = la touche clignote en vert, passage à la note suivante',
            step5: '<strong>Incorrect</strong> = la touche clignote en rouge, réessayez',

            keyboardControls: 'Contrôles du clavier PC',
            whiteKeys: 'Touches blanches :',
            blackKeys: 'Touches noires :',
            nextOctave: 'Octave suivante :',
            white: 'blanches',
            black: 'noires',
            octaveShift: 'Changement d\'octave :',
            arrowKeys: 'Touches fléchées',

            settingsTitle: 'Paramètres',
            settingCol: 'Paramètre',
            descriptionCol: 'Description',
            clefDesc: 'Sol, Fa ou les deux (aléatoire)',
            rangeDesc: 'Limiter les notes pour l\'entraînement',
            noteHintsDesc: 'Afficher le nom de la note sous la portée',
            keyLabelsDesc: 'Afficher les noms des notes sur les touches',
            accidentalsDesc: 'Inclure dièses et bémols (C#, D#, etc.)',
            timerDesc: 'Afficher/masquer le compteur de temps de réponse',
            soundDesc: 'Son du piano on/off',
            darkDesc: 'Basculer thème sombre/clair',

            smartRepetition: 'Répétition intelligente',
            smartRepIntro: 'L\'application apprend automatiquement quelles notes vous posent problème :',
            smartRep1: 'Les notes ratées apparaissent plus souvent',
            smartRep2: 'Les réponses lentes sont plus pratiquées',
            smartRep3: 'Les notes adjacentes se répètent moins (force des sauts plus grands)',
            smartRep4: 'Réinitialisé quand vous cliquez sur "Effacer"',

            statisticsTitle: 'Statistiques',
            stats1: '<strong>Panneau erreurs :</strong> Affiche les notes les plus ratées',
            stats2: '<strong>Panneau plus lentes :</strong> Affiche les notes avec les temps de réponse les plus lents',
            stats3: 'Les statistiques persistent entre les sessions jusqu\'à cliquer sur "Effacer"',
            stats4: '"Nouvelle session" ne réinitialise que les compteurs correct/incorrect',

            midiKeyboard: 'Clavier MIDI',
            midiIntro: 'Connectez un clavier MIDI USB pour l\'expérience de pratique la plus réaliste :',
            midi1: 'Branchez votre clavier MIDI via USB',
            midi2: 'L\'application détecte automatiquement les appareils connectés',
            midi3: 'Regardez l\'indicateur d\'état MIDI sous le clavier',
            midi4: 'Point vert = connecté et prêt',
            midi5: 'Point gris = pas d\'appareil ou non supporté',
            browserSupport: '<strong>Support navigateur :</strong> Le MIDI fonctionne dans Chrome, Edge et Opera. Firefox et Safari ne supportent pas Web MIDI - utilisez la souris ou le clavier PC.',

            tipsTitle: 'Conseils d\'apprentissage',
            tip1: 'Commencez avec une petite plage (ex. C4-G4) et élargissez progressivement',
            tip2: 'Désactivez "Indices de notes" et "Noms des touches" au fur et à mesure que vous progressez',
            tip3: 'L\'application se met en pause automatiquement quand vous changez de fenêtre',
            tip4: 'Utilisez le bouton pause (en haut à droite) quand vous avez besoin d\'une pause',
            portableNote: '<strong>Portable :</strong> Copiez ce dossier sur n\'importe quel ordinateur - il fonctionnera de la même façon. Les paramètres et statistiques sont stockés dans votre navigateur et ne seront pas transférés.'
        },

        zh: {
            // Modal titles
            settings: '设置',
            statistics: '统计',

            // Settings labels
            notes: '音符：',
            clef: '谱号：',
            range: '范围：',
            to: '至',
            noteHints: '音符提示',
            keyLabels: '琴键标签',
            accidentals: '升降号',
            timer: '计时器',
            sound: '声音',

            // Clef options
            treble: '高音谱号',
            bass: '低音谱号',
            both: '两者',

            // Score labels
            correct: '正确：',
            wrong: '错误：',
            accuracy: '准确率：',
            streak: '连击：',

            // Panel titles
            mistakes: '错误',
            slowest: '最慢',
            noneYet: '暂无',

            // Buttons
            clearStats: '清除统计',
            newSession: '新会话',

            // Tooltips
            helpTooltip: '帮助与说明',
            coffeeTooltip: '请我喝咖啡',
            settingsTooltip: '设置',
            statisticsTooltip: '统计',
            themeTooltip: '切换深色/浅色主题',
            languageTooltip: '更改语言',
            notesStyleTooltip: '音符命名方式',
            clefTooltip: '显示哪种谱号',
            clefSelectTooltip: '高音、低音或随机',
            rangeTooltip: '限制练习的音符范围',
            rangeMinTooltip: '最低音',
            rangeMaxTooltip: '最高音',
            noteHintsTooltip: '在五线谱下方显示音符名称',
            keyLabelsTooltip: '在琴键上显示音符名称',
            accidentalsTooltip: '包括升号和降号（C#、D#等）',
            timerTooltip: '显示反应计时器（隐藏时仍在后台计时）',
            soundTooltip: '按键时播放钢琴声',
            clearStatsTooltip: '清除错误和最慢统计',
            newSessionTooltip: '重置分数并重新开始',
            pauseTooltip: '暂停/继续',

            // Keyboard hints
            keyboardHints: '键盘：Q W E R T Y U I O P = 白键 | 2 3 5 6 7 9 0 = 黑键 | 上下箭头 = 八度',

            // MIDI status
            midiNoDevice: 'MIDI：无设备',
            midiConnected: 'MIDI：',
            midiNotSupported: '不支持MIDI',
            noMidiDevice: '未连接MIDI设备',
            connectedTo: '已连接',

            // Mobile stats
            session: '会话',

            // Rotate overlay
            rotatePhone: '请将手机横屏使用',

            // Help page
            helpTitle: '钢琴音符训练器',
            helpSubtitle: '学习识读五线谱上的音符',
            backToTraining: '返回训练',

            aboutMe: '关于作者',
            developedBy: '开发者',

            features: '功能特点',
            feature1: '互动钢琴键盘（鼠标、触摸、PC键盘或MIDI键盘）',
            feature2: 'USB MIDI键盘支持，自动检测',
            feature3: '真实三角钢琴音色',
            feature4: '支持高音谱号和低音谱号',
            feature5: '可自定义音符范围（C3-B5）',
            feature6: '智能重复系统，根据您的错误进行调整',
            feature7: '反应时间追踪',
            feature8: '统计面板（错误、最慢音符）',
            feature9: '暂停/继续，切换窗口时自动暂停',
            feature10: '深色和浅色主题',
            feature11: '多种音符命名系统（ABC、Do-Re-Mi、德语、俄语、日语、印度语）',
            feature12: '完全便携 - 只需复制文件夹',
            feature13: '无需安装',

            howToPlay: '如何使用',
            step1: '点击<strong>开始</strong>按钮',
            step2: '五线谱上出现一个音符',
            step3: '在钢琴键盘上按下正确的键',
            step4: '<strong>正确</strong> = 琴键闪绿色，进入下一个音符',
            step5: '<strong>错误</strong> = 琴键闪红色，请重试',

            keyboardControls: 'PC键盘控制',
            whiteKeys: '白键：',
            blackKeys: '黑键：',
            nextOctave: '下一个八度：',
            white: '白键',
            black: '黑键',
            octaveShift: '八度切换：',
            arrowKeys: '方向键',

            settingsTitle: '设置',
            settingCol: '设置项',
            descriptionCol: '说明',
            clefDesc: '高音谱号、低音谱号或两者（随机）',
            rangeDesc: '限制训练中出现的音符',
            noteHintsDesc: '在五线谱下方显示音符名称',
            keyLabelsDesc: '在琴键上显示音符名称',
            accidentalsDesc: '包括升号和降号（C#、D#等）',
            timerDesc: '显示/隐藏反应时间计数器',
            soundDesc: '钢琴声音开/关',
            darkDesc: '切换深色/浅色主题',

            smartRepetition: '智能重复',
            smartRepIntro: '应用程序会自动学习您在哪些音符上有困难：',
            smartRep1: '错误的音符会更频繁出现',
            smartRep2: '反应慢的音符会得到更多练习',
            smartRep3: '相邻音符不太可能重复（强制更大的跳跃）',
            smartRep4: '点击"清除统计"时重置',

            statisticsTitle: '统计',
            stats1: '<strong>错误面板：</strong>显示错误最多的音符',
            stats2: '<strong>最慢面板：</strong>显示反应时间最慢的音符',
            stats3: '统计数据在会话之间保留，直到点击"清除统计"',
            stats4: '"新会话"只重置正确/错误计数',

            midiKeyboard: 'MIDI键盘',
            midiIntro: '连接USB MIDI键盘以获得最真实的练习体验：',
            midi1: '通过USB连接您的MIDI键盘',
            midi2: '应用程序自动检测连接的设备',
            midi3: '查看键盘下方的MIDI状态指示器',
            midi4: '绿点 = 已连接并就绪',
            midi5: '灰点 = 无设备或不支持',
            browserSupport: '<strong>浏览器支持：</strong>MIDI在Chrome、Edge和Opera中可用。Firefox和Safari不支持Web MIDI - 请使用鼠标或PC键盘。',

            tipsTitle: '学习技巧',
            tip1: '从小范围开始（如C4-G4），然后逐渐扩大',
            tip2: '随着进步，关闭"音符提示"和"琴键标签"',
            tip3: '切换窗口时应用程序会自动暂停',
            tip4: '需要休息时使用暂停按钮（右上角）',
            portableNote: '<strong>便携性：</strong>将此文件夹复制到任何电脑 - 它将以相同方式工作。设置和统计数据存储在浏览器中，不会转移。'
        }
    };

    // Get current language
    function getLanguage() {
        return currentLang;
    }

    // Set language
    function setLanguage(lang) {
        if (translations[lang]) {
            currentLang = lang;
            return true;
        }
        return false;
    }

    // Get translation
    function t(key) {
        const langData = translations[currentLang] || translations.en;
        return langData[key] || translations.en[key] || key;
    }

    // Get all available languages
    function getLanguages() {
        return Object.values(LANGUAGES);
    }

    // Apply translations to the DOM
    function applyTranslations() {
        // Modal titles
        const settingsTitle = document.querySelector('#settings-modal .modal-title');
        if (settingsTitle) settingsTitle.textContent = t('settings');

        const statsTitle = document.querySelector('#stats-modal .modal-title');
        if (statsTitle) statsTitle.textContent = t('statistics');

        // Settings panel labels
        const notesLabel = document.querySelector('#settings-panel .setting-group:nth-child(1) label');
        if (notesLabel) {
            notesLabel.textContent = t('notes');
            notesLabel.title = t('notesStyleTooltip');
        }

        const rangeLabel = document.querySelector('#settings-panel .setting-group:nth-child(2) label');
        if (rangeLabel) {
            rangeLabel.textContent = t('range');
            rangeLabel.title = t('rangeTooltip');
        }

        // Range "to" text
        const rangeToSpan = document.querySelector('#settings-panel .setting-group:nth-child(2) span');
        if (rangeToSpan) rangeToSpan.textContent = t('to');

        // Toggle labels
        const toggleLabels = document.querySelectorAll('#settings-panel .toggle-label');
        const toggleKeys = ['noteHints', 'keyLabels', 'accidentals', 'timer', 'sound'];
        const toggleTooltipKeys = ['noteHintsTooltip', 'keyLabelsTooltip', 'accidentalsTooltip', 'timerTooltip', 'soundTooltip'];
        toggleLabels.forEach((label, index) => {
            if (toggleKeys[index]) {
                label.textContent = t(toggleKeys[index]);
                const toggleParent = label.closest('.toggle');
                if (toggleParent && toggleTooltipKeys[index]) {
                    toggleParent.title = t(toggleTooltipKeys[index]);
                }
            }
        });

        // Range selects tooltips
        const rangeMin = document.getElementById('range-min');
        const rangeMax = document.getElementById('range-max');
        if (rangeMin) rangeMin.title = t('rangeMinTooltip');
        if (rangeMax) rangeMax.title = t('rangeMaxTooltip');

        // Score strip labels
        const scoreLabels = document.querySelectorAll('#score-strip .score-item .label');
        const scoreKeys = ['correct', 'wrong', 'accuracy', 'streak'];
        scoreLabels.forEach((label, index) => {
            if (scoreKeys[index]) label.textContent = t(scoreKeys[index]);
        });

        // Side panels
        const missesTitle = document.querySelector('#misses-panel .panel-title');
        if (missesTitle) missesTitle.textContent = t('mistakes');

        const slowestTitle = document.querySelector('#slowest-panel .panel-title');
        if (slowestTitle) slowestTitle.textContent = t('slowest');

        const panelEmptyElements = document.querySelectorAll('.panel-empty');
        panelEmptyElements.forEach(el => {
            el.textContent = t('noneYet');
        });

        // Buttons
        const clearStatsBtn = document.getElementById('clear-stats-btn');
        if (clearStatsBtn) {
            clearStatsBtn.textContent = t('clearStats');
            clearStatsBtn.title = t('clearStatsTooltip');
        }

        const newSessionBtn = document.getElementById('new-session-btn');
        if (newSessionBtn) {
            newSessionBtn.textContent = t('newSession');
            newSessionBtn.title = t('newSessionTooltip');
        }

        // Header buttons tooltips
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) helpBtn.title = t('helpTooltip');

        const coffeeBtn = document.getElementById('coffee-btn');
        if (coffeeBtn) coffeeBtn.title = t('coffeeTooltip');

        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) settingsBtn.title = t('settingsTooltip');

        const statsBtn = document.getElementById('stats-btn');
        if (statsBtn) statsBtn.title = t('statisticsTooltip');

        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) themeBtn.title = t('themeTooltip');

        const langBtn = document.getElementById('lang-btn');
        if (langBtn) langBtn.title = t('languageTooltip');

        const pauseBtn = document.getElementById('pause-toggle-btn');
        if (pauseBtn) pauseBtn.title = t('pauseTooltip');

        // Keyboard hints
        const keyboardHintsSpan = document.querySelector('#keyboard-hints > span');
        if (keyboardHintsSpan) keyboardHintsSpan.textContent = t('keyboardHints');

        // MIDI status
        const midiStatus = document.getElementById('midi-status');
        if (midiStatus) {
            const midiText = midiStatus.querySelector('.midi-text');
            const midiDot = midiStatus.querySelector('.midi-dot');
            if (midiText && midiDot) {
                if (midiDot.classList.contains('disconnected')) {
                    midiText.textContent = t('midiNoDevice');
                    midiStatus.title = t('noMidiDevice');
                }
                // Connected state is handled dynamically in keyboard.js
            }
        }

        // Rotate overlay
        const rotateText = document.querySelector('.rotate-text');
        if (rotateText) rotateText.textContent = t('rotatePhone');
    }

    // Detect browser language
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        return translations[langCode] ? langCode : 'en';
    }

    return {
        getLanguage,
        setLanguage,
        t,
        getLanguages,
        applyTranslations,
        detectBrowserLanguage,
        LANGUAGES
    };
})();
