// script.js

// ==================== ПЕЧАТАЮЩИЙСЯ ТЕКСТ ====================
const typedTextSpan = document.getElementById('typed-text');
const words = ['AI-интегратор', 'автоматизатор', 'исследователь', 'генератор контента'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 300);
    } else {
        setTimeout(type, 100);
    }
}
document.addEventListener('DOMContentLoaded', type);

// ==================== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ====================
function checkReveal() {
    const revealElements = document.querySelectorAll('.main-panel .reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}
document.addEventListener('DOMContentLoaded', checkReveal);
window.addEventListener('scroll', checkReveal);

// ==================== ИНИЦИАЛИЗАЦИЯ VANILLATILT ====================
document.addEventListener('DOMContentLoaded', () => {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        gyroscope: true,
    });
});

// ==================== ПЕРЕКЛЮЧЕНИЕ ПАНЕЛЕЙ ====================
const wrapper = document.getElementById('siteWrapper');
const trigger = document.getElementById('helpTrigger');
const backButton = document.getElementById('backButton');

function smoothScrollToTop() {
    smoothScrollTo(0, 600); // плавная прокрутка наверх за 600мс
}

trigger.addEventListener('click', () => {
    wrapper.classList.add('shift');
    setTimeout(smoothScrollToTop, 100);
});

backButton.addEventListener('click', () => {
    wrapper.classList.remove('shift');
    setTimeout(smoothScrollToTop, 100);
});

// ==================== КАСТОМНАЯ ПЛАВНАЯ ПРОКРУТКА ====================
/**
 * Плавно прокручивает страницу к заданной позиции Y
 * @param {number} targetY - целевая позиция прокрутки по вертикали
 * @param {number} duration - длительность анимации в миллисекундах
 */
function smoothScrollTo(targetY, duration = 800) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        // easing function для плавности
        const ease = easeInOutQuad(progress);
        window.scrollTo(0, startY + distance * ease);
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    requestAnimationFrame(animation);
}

/**
 * Плавно прокручивает страницу к элементу, центрируя его на экране
 * @param {HTMLElement} element - элемент, к которому нужно прокрутить
 * @param {number} duration - длительность анимации
 */
function smoothScrollToElement(element, duration = 800) {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.pageYOffset;
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    // Позиция, чтобы элемент был по центру
    const targetY = elementTop - (windowHeight / 2) + (elementHeight / 2);
    smoothScrollTo(targetY, duration);
}

// ==================== ЛОГИКА КАРТОЧЕК ПОМОЩИ ====================
const cards = document.querySelectorAll('.help-card');
const descriptionDiv = document.getElementById('helpDescription');
const extraButtonsDiv = document.getElementById('extraButtons');
const detailsPanel = document.getElementById('detailsPanel');
const subtitleSmall = document.querySelector('.help-subtitle-small');
let activeCard = null;
let wordTimer = null;
let glowTimer = null;

// Тексты описаний
const descriptions = {
    business: 'Помог владельцу небольшой транспортной компании автоматизировать документооборот и учёт заказов, используя Google Sheets и Python-скрипты. Сократил время на отчёты с 3 часов до 30 минут в день.',
    creator: 'Работал с YouTube-блогером: монтировал видео в DaVinci Resolve, генерировал обложки через Midjourney, настраивал автоматическую публикацию. Результат — стабильный график выхода роликов.',
    photo: 'Обрабатывал фотографии для знакомых фотографов: цветокоррекция, ретушь, удаление фона с помощью нейросетей (Remove.bg, Photoshop AI).',
    student: 'Помогал однокурсникам с проектами по программированию: объяснял алгоритмы, помогал отлаживать код на Python и C++. Несколько работ защищены на отлично.',
    marketing: 'Для небольшого интернет-магазина генерировал описания товаров с помощью ChatGPT, создавал карточки товаров в Figma. CTR вырос на 15%.',
    dev: 'Консультировал стартап по интеграции Telegram-бота с OpenAI API: настроил промпты, разобрался с документацией, бот отвечает на 80% вопросов клиентов.'
};

