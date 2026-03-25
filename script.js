async function loadData() {
    try {
        const response = await fetch('archetypes.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        buildGrid(data);
    } catch (err) {
        console.error('Помилка завантаження даних:', err);
        document.getElementById('grid').innerHTML = '<p style="grid-column:1/-1; text-align:center">❌ Не вдалося завантажити archetypes.json. Переконайтеся, що файл існує.</p>';
    }
}

function buildGrid(data) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    // ключі від 000000 до 111111
    for (let i = 0; i < 64; i++) {
        const key = i.toString(2).padStart(6, '0');
        const archetype = data[key];
        if (!archetype) {
            // Якщо якогось архетипу немає, додаємо порожню клітинку
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cell';
            emptyCell.textContent = key;
            emptyCell.style.backgroundColor = '#f5ede3';
            emptyCell.style.cursor = 'default';
            grid.appendChild(emptyCell);
            continue;
        }
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = archetype.trigram || key;
        cell.addEventListener('click', () => showModal(archetype));
        grid.appendChild(cell);
    }
}

function showModal(arch) {
    document.getElementById('modal-title').textContent = arch.title || 'Без назви';
    document.getElementById('modal-trigram').textContent = arch.trigram || '';
    document.getElementById('modal-desc').textContent = arch.description || '';

    const fieldsDiv = document.getElementById('modal-fields');
    fieldsDiv.innerHTML = arch.cultural_fields?.length
        ? `<strong>🏛 Культурні поля:</strong> ${arch.cultural_fields.join(', ')}`
        : '';

    const repsDiv = document.getElementById('modal-representatives');
    repsDiv.innerHTML = arch.representatives?.length
        ? `<strong>👥 Представники:</strong> ${arch.representatives.join(', ')}`
        : '';

    const worksDiv = document.getElementById('modal-works');
    worksDiv.innerHTML = arch.works?.length
        ? `<strong>📖 Твори / події:</strong> ${arch.works.join(', ')}`
        : '';

    const linksDiv = document.getElementById('modal-links');
    if (arch.links && Object.keys(arch.links).length > 0) {
        let linksHtml = '<strong>🔗 Посилання:</strong> ';
        for (const [name, url] of Object.entries(arch.links)) {
            linksHtml += `<a href="${url}" target="_blank" rel="noopener">${name}</a> `;
        }
        linksDiv.innerHTML = linksHtml;
    } else {
        linksDiv.innerHTML = '';
    }

    document.getElementById('modal').style.display = 'block';
}

// Закриття модального вікна
document.querySelector('.close').onclick = function() {
    document.getElementById('modal').style.display = 'none';
};
window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};

loadData();
