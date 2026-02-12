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

// Створюємо впорядковані масиви повних назв для пошуку за індексом
const orderUA = [...new Set(Object.values(maps.ukr))];
const orderRU = [...new Set(Object.values(maps.ru))];

let bookName = "", chapterNum = "", targetVerseStart = null, targetVerseEnd = null;

// --- ЛОГІКА РОЗБОРУ ТА ЗБЕРЕЖЕННЯ ВІРШІВ ---
const rangeMatch = fullRef.match(/^(.+)\s(\d+):(\d+)-(\d+)$/);
const singleMatch = fullRef.match(/^(.+)\s(\d+):(\d+)$/);
const chapterMatch = fullRef.match(/^(.+)\s(\d+)$/);

if (rangeMatch) {
    bookName = rangeMatch[1];
    chapterNum = rangeMatch[2];
    targetVerseStart = parseInt(rangeMatch[3]);
    targetVerseEnd = parseInt(rangeMatch[4]);
    // Зберігаємо Книгу ТА Розділ ТА Вірші
    sessionStorage.setItem('savedBook', bookName);
    sessionStorage.setItem('savedChap', chapterNum);
    sessionStorage.setItem('savedStart', targetVerseStart);
    sessionStorage.setItem('savedEnd', targetVerseEnd);
} else if (singleMatch) {
    bookName = singleMatch[1];
    chapterNum = singleMatch[2];
    targetVerseStart = parseInt(singleMatch[3]);
    targetVerseEnd = targetVerseStart;
    // Зберігаємо Книгу ТА Розділ ТА Вірш
    sessionStorage.setItem('savedBook', bookName);
    sessionStorage.setItem('savedChap', chapterNum);
    sessionStorage.setItem('savedStart', targetVerseStart);
    sessionStorage.setItem('savedEnd', targetVerseEnd);
} else if (chapterMatch) {
    bookName = chapterMatch[1];
    chapterNum = chapterMatch[2];
    
    // ПЕРЕВІРКА: Підсвічуємо лише якщо Книга ТА Розділ збігаються з тими, де ми клікнули
    const sBook = sessionStorage.getItem('savedBook');
    const sChap = sessionStorage.getItem('savedChap');
    
    if (sBook === bookName && sChap === chapterNum) {
        targetVerseStart = parseInt(sessionStorage.getItem('savedStart'));
        targetVerseEnd = parseInt(sessionStorage.getItem('savedEnd'));
    } else {
        // Якщо перейшли в інший розділ або книгу — візуально не підсвічуємо
        targetVerseStart = null;
        targetVerseEnd = null;
    }
}

const chapterRef = `${bookName} ${chapterNum}`;
const refHeader = document.getElementById('refHeader');
const contentDiv = document.getElementById('content');
const parallelDiv = document.getElementById('content-parallel');
const toggleBtn = document.getElementById('toggleParallel');

let bibleDataUA = null;
let bibleDataRU = null;
let isParallel = localStorage.getItem('parallelMode') === 'true';

// --- ФУНКЦІЯ ПЕРЕКЛАДУ НАЗВИ КНИГИ ЧЕРЕЗ ПОРЯДКОВИЙ НОМЕР ---
function getCrossLangBookName(currentName, fromLang) {
    const fromOrder = (fromLang === 'ukr') ? orderUA : orderRU;
    const toOrder = (fromLang === 'ukr') ? orderRU : orderUA;
    
    // 1. Шукаємо повну назву в картах, якщо прийшло скорочення
    let fullName = currentName;
    if (maps[fromLang][currentName.toLowerCase().replace(/\.$/, "")]) {
        fullName = maps[fromLang][currentName.toLowerCase().replace(/\.$/, "")];
    }

    // 2. Знаходимо індекс цієї книги в біблійному порядку
    const index = fromOrder.indexOf(fullName);
    
    // 3. Повертаємо назву з іншого списку за тим самим індексом
    if (index !== -1 && toOrder[index]) {
        return toOrder[index];
    }
    
    return currentName; // Якщо не знайшли, повертаємо як є
}

function buildChapterHtml(bibleData, bName, cNum, isMainColumn) {
    let chapterHtml = "";
    const searchPrefix = `${bName} ${cNum}:`;
    
    const keys = Object.keys(bibleData).filter(k => k.startsWith(searchPrefix));
    
    keys.sort((a, b) => {
        const vA = parseInt(a.split(':')[1]);
        const vB = parseInt(b.split(':')[1]);
        return vA - vB;
    });

    keys.forEach(key => {
        const verseNum = parseInt(key.split(':')[1]);
        const text = bibleData[key];

        let isHighlighted = false;
        if (targetVerseStart && targetVerseEnd) {
            isHighlighted = (verseNum >= targetVerseStart && verseNum <= targetVerseEnd);
        } else if (targetVerseStart) {
            isHighlighted = (verseNum === targetVerseStart);
        }

        const highlightClass = isHighlighted ? 'highlight' : '';
        const idAttr = (isMainColumn && targetVerseStart && verseNum === targetVerseStart) ? 'id="target"' : '';

        // Використовуємо div та клас verse-item, щоб кожен вірш був з нового рядка
        chapterHtml += `<div class="verse-item ${highlightClass}" ${idAttr}><span class="verse-num">${verseNum}</span>${text}</div>`;
    });

    return chapterHtml || "Текст не знайдено";
}

