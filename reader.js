// 1. ОГОЛОШЕННЯ ЗМІННИХ ТА ЗБЕРЕЖЕННЯ ОСТАННЬОГО МІСЦЯ
const urlParams = new URLSearchParams(window.location.search);
let fullRef = decodeURIComponent(urlParams.get('ref') || "").replace(/\+/g, ' ');
let currentLang = urlParams.get('lang') || 'ukr';
let bibleData = null;

// Запам'ятовуємо розділ для PWA/LocalStorage
if (fullRef) {
    localStorage.setItem('lastBibleRef', fullRef);
    localStorage.setItem('lastBibleLang', currentLang);
}

// Ваша надійна мапа для UA/RU
const bookMap = {
    "Буття": "Бытие", "Вихід": "Исход", "Левит": "Левит", "Числа": "Числа", 
    "Повторення Закону": "Второзаконие", "Ісус Навин": "Иисус Навин", "Судді": "Судьи", 
    "Рут": "Руфь", "1 Самуїлова": "1 Царств", "2 Самуїлова": "2 Царств", 
    "1 Царів": "3 Царств", "2 Царів": "4 Царств", "1 Хронік": "1 Паралипоменон", 
    "2 Хронік": "2 Паралипоменон", "Ездра": "Ездра", "Неемія": "Неемия", 
    "Естер": "Есфирь", "Йов": "Иов", "Псалми": "Псалтирь", "Приповісті": "Притчи", 
    "Екклезіаст": "Екклезиаст", "Пісня Пісень": "Песнь Песней", "Ісая": "Исаия", 
    "Єремія": "Иеремия", "Плач Єремії": "Плач Иеремии", "Єзекіїль": "Иезекииль", 
    "Даниїл": "Даниил", "Осія": "Осия", "Йоіл": "Иоиль", "Амос": "Амос", 
    "Овдій": "Авдий", "Йона": "Иона", "Михей": "Михей", "Наум": "Наум", 
    "Авакум": "Аввакум", "Софонія": "Софония", "Огій": "Аггей", 
    "Захарія": "Захария", "Малахія": "Малахия",
    "Від Матвія": "Матфея", "Від Марка": "Марка", "Від Луки": "Луки", 
    "Від Івана": "Иоанна", "Дії Апостолів": "Деяния", "До Римлян": "Римлянам", 
    "1 до Коринтян": "1 Коринфянам", "2 до Коринтян": "2 Коринфянам", 
    "До Галатів": "Галатам", "До Ефесян": "Ефесянам", "До Филип'ян": "Филиппийцам", 
    "До Колосян": "Колоссянам", "1 до Солунян": "1 Фессалоникийцам", 
    "2 до Солунян": "2 Фессалоникийцам", "1 до Тимофія": "1 Тимофею", 
    "2 до Тимофія": "2 Тимофею", "До Тита": "Титу", "До Филимона": "Филимону", 
    "До Євреїв": "Евреям", "Якова": "Иакова", "1 Петра": "1 Петра", 
    "2 Петра": "2 Петра", "1 Івана": "1 Иоанна", "2 Івана": "2 Иоанна", 
    "3 Івана": "3 Иоанна", "Юди": "Иуды", "Об'явлення": "Откровение"
};

// 2. ФУНКЦІЯ ПЕРЕКЛАДУ
function getTranslatedBookName(name, toLang) {
    // Якщо перемикання між UA та RU (використовуємо ваш bookMap)
    if ((currentLang === 'ukr' || currentLang === 'rus') && (toLang === 'ukr' || toLang === 'rus')) {
        if (toLang === 'rus') return bookMap[name] || name;
        return Object.keys(bookMap).find(key => bookMap[key] === name) || name;
    }

    // Для інших мов (ES, EN, PL, GR) шукаємо за індексом у biblemaps.js
    if (typeof maps !== 'undefined' && maps[currentLang] && maps[toLang]) {
        const currentTitles = Object.values(maps[currentLang]);
        const nextTitles = Object.values(maps[toLang]);
        const index = currentTitles.indexOf(name);
        if (index !== -1) return nextTitles[index];
    }
    return name;
}

// 3. РОЗБІР ПОСИЛАННЯ
let bookName = "", chapterNum = "1", vStart = null, vEnd = null;
const match = fullRef.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);

if (match) {
    bookName = match[1];
    chapterNum = match[2];
    vStart = match[3] ? parseInt(match[3]) : null;
    vEnd = match[4] ? parseInt(match[4]) : vStart;
}

