// Перенесемо ініціалізацію змінних на початок
const urlParams = new URLSearchParams(window.location.search);
let fullRef = decodeURIComponent(urlParams.get('ref') || "").replace(/\+/g, ' ');
let currentLang = urlParams.get('lang') || 'ukr';
let bibleData = null;

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

function getTranslatedBookName(name, toLang) {
    if (toLang === 'rus') return bookMap[name] || name;
    return Object.keys(bookMap).find(key => bookMap[key] === name) || name;
}

let bookName = "", chapterNum = "1", targetVerse = null;
const match = fullRef.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
if (match) {
    bookName = match[1];
    chapterNum = match[2];
    targetVerse = match[3] ? parseInt(match[3]) : null;
}

function loadBible() {
    const fileName = currentLang === 'ukr' ? 'bibleTextUA.json' : 'bibleTextRU.json';
    const btn = document.getElementById('langBtn');
    if(btn) btn.innerText = currentLang === 'ukr' ? 'UA' : 'RU';

    fetch(fileName)
        .then(r => r.json())
        .then(data => {
            bibleData = data;
            renderContent();
            initTouchLogic(); // Активуємо свайпи ТІЛЬКИ після завантаження даних
        })
        .catch(err => {
            const layout = document.getElementById('reader-layout');
            if(layout) layout.innerHTML = "Помилка завантаження тексту.";
        });
}

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
        layout.innerHTML = `<div style="text-align:center; padding:40px; opacity:0.5;">Розділ не знайдено.</div>`;
        return;
    }

    keys.forEach(key => {
        const vNum = key.split(':')[1];
        const isTarget = parseInt(vNum) === targetVerse;
        const div = document.createElement('div');
        div.className = `verse-item ${isTarget ? 'highlight' : ''}`;
        if (isTarget) div.id = "target";
        div.innerHTML = `<span class="verse-num">${vNum}</span>${bibleData[key]}`;
        layout.appendChild(div);
    });

    if (targetVerse) {
        setTimeout(() => {
            const el = document.getElementById('target');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// --- ЕТАЛОННИЙ МОБІЛЬНИЙ СВАЙП ---
let touchStartX = 0;
let currentX = 0;
let isMoving = false;
const layout = document.getElementById('reader-layout');

window.addEventListener('touchstart', (e) => {
    // Беремо початкову точку з будь-якого місця екрану
    touchStartX = e.touches[0].clientX;
    isMoving = true;
    if (layout) layout.classList.add('no-transition');
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isMoving || !layout) return;

    const touchX = e.touches[0].clientX;
    currentX = touchX - touchStartX;

    // Рух стає важчим, чим далі ми тягнемо (ефект гуми)
    const resistance = 0.85; 
    const translate = currentX * resistance;

    // Використовуємо requestAnimationFrame для максимальної плавності
    requestAnimationFrame(() => {
        layout.style.transform = `translateX(${translate}px)`;
        layout.style.opacity = 1 - Math.abs(translate) / 600;
    });
}, { passive: true });

window.addEventListener('touchend', (e) => {
    if (!isMoving || !layout) return;
    isMoving = false;
    
    layout.classList.remove('no-transition');
    
    const threshold = window.innerWidth * 0.25; // Поріг — 25% ширини екрану

    if (Math.abs(currentX) > threshold) {
        // Додаємо фінальну анімацію вильоту за екран
        const direction = currentX > 0 ? 1 : -1;
        layout.style.transform = `translateX(${direction * 100}vw)`;
        layout.style.opacity = '0';
        
        // Переходимо до нового розділу після короткої паузи
        setTimeout(() => {
            navigate(direction === 1 ? -1 : 1);
        }, 200);
    } else {
        // Плавне повернення на місце
        layout.style.transform = 'translateX(0)';
        layout.style.opacity = '1';
    }
    currentX = 0;
});

loadBible();
