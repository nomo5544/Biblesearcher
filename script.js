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

const maps = {
    ukr: {
        "бут": "Буття", "буття": "Буття",
        "вих": "Вихід", "вихід": "Вихід",
        "лев": "Левит", "левит": "Левит",
        "чис": "Числа", "числа": "Числа",
        "повт": "Повторення Закону", "повторення": "Повторення Закону", "втор": "Повторення Закону",
        "ісН": "Ісус Навин", "нав": "Ісус Навин",
        "суд": "Судді", "суддів": "Судді",
        "рут": "Рут", "Рути": "Рут",
        "1сам": "1 Самуїлова", "1самуїлова": "1 Самуїлова", "1 сам": "1 Самуїлова",
        "2сам": "2 Самуїлова", "2самуїлова": "2 Самуїлова", "2 сам": "2 Самуїлова",
        "1цар": "1 Царів", "1царів": "1 Царів", "1 цар": "1 Царів",
        "2цар": "2 Царів", "2царів": "2 Царів", "2 цар": "2 Царів",
        "1хр": "1 Хронік", "1хронік": "1 Хронік", "1 хр": "1 Хронік",
        "2хр": "2 Хронік", "2Хронік": "2 Хронік", "2 хр": "2 Хронік",
        "езд": "Ездра", "Ездри": "Ездра",
        "неем": "Неемія", "Неемії": "Неемія",
        "ест": "Естер", "Естер": "Естер",
        "йов": "Йов", "Йова": "Йов",
        "пс": "Псалми", "псалом": "Псалми", "псалми": "Псалми",
        "прип": "Приповісті", "приповістей": "Приповісті",
        "еккл": "Екклезіаст", "екклезіяст": "Екклезіаст",
        "пісн": "Пісня Пісень", "пісня": "Пісня Пісень",
        "іс": "Ісая", "ісаї": "Ісая", "ісая": "Ісая",
        "єр": "Єремія", "єремії": "Єремія",
        "плач": "Плач Єремії",
        "єзк": "Єзекіїль", "єзк": "Єзекіїль", "єзекіїля": "Єзекіїль",
        "дан": "Даниїл", "даниїла": "Даниїл",
        "ос": "Осія", "осії": "Осія",
        "йоіл": "Йоіл", "йоіла": "Йоіл",
        "ам": "Амос", "амоса": "Амос",
        "ов": "Овдій", "овд": "Овдій",
        "йона": "Йона", "йони": "Йона",
        "мих": "Михей", "михея": "Михей",
        "наум": "Наум", "наума": "Наум",
        "авк": "Авакум", "авакума": "Авакум",
        "соф": "Софонія", "софонії": "Софонія",
        "ог": "Огій", "огія": "Огій",
        "зах": "Захарія", "захарії": "Захарія",
        "мал": "Малахія", "малахії": "Малахія",
        "мат": "Від Матвія", "матвія": "Від Матвія", "мт": "Від Матвія", "мф": "Від Матвія",
        "мар": "Від Марка", "марка": "Від Марка", "мр": "Від Марка", "марк": "Від Марка",
        "лук": "Від Луки", "луки": "Від Луки", "лк": "Від Луки",
        "ів": "Від Івана", "івана": "Від Івана",
        "дії": "Дії Апостолів", "Дії": "Дії Апостолів",
        "рим": "До Римлян", "римлянам": "До Римлян",
        "1кор": "1 до Коринтян", "1коринтянам": "1 до Коринтян", "1 коринтянам": "1 до Коринтян", "1 кор": "1 до Коринтян",
        "2кор": "2 до Коринтян", "2коринтянам": "2 до Коринтян", "2 коринтянам": "2 до Коринтян", "2 кор": "2 до Коринтян",
        "гал": "До Галатів", "галатів": "До Галатів",
        "еф": "До Ефесян", "ефесянам": "До Ефесян",
        "фил": "До Филип'ян", "филип'янам": "До Филип'ян",
        "кол": "До Колосян", "колосянам": "До Колосян", "колосян": "До Колосян",
        "1сол": "1 до Солунян", "1солунянам": "1 до Солунян", "1 солунянам": "1 до Солунян", "1 сол": "1 до Солунян",
        "2сол": "2 до Солунян", "2солунянам": "2 до Солунян", "2 сол": "2 до Солунян",
        "1тим": "1 до Тимофія", "1тимофію": "1 до Тимофія", "1 тимофію": "1 до Тимофія", "1 тим": "1 до Тимофія",
        "2тим": "2 до Тимофія", "2тимофію": "2 до Тимофія", "2 тим": "2 до Тимофія",
        "тит": "До Тита", "титу": "До Тита",
        "флм": "До Пилимона", "филимону": "До Пилимона",
        "євр": "До Євреїв", "євреям": "До Євреїв",
        "як": "Якова", "якова": "Якова",
        "1пет": "1 Петра", "1петра": "1 Петра", "1 петра": "1 Петра", "1 пет": "1 Петра",
        "2пет": "2 Петра", "2петра": "2 Петра", "2 пет": "2 Петра",
        "1ів": "1 Івана", "1івана": "1 Івана", "1 івана": "1 Івана", "1 ів": "1 Івана",
        "2ів": "2 Івана", "2івана": "2 Івана", "2 івана": "2 Івана", "2 ів": "2 Івана",
        "3ів": "3 Івана", "3івана": "3 Івана", "3 івана": "3 Івана", "3 ів": "3 Івана",
        "юди": "Юди", "юд": "Юди",
        "об": "Об'явлення", "об'яв": "Об'явлення", "об'явл": "Об'явлення", "одкр": "Об'явлення", "об'явлення": "Об'явлення"
    },
    ru: {
        "быт": "Бытие", "бытие": "Бытие", 
        "исх": "Исход", "исход": "Исход",
        "лев": "Левит", "левит": "Левит",
        "чис": "Числа", "числа": "Числа",
        "втор": "Второзаконие", "второзаконие": "Второзаконие",
        "нав": "Иисус Навин", "иисн": "Иисус Навин",
        "суд": "Судьи", "судьи": "Судьи",
        "руф": "Руфь", "руфь": "Руфь",
        "1цар": "1 Царств", "1 цар": "1 Царств",
        "2цар": "2 Царств", "2 цар": "2 Царств",
        "3цар": "3 Царств", "3 цар": "3 Царств",
        "4цар": "4 Царств", "4 цар": "4 Царств",
        "1пар": "1 Паралипоменон", "1хр": "1 Паралипоменон",
        "2пар": "2 Паралипоменон", "2хр": "2 Паралипоменон",
        "езд": "Ездра", "ездры": "Ездра",
        "неем": "Неемия", "неемии": "Неемия",
        "есф": "Есфирь", "есфири": "Есфирь",
        "иов": "Иов", "иова": "Иов",
        "пс": "Псалтирь", "псал": "Псалтирь", "псалтирь": "Псалтирь", "псалом": "Псалтирь",
        "прит": "Притчи", "притчи": "Притчи", "притчей": "Притчи",
        "ekkl": "Екклезиаст", "еккл": "Екклезиаст",
        "песн": "Песнь Песней", "песня": "Песнь Песней",
        "ис": "Исаия", "исаия": "Исаия", "исаии": "Исаия",
        "иер": "Иеремия", "иеремии": "Иеремия",
        "плач": "Плач Иеремии",
        "иез": "Иезекииль", "иезекииль": "Иезекииль",
        "дан": "Даниил", "даниила": "Даниил",
        "ос": "Осия", "осии": "Осия",
        "иоил": "Иоиль", "иоиля": "Иоиль",
        "ам": "Амос", "амоса": "Амос",
        "авд": "Авдий", "авдия": "Авдий",
        "ион": "Иона", "ионы": "Иона",
        "мих": "Михей", "михея": "Михей",
        "наум": "Наум", "наума": "Наум",
        "авв": "Аввакум", "аввакума": "Аввакум",
        "соф": "Софония", "софонии": "Софония",
        "агг": "Аггей", "аггея": "Аггей",
        "зах": "Захария", "захарии": "Захария",
        "мал": "Малахия", "малахии": "Малахия",
        "мф": "Матфея", "матф": "Матфея", "матфея": "Матфея", "мат": "Матфея",
        "мк": "Марка", "марк": "Марка", "марка": "Марка", "мр": "Марка",
        "лк": "Луки", "лук": "Луки", "луки": "Луки",
        "ин": "Иоанна", "иоан": "Иоанна", "иоанна": "Иоанна", "ин": "Иоанна",
        "деян": "Деяния", "деяния": "Деяния",
        "иак": "Иакова", "иакова": "Иакова", "як": "Иакова",
        "1пет": "1 Петра", "1 петра": "1 Петра",
        "2пет": "2 Петра", "2 петра": "2 Петра",
        "1иоан": "1 Иоанна", "1 иоанна": "1 Иоанна",
        "2иоан": "2 Иоанна", "2 иоанна": "2 Иоанна",
        "3иоан": "3 Иоанна", "3 иоанна": "3 Иоанна",
        "иуд": "Иуды", "иуды": "Иуды",
        "рим": "Римлянам", "римлянам": "Римлянам",
        "1кор": "1 Коринфянам", "1 кор": "1 Коринфянам",
        "2кор": "2 Коринфянам", "2 кор": "2 Коринфянам",
        "гал": "Галатам", "галатам": "Галатам",
        "еф": "Ефесянам", "ефесянам": "Ефесянам",
        "фил": "Филиппийцам", "филиппийцам": "Филиппийцам",
        "кол": "Колоссянам", "колоссянам": "Колоссянам",
        "1фес": "1 Фессалоникийцам", "1 фес": "1 Фессалоникийцам",
        "2фес": "2 Фессалоникийцам", "2 фес": "2 Фессалоникийцам",
        "1тим": "1 Тимофею", "1 тим": "1 Тимофею",
        "2тим": "2 Тимофею", "2 тим": "2 Тимофею",
        "тит": "Титу", "титу": "Титу",
        "флм": "Филимону", "филимону": "Филимону",
        "евр": "Евреям", "евреям": "Евреям",
        "откр": "Откровение", "откровение": "Откровение", "отк": "Откровение"
    }
};

    // --- 2. ФУНКЦІЇ ВІДОБРАЖЕННЯ ---
    /** Відображає результат прямого пошуку за посиланням **/
    function renderDirectResult(ref, text) {
        if (!resultsDiv) return;
        const div = document.createElement('div');
        div.className = 'verse';
        div.innerHTML = `<span class="ref" style="color: #CD00CD; cursor:pointer; font-weight: normal;">● ${ref}</span> ${text}`;
        div.querySelector('.ref').addEventListener('click', () => {
            window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
        });
        resultsDiv.appendChild(div);
    }

    /** Додає окремий вірш до фрагмента списку результатів **/
    function addVerseToFragment(fragment, ref, htmlContent) {
        const div = document.createElement('div');
        div.className = 'verse'; 
        div.innerHTML = `<span class="ref" style="cursor:pointer; color: #0000EE; font-weight: normal;">${ref}</span> ${htmlContent}`;
        div.querySelector('.ref').addEventListener('click', () => {
            window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
        });
        fragment.appendChild(div);
        // Коли сторінка завантажилася:
const savedResults = sessionStorage.getItem('lastSearchResults');
const savedQuery = sessionStorage.getItem('lastSearchQuery');
const savedCount = sessionStorage.getItem('lastResultCount');

if (savedResults) {
    resultsDiv.innerHTML = savedResults;
    searchInput.value = savedQuery || '';
    countDisplay.innerText = savedCount || '0';
    
    // Важливо: переприв'язати кліки до посилань .ref, 
    // бо після відновлення з HTML старі обробники зникають
    resultsDiv.querySelectorAll('.ref').forEach(el => {
        el.addEventListener('click', () => {
            const ref = el.innerText.replace('● ', '').trim();
            window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
        });
    });
}
    
    }

    // --- 3. ГОЛОВНА ФУНКЦІЯ ПОШУКУ ---
    /** Аналізує ввід та виконує пошук за посиланням або словами **/
    window.performSearch = function() {
        const query = searchInput.value.trim();
        if (!resultsDiv) return;
        resultsDiv.innerHTML = '';
        
        if (query.length < 2) { 
            if (countDisplay) countDisplay.innerText = '0'; 
            return; 
        }

        const refRegex = /^(\d?\s?[А-Яа-яІіЇЄєҐыЫэЭёЁ][а-яіїєґ'ыэё]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
        const match = query.match(refRegex);

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
            // Після того, як результати виведені на екран:
                sessionStorage.setItem('lastSearchResults', resultsDiv.innerHTML);
                sessionStorage.setItem('lastSearchQuery', searchInput.value);
                sessionStorage.setItem('lastResultCount', countDisplay.innerText);
        }

        let count = 0;
        const isExact = exactMatch ? exactMatch.checked : false;
        const fragment = document.createDocumentFragment();

        if (isExact) {
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
                    if (count >= 500) break;
                }
            }
        } else {
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

    // ЗБЕРЕЖЕННЯ (додайте це сюди):
    sessionStorage.setItem('lastQuery', query);
    sessionStorage.setItem('lastResults', resultsDiv.innerHTML);
    sessionStorage.setItem('lastCount', countDisplay ? countDisplay.innerText : '0');
};