// Данные для дополнительных кнопок (второй уровень)
const buttonsData = {
    business: [
        { text: '💰 Узнать стоимость автоматизации', link: 'https://t.me/Mr_Amor4ick?text=Привет!%20Хочу%20узнать%20стоимость%20автоматизации%20для%20бизнеса' },
        { text: '📊 Примеры внедрений', action: 'examples', category: 'business' },
        { text: '📞 Связаться в Telegram', link: 'https://t.me/Mr_Amor4ick' },
        { text: '❓ Часто задаваемые вопросы', action: 'faq', category: 'business' }
    ],
    creator: [
        { text: '🎬 Примеры видео', action: 'examples', category: 'creator' },
        { text: '💰 Стоимость монтажа', link: 'https://t.me/Mr_Amor4ick?text=Интересует%20монтаж%20видео' },
        { text: '📞 Связаться', link: 'https://t.me/Mr_Amor4ick' },
        { text: '❓ FAQ', action: 'faq', category: 'creator' }
    ],
    photo: [
        { text: '📸 Примеры обработки', action: 'examples', category: 'photo' },
        { text: '💰 Прайс на ретушь', link: 'https://t.me/Mr_Amor4ick?text=Прайс%20на%20обработку%20фото' },
        { text: '📞 Связаться', link: 'https://t.me/Mr_Amor4ick' },
        { text: '❓ FAQ', action: 'faq', category: 'photo' }
    ],
    student: [
        { text: '📚 Помощь с проектом', link: 'https://t.me/Mr_Amor4ick?text=Нужна%20помощь%20с%20проектом' },
        { text: '💡 Примеры работ', action: 'examples', category: 'student' },
        { text: '📞 Связаться', link: 'https://t.me/Mr_Amor4ick' },
        { text: '❓ FAQ', action: 'faq', category: 'student' }
    ],
    marketing: [
        { text: '📈 Примеры текстов', action: 'examples', category: 'marketing' },
        { text: '💰 Стоимость генерации', link: 'https://t.me/Mr_Amor4ick?text=Стоимость%20генерации%20контента' },
        { text: '📞 Связаться', link: 'https://t.me/Mr_Amor4ick' },
        { text: '❓ FAQ', action: 'faq', category: 'marketing' }
    ],
    dev: [
        { text: '💻 Примеры кода', action: 'examples', category: 'dev' },
        { text: '💰 Консультация', link: 'https://t.me/Mr_Amor4ick?text=Нужна%20консультация%20по%20коду' },
        { text: '📞 Связаться', link: 'https://t.me/Mr_Amor4ick' },
        { text: '❓ FAQ', action: 'faq', category: 'dev' }
    ]
};

