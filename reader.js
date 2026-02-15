// --- ПАРАМЕТРИ ТА ЗМІННІ ---
const urlParams = new URLSearchParams(window.location.search);
const fullRef = urlParams.get('ref') || ""; 
const lang = urlParams.get('lang') || 'ukr';

// --- СЛОВНИКИ (використовуємо ваші) ---
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
        "плач": "Плач Єремії", "плач": "Плач Єремії",
        "єзк": "Єзекіїль", "єзекіїля": "Єзекіїль",
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
        "флм": "До Филимона", "филимону": "До Филимона",
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
        "еккл": "Екклезиаст", "еккл": "Екклезиаст",
        "песн": "Песнь Песней", "песня": "Песнь Песней",
        "ис": "Исаия", "исаия": "Исаия", "исаии": "Исаия",
        "иер": "Иеремия", "иеремии": "Иеремия",
        "плач": "Плач Иеремии", "плач": "Плач Иеремии",
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
        "откр": "Откровение", "откровение": "Откроение", "отк": "Откровение"
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
