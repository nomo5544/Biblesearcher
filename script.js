// ПЕРШИЙ РЯДОК ФАЙЛУ script.js
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

    // ОНОВЛЕНИЙ МАСИВ МОВ
    const languages = ['ua', 'ru', 'en', 'pl', 'es', 'gr'];

    const maps = {
        ukr: {
            "бут": "Буття", "буття": "Буття", "вих": "Вихід", "вихід": "Вихід", "лев": "Левит", "левит": "Левит",
            "чис": "Числа", "числа": "Числа", "повт": "Повторення Закону", "повторення": "Повторення Закону", "втор": "Повторення Закону",
            "ісН": "Ісус Навин", "нав": "Ісус Навин", "суд": "Судді", "суддів": "Судді", "рут": "Рут", "Рути": "Рут",
            "1сам": "1 Самуїлова", "1самуїлова": "1 Самуїлова", "1 сам": "1 Самуїлова", "2сам": "2 Самуїлова", "2самуїлова": "2 Самуїлова", "2 сам": "2 Самуїлова",
            "1цар": "1 Царів", "1царів": "1 Царів", "1 цар": "1 Царів", "2цар": "2 Царів", "2царів": "2 Царів", "2 цар": "2 Царів",
            "1хр": "1 Хронік", "1хронік": "1 Хронік", "1 хр": "1 Хронік", "2хр": "2 Хронік", "2Хронік": "2 Хронік", "2 хр": "2 Хронік",
            "езд": "Ездра", "неем": "Неемія", "ест": "Естер", "йов": "Йов", "пс": "Псалми", "псалми": "Псалми",
            "прип": "Приповісті", "еккл": "Екклезіаст", "пісн": "Пісня Пісень", "іс": "Ісая", "єр": "Єремія", "плач": "Плач Єремії",
            "єзк": "Єзекіїль", "дан": "Даниїл", "ос": "Осія", "йоіл": "Йоіл", "ам": "Амос", "ов": "Овдій", "йона": "Йона",
            "мих": "Михей", "наум": "Наум", "авк": "Авакум", "соф": "Софонія", "ог": "Огій", "зах": "Захарія", "мал": "Малахія",
            "мат": "Від Матвія", "мар": "Від Марка", "лук": "Від Луки", "ів": "Від Івана", "дії": "Дії Апостолів", "рим": "До Римлян",
            "1кор": "1 до Коринтян", "2кор": "2 до Коринтян", "гал": "До Галатів", "еф": "До Ефесян", "фил": "До Филип'ян",
            "кол": "До Колосян", "1сол": "1 до Солунян", "2сол": "2 до Солунян", "1тим": "1 до Тимофія", "2тим": "2 до Тимофія",
            "тит": "До Тита", "флм": "До Пилимона", "євр": "До Євреїв", "як": "Якова", "1пет": "1 Петра", "2пет": "2 Петра",
            "1ів": "1 Івана", "2ів": "2 Івана", "3ів": "3 Івана", "юди": "Юди", "об": "Об'явлення"
        },
        ru: {
            "быт": "Бытие", "исх": "Исход", "лев": "Левит", "чис": "Числа", "втор": "Второзаконие", "нав": "Иисус Навин",
            "суд": "Судьи", "руф": "Руфь", "1цар": "1 Царств", "2цар": "2 Царств", "3цар": "3 Царств", "4цар": "4 Царств",
            "1пар": "1 Паралипоменон", "2пар": "2 Паралипоменон", "езд": "Ездра", "неем": "Неемия", "есф": "Есфирь",
            "иов": "Иов", "пс": "Псалтирь", "прит": "Притчи", "ekkl": "Екклезиаст", "песн": "Песнь Песней", "ис": "Исаия",
            "иер": "Иеремия", "плач": "Плач Иеремии", "иез": "Иезекииль", "дан": "Даниил", "ос": "Осия", "иоил": "Иоиль",
            "ам": "Амос", "авд": "Авдий", "ион": "Иона", "мих": "Михей", "наум": "Наум", "авв": "Аввакум", "соф": "Софония",
            "агг": "Аггей", "зах": "Захария", "мал": "Малахия", "мф": "Матфея", "мк": "Марка", "лк": "Луки", "ин": "Иоанна",
            "деян": "Деяния", "иак": "Иакова", "1пет": "1 Петра", "2пет": "2 Петра", "1иоан": "1 Иоанна", "2иоан": "2 Иоанна",
            "3иоан": "3 Иоанна", "иуд": "Иуды", "рим": "Римлянам", "1кор": "1 Коринфянам", "2кор": "2 Коринфянам",
            "гал": "Галатам", "еф": "Ефесянам", "фил": "Филиппийцам", "кол": "Колоссянам", "1фес": "1 Фессалоникийцам",
            "2фес": "2 Фессалоникийцам", "1тим": "1 Тимофею", "2тим": "2 Тимофею", "тит": "Титу", "флм": "Филимону",
            "евр": "Евреям", "откр": "Откровение"
        },
        // Спрощені карти для пошуку в інших мовах (назва книги = ключ)
        en: { "gen": "Genesis", "exo": "Exodus", "mat": "Matthew" }, 
        pl: { "dz": "Dzieje Apostolskie", "mat": "Mateusza" },
        es: { "gen": "Génesis", "mat": "Mateo" },
        gr: { "mat": "κατά Ματθαίον" }
    };

    function handleRefClick(el, ref) {
        let clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
        if (!clickedRefs.includes(ref)) {
            clickedRefs.push(ref);
            sessionStorage.setItem('clickedRefs', JSON.stringify(clickedRefs));
        }
        el.classList.add('clicked');
        saveState();
        window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
    }

    function renderDirectResult(ref, text) {
        if (!resultsDiv) return;
        const div = document.createElement('div');
        div.className = 'verse';
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

        const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐыЫэЭёЁ\u0370-\u03FFñÑáéíóúÁÉÍÓÚ][a-zа-яіїєґ'ыэё\u0370-\u03FFñÑáéíóúÁÉÍÓÚ]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
        const match = query.match(refRegex);

        if (match) {
            const bookInput = match[1].trim().toLowerCase().replace(/\.$/, "");
            const chapter = match[2];
            const vStart = parseInt(match[3] || "1");
            const vEnd = match[4] ? parseInt(match[4]) : vStart;
            const currentMap = maps[window.currentLang] || {};
            const fullBookName = currentMap[bookInput] || bookInput;

            let combinedText = "";
            let foundAny = false;
            for (let v = vStart; v <= vEnd; v++) {
                const ref = `${fullBookName} ${chapter}:${v}`;
                const text = window.currentLangData[ref];
                if (text) {
                    combinedText += `<b style="color: #888; font-size: 0.8em; margin-left: 5px;">${v}</b> ${text} `;
                    foundAny = true;
                }
            }
            if (foundAny) {
                let displayRef = `${fullBookName} ${chapter}:${vStart}${match[4] ? '-' + vEnd : ''}`;
                renderDirectResult(displayRef, combinedText);
                if (countDisplay) countDisplay.innerText = '1';
                saveState();
                return; 
            }
        }

        let count = 0;
        const isExact = exactMatch ? exactMatch.checked : false;
        const fragment = document.createDocumentFragment();

        const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
        if (searchWords.length === 0) return;

        for (const ref in window.currentLangData) {
            const text = window.currentLangData[ref];
            const textLower = text.toLowerCase();
            
            let isMatch = false;
            if (isExact) {
                const regex = new RegExp(`(?<![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁñÑáéíóúÁÉÍÓÚ])${query}(?![a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9ыЫэЭёЁñÑáéíóúÁÉÍÓÚ])`, 'gi');
                isMatch = !!text.match(regex);
            } else {
                isMatch = searchWords.every(word => textLower.includes(word));
            }

            if (isMatch) {
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
        resultsDiv.appendChild(fragment);
        if (countDisplay) countDisplay.innerText = count;
        saveState();
    };

    function saveState() {
        sessionStorage.setItem('lastSearchResults', resultsDiv.innerHTML);
        sessionStorage.setItem('lastSearchQuery', searchInput.value);
        sessionStorage.setItem('lastResultCount', countDisplay ? countDisplay.innerText : '0');
    }

    window.loadLanguage = function(langCode) {
        const fileMap = {
            ukr: 'bibleTextUA.json', ru: 'bibleTextRU.json', en: 'bibleTextEN.json',
            pl: 'bibleTextPL.json', es: 'bibleTextES.json', gr: 'bibleTextGR.json'
        };
        fetch(fileMap[langCode] || 'bibleTextUA.json')
            .then(res => res.json())
            .then(data => {
                window.currentLangData = data;
                const savedHTML = sessionStorage.getItem('lastSearchResults');
                if (savedHTML && resultsDiv.innerHTML === "") {
                    resultsDiv.innerHTML = savedHTML;
                    searchInput.value = sessionStorage.getItem('lastSearchQuery') || '';
                    if (countDisplay) countDisplay.innerText = sessionStorage.getItem('lastResultCount') || '0';
                    resultsDiv.querySelectorAll('.ref').forEach(el => {
                        const ref = el.innerText.replace('● ', '').trim();
                        const clickedRefs = JSON.parse(sessionStorage.getItem('clickedRefs') || '[]');
                        if (clickedRefs.includes(ref)) el.classList.add('clicked');
                        el.onclick = function(e) {
                            e.preventDefault();
                            handleRefClick(this, ref);
                        };
                    });
                } else if (searchInput.value.length >= 2) {
                    window.performSearch();
                }
            })
            .catch(err => console.error(err));
    };

    if (langToggle) {
        langToggle.onclick = () => {
            let idx = (languages.indexOf(window.currentLang) + 1) % languages.length;
            window.currentLang = languages[idx];
            langToggle.innerText = window.currentLang.toUpperCase();
            localStorage.setItem('selectedLang', window.currentLang);
            window.loadLanguage(window.currentLang);
        };
        langToggle.innerText = window.currentLang.toUpperCase();
    }

    if (searchInput) {
        searchInput.oninput = window.performSearch;
        searchInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                const refRegex = /^(\d?\s?[A-Za-zА-Яа-яІіЇЄєҐыЫэЭёЁ\u0370-\u03FFñÑáéíóúÁÉÍÓÚ][a-zа-яіїєґ'ыэё\u0370-\u03FFñÑáéíóúÁÉÍÓÚ]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
                const match = query.match(refRegex);
                if (match) {
                    const bookInput = match[1].trim().toLowerCase().replace(/\.$/, "");
                    const currentMap = maps[window.currentLang] || {};
                    const book = currentMap[bookInput] || bookInput;
                    let r = `${book} ${match[2]}:${match[3] || "1"}`;
                    if (match[4]) r += `-${match[4]}`;
                    window.location.href = `reader.html?ref=${encodeURIComponent(r)}&lang=${window.currentLang}`;
                    return;
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