// 4. ЗАВАНТАЖЕННЯ ТЕКСТУ
function loadBible() {
    const fileMap = {
        'ukr': 'bibleTextUA.json',
        'rus': 'bibleTextRU.json',
        'en': 'bibleTextEN.json',
        'pl': 'bibleTextPL.json',
        'es': 'bibleTextES.json',
        'gr': 'bibleTextGR.json'
    };

    const fileName = fileMap[currentLang] || 'bibleTextUA.json';
    const btn = document.getElementById('langBtn');
    
    const displayNames = { 'ukr': 'UA', 'rus': 'RU', 'en': 'EN', 'pl': 'PL', 'es': 'ES', 'gr': 'GR' };
    if(btn) btn.innerText = displayNames[currentLang] || 'UA';

    fetch(fileName)
        .then(r => r.json())
        .then(data => {
            bibleData = data;
            renderContent();
        })
        .catch(err => {
            console.error("Помилка завантаження:", err);
            const layout = document.getElementById('reader-layout');
            if(layout) layout.innerHTML = "Помилка завантаження тексту.";
        });
}

// 5. ВІДОБРАЖЕННЯ ТЕКСТУ
function renderContent() {
    const layout = document.getElementById('reader-layout');
    const refHeader = document.getElementById('refHeader');
    if (!layout || !bibleData) return;
    
    layout.innerHTML = "";
    if (refHeader) refHeader.innerText = `${bookName} ${chapterNum}`;

    const prefix = `${bookName} ${chapterNum}:`;
    const keys = Object.keys(bibleData).filter(k => k.startsWith(prefix));
    keys.sort((a, b) => parseInt(a.split(':')[1]) - parseInt(b.split(':')[1]));

    if (keys.length === 0) {
        layout.innerHTML = `<div style="text-align:center; padding:40px; opacity:0.5;">Розділ не знайдено (${bookName} ${chapterNum}).</div>`;
        return;
    }

    keys.forEach(key => {
        const vNum = parseInt(key.split(':')[1]);
        let isHighlighted = (vStart !== null && vNum >= vStart && vNum <= vEnd);
        
        const div = document.createElement('div');
        div.className = `verse-item ${isHighlighted ? 'highlight' : ''}`;
        if (vStart !== null && vNum === vStart) div.id = "target";
        
        div.innerHTML = `<span class="verse-num">${vNum}</span> ${bibleData[key]}`;
        setupShare(div, bibleData[key], `${bookName} ${chapterNum}:${vNum}`);
        layout.appendChild(div);
    });

    if (vStart !== null) {
        setTimeout(() => {
            const el = document.getElementById('target');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
    }
}

// 6. ПЕРЕМИКАЧ МОВ
document.getElementById('langBtn').onclick = () => {
    const availableLangs = ['ukr', 'rus', 'en', 'pl', 'es', 'gr'];
    let currentIndex = availableLangs.indexOf(currentLang);
    let nextIndex = (currentIndex + 1) % availableLangs.length;
    const nextLang = availableLangs[nextIndex];

    const translatedBook = getTranslatedBookName(bookName, nextLang);
    let versePart = vStart ? `:${vStart}${vEnd !== vStart ? '-' + vEnd : ''}` : "";
    const newRef = `${translatedBook} ${chapterNum}${versePart}`;
    
    window.location.href = `reader.html?ref=${encodeURIComponent(newRef)}&lang=${nextLang}`;
};

// 7. НАВІГАЦІЯ
function navigate(step) {
    const nextChap = parseInt(chapterNum) + step;
    if (nextChap < 1) return;
    window.location.href = `reader.html?ref=${encodeURIComponent(bookName + ' ' + nextChap)}&lang=${currentLang}`;
}

document.getElementById('prevBtn').onclick = () => navigate(-1);
document.getElementById('nextBtn').onclick = () => navigate(1);

// 8. ДОПОМІЖНІ ФУНКЦІЇ (Share, Swipes, Keyboard)
function setupShare(div, text, ref) {
    let pressTimer;
    const start = () => {
        div.classList.add('pressing');
        pressTimer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate(40);
            div.classList.replace('pressing', 'shared-flash');
            shareVerse(text, ref);
            setTimeout(() => div.classList.remove('shared-flash'), 1000);
        }, 800);
    };
    const cancel = () => { clearTimeout(pressTimer); div.classList.remove('pressing'); };
    div.addEventListener('touchstart', start, {passive:true});
    div.addEventListener('touchend', cancel, {passive:true});
    div.addEventListener('mousedown', start);
    div.addEventListener('mouseup', cancel);
}

async function shareVerse(text, ref) {
    const shareText = `«${text}» (${ref})\n\n`;
    if (navigator.share) {
        try { await navigator.share({ title: 'Біблія', text: shareText }); } catch (err) {}
    } else {
        await navigator.clipboard.writeText(shareText);
        alert("Скопійовано!");
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") navigate(-1);
    else if (e.key === "ArrowRight") navigate(1);
});

loadBible();
