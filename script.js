// --- 1. ОГОЛОШЕННЯ ЗМІННИХ ---
// (IIFE) Самовиклична функція для ізоляції області видимості
(function() {
    // Ініціалізація DOM-елементів (пошук, результати, перемикачі тощо)
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const countDisplay = document.getElementById('resultCount');
    const langToggle = document.getElementById('langToggle');
    const exactMatch = document.getElementById('exactMatch');
    const copyRefsBtn = document.getElementById('copyRefsBtn');
    const fontSizeRange = document.getElementById('fontSizeRange');

    // Налаштування поточної мови з локального сховища або за замовчуванням
    window.currentLang = localStorage.getItem('selectedLang') || 'ukr';
    window.currentLangData = {};

// --- СЛОВНИКИ ДЛЯ ОБОХ МОВ ---
// Об'єкт 'maps' містить мапінг скорочень та варіантів назв книг на їхні повні назви (UA/RU)
const maps = {
    ukr: { /* скорочення для української Біблії */ },
    ru: { /* сокращения для русской Библии */ }
};

    // --- 2. ФУНКЦІЇ ВІДОБРАЖЕННЯ (Без жирного шрифту) ---
    
    // Функція для відображення результату, коли знайдено пряме посилання (напр. Буття 1:1)
    function renderDirectResult(ref, text) {
        if (!resultsDiv) return;
        const div = document.createElement('div');
        div.className = 'verse';
        div.innerHTML = `<span class="ref" style="color: #CD00CD; cursor:pointer; font-weight: normal;">● ${ref}</span> ${text}`;
        // Додає обробник кліку для переходу в режим читання
        div.querySelector('.ref').addEventListener('click', () => {
            window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
        });
        resultsDiv.appendChild(div);
    }

    // Функція для додавання знайденого вірша у тимчасовий фрагмент (для оптимізації рендерингу)
    function addVerseToFragment(fragment, ref, htmlContent) {
        const div = document.createElement('div');
        div.className = 'verse'; 
        div.innerHTML = `<span class="ref" style="cursor:pointer; color: #0000EE; font-weight: normal;">${ref}</span> ${htmlContent}`;
        // Додає обробник кліку для переходу в режим читання
        div.querySelector('.ref').addEventListener('click', () => {
            window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
        });
        fragment.appendChild(div);
    }

    // --- 3. ГОЛОВНА ФУНКЦІЯ ПОШУКУ ---
    // Основна логіка: розпізнає посилання на вірш або шукає за словами в тексті
    window.performSearch = function() {
        const query = searchInput.value.trim();
        if (!resultsDiv) return;
        resultsDiv.innerHTML = '';
        
        // Мінімальна довжина запиту — 2 символи
        if (query.length < 2) { 
            if (countDisplay) countDisplay.innerText = '0'; 
            return; 
        }

        // Регулярний вираз для розпізнавання формату "Книга розділ:вірш"
        const refRegex = /^(\d?\s?[А-Яа-яІіЇЄєҐыЫэЭёЁ][а-яіїєґ'ыэё]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
        const match = query.match(refRegex);

        // Блок обробки пошуку за посиланням (якщо введено назву книги)
        if (match && typeof maps !== 'undefined') {
            const bookInput = match[1].trim().toLowerCase().replace(/\.$/, "");
            const chapter = match[2];
            const vStart = parseInt(match[3] || "1");
            const vEnd = match[4] ? parseInt(match[4]) : vStart;
            
            const currentMap = maps[window.currentLang];
            const fullBookName = currentMap ? currentMap[bookInput] : null;

            if (fullBookName) {
                let combinedText = "";
                let foundAny = false;
                for (let v = vStart; v <= vEnd; v++) {
                    const ref = `${fullBookName} ${chapter}:${v}`;
                    const refPadded = `${fullBookName} ${chapter}:${String(v).padStart(2, '0')}`;
                    const text = window.currentLangData[ref] || window.currentLangData[refPadded];
                    if (text) {
                        combinedText += `<b style="color: #888; font-size: 0.8em; margin-left: 5px;">${v}</b> ${text} `;
                        foundAny = true;
                    }
                }
                if (foundAny) {
                    let displayRef = `${fullBookName} ${chapter}:${vStart}`;
                    if (match[4]) displayRef += `-${vEnd}`;
                    renderDirectResult(displayRef, combinedText);
                    if (countDisplay) countDisplay.innerText = '1';
                    return; 
                }
            }
        }

        // Блок текстового пошуку (якщо запит — це просто слова)
        let count = 0;
        const isExact = exactMatch ? exactMatch.checked : false;
        const fragment = document.createDocumentFragment();

        if (isExact) {
            // Пошук точного збігу цілого слова через регулярний вираз
            let regex;
            try {
                const pattern = `(?<![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁ])${query}(?![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁ])`;
                regex = new RegExp(pattern, 'gi');
            } catch (e) { return; }

            for (const ref in window.currentLangData) {
                const text = window.currentLangData[ref];
                if (text.match(regex)) {
                    count++;
                    addVerseToFragment(fragment, ref, text.replace(regex, '<mark>$&</mark>'));
                    if (count >= 500) break; // Обмеження виводу до 500 результатів
                }
            }
        } else {
            // Звичайний пошук (всі слова мають бути присутні у вірші в будь-якому порядку)
            const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
            if (searchWords.length === 0) return;

            for (const ref in window.currentLangData) {
                const text = window.currentLangData[ref];
                const textLower = text.toLowerCase();
                const matchesAll = searchWords.every(word => textLower.includes(word));

                if (matchesAll) {
                    count++;
                    let highlightedText = text;
                    searchWords.forEach(word => {
                        const cleanWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const highlightRegex = new RegExp(`(${cleanWord})`, 'gi');
                        highlightedText = highlightedText.replace(highlightRegex, '<mark>$1</mark>');
                    });
                    addVerseToFragment(fragment, ref, highlightedText);
                    if (count >= 500) break;
                }
            }
        }
        resultsDiv.appendChild(fragment);
        if (countDisplay) countDisplay.innerText = count;
    };

    // --- 4. ЗАВАНТАЖЕННЯ ---
    // Функція для завантаження JSON-файлу з текстом Біблії залежно від обраної мови
    window.loadLanguage = function(langCode) {
        const fileName = langCode === 'ukr' ? 'bibleTextUA.json' : 'bibleTextRU.json';
        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                window.currentLangData = data;
                // Якщо в полі пошуку вже щось є — оновити результати
                if (searchInput.value.trim().length >= 2) window.performSearch();
            })
            .catch(err => console.error("Файл не знайдено:", fileName));
    };

    // --- 5. ОБРОБНИКИ ПОДІЙ ---
    
    // Обробник перемикача мови
    if (langToggle) {
        langToggle.onclick = () => {
            window.currentLang = (window.currentLang === 'ukr') ? 'ru' : 'ukr';
            langToggle.innerText = window.currentLang === 'ukr' ? 'UA' : 'RU';
            localStorage.setItem('selectedLang', window.currentLang);
            window.loadLanguage(window.currentLang);
        };
    }

    // Живий пошук при введенні тексту або зміні на
