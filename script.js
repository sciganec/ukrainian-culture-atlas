async function loadData() {
    const response = await fetch('archetypes.json');
    const data = await response.json();
    buildGrid(data);
}

function getWhenClass(trigram) {
    // trigram format: "WHO · WHERE · WHEN"
    const parts = trigram.split(' · ');
    const when = parts[2];
    switch (when) {
        case 'SPRING': return 'cell-spring';
        case 'SUMMER': return 'cell-summer';
        case 'AUTUMN': return 'cell-autumn';
        case 'WINTER': return 'cell-winter';
        default: return '';
    }
}

function buildGrid(data) {
    const grid = document.getElementById('grid');
    // Очищуємо сітку на випадок перезавантаження
    grid.innerHTML = '';
    // Проходимо по всіх 64 ключах від 000000 до 111111
    for (let i = 0; i < 64; i++) {
        const key = i.toString(2).padStart(6, '0');
        const archetype = data[key];
        if (!archetype) continue;
        const cell = document.createElement('div');
        cell.className = `cell ${getWhenClass(archetype.trigram)}`;
        cell.textContent = archetype.trigram || key;
        cell.addEventListener('click', () => showModal(archetype));
        grid.appendChild(cell);
    }
}

function showModal(archetype) {
    document.getElementById('modal-title').textContent = archetype.title;
    document.getElementById('modal-trigram').textContent = archetype.trigram;
    document.getElementById('modal-desc').textContent = archetype.description;

    // Заповнюємо поля
    document.querySelector('#modal-fields span').textContent = archetype.cultural_fields.join(', ');
    document.querySelector('#modal-representatives span').textContent = archetype.representatives.join(', ');
    document.querySelector('#modal-works span').textContent = archetype.works.join(', ');

    // Посилання (якщо є)
    const linksSpan = document.querySelector('#modal-links span');
    if (archetype.links && Object.keys(archetype.links).length > 0) {
        let linksHtml = '';
        for (const [name, url] of Object.entries(archetype.links)) {
            linksHtml += `<a href="${url}" target="_blank">${name}</a> `;
        }
        linksSpan.innerHTML = linksHtml;
    } else {
        linksSpan.innerHTML = '';
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
