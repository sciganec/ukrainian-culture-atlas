const WHO_ORDER = ["ME", "WE", "THEY", "YOU"];
const WHERE_ORDER = ["NORTH", "WEST", "SOUTH", "EAST"];
const WHEN_ORDER = ["WINTER", "AUTUMN", "SPRING", "SUMMER"];

const WHO_LABELS = {
    ME: "Індивід",
    WE: "Колектив",
    THEY: "Пам’ять та інституції",
    YOU: "Аудиторія"
};

const WHERE_LABELS = {
    NORTH: "Північ",
    WEST: "Захід",
    SOUTH: "Південь",
    EAST: "Схід"
};

const WHEN_LABELS = {
    WINTER: "Пам’ять і архівація",
    AUTUMN: "Криза і трансформація",
    SPRING: "Зародження",
    SUMMER: "Розквіт"
};

const state = {
    archetypes: [],
    filtered: [],
    activeKey: null,
    lastFocusedElement: null
};

const dom = {
    grid: document.getElementById("grid"),
    modal: document.getElementById("modal"),
    modalTitle: document.getElementById("modal-title"),
    modalKey: document.getElementById("modal-key"),
    modalTrigram: document.getElementById("modal-trigram"),
    modalDesc: document.getElementById("modal-desc"),
    modalFields: document.getElementById("modal-fields"),
    modalRepresentatives: document.getElementById("modal-representatives"),
    modalWorks: document.getElementById("modal-works"),
    modalLinks: document.getElementById("modal-links"),
    searchInput: document.getElementById("search-input"),
    whoFilter: document.getElementById("who-filter"),
    whereFilter: document.getElementById("where-filter"),
    whenFilter: document.getElementById("when-filter"),
    resetButton: document.getElementById("reset-button"),
    randomButton: document.getElementById("random-button"),
    closeButton: document.getElementById("close-button"),
    status: document.getElementById("status"),
    resultsSummary: document.getElementById("results-summary"),
    totalStat: document.getElementById("stat-total"),
    visibleStat: document.getElementById("stat-visible")
};

async function loadData() {
    setStatus("Завантаження архетипів…");

    try {
        const response = await fetch("archetypes.json");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const rawData = await response.json();
        state.archetypes = Object.entries(rawData)
            .map(([key, value]) => normalizeArchetype(key, value))
            .sort((left, right) => left.key.localeCompare(right.key));

        dom.totalStat.textContent = String(state.archetypes.length);
        populateFilters(state.archetypes);
        applyFilters();

        const initialKey = decodeURIComponent(window.location.hash.replace("#", ""));
        if (initialKey) {
            const match = state.archetypes.find((entry) => entry.key === initialKey);
            if (match) {
                showModal(match, dom.grid.querySelector(`[data-key="${CSS.escape(initialKey)}"]`));
            }
        }
    } catch (error) {
        console.error("Помилка завантаження даних:", error);
        setStatus(
            "Не вдалося завантажити archetypes.json. Переконайтеся, що атлас запущений через локальний сервер.",
            true
        );
    }
}

function normalizeArchetype(key, data) {
    const who = normalizeToken(data.who);
    const where = normalizeToken(data.where);
    const when = normalizeToken(data.when);
    const summary = data.summary || data.description || "";
    const description = data.description || data.summary || "";

    const haystack = [
        key,
        data.id,
        data.slug,
        data.title,
        summary,
        description,
        who,
        where,
        when,
        data.who_label_uk,
        data.where_label_uk,
        data.when_label_uk,
        ...(data.cultural_fields || []),
        ...(data.representatives || []),
        ...(data.works || []),
        ...(data.search_terms || [])
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return {
        key,
        id: data.id || key,
        slug: data.slug || `${who.toLowerCase()}-${where.toLowerCase()}-${when.toLowerCase()}`,
        title: data.title || "Без назви",
        summary,
        description,
        trigram: `${who} · ${where} · ${when}`,
        who,
        where,
        when,
        whoLabel: data.who_label_uk || WHO_LABELS[who] || who,
        whereLabel: data.where_label_uk || WHERE_LABELS[where] || where,
        whenLabel: data.when_label_uk || WHEN_LABELS[when] || when,
        culturalFields: data.cultural_fields || [],
        representatives: data.representatives || [],
        works: data.works || [],
        links: data.links || {},
        phaseClass: getPhaseClass(when),
        haystack
    };
}

function normalizeToken(value) {
    return String(value || "").trim().toUpperCase();
}

function getPhaseClass(phase) {
    const normalized = String(phase || "").toLowerCase();
    if (["spring", "summer", "autumn", "winter"].includes(normalized)) {
        return `cell-${normalized}`;
    }
    return "";
}

function populateFilters(items) {
    fillSelect(dom.whoFilter, uniqueValues(items, "who"), WHO_ORDER, WHO_LABELS);
    fillSelect(dom.whereFilter, uniqueValues(items, "where"), WHERE_ORDER, WHERE_LABELS);
    fillSelect(dom.whenFilter, uniqueValues(items, "when"), WHEN_ORDER, WHEN_LABELS);
}

function fillSelect(select, values, preferredOrder, labelMap) {
    const current = select.value || "all";
    const sorted = [...values].sort((left, right) => {
        const leftIndex = preferredOrder.indexOf(left);
        const rightIndex = preferredOrder.indexOf(right);
        return leftIndex - rightIndex;
    });

    for (const value of sorted) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = `${value} · ${labelMap[value] || value}`;
        select.appendChild(option);
    }

    select.value = current;
}

function uniqueValues(items, key) {
    return [...new Set(items.map((item) => item[key]).filter(Boolean))];
}

