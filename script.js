// 1. ОГОЛОШЕННЯ РЕГУЛЯРНОГО ВИРАЗУ (Універсальний)
const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐ\u0370-\u03FFñÑáéíóúÁÉÍÓÚ][A-Za-zА-Яа-яІіЇЄєҐ'ыэё\u0370-\u03FFñÑáéíóúÁÉÍÓÚ]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;

// 2. ІНІЦІАЛІЗАЦІЯ ЗМІННИХ
let currentLang = localStorage.getItem('lastBibleLang') || 'ukr';
let currentLangData = null;

// Елементи DOM
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const countDisplay = document.getElementById('countDisplay');
const langBtn = document.getElementById('langBtn');

// 3. ФУНКЦІЯ ПОШУКУ
window.performSearch = function() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query || !currentLangData) {
        resultsContainer.innerHTML = "";
        countDisplay.innerText = "0";
        return;
    }

    // Зберігаємо запит, щоб він не зникав
    localStorage.setItem('lastSearchQuery', query);

    const match = query.match(refRegex);
    
    // ЛОГІКА ПРЯМОГО ПОСИЛАННЯ (напр. Мат 2.23)
    if (match) {
        const bookInput = match[1].trim().toLowerCase().replace(/\.$/, "");
        if (typeof maps !== 'undefined' && maps[currentLang]) {
            const book = maps[currentLang][bookInput];
            if (book) {
                const chapter = match[2];
                const vStart = parseInt(match[3]) || 1;
                const vEnd = match[4] ? parseInt(match[4]) : (match[3] ? parseInt(match[3]) : vStart);
                
                let combinedText = "";
                let found = false;
                for (let v = vStart; v <= vEnd; v++) {
                    const key = `${book} ${chapter}:${v}`;
                    const text = currentLangData[key];
                    if (text) {
                        combinedText += `<b style="color:#888;">${v}</b> ${text} `;
                        found = true;
                    }
                }
                if (found) {
                    renderDirectResult(`${book} ${chapter}:${vStart}${vEnd !== vStart ? '-'+vEnd : ''}`, combinedText);
                    countDisplay.innerText = "1";
                    return;
                }
            }
        }
    }

    // ЗВИЧАЙНИЙ ПОШУК ЗА СЛОВАМИ
    let resultsHtml = "";
    let count = 0;
    for (const [ref, text] of Object.entries(currentLangData)) {
        if (text.toLowerCase().includes(query)) {
            resultsHtml += `
                <div class="result-item" onclick="goToReader('${ref}')">
                    <div class="result-ref">${ref}</div>
                    <div class="result-text">${highlight(text, query)}</div>
                </div>`;
            count++;
            if (count >= 50) break; // Обмеження для швидкості
        }
    }
    resultsContainer.innerHTML = resultsHtml;
    countDisplay.innerText = count;
};

// 4. ДОПОМІЖНІ ФУНКЦІЇ
function highlight(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
}

function renderDirectResult(ref, text) {
    resultsContainer.innerHTML = `
        <div class="result-item direct" onclick="goToReader('${ref}')">
            <div class="result-ref">${ref}</div>
            <div class="result-text">${text}</div>
        </div>`;
}

window.goToReader = function(ref) {
    window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${currentLang}`;
};

// 5. ЗАВАНТАЖЕННЯ ДАНИХ ТА МОВИ
function loadLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lastBibleLang', lang);
    
    const fileMap = {
        'ukr': 'bibleTextUA.json',
        'rus': 'bibleTextRU.json',
        'en': 'bibleTextEN.json',
        'pl': 'bibleTextPL.json',
        'es': 'bibleTextES.json',
        'el': 'bibleTextGR.json' // Виправлено для грецької
    };

    const displayNames = { 'ukr':'UA', 'rus':'RU', 'en':'EN', 'pl':'PL', 'es':'ES', 'el':'GR' };
    if (langBtn) langBtn.innerText = displayNames[lang] || 'UA';

    fetch(fileMap[lang] || 'bibleTextUA.json')
        .then(r => r.json())
        .then(data => {
            currentLangData = data;
            // ЯКЩО БУВ ЗАПИТ — ВІДНОВЛЮЄМО ЙОГО
            const savedQuery = localStorage.getItem('lastSearchQuery');
            if (savedQuery) {
                searchInput.value = savedQuery;
                window.performSearch();
            }
        });
}

// 6. ОБРОБНИКИ ПОДІЙ
if (langBtn) {
    langBtn.onclick = () => {
        const langs = ['ukr', 'rus', 'en', 'pl', 'es', 'el'];
        let idx = (langs.indexOf(currentLang) + 1) % langs.length;
        loadLanguage(langs[idx]);
    };
}

if (searchInput) {
    searchInput.oninput = window.performSearch;
    searchInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.performSearch();
        }
    };
}

// ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ
loadLanguage(currentLang);