function renderContent() {
    // 1. Визначаємо назву книги для іншої мови
    const parallelBookName = getCrossLangBookName(bookName, lang);
    
    // 2. Визначаємо, які дані головні, а які паралельні
    const mainData = (lang === 'ukr') ? bibleDataUA : bibleDataRU;
    const sideData = (lang === 'ukr') ? bibleDataRU : bibleDataUA;

    const layout = document.getElementById('reader-layout');
    if (!layout) return;
    
    layout.innerHTML = ""; // Очищуємо контейнер

    const mainPrefix = `${bookName} ${chapterNum}:`;
    const sidePrefix = `${parallelBookName} ${chapterNum}:`;
    
    // 3. Отримуємо всі вірші
    const keys = Object.keys(mainData).filter(k => k.startsWith(mainPrefix));
    keys.sort((a, b) => parseInt(a.split(':')[1]) - parseInt(b.split(':')[1]));

    if (keys.length === 0) {
        layout.innerHTML = "<div style='padding:20px; opacity:0.5;'>Розділ не знайдено...</div>";
        return;
    }

    // 4. Створюємо кожен вірш як рядок
    keys.forEach((key, index) => {
        const vNum = key.split(':')[1];
        const sideKey = `${sidePrefix}${vNum}`;

        const row = document.createElement('div');
        // Додаємо клас single-mode, якщо паралель вимкнена
        row.className = `verse-row animate-verse ${isParallel ? '' : 'single-mode'}`;
        row.style.animationDelay = `${index * 0.03}s`;

        // Перевірка на підсвітку
        let isHighlighted = false;
        if (targetVerseStart) {
            const vInt = parseInt(vNum);
            isHighlighted = targetVerseEnd ? (vInt >= targetVerseStart && vInt <= targetVerseEnd) : (vInt === targetVerseStart);
        }
        const hClass = isHighlighted ? 'highlight' : '';
        const idAttr = (isHighlighted && vNum == targetVerseStart) ? 'id="target"' : '';

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

    // 5. Плавний скрол до вірша
    if (targetVerseStart) {
        setTimeout(() => {
            const target = document.getElementById('target');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}
// Навігація клавішами
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") {
        navigate(-1);
    } else if (e.key === "ArrowRight") {
        navigate(1);
    }
});
// Оновлюємо кнопку перемикання
toggleBtn.onclick = () => {
    isParallel = !isParallel;
    localStorage.setItem('parallelMode', isParallel);
    applyParallelState();
    renderContent(); // Перемальовуємо, щоб запустити анімацію та змінити розкладку
};

// --- ЗАПУСК ---

Promise.all([
    fetch('bibleTextUA.json').then(res => res.json()),
    fetch('bibleTextRU.json').then(res => res.json())
])
.then(([uaData, ruData]) => {
    bibleDataUA = uaData;
    bibleDataRU = ruData;
    refHeader.innerText = chapterRef;
    renderContent();
    applyParallelState();
})
.catch(err => console.error("Помилка файлів:", err));

function applyParallelState() {
    const rows = document.querySelectorAll('.verse-row');
    const toggleBtn = document.getElementById('toggleParallel');

    if (isParallel) {
        rows.forEach(row => row.classList.remove('single-mode'));
        toggleBtn.style.background = 'var(--accent-color)';
        toggleBtn.style.color = '#fff';
        toggleBtn.innerText = "||"; // Фіксований текст
    } else {
        rows.forEach(row => row.classList.add('single-mode'));
        toggleBtn.style.background = '#f4f4f4';
        toggleBtn.style.color = 'var(--text-color)';
        toggleBtn.innerText = "||"; // Або залиште UA | RU
    }
}

// Повна логіка натискання кнопки
toggleBtn.onclick = () => {
    isParallel = !isParallel; // Змінюємо стан
    localStorage.setItem('parallelMode', isParallel); // Зберігаємо вибір
    
    // Варіант А: Швидке перемикання без перемальовування тексту
    applyParallelState();
    
    // Варіант Б (якщо хочете, щоб анімація програлася знову при зміні режиму):
    // renderContent(); 
};

function navigate(direction) {
    const newChapter = parseInt(chapterNum) + direction;
    if (newChapter < 1) return;

    // Стрілки ведуть просто на розділ, без номерів віршів у посиланні
    let newRef = `${bookName} ${newChapter}`;
    window.location.href = `reader.html?ref=${encodeURIComponent(newRef)}&lang=${lang}`;
}

document.getElementById('prevBtn').onclick = () => navigate(-1);
document.getElementById('nextBtn').onclick = () => navigate(1);