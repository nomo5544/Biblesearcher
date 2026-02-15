// --- ПАРАМЕТРИ ТА ЗМІННІ ---
const urlParams = new URLSearchParams(window.location.search);
const fullRef = urlParams.get('ref') || ""; 
const lang = urlParams.get('lang') || 'ukr';

// --- СЛОВНИКИ (використовуємо ваші) ---
const maps = {
    ukr: {
        "бут": "Буття", "вих": "Вихід", "лев": "Левит", "чис": "Числа", "повт": "Повторення Закону",
        "існ": "Ісус Навин", "суд": "Судді", "рут": "Рут", "1сам": "1 Самуїлова", "2сам": "2 Самуїлова",
        "1цар": "1 Царів", "2цар": "2 Царів", "1хр": "1 Хронік", "2хр": "2 Хронік", "езд": "Ездра",
        "неем": "Неемія", "ест": "Естер", "йов": "Йов", "пс": "Псалми", "прип": "Приповісті",
        "еккл": "Екклезіаст", "пісн": "Пісня Пісень", "іс": "Ісая", "єр": "Єремія", "плач": "Плач Єремії",
        "єзк": "Єзекіїль", "дан": "Даниїл", "ос": "Осія", "йоіл": "Йоіл", "ам": "Амос", "авд": "Овдій",
        "йона": "Йона", "мих": "Михей", "наум": "Наум", "авк": "Авакум", "соф": "Софонія", "ог": "Огій",
        "зах": "Захарія", "мал": "Малахія", "мат": "Від Матвія", "мар": "Від Марка", "лук": "Від Луки",
        "ів": "Від Івана", "дії": "Дії Апостолів", "рим": "До Римлян", "1кор": "1 до Коринтян",
        "2кор": "2 до Коринтян", "гал": "До Галатів", "еф": "До Ефесян", "фил": "До Филип'ян",
        "кол": "До Колосян", "1сол": "1 до Солунян", "2сол": "2 до Солунян", "1тим": "1 до Тимофія",
        "2тим": "2 до Тимофія", "тит": "До Тита", "флм": "До Филимона", "євр": "До Євреїв",
        "як": "Якова", "1пет": "1 Петра", "2пет": "2 Петра", "1ів": "1 Івана", "2ів": "2 Івана",
        "3ів": "3 Івана", "юди": "Юди", "об": "Об'явлення"
    },
    ru: {
        "бут": "Бытие", "исх": "Исход", "лев": "Левит", "чис": "Числа", "повт": "Второзаконие",
        "існ": "Иисус Навин", "суд": "Судьи", "руф": "Руфь", "1сам": "1 Царств", "2сам": "2 Царств",
        "1цар": "3 Царств", "2цар": "4 Царств", "1хр": "1 Паралипоменон", "2хр": "2 Паралипоменон", "езд": "Ездра",
        "неем": "Неемия", "ест": "Есфирь", "йов": "Иов", "пс": "Псалтирь", "прип": "Притчи",
        "еккл": "Екклезиаст", "пісн": "Песнь Песней", "іс": "Исаия", "єр": "Иеремия", "плач": "Плач Иеремии",
        "єзк": "Иезекииль", "дан": "Даниил", "ос": "Осия", "йоіл": "Иоиль", "ам": "Амос", "авд": "Авдий",
        "йона": "Иона", "мих": "Михей", "наум": "Наум", "авк": "Аввакум", "соф": "Софония", "ог": "Аггей",
        "зах": "Захария", "мал": "Малахия", "мат": "Матфея", "мар": "Марка", "лук": "Луки",
        "ів": "Иоанна", "дії": "Деяния", "рим": "Римлянам", "1кор": "1 Коринфянам",
        "2кор": "2 Коринфянам", "гал": "Галатам", "еф": "Ефесянам", "фил": "Филиппийцам",
        "кол": "Колоссянам", "1сол": "1 Фессалоникийцам", "2сол": "2 Фессалоникийцам", "1тим": "1 Тимофею",
        "2тим": "2 Тимофею", "тит": "Титу", "флм": "Филимону", "євр": "Евреям",
        "як": "Иакова", "1пет": "1 Петра", "2пет": "2 Петра", "1ів": "1 Иоанна", "2ів": "2 Иоанна",
        "3ів": "3 Иоанна", "юди": "Иуды", "об": "Откровение"
    }
};

// --- ДОДАЙТЕ ЦЕ ВІДРАЗУ ПІСЛЯ CONST MAPS ---

const reverseMaps = {
    ukr: {},
    ru: {}
};

// Заповнюємо автоматично, щоб не робити помилок вручну
Object.entries(maps.ukr).forEach(([key, val]) => { reverseMaps.ukr[val.toLowerCase()] = key; });
Object.entries(maps.ru).forEach(([key, val]) => { reverseMaps.ru[val.toLowerCase()] = key; });

// --- ТЕПЕР ОНОВІТЬ ФУНКЦІЮ getCrossLangBookName ---

function getCrossLangBookName(name, fromLang) {
    // 1. Отримуємо ключ (код книги)
    const bookKey = reverseMaps[fromLang][name.toLowerCase()];
    if (!bookKey) return name; // Якщо не знайшли, повертаємо стару назву

    // 2. Визначаємо цільову мову
    const targetLang = fromLang === 'ukr' ? 'ru' : 'ukr';

    // 3. Повертаємо назву з цільового словника за кодом
    return maps[targetLang][bookKey] || name;
}

let bibleDataUA = null;
let bibleDataRU = null;
let isParallel = localStorage.getItem('parallelMode') === 'true';

