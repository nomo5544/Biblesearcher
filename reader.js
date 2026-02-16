const urlParams = new URLSearchParams(window.location.search);
let fullRef = urlParams.get('ref') || "";
let currentLang = urlParams.get('lang') || 'ukr';

let bibleData = null;

// Розбір посилання (Книга Розділ:Вірш)
let bookName = "", chapterNum = "1", targetVerse = null;
const match = fullRef.match(/^(.+)\s(\d+)(?::(\d+))?/);
if (match) {
    bookName = match[1];
    chapterNum = match[2];
    targetVerse = match[3] ? parseInt(match[3]) : null;
}

// Завантаження даних
function loadBible() {
    const fileName = currentLang === 'ukr' ? 'bibleTextUA.json' : 'bibleTextRU.json';
    document.getElementById('langBtn').innerText = currentLang === 'ukr' ? 'UA' : 'RU';

    fetch(fileName)
        .then(r => r.json())
        .then(data => {
            bibleData = data;
            renderContent();
        })
        .catch(err => console.error("Помилка завантаження:", err));
}

function renderContent() {
    const layout = document.getElementById('reader-layout');
    const refHeader = document.getElementById('refHeader');
    layout.innerHTML = "";
    refHeader.innerText = `${bookName} ${chapterNum}`;

    const prefix = `${bookName} ${chapterNum}:`;
    const keys = Object.keys(bibleData).filter(k => k.startsWith(prefix));
    
    // Сортування віршів
    keys.sort((a, b) => parseInt(a.split(':')[1]) - parseInt(b.split(':')[1]));

    if (keys.length === 0) {
        layout.innerHTML = "Розділ не знайдено";
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

    // Прокрутка до потрібного вірша
    if (targetVerse) {
        setTimeout(() => {
            const el = document.getElementById('target');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// Перемикач мови
document.getElementById('langBtn').onclick = () => {
    currentLang = currentLang === 'ukr' ? 'rus' : 'ukr';
    // Оновлюємо URL без перезавантаження для збереження позиції (або з ним для простоти)
    window.location.href = `reader.html?ref=${encodeURIComponent(fullRef)}&lang=${currentLang}`;
};

// Навігація по розділах
function navigate(step) {
    const nextChap = parseInt(chapterNum) + step;
    if (nextChap < 1) return;
    window.location.href = `reader.html?ref=${encodeURIComponent(bookName + ' ' + nextChap)}&lang=${currentLang}`;
}

document.getElementById('prevBtn').onclick = () => navigate(-1);
document.getElementById('nextBtn').onclick = () => navigate(1);

// Запуск
loadBible();
