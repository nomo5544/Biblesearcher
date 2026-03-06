// 1. ОГОЛОШЕННЯ РЕГУЛЯРНОГО ВИРАЗУ
const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐ\u0370-\u03FFñÑáéíóúÁÉÍÓÚ][A-Za-zА-Яа-яІіЇЄєҐ'ыэё\u0370-\u03FFñÑáéíóúÁÉÍÓÚ]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;

// 2. ІНІЦІАЛІЗАЦІЯ
let currentLang = localStorage.getItem('lastBibleLang') || 'ukr';
let currentLangData = null;

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const countDisplay = document.getElementById('countDisplay');
const langBtn = document.getElementById('langBtn');

// 3. ФУНКЦІЯ ПОШУКУ
function performSearch() {
    if (!searchInput || !resultsContainer) return;
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query || !currentLangData) {
        resultsContainer.innerHTML = "";
        if (countDisplay) countDisplay.innerText = "0";
        return;
    }

    // Запам'ятовуємо слово
    localStorage.setItem('lastSearchQuery', query);

    const match = query.match(refRegex);
    
    // ПРЯМЕ ПОСИЛАННЯ (Використовуємо ваші класи)
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
                        combinedText += v + " " + text + " ";
                        found = true;
                    }
                }
                if (found) {
                    const fullRef = book + " " + chapter + ":" + vStart + (vEnd !== vStart ? "-" + vEnd : "");
                    resultsContainer.innerHTML = `
                        <div class="result-item" onclick="goToReader('${fullRef}')">
                            <div class="result-ref">${fullRef}</div>
                            <div class="result-text">${combinedText}</div>
                        </div>`;
                    if (countDisplay) countDisplay.innerText = "1";
                    return;
                }
            }
        }
    }

    // ПОШУК ЗА СЛОВАМИ
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
            if (count >= 50) break;
        }
    }
    resultsContainer.innerHTML = resultsHtml;
    if (countDisplay) countDisplay.innerText = count;
}

function highlight(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
}

function goToReader(ref) {
    window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${currentLang}`;
}

// 4. ЗАВАНТАЖЕННЯ МОВИ
function loadLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lastBibleLang', lang);
    
    const fileMap = {
        'ukr': 'bibleTextUA.json', 
        'rus': 'bibleTextRU.json', 
        'en': 'bibleTextEN.json',
        'pl': 'bibleTextPL.json', 
        'es': 'bibleTextES.json', 
        'gr': 'bibleTextGR.json'
    };

    const displayNames = { 'ukr':'UA', 'rus':'RU', 'en':'EN', 'pl':'PL', 'es':'ES', 'gr':'GR' };
    if (langBtn) langBtn.innerText = displayNames[lang] || 'UA';

    fetch(fileMap[lang] || 'bibleTextUA.json')
        .then(r => r.json())
        .then(data => {
            currentLangData = data;
            
            // ВІДНОВЛЕННЯ ПОШУКУ ПРИ ПОВЕРНЕННІ
            const savedQuery = localStorage.getItem('lastSearchQuery');
            if (savedQuery && searchInput) {
                searchInput.value = savedQuery;
                performSearch();
            }
        })
        .catch(err => console.error("Error:", err));
}

// 5. ОБРОБНИКИ ПОДІЙ (з перевіркою на існування елементів)
if (langBtn) {
    langBtn.onclick = () => {
        const langs = ['ukr', 'rus', 'en', 'pl', 'es', 'gr'];
        let idx = (langs.indexOf(currentLang) + 1) % langs.length;
        loadLanguage(langs[idx]);
    };
}

if (searchInput) {
    searchInput.oninput = performSearch;
    searchInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const firstResult = resultsContainer ? resultsContainer.querySelector('.result-item') : null;
            if (firstResult) firstResult.click();
        }
    };
}

// Початковий запуск
loadLanguage(currentLang);