// Розбір посилання
let bookName = "", chapterNum = "1", targetVerseStart = null, targetVerseEnd = null;
const rangeMatch = fullRef.match(/^(.+)\s(\d+):(\d+)-(\d+)$/);
const singleMatch = fullRef.match(/^(.+)\s(\d+):(\d+)$/);
const chapterMatch = fullRef.match(/^(.+)\s(\d+)$/);

if (rangeMatch) {
    [ , bookName, chapterNum, targetVerseStart, targetVerseEnd] = rangeMatch.map((v, i) => i > 1 ? parseInt(v) : v);
} else if (singleMatch) {
    [ , bookName, chapterNum, targetVerseStart] = singleMatch.map((v, i) => i > 1 ? parseInt(v) : v);
    targetVerseEnd = targetVerseStart;
} else if (chapterMatch) {
    [ , bookName, chapterNum] = chapterMatch;
}

// --- 2. ФУНКЦІЇ ---

function getCrossLangBookName(name, fromLang) {
    // Якщо об'єкт maps не знайдено, повертаємо назву як є, щоб не "класти" скрипт
    if (typeof maps === 'undefined' || !maps[fromLang]) return name;
    
    const currentMaps = maps[fromLang];
    const targetLang = fromLang === 'ukr' ? 'ru' : 'ukr';
    const targetMaps = maps[targetLang];

    // Шукаємо ключ книги
    const bookKey = Object.keys(currentMaps).find(key => 
        currentMaps[key].toLowerCase() === name.toLowerCase()
    );

    return (bookKey && targetMaps[bookKey]) ? targetMaps[bookKey] : name;
}

function renderContent() {
    const layout = document.getElementById('reader-layout');
    const refHeader = document.getElementById('refHeader');
    if (!layout || !bibleDataUA || !bibleDataRU) return;

    layout.innerHTML = "";
    if (refHeader) refHeader.innerText = `${bookName} ${chapterNum}`;

    const parallelBookName = getCrossLangBookName(bookName, lang);
    const mainData = (lang === 'ukr') ? bibleDataUA : bibleDataRU;
    const sideData = (lang === 'ukr') ? bibleDataRU : bibleDataUA;

    const mainPrefix = `${bookName} ${chapterNum}:`;
    const sidePrefix = `${parallelBookName} ${chapterNum}:`;

    // Фільтруємо вірші розділу
    const keys = Object.keys(mainData).filter(k => k.startsWith(mainPrefix));
    // Замініть ваш рядок сортування на цей:
    keys.sort((a, b) => {
        const vA = parseInt(a.split(':')[1]);
        const vB = parseInt(b.split(':')[1]);
        return vA - vB;
    });

    if (keys.length === 0) {
        layout.innerHTML = `<div style="padding:40px; text-align:center; opacity:0.5;">Розділ "${fullRef}" не знайдено.</div>`;
        return;
    }

    const fragment = document.createDocumentFragment();
keys.forEach((key, index) => {
    const vNum = key.split(':')[1];
    const vInt = parseInt(vNum);
    const sideKey = `${sidePrefix}${vNum}`;

    // Перевірка: чи входить цей вірш у діапазон підсвічування
    let isHighlighted = false;
    if (targetVerseStart !== null) {
        if (targetVerseEnd !== null) {
            // Якщо є діапазон (напр. 1:1-5)
            isHighlighted = (vInt >= targetVerseStart && vInt <= targetVerseEnd);
        } else {
            // Якщо тільки один вірш (напр. 1:1)
            isHighlighted = (vInt === targetVerseStart);
        }
    }
    
    const hClass = isHighlighted ? 'highlight' : '';
    const idAttr = (isHighlighted && vInt === targetVerseStart) ? 'id="target"' : '';

    const row = document.createElement('div');
    row.className = `verse-row ${isParallel ? '' : 'single-mode'}`;
    row.id = `v${vNum}`;

    row.innerHTML = `
        <div class="verse-cell primary-cell ${hClass}" ${idAttr}>
            <span class="verse-num">${vNum}</span>${mainData[key]}
        </div>
        <div class="verse-cell secondary-cell ${hClass}">
            <span class="verse-num">${vNum}</span>${sideData[sideKey] || "—"}
        </div>
    `;
    layout.appendChild(row);
});

    layout.appendChild(fragment);

    // Прокрутка
    if (targetVerseStart) {
        setTimeout(() => {
            const targetEl = document.getElementById('target');
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}

// --- 3. ПОДІЇ ТА ЗАВАНТАЖЕННЯ ---

function navigate(dir) {
    const newChap = parseInt(chapterNum) + dir;
    if (newChap < 1) return;
    window.location.href = `reader.html?ref=${encodeURIComponent(bookName + ' ' + newChap)}&lang=${lang}`;
}

document.getElementById('prevBtn').onclick = () => navigate(-1);
document.getElementById('nextBtn').onclick = () => navigate(1);
document.getElementById('toggleParallel').onclick = function() {
    isParallel = !isParallel;
    localStorage.setItem('parallelMode', isParallel);
    document.querySelectorAll('.verse-row').forEach(r => r.classList.toggle('single-mode'));
    this.style.background = isParallel ? 'var(--accent-color)' : '#f4f4f4';
    this.style.color = isParallel ? '#fff' : 'var(--text-color)';
};

// Завантаження файлів
Promise.all([
    fetch('bibleTextUA.json').then(r => r.json()),
    fetch('bibleTextRU.json').then(r => r.json())
]).then(([ua, ru]) => {
    bibleDataUA = ua;
    bibleDataRU = ru;
    renderContent();
}).catch(err => {
    document.getElementById('reader-layout').innerHTML = "Помилка завантаження JSON файлів.";
    console.error(err);
});
