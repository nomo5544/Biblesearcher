const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐ\u0370-\u03FFñÑáéíóúÁÉÍÓÚ][A-Za-zА-Яа-яІіЇЄєҐ'ыэё\u0370-\u03FFñÑáéíóúÁÉÍÓÚ]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;

let currentLang = localStorage.getItem('lastBibleLang') || 'ukr';
let currentLangData = null;

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const countDisplay = document.getElementById('countDisplay');
const langBtn = document.getElementById('langBtn');

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query || !currentLangData) {
        resultsContainer.innerHTML = "";
        countDisplay.innerText = "0";
        return;
    }

    // Рядок для збереження запиту (щоб не зникав при поверненні)
    localStorage.setItem('lastSearchQuery', query);

    const match = query.match(refRegex);
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
                    const ref = `${book} ${chapter}:${vStart}${vEnd !== vStart ? '-' + vEnd : ''}`;
                    resultsContainer.innerHTML = `
                        <div class="result-item" onclick="goToReader('${ref}')">
                            <div class="result-ref">${ref}</div>
                            <div class="result-text">${combinedText}</div>
                        </div>`;
                    countDisplay.innerText = "1";
                    return;
                }
            }
        }
    }

    let resultsHtml = "";
    let count = 0;
    for (const [ref, text] of Object.entries(currentLangData)) {
        if (text.toLowerCase().includes(query)) {
            resultsHtml += `
                <div class="result-item" onclick="goToReader('${ref}')">
                    <div class="result-ref">${ref}</div>
                    <div class="result-text">${text.replace(new RegExp('(' + query + ')', 'gi'), '<mark>$1</mark>')}</div>
                </div>`;
            count++;
            if (count >= 50) break;
        }
    }
    resultsContainer.innerHTML = resultsHtml;
    countDisplay.innerText = count;
}

function goToReader(ref) {
    window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${currentLang}`;
}

function loadLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lastBibleLang', lang);
    
    const fileMap = {
        'ukr': 'bibleTextUA.json',
        'rus': 'bibleTextRU.json'
    };

    const displayNames = { 'ukr': 'UA', 'rus': 'RU' };
    if (langBtn) langBtn.innerText = displayNames[lang] || 'UA';

    fetch(fileMap[lang] || 'bibleTextUA.json')
        .then(r => r.json())
        .then(data => {
            currentLangData = data;
            
            // ВІДНОВЛЕННЯ ПОШУКУ
            const savedQuery = localStorage.getItem('lastSearchQuery');
            if (savedQuery) {
                searchInput.value = savedQuery;
                performSearch();
            }
        });
}

langBtn.onclick = () => {
    loadLanguage(currentLang === 'ukr' ? 'rus' : 'ukr');
};

searchInput.oninput = performSearch;

searchInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
        const first = resultsContainer.querySelector('.result-item');
        if (first) first.click();
    }
};

loadLanguage(currentLang);