// --- ФУНКЦІЯ КОПІЮВАННЯ ПОСИЛАНЬ ---
    if (copyRefsBtn) {
        copyRefsBtn.onclick = () => {
            // Знаходимо всі елементи з класом .ref у результатах
            const refElements = resultsDiv.querySelectorAll('.ref');
            if (refElements.length === 0) return;

            // Збираємо текст посилань, видаляючи зайві символи (наприклад, маркер ●)
            const refsText = Array.from(refElements)
                .map(el => el.innerText.replace('● ', '').trim())
                .join(', ');

            // Копіюємо отриманий рядок у буфер обміну
            navigator.clipboard.writeText(refsText).then(() => {
                const originalText = copyRefsBtn.innerText;
                copyRefsBtn.innerText = '✅';
                setTimeout(() => {
                    copyRefsBtn.innerText = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Помилка копіювання:', err);
            });
        };
    }
    
    // --- 4. ЗАВАНТАЖЕННЯ ---
    /** Завантажує відповідний JSON файл Біблії **/
    window.loadLanguage = function(langCode) {
        const fileName = langCode === 'ukr' ? 'bibleTextUA.json' : 'bibleTextRU.json';
        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                window.currentLangData = data;
                if (searchInput.value.trim().length >= 2) window.performSearch();
            })
            .catch(err => console.error("Файл не знайдено:", fileName));
    };
    // --- ЛОГІКА ВЕРСІЇ ТА ОНОВЛЕННЯ ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(reg => {
                // Якщо знайдено оновлення Service Worker
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Повідомляємо користувача, що додаток оновлено (опціонально)
                            console.log('Нова версія готова. Будь ласка, перезавантажте сторінку.');
                        }
                    };
                };
            });
        });
    }
    
    // --- ЗБЕРЕЖЕННЯ РЕЗУЛЬТАТІВ (SessionStorage) ---
    window.addEventListener('DOMContentLoaded', () => {
        const savedResults = sessionStorage.getItem('lastResults');
        const savedQuery = sessionStorage.getItem('lastQuery');
        const savedCount = sessionStorage.getItem('lastCount');
        
        const resultsContainer = document.getElementById('results');
        const inputField = document.getElementById('searchInput');
        const countDisp = document.getElementById('resultCount');

        if (savedResults && resultsContainer && inputField) {
            // Відновлюємо дані
            resultsContainer.innerHTML = savedResults;
            inputField.value = savedQuery || '';
            if (countDisp) countDisp.innerText = savedCount || '0';
            
            // "Оживляємо" всі посилання після відновлення
            resultsContainer.querySelectorAll('.ref').forEach(el => {
                el.onclick = () => { // Використовуємо .onclick для надійності
                    const ref = el.innerText.replace('● ', '').trim();
                    window.location.href = `reader.html?ref=${encodeURIComponent(ref)}&lang=${window.currentLang}`;
                };
            });
        }
    });
    
    // Додайте цей рядок у вашу основну функцію performSearch, де ви отримуєте результати:
    sessionStorage.setItem('lastResults', resultsDiv.innerHTML);
    sessionStorage.setItem('lastQuery', searchInput.value);
    // --- 5. ОБРОБНИКИ ПОДІЙ ---
    if (langToggle) {
        langToggle.onclick = () => {
            window.currentLang = (window.currentLang === 'ukr') ? 'ru' : 'ukr';
            langToggle.innerText = window.currentLang === 'ukr' ? 'UA' : 'RU';
            localStorage.setItem('selectedLang', window.currentLang);
            window.loadLanguage(window.currentLang);
        };
    }

    if (searchInput) searchInput.oninput = window.performSearch;
    if (exactMatch) exactMatch.onchange = window.performSearch;

    if (fontSizeRange && resultsDiv) {
        const savedSize = localStorage.getItem('searchFontSize') || '18';
        fontSizeRange.value = savedSize;
        resultsDiv.style.fontSize = savedSize + 'px';
        fontSizeRange.oninput = () => {
            resultsDiv.style.fontSize = fontSizeRange.value + 'px';
            localStorage.setItem('searchFontSize', fontSizeRange.value);
        };
    }

    if (langToggle) langToggle.innerText = window.currentLang === 'ukr' ? 'UA' : 'RU';
    window.loadLanguage(window.currentLang);

    if (searchInput) {
        /** Обробляє натискання Enter для переходу в режим читання **/
        searchInput.onkeydown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                const query = searchInput.value.trim();
                
                const refRegex = /^(\d?\s?[А-Яа-яІіЇЄєҐыЫэЭёЁ][а-яіїєґ'ыэё]{0,15})\s*[\s\.\:]\s*(\d+)(?:[\s\:\.\-]+(\d+)(?:\-(\d+))?)?$/;
                const match = query.match(refRegex);

                if (match && typeof maps !== 'undefined') {
                    const bookInput = match[1].trim().toLowerCase().replace(/\.$/, "");
                    const currentMap = maps[window.currentLang];
                    const fullBookName = currentMap ? currentMap[bookInput] : null;

                    if (fullBookName) {
                        const chapter = match[2];
                        const vStart = match[3] || "1";
                        const vEnd = match[4];
                        let finalRef = `${fullBookName} ${chapter}:${vStart}`;
                        if (vEnd) finalRef += `-${vEnd}`;
                        
                        window.location.href = `reader.html?ref=${encodeURIComponent(finalRef)}&lang=${window.currentLang}`;
                        return;
                    }
                }
                window.performSearch();
            }
        };
    }
})();
