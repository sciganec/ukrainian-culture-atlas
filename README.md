# Атлас української культури

**Інтерактивний каталог 64 архетипів української культури**  
Побудований на системі SUBIT: **WHO × WHERE × WHEN**

[🌐 Жива версія](https://sciganec.github.io/ukrainian-culture-atlas)
---

## Що це?

«Атлас української культури» — це спроба охопити всю багатовікову культуру України від архаїки (Трипілля, скіфи, Київська Русь) до кінця ХХ століття (шістдесятники, нонконформізм, незалежний театр) за допомогою універсальної системи координат **SUBIT**.

Кожне культурне явище (митець, твір, інституція, подія) отримує координати за трьома осями:

- **WHO** – суб’єкт дії: `ME` (індивід), `WE` (колектив), `YOU` (глядач/адресат), `THEY` (національна пам’ять/діаспора)
- **WHERE** – геокультурний простір: `EAST` (Слобожанщина, Лівобережжя), `SOUTH` (Причорномор’я), `WEST` (Галичина, Волинь), `NORTH` (Київщина, Полісся)
- **WHEN** – темпоральна фаза: `SPRING` (зародження), `SUMMER` (розквіт), `AUTUMN` (криза/трансформація), `WINTER` (пам’ять/архівація)

Комбінація трьох бінарних виборів дає **64 архетипи** — кожен з них містить набір культурних явищ, що відповідають конкретному суб’єкту, простору та часовій фазі.

---

## Як це використовувати?

### Онлайн-каталог

Відкрийте [живу версію](https://sciganec.github.io/ukrainian-culture-atlas) — ви побачите сітку 8×8, де кожна клітинка позначає один архетип (наприклад, `ME·EAST·SPRING`).  
Клацніть на будь-яку клітинку — з’явиться модальне вікно з повною інформацією:

- Назва архетипу
- Опис
- Культурні поля (театр, література, музика, кіно, археологія тощо)
- Ключові представники (особи, колективи, інституції)
- Твори або події
- Посилання (де є)

### Локальний запуск

1. Склонуйте репозиторій:  
   ```bash
   git clone https://github.com/yourusername/ukrainian-culture-atlas.git
   cd ukrainian-culture-atlas
   ```
2. Запустіть простий веб-сервер (наприклад, Python):  
   ```bash
   python -m http.server 8000
   ```
3. Відкрийте браузер за адресою `http://localhost:8000`.

---

## Дані

Усі архетипи зберігаються в єдиному файлі **`archetypes.json`** у корені репозиторію. Це єдине джерело правди.  
Кожен запис має структуру:

```json
{
  "000000": {
    "trigram": "THEY · NORTH · WINTER",
    "title": "Північна пам'ять – архіви та інституції",
    "description": "...",
    "cultural_fields": ["театр", "музика", ...],
    "representatives": ["Іван Франко", "Національна опера", ...],
    "works": ["«Мойсей»", "«Украдене щастя»", ...],
    "images": [],
    "links": {}
  },
  ...
}
```

Ключі `000000` – `111111` відповідають 6-бітному кодуванню SUBIT (WHO bits + WHERE bits + WHEN bits).

---

## Структура репозиторію

```
ukrainian-culture-atlas/
├── README.md                 # цей файл
├── LICENSE                   # ліцензія (MIT)
├── .gitignore
├── archetypes.json           # головний файл з даними
├── index.html                # головна сторінка каталогу
├── style.css                 # стилі
└── script.js                 # логіка завантаження та відображення
```

---

**Atlas of Ukrainian Culture**  
*An interactive catalog of 64 archetypes mapping Ukrainian cultural history through the SUBIT system.*

---

## EN

The **Atlas of Ukrainian Culture** is a digital project that structures the entire span of Ukrainian cultural history — from ancient Trypillia and Scythian times to the end of the 20th century — into **64 archetypes** defined by three coordinates: **WHO** (the acting subject), **WHERE** (the geocultural region), and **WHEN** (the historical phase).  

This framework, called **SUBIT**, combines:

- **WHO** = ME, WE, YOU, THEY  
- **WHERE** = EAST, SOUTH, WEST, NORTH  
- **WHEN** = SPRING, SUMMER, AUTUMN, WINTER  

Each archetype corresponds to a unique 6‑bit binary key (from `000000` to `111111`). Every key is linked to a rich description, key representatives, works, cultural fields, and links.

---

## What’s Inside

The atlas covers **Ukrainian culture from its archaic roots to the year 2000**, including:

- **Archaic cultures**: Trypillia, Scythians, ancient Greek colonies, Kyivan Rus’ (including *The Tale of Igor’s Campaign*).  
- **Cossack era**: kobzar epic singers, vertep puppet theater, baroque architecture, Kyiv-Mohyla Academy.  
- **19th‑century national revival**: classics of literature (Shevchenko, Franko, Lesya Ukrainka), the Coryphaeus theater, folk music collections.  
- **Early 20th‑century avant-garde**: Les Kurbas’ Berezil theater, Mykola Khvylovy, Mykhail Semenko, avant-garde painting.  
- **Soviet period**: cinema (Dovzhenko, Mykolaychuk), music (Rotaru, Ivasyuk, Utyosov), rock music (Vopli Vidopliasova, Brothers Hadyukiny), non‑conformist art, diaspora theater
- **Independent era**: (1990s): DakhaBrakha, theater DAKH, literary groups (Bu-Ba-Bu), contemporary prose (Zabuzhko, Andrukhovych, Zhadan)

The project is structured as a single JSON file and an interactive 8×8 grid website, deployable on GitHub Pages. All 64 archetypes are verified, free of Russian cultural impositions, and chronologically consistent.