// Контент для панели деталей (примеры и FAQ) с путями к изображениям
const detailsContent = {
    business: {
        examples: {
            title: 'Примеры внедрений для бизнеса',
            items: [
                { icon: 'fa-file-invoice', text: 'Автоматизация документооборота (Python + Google Sheets)', img: 'examples/business-docs.jpg' },
                { icon: 'fa-robot', text: 'Чат-бот для записи клиентов (Telegram)', img: 'examples/business-bot.jpg' },
                { icon: 'fa-chart-line', text: 'Аналитика продаж в реальном времени', img: 'examples/business-analytics.jpg' }
            ]
        },
        faq: {
            title: 'Ответы на частые вопросы (бизнес)',
            items: [
                { icon: 'fa-question-circle', text: 'Какие задачи можно автоматизировать? — Любые рутинные процессы с данными.' },
                { icon: 'fa-clock', text: 'Сколько времени занимает внедрение? — От 1 дня до 2 недель.' },
                { icon: 'fa-shield-alt', text: 'Насколько безопасно? — Использую шифрование и локальные серверы.' }
            ]
        }
    },
    creator: {
        examples: {
            title: 'Примеры видео и контента',
            items: [
                { icon: 'fa-video', text: 'Монтаж обзоров для YouTube-канала (10+ видео)', img: 'examples/creator-video.jpg' },
                { icon: 'fa-image', text: 'Генерация обложек через Midjourney', img: 'examples/creator-cover.jpg' },
                { icon: 'fa-music', text: 'Создание фоновой музыки с ИИ', img: 'examples/creator-music.jpg' }
            ]
        },
        faq: {
            title: 'FAQ для креаторов',
            items: [
                { icon: 'fa-question-circle', text: 'Какие форматы видео монтируете? — MP4, MOV, готово для YouTube, TikTok.' },
                { icon: 'fa-clock', text: 'Сроки монтажа? — От 2 дней.' },
                { icon: 'fa-dollar-sign', text: 'Стоимость? — От 3000₽ за видео.' }
            ]
        }
    },
    photo: {
        examples: {
            title: 'Примеры обработки фотографий',
            items: [
                { icon: 'fa-camera-retro', text: 'Ретушь портретов (до/после)', img: 'examples/photo-retouch.jpg' },
                { icon: 'fa-tree', text: 'Замена фона с помощью ИИ', img: 'examples/photo-bg.jpg' },
                { icon: 'fa-palette', text: 'Цветокоррекция в стиле cinema', img: 'examples/photo-color.jpg' }
            ]
        },
        faq: {
            title: 'FAQ для фотографов',
            items: [
                { icon: 'fa-question-circle', text: 'Какие исходники нужны? — RAW или JPEG высокого качества.' },
                { icon: 'fa-clock', text: 'Сколько обрабатываете одно фото? — 15–30 минут.' },
                { icon: 'fa-dollar-sign', text: 'Цена за фото? — От 200₽.' }
            ]
        }
    },
    student: {
        examples: {
            title: 'Примеры студенческих проектов',
            items: [
                { icon: 'fa-code', text: 'Курсовая по Python: парсинг данных', img: 'examples/student-python.jpg' },
                { icon: 'fa-calculator', text: 'Решение задач по высшей математике', img: 'examples/student-math.jpg' },
                { icon: 'fa-database', text: 'База данных для курсовой', img: 'examples/student-db.jpg' }
            ]
        },
        faq: {
            title: 'FAQ для студентов',
            items: [
                { icon: 'fa-question-circle', text: 'Помогаете писать код? — Да, объясняю и помогаю отладить.' },
                { icon: 'fa-clock', text: 'Сроки? — Зависит от сложности.' },
                { icon: 'fa-dollar-sign', text: 'Бюджетно? — Да, для студентов скидки.' }
            ]
        }
    },
    marketing: {
        examples: {
            title: 'Примеры маркетинговых текстов',
            items: [
                { icon: 'fa-ad', text: 'Рекламные посты для Instagram', img: 'examples/marketing-post.jpg' },
                { icon: 'fa-envelope-open-text', text: 'Email-рассылки (продающие)', img: 'examples/marketing-email.jpg' },
                { icon: 'fa-chart-simple', text: 'Описания товаров с высоким CTR', img: 'examples/marketing-description.jpg' }
            ]
        },
        faq: {
            title: 'FAQ для маркетологов',
            items: [
                { icon: 'fa-question-circle', text: 'Генерируете уникальный контент? — Да, с помощью ChatGPT.' },
                { icon: 'fa-clock', text: 'Сколько текстов в день? — До 10.' },
                { icon: 'fa-dollar-sign', text: 'Цена за пост? — От 300₽.' }
            ]
        }
    },
    dev: {
        examples: {
            title: 'Примеры кода и консультаций',
            items: [
                { icon: 'fa-robot', text: 'Telegram-бот на Python с ИИ', img: 'examples/dev-bot.jpg' },
                { icon: 'fa-globe', text: 'Веб-интеграция OpenAI API', img: 'examples/dev-api.jpg' },
                { icon: 'fa-microchip', text: 'Оптимизация алгоритмов на C++', img: 'examples/dev-algo.jpg' }
            ]
        },
        faq: {
            title: 'FAQ для разработчиков',
            items: [
                { icon: 'fa-question-circle', text: 'Консультируете по коду? — Да, онлайн.' },
                { icon: 'fa-clock', text: 'Быстро ли отвечаете? — В течение дня.' },
                { icon: 'fa-dollar-sign', text: 'Стоимость часа? — Договорная.' }
            ]
        }
    }
};

// Функция для плавного вывода текста по словам
function printWordsSmooth(text, element) {
    if (wordTimer) clearTimeout(wordTimer);
    const wordsArray = text.split(' ');
    element.innerHTML = '';

    let currentIndex = 0;
    function addWord() {
        if (currentIndex < wordsArray.length) {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.textContent = wordsArray[currentIndex] + ' ';
            element.appendChild(wordSpan);
            currentIndex++;
            wordTimer = setTimeout(addWord, 80);
        } else {
            wordTimer = null;
        }
    }
    const icon = document.createElement('i');
    icon.className = 'fas fa-quote-left';
    icon.style.color = 'var(--neon-blue)';
    icon.style.marginRight = '8px';
    element.appendChild(icon);
    addWord();
}

