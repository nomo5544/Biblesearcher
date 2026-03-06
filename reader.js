// 1. ОГОЛОШЕННЯ ЗМІННИХ
const urlParams = new URLSearchParams(window.location.search);
let fullRef = decodeURIComponent(urlParams.get('ref') || "").replace(/\+/g, ' ');
let currentLang = urlParams.get('lang') || 'ukr';
let bibleData = null;

// Запам'ятовуємо розділ
if (fullRef) {
    localStorage.setItem('lastBibleRef', fullRef);
    localStorage.setItem('lastBibleLang', currentLang);
}

// 2. ФУНКЦІЯ ПЕРЕКЛАДУ НАЗВИ КНИГИ (Універсальна)
function getTranslatedBookName(oldName, fromLang, toLang) {
    const fromMap = maps[fromLang];
    const toMap = maps[toLang];

    // Отримуємо списки ПОВНИХ назв для обох мов
    const fromTitles = Object.values(fromMap);
    const toTitles = Object.values(toMap);

    // Знаходимо, якою за рахунком є наша книга (напр. 40-ва)
    const bookIndex = fromTitles.indexOf(oldName);

    if (bookIndex !== -1 && toTitles[bookIndex]) {
        return toTitles[bookIndex]; // Повертаємо 40-ву назву з нової мови
    }

    // РЕЗЕРВ: Якщо не знайшли за списком, шукаємо через ключі (для UA/RU)
    let foundKey = null;
    for (let key in fromMap) {
        if (fromMap[key] === oldName) {
            foundKey = key;
            break;
        }
    }
    
    if (foundKey && toMap[foundKey]) {
        return toMap[foundKey];
    }

    return oldName; // Якщо нічого не спрацювало, лишаємо як було
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

// 4. ЗАВАНТАЖЕННЯ БІБЛІЇ
function loadBible() {
    const fileMap = {
        'ukr': 'bibleTextUA.json',
        'ru': 'bibleTextRU.json',
        'en': 'bibleTextEN.json',
        'pl': 'bibleTextPL.json',
        'es': 'bibleTextES.json',
        'el': 'bibleTextGR.json'
    };

    const fileName = fileMap[currentLang] || 'bibleTextUA.json';
    const btn = document.getElementById('langBtn');
    
    // Відображення на кнопці
    const displayNames = { 'ukr': 'UA', 'ru': 'RU', 'en': 'EN', 'pl': 'PL', 'es': 'ES', 'el': 'GR' };
    if(btn) btn.innerText = displayNames[currentLang] || 'UA';

    fetch(fileName)
        .then(r => r.json())
        .then(data => {
            bibleData = data;
            renderContent();
        })
        .catch(err => {
            console.error("Помилка:", err);
            const layout = document.getElementById('reader-layout');
            if(layout) layout.innerHTML = "Помилка завантаження тексту.";
        });
}

// 5. ПЕРЕМИКАЧ МОВ (Виправлений)
document.getElementById('langBtn').onclick = () => {
    const availableLangs = ['ukr', 'ru', 'en', 'pl', 'es', 'el'];
    let currentIndex = availableLangs.indexOf(currentLang);
    let nextIndex = (currentIndex + 1) % availableLangs.length;
    const nextLang = availableLangs[nextIndex];

    // Беремо назву книги, яка ЗАРАЗ відображена в заголовку (це найнадійніше)
    const currentDisplayedBook = bookName; 
    const translatedBook = getTranslatedBookName(currentDisplayedBook, currentLang, nextLang);
    
    // Формуємо вірші
    let versePart = "";
    if (vStart) {
        versePart = `:${vStart}${vEnd && vEnd !== vStart ? '-' + vEnd : ''}`;
    }
    
    const newRef = `${translatedBook} ${chapterNum}${versePart}`;
    
    // ПЕРЕХІД
    console.log("Перехід на:", newRef, "Мова:", nextLang);
    window.location.href = `reader.html?ref=${encodeURIComponent(newRef)}&lang=${nextLang}`;
};

// --- РЕНДЕР ТА НАВІГАЦІЯ (залишаємо вашу логіку без змін) ---

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
        layout.innerHTML = `<div style="text-align:center; padding:40px; opacity:0.5;">Not found (${bookName} ${chapterNum}).</div>`;
        return;
    }

    keys.forEach(key => {
        const vNum = parseInt(key.split(':')[1]);
        let isHighlighted = (vStart !== null && vNum >= vStart && vNum <= vEnd);
        
        const div = document.createElement('div');
        div.className = `verse-item ${isHighlighted ? 'highlight' : ''}`;
        if (vStart !== null && vNum === vStart) div.id = "target";
        
        div.innerHTML = `<span class="verse-num">${vNum}</span> ${bibleData[key]}`;

        // Додаємо вашу логіку shareVerse тут (копіюємо з вашого старого коду)...
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
        try { await navigator.share({ title: 'Bible', text: shareText }); } catch (err) {}
    } else {
        await navigator.clipboard.writeText(shareText);
        alert("Copied!");
    }
}

function navigate(step) {
    const nextChap = parseInt(chapterNum) + step;
    if (nextChap < 1) return;
    window.location.href = `reader.html?ref=${encodeURIComponent(bookName + ' ' + nextChap)}&lang=${currentLang}`;
}

function getBookKey(fullBookName, currentLang) {
    const map = maps[currentLang];
    for (let key in map) {
        if (map[key] === fullBookName) {
            // Повертаємо ключ (наприклад, "gen"), але ми знаємо, 
            // що в мапах ключі часто — це скорочення. 
            // Найкраще знайти ключ, який є спільним для всіх мов.
            return key; 
        }
    }
    return null;
}

document.getElementById('prevBtn').onclick = () => navigate(-1);
document.getElementById('nextBtn').onclick = () => navigate(1);

// Ініціалізація
loadBible();
