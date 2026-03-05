const urlParams = new URLSearchParams(window.location.search);
if (!urlParams.has('fromSearch')) {
    const lastRef = localStorage.getItem('lastBibleRef');
    const lastLang = localStorage.getItem('lastBibleLang');
    if (lastRef) {
        window.location.href = `reader.html?ref=${encodeURIComponent(lastRef)}&lang=${lastLang || 'ukr'}`;
    }
}
// --- 1. ОГОЛОШЕННЯ ЗМІННИХ ---
(function() {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const countDisplay = document.getElementById('resultCount');
    const langToggle = document.getElementById('langToggle');
    const exactMatch = document.getElementById('exactMatch');
    const copyRefsBtn = document.getElementById('copyRefsBtn');
    const fontSizeRange = document.getElementById('fontSizeRange');

    window.currentLang = localStorage.getItem('selectedLang') || 'ukr';
    window.currentLangData = {};

        // Допоміжна функція для обробки кліку та збереження стану
        function handleRefClick(el, ref) {
            // 1. Зберігаємо в пам'ять сесії, що це посилання натиснуте
            let clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
            if (!clickedRefs.includes(ref)) {
                clickedRefs.push(ref);
                sessionStorage.setItem('clickedRefs', JSON.stringify(clickedRefs));
            }
            // 2. Додаємо клас візуально
            el.classList.add('clicked');
            // ВАЖЛИВО: Оновлюємо збережений HTML перед переходом
            saveState();
            // 3. Переходимо
            window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
        }
        
        function renderDirectResult(ref, text) {
            if (!resultsDiv) return;
            const div = document.createElement('div');
            div.className = 'verse';
            // Перевіряємо, чи було натиснуто раніше
            const clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
            const isClicked = clickedRefs.includes(ref) ? 'clicked' : '';
            
            div.innerHTML = `<span class="ref ${isClicked}">${ref}</span> ${text}`;
            div.querySelector('.ref').onclick = function() {
                handleRefClick(this, ref);
            };
            resultsDiv.appendChild(div);
        }
        
        function addVerseToFragment(fragment, ref, htmlContent) {
            const div = document.createElement('div');
            div.className = 'verse'; 
            const clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
            const isClicked = clickedRefs.includes(ref) ? 'clicked' : '';
        
            div.innerHTML = `<span class="ref ${isClicked}">${ref}</span> ${htmlContent}`;
            div.querySelector('.ref').onclick = function() {
                handleRefClick(this, ref);
            };
            fragment.appendChild(div);
        }

    window.performSearch = function() {
        const query = searchInput.value.trim();
        if (!resultsDiv) return;
        resultsDiv.innerHTML = '';
        if (query.length < 2) { 
            if (countDisplay) countDisplay.innerText = '0'; 
            return; 
        }

        // Додано a-zA-Z (латиниця) та \u0370-\u03FF (грецька)
        // Додано підтримку іспанських акцентів: áéíóúÁÉÍÓÚñÑ
        const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐ\u0370-\u03FFñÑáéíóúÁÉÍÓÚ][A-Za-zА-Яа-яІіЇЄєҐ'ыэё\u0370-\u03FFñÑáéíóúÁÉÍÓÚ]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
        const match = query.match(refRegex);

        // Знаходимо цей блок у вашому script.js:
        if (match) {
            const bookInput = match[1].trim().toLowerCase().replace(/\.$/, "");
            
            // ПЕРЕВІРКА: чи існує об'єкт maps взагалі
            if (typeof maps === 'undefined') {
                console.error("Критична помилка: файл biblemaps.js не завантажений!");
                return;
            }
        
            const currentMap = maps[window.currentLang];
            if (!currentMap) {
                console.error("Мапа для мови не знайдена:", window.currentLang);
                return;
            }
        
            const fullBookName = currentMap[bookInput];
        
            if (fullBookName) {
                let combinedText = "";
                let foundAny = false;
                
                for (let v = vStart; v <= vEnd; v++) {
                    // Складаємо ключ так, як він зберігається у ваших JSON (напр. "Від Матвія 5:3")
                    const refKey = `${fullBookName} ${chapter}:${v}`;
                    const refPadded = `${fullBookName} ${chapter}:${String(v).padStart(2, '0')}`;
                    
                    const text = window.currentLangData[refKey] || window.currentLangData[refPadded];
                    
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
                    saveState();
                    return; // Перериваємо функцію, бо знайшли пряме посилання
                }
            }
        }

        let count = 0;
        const isExact = exactMatch ? exactMatch.checked : false;
        const fragment = document.createDocumentFragment();

        if (isExact) {
            let regex;
            try {
                // Знайдіть цей рядок у performSearch і замініть pattern:
                // Додано підтримку іспанських символів: ñ, á, é, í, ó, ú
                const pattern = `(?<![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁ\\u0370-\\u03FF\\u0100-\\u017FñÑáéíóúÁÉÍÓÚ])${query}(?![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁ\\u0370-\\u03FF\\u0100-\\u017FñÑáéíóúÁÉÍÓÚ])`;
                regex = new RegExp(pattern, 'gi');
            } catch (e) { return; }
            for (const ref in window.currentLangData) {
                const text = window.currentLangData[ref];
                if (text.match(regex)) {
                    count++;
                    addVerseToFragment(fragment, ref, text.replace(regex, '<mark>$&</mark>'));
                    if (count >= 500) break;
                }
            }
        } else {
            const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
            if (searchWords.length === 0) return;
            for (const ref in window.currentLangData) {
                const text = window.currentLangData[ref];
                const textLower = text.toLowerCase();
                if (searchWords.every(word => textLower.includes(word))) {
                    count++;
                    let highlightedText = text;
                    searchWords.forEach(word => {
                        const cleanWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        highlightedText = highlightedText.replace(new RegExp(`(${cleanWord})`, 'gi'), '<mark>$1</mark>');
                    });
                    addVerseToFragment(fragment, ref, highlightedText);
                    if (count >= 500) break;
                }
            }
        }
        resultsDiv.appendChild(fragment);
        if (countDisplay) countDisplay.innerText = count;
        saveState();
    };

function saveState() {
    sessionStorage.setItem('lastSearchResults', resultsDiv.innerHTML);
    sessionStorage.setItem('lastSearchQuery', searchInput.value);
    sessionStorage.setItem('lastSearchLang', window.currentLang); // Зберігаємо мову
    sessionStorage.setItem('lastResultCount', countDisplay ? countDisplay.innerText : '0');
}

window.loadLanguage = function(langCode) {
    const fileMap = {
        'ukr': 'bibleTextUA.json',
        'ru': 'bibleTextRU.json',
        'en': 'bibleTextEN.json',
        'pl': 'bibleTextPL.json',
        'es': 'bibleTextES.json', // ПЕРЕВІРТЕ: на GitHub файл має бути точно bibleTextES.json
        'el': 'bibleTextGR.json'
    };

    const fileName = fileMap[langCode] || 'bibleTextUA.json';

    fetch(fileName)
        .then(res => {
            if (!res.ok) throw new Error(`404: Файл ${fileName} не знайдено`);
            return res.json(); // Використовуємо .json() напряму, це надійніше
        })
        .then(data => {
            window.currentLangData = data;
            console.log("Успішно завантажено:", langCode);
            // Виконуємо пошук, якщо в полі вже щось є
            if (searchInput && searchInput.value.length >= 2) {
                window.performSearch();
            }
        })
        .catch(err => {
            console.error("Помилка завантаження мови:", err.message);
            // Виводимо підказку в результати, щоб ви бачили проблему на телефоні
            if (resultsDiv) resultsDiv.innerHTML = `<p style="color:red; padding:20px;">Помилка: ${err.message}. Перевірте назву файлу на GitHub.</p>`;
        });
};
if (langToggle) {
    const availableLangs = ['ukr', 'ru', 'en', 'pl', 'es', 'el'];

langToggle.onclick = () => {
    let currentIndex = availableLangs.indexOf(window.currentLang);
    let nextIndex = (currentIndex + 1) % availableLangs.length;
    window.currentLang = availableLangs[nextIndex];

    const displayNames = {
        'ukr': 'UA', 'ru': 'RU', 'en': 'EN', 
        'pl': 'PL', 'es': 'ES', 'el': 'GR'
    };
    langToggle.innerText = displayNames[window.currentLang];

    // 1. ОЧИЩАЄМО ЕКРАН ВІДРАЗУ (щоб польська не висіла)
    resultsDiv.innerHTML = ""; 
    if (countDisplay) countDisplay.innerText = "0";
    
    // 2. ОЧИЩАЄМО ДАНІ (щоб старий пошук не спрацював на старих даних)
    window.currentLangData = {}; 
    
    // 3. ОЧИЩАЄМО СЕСІЮ
    sessionStorage.removeItem('lastSearchResults');
    sessionStorage.removeItem('lastSearchQuery');

    localStorage.setItem('selectedLang', window.currentLang);
    
    // 4. ЗАВАНТАЖУЄМО ІСПАНСЬКУ
    window.loadLanguage(window.currentLang);
};
    
    const displayNames = { 'ukr': 'UA', 'ru': 'RU', 'en': 'EN', 'pl': 'PL', 'es': 'ES', 'el': 'GR' };
    langToggle.innerText = displayNames[window.currentLang] || 'UA';
}

    if (searchInput) {
        searchInput.oninput = window.performSearch;
        searchInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐ\u0370-\u03FF][A-Za-zА-Яа-яІіЇЄєҐ'ыэё\u0370-\u03FF]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
                const match = query.match(refRegex);
                if (match) {
                    const book = maps[window.currentLang][match[1].trim().toLowerCase().replace(/\.$/, "")];
                    if (book) {
                        let r = `${book} ${match[2]}:${match[3] || "1"}`;
                        if (match[4]) r += `-${match[4]}`;
                        window.location.href = `reader.html?ref=${encodeURIComponent(r)}&lang=${window.currentLang}`;
                        return;
                    }
                }
                window.performSearch();
            }
        };
    }

    if (exactMatch) exactMatch.onchange = window.performSearch;
    if (fontSizeRange) {
        const savedSize = localStorage.getItem('searchFontSize') || '19';
        fontSizeRange.value = savedSize;
        resultsDiv.style.fontSize = savedSize + 'px';
        fontSizeRange.oninput = () => {
            resultsDiv.style.fontSize = fontSizeRange.value + 'px';
            localStorage.setItem('searchFontSize', fontSizeRange.value);
        };
    }

    if (copyRefsBtn) {
        copyRefsBtn.onclick = () => {
            const refs = Array.from(resultsDiv.querySelectorAll('.ref')).map(el => el.innerText.replace('● ', '').trim()).join(', ');
            if (!refs) return;
            navigator.clipboard.writeText(refs).then(() => {
                const old = copyRefsBtn.innerText;    
                copyRefsBtn.innerText = '✅';
                setTimeout(() => copyRefsBtn.innerText = old, 2000);
            });
        };
    }

    window.loadLanguage(window.currentLang);
})();