function applyFilters() {
    const searchQuery = dom.searchInput.value.trim().toLowerCase();
    const whoValue = dom.whoFilter.value;
    const whereValue = dom.whereFilter.value;
    const whenValue = dom.whenFilter.value;

    state.filtered = state.archetypes.filter((item) => {
        const matchesSearch = !searchQuery || item.haystack.includes(searchQuery);
        const matchesWho = whoValue === "all" || item.who === whoValue;
        const matchesWhere = whereValue === "all" || item.where === whereValue;
        const matchesWhen = whenValue === "all" || item.when === whenValue;
        return matchesSearch && matchesWho && matchesWhere && matchesWhen;
    });

    renderGrid();
    updateSummary();
}

function renderGrid() {
    dom.grid.innerHTML = "";

    if (!state.filtered.length) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "Нічого не знайдено. Спробуйте інший запит або скиньте фільтри.";
        dom.grid.appendChild(empty);
        setStatus("");
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const item of state.filtered) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = ["cell", item.phaseClass, item.key === state.activeKey ? "is-active" : ""]
            .filter(Boolean)
            .join(" ");
        button.dataset.key = item.key;
        button.setAttribute(
            "aria-label",
            `${item.title}. ${item.whoLabel}, ${item.whereLabel}, ${item.whenLabel}.`
        );

        const key = document.createElement("span");
        key.className = "cell-key";
        key.textContent = item.key;

        const title = document.createElement("span");
        title.className = "cell-title";
        title.textContent = item.title;

        const meta = document.createElement("span");
        meta.className = "cell-meta";
        meta.textContent = `${item.who} · ${item.where} · ${item.when}`;

        button.append(key, title, meta);
        button.addEventListener("click", () => showModal(item, button));
        fragment.appendChild(button);
    }

    dom.grid.appendChild(fragment);
    setStatus("");
}

function updateSummary() {
    const visible = state.filtered.length;
    const total = state.archetypes.length;
    dom.visibleStat.textContent = String(visible);
    dom.resultsSummary.textContent = `Показано ${visible} із ${total} архетипів.`;
}

function setStatus(message, isError = false) {
    dom.status.textContent = message;
    dom.status.classList.toggle("error", isError);
}

function showModal(item, triggerElement = null) {
    state.activeKey = item.key;
    state.lastFocusedElement = triggerElement || document.activeElement;
    window.location.hash = encodeURIComponent(item.key);

    dom.modalKey.textContent = `Архетип ${item.key}`;
    dom.modalTitle.textContent = item.title;
    dom.modalTrigram.textContent = `${item.whoLabel} · ${item.whereLabel} · ${item.whenLabel}`;
    dom.modalDesc.textContent = item.description;

    renderDetailSection(dom.modalFields, "Культурні поля", item.culturalFields);
    renderDetailSection(dom.modalRepresentatives, "Представники", item.representatives);
    renderDetailSection(dom.modalWorks, "Твори та події", item.works);
    renderLinksSection(dom.modalLinks, item.links);

    dom.modal.hidden = false;
    document.body.classList.add("modal-open");
    dom.closeButton.focus();
    syncActiveCard();
}

function renderDetailSection(container, title, items) {
    if (!items.length) {
        container.innerHTML = "";
        return;
    }

    const listItems = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    container.innerHTML = `<h3>${escapeHtml(title)}</h3><ul class="detail-list">${listItems}</ul>`;
}

function renderLinksSection(container, links) {
    const entries = Object.entries(links).filter(([, url]) => Boolean(url));
    if (!entries.length) {
        container.innerHTML = "";
        return;
    }

    const items = entries
        .map(
            ([label, url]) =>
                `<a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
        )
        .join("");

    container.innerHTML = `<h3>Посилання</h3><div class="link-list">${items}</div>`;
}

function closeModal() {
    dom.modal.hidden = true;
    document.body.classList.remove("modal-open");
    state.activeKey = null;
    syncActiveCard();

    if (window.location.hash) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    if (state.lastFocusedElement instanceof HTMLElement) {
        state.lastFocusedElement.focus();
    }
}

function syncActiveCard() {
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.toggle("is-active", cell.dataset.key === state.activeKey);
    });
}

function openRandomArchetype() {
    if (!state.filtered.length) return;
    const randomIndex = Math.floor(Math.random() * state.filtered.length);
    const item = state.filtered[randomIndex];
    const button = dom.grid.querySelector(`[data-key="${CSS.escape(item.key)}"]`);
    showModal(item, button);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function resetFilters() {
    dom.searchInput.value = "";
    dom.whoFilter.value = "all";
    dom.whereFilter.value = "all";
    dom.whenFilter.value = "all";
    applyFilters();
}

dom.searchInput.addEventListener("input", applyFilters);
dom.whoFilter.addEventListener("change", applyFilters);
dom.whereFilter.addEventListener("change", applyFilters);
dom.whenFilter.addEventListener("change", applyFilters);
dom.resetButton.addEventListener("click", resetFilters);
dom.randomButton.addEventListener("click", openRandomArchetype);
dom.closeButton.addEventListener("click", closeModal);

dom.modal.addEventListener("click", (event) => {
    if (event.target === dom.modal) {
        closeModal();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.modal.hidden) {
        closeModal();
    }
});

window.addEventListener("hashchange", () => {
    const key = decodeURIComponent(window.location.hash.replace("#", ""));

    if (!key && !dom.modal.hidden) {
        closeModal();
        return;
    }

    if (!key) return;

    const match = state.archetypes.find((item) => item.key === key);
    if (match) {
        showModal(match, dom.grid.querySelector(`[data-key="${CSS.escape(key)}"]`));
    }
});

loadData();
