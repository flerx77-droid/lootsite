const SHEET_ID = '1BTg8yBkBjwLalC-_kB-34TziOU8QLiIOnBOmI4M0bjQ';
const SHEET_NAME = 'Лист1';

async function loadNews() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    const newsContainer = document.getElementById('newsGrid');
    if (!newsContainer) return;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        const rows = json.table.rows;

        newsContainer.innerHTML = '';
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row.c || row.c.length < 3) continue;
            const title = row.c[0]?.v || 'Без названия';
            const content = row.c[1]?.v || '';
            const date = row.c[2]?.v || '';

            const card = document.createElement('div');
            card.className = 'news__item';
            card.innerHTML = `
                <h3>${escapeHtml(title)}</h3>
                <span class="news-date">${escapeHtml(date)}</span>
                <p>${escapeHtml(content)}</p>
            `;
            newsContainer.appendChild(card);
        }
        if (newsContainer.children.length === 0) {
            newsContainer.innerHTML = '<div class="news__item placeholder">Новостей пока нет. Добавьте их в таблицу.</div>';
        }
    } catch (err) {
        console.error(err);
        newsContainer.innerHTML = '<div class="news__item placeholder">Не удалось загрузить новости. Проверьте доступ к таблице.</div>';
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Активное меню
document.addEventListener('DOMContentLoaded', () => {
    const current = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav a').forEach(link => {
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });
    // Загружаем новости только на главной
    if (document.getElementById('newsGrid')) {
        loadNews();
    }
});