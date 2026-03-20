// Загрузка новостей из Google Sheets
const SHEET_ID = '1BTg8yBkBjwLalC-_kB-34TziOU8QLiIOnBOmI4M0bjQ';
const SHEET_NAME = 'Лист1'; // если название листа не меняли, оставьте 'Лист1'

async function loadNews() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        const rows = json.table.rows;

        const newsContainer = document.getElementById('newsGrid');
        if (!newsContainer) return;

        newsContainer.innerHTML = '';
        for (let i = 1; i < rows.length; i++) { // пропускаем заголовки
            const row = rows[i];
            if (!row.c || row.c.length < 3) continue;
            const title = row.c[0]?.v || 'Без названия';
            const content = row.c[1]?.v || '';
            const date = row.c[2]?.v || '';
            
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <h3>${title}</h3>
                <span class="news-date">${date}</span>
                <p>${content}</p>
            `;
            newsContainer.appendChild(newsCard);
        }
        if (newsContainer.children.length === 0) {
            newsContainer.innerHTML = '<div class="news-card">Новостей пока нет. Добавьте их в Google Таблицу.</div>';
        }
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        const newsContainer = document.getElementById('newsGrid');
        if (newsContainer) {
            newsContainer.innerHTML = '<div class="news-card">Не удалось загрузить новости. Проверьте доступ к таблице.</div>';
        }
    }
}

// Активное меню
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Загружаем новости только на главной странице
    if (document.getElementById('newsGrid')) {
        loadNews();
    }
});