// Функция для создания дополнительных кнопок (второй уровень)
function createExtraButtons(category) {
    const buttons = buttonsData[category] || [];
    extraButtonsDiv.innerHTML = ''; // очищаем
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        const button = document.createElement('a');
        button.className = 'action-btn';
        if (btn.link) {
            button.href = btn.link;
            button.target = '_blank';
        } else if (btn.action) {
            button.href = '#';
            button.addEventListener('click', (e) => {
                e.preventDefault();
                showDetails(btn.category, btn.action);
            });
        }
        button.innerHTML = btn.text;
        extraButtonsDiv.appendChild(button);
    });
    extraButtonsDiv.classList.add('visible');
}

// Функция для отображения панели деталей
function showDetails(category, type) {
    const content = detailsContent[category]?.[type];
    if (!content) return;

    let html = `<h4>${content.title}</h4>`;
    html += '<div class="example-grid">';
    content.items.forEach(item => {
        html += `
            <div class="example-item">
                <img src="${item.img}" alt="${item.text}" class="example-img">
                <i class="fas ${item.icon} example-icon"></i>
                <span>${item.text}</span>
            </div>
        `;
    });
    html += '</div>';
    
    detailsPanel.innerHTML = html;
    detailsPanel.classList.add('visible');

    // Добавляем обработчики ошибок для изображений
    const images = detailsPanel.querySelectorAll('.example-img');
    images.forEach(img => {
        img.onerror = function() {
            this.style.display = 'none';
            const icon = this.nextElementSibling;
            if (icon && icon.classList.contains('example-icon')) {
                icon.style.display = 'block';
            }
        };
    });

    // Плавная прокрутка к панели деталей с центрированием
    setTimeout(() => {
        smoothScrollToElement(detailsPanel, 800);
    }, 300);
}

// Функция для скрытия панели деталей
function hideDetails() {
    detailsPanel.classList.remove('visible');
    setTimeout(() => {
        detailsPanel.innerHTML = '';
    }, 500);
}

// Функция для запуска анимации свечения
function startGlowAnimation(element) {
    if (glowTimer) clearTimeout(glowTimer);
    element.classList.remove('glow-run');
    setTimeout(() => {
        element.classList.add('glow-run');
    }, 10);
    glowTimer = setTimeout(() => {
        element.classList.remove('glow-run');
    }, 3000);
}

// Скрыть дополнительные кнопки (при закрытии)
function hideExtraButtons() {
    extraButtonsDiv.classList.remove('visible');
    setTimeout(() => {
        extraButtonsDiv.innerHTML = '';
    }, 500);
}

cards.forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;

        if (this.classList.contains('active') && descriptionDiv.classList.contains('visible')) {
            // Закрываем описание и кнопки
            this.classList.remove('active');
            descriptionDiv.classList.remove('visible', 'highlight');
            hideExtraButtons();
            hideDetails();
            if (subtitleSmall) subtitleSmall.classList.remove('visible');
            if (wordTimer) clearTimeout(wordTimer);
            wordTimer = null;
            if (glowTimer) clearTimeout(glowTimer);
            descriptionDiv.classList.remove('glow-run');
            cards.forEach(c => c.classList.remove('no-float'));
            activeCard = null;
        } else {
            // Открываем новое описание
            cards.forEach(c => {
                c.classList.remove('active');
                c.classList.add('no-float');
            });
            this.classList.add('active');
            this.classList.add('no-float');

            descriptionDiv.innerHTML = '';
            descriptionDiv.classList.add('visible', 'highlight');

            printWordsSmooth(descriptions[category], descriptionDiv);
            startGlowAnimation(descriptionDiv);
            
            createExtraButtons(category);
            hideDetails();

            if (subtitleSmall) subtitleSmall.classList.add('visible');

            // Плавная прокрутка к описанию с центрированием
            setTimeout(() => {
                smoothScrollToElement(descriptionDiv, 800);
            }, 300);

            activeCard = this;
        }
    });
});

// Скрываем всё при возврате на главную панель
backButton.addEventListener('click', () => {
    wrapper.classList.remove('shift');
    setTimeout(() => smoothScrollTo(0, 600), 100);
    cards.forEach(c => c.classList.remove('active', 'no-float'));
    descriptionDiv.classList.remove('visible', 'highlight');
    hideExtraButtons();
    hideDetails();
    if (subtitleSmall) subtitleSmall.classList.remove('visible');
    if (wordTimer) clearTimeout(wordTimer);
    wordTimer = null;
    if (glowTimer) clearTimeout(glowTimer);
    descriptionDiv.classList.remove('glow-run');
});
