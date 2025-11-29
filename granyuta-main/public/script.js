// КЛИЕНТСКИЙ РОУТИНГ
function initRouter() {
    // Функция для перехода к секции и переключения вкладки
    function navigateToSection(sectionId) {
        // Используем существующую функцию switchTab
        switchTab(sectionId);
        
        // Плавная прокрутка к секции
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Обработка изменения URL
    function handleRoute() {
        const path = window.location.pathname;
        
        switch(path) {
            case '/':
                navigateToSection('home');
                break;
            case '/catalog':
                navigateToSection('catalog');
                break;
            case '/about':
                navigateToSection('about');
                break;
            case '/gallery':
                navigateToSection('gallery');
                break;
            case '/calculator':
                navigateToSection('calculator');
                break;
            case '/contact':
                navigateToSection('contact');
                break;
            case '/faq':
                // Для FAQ оставляем как есть, так как это отдельная страница
                break;
            default:
                // Если роут не найден, переходим на главную
                if (path !== '/faq') {
                    navigateToSection('home');
                }
        }
    }
    
    // Обработка кликов по ссылкам навигации (для прямых ссылок)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            const href = e.target.getAttribute('href');
            
            if (href === '/faq') {
                // Для FAQ переходим на отдельную страницу
                return; // Позволяем браузеру обработать переход
            } else if (href.startsWith('/') && !e.target.hasAttribute('data-tab')) {
                e.preventDefault();
                const sectionId = href.replace('/', '') || 'home';
                navigateToSection(sectionId);
                
                // Обновляем URL без перезагрузки страницы
                window.history.pushState({}, '', href);
            }
        }
    });
    
    // Обработка кнопки "Назад" в браузере
    window.addEventListener('popstate', handleRoute);
    
    // Инициализация при загрузке страницы
    handleRoute();
}

// КОНФИГУРАЦИЯ КАЛЬКУЛЯТОРА - ЗДЕСЬ МОЖНО МЕНЯТЬ ВСЕ ПОД СЕБЯ
const CONFIG = {
    // Базовые цены на размеры бань
    sizes: {
        '200000': { name: '2м × 4м', price: 200000 },
        '250000': { name: '2м × 5м', price: 250000 },
        '300000': { name: '2м × 6м', price: 300000 },
        '350000': { name: '2.5м × 6м', price: 350000 }
    },
    
    // Коэффициенты для материалов
    materials: {
        '1': { name: 'Кедр сибирский', multiplier: 1 },
        '1.3': { name: 'Кедр канадский', multiplier: 1.3 },
        '0.8': { name: 'Липа', multiplier: 0.8 },
        '0.9': { name: 'Осина', multiplier: 0.9 }
    },
    
    // Цены на печи
    stoves: {
        '0': { name: 'Без печи', price: 0 },
        '50000': { name: 'Электрическая печь', price: 50000 },
        '80000': { name: 'Дровяная печь', price: 80000 },
        '120000': { name: 'Премиум дровяная', price: 120000 }
    },
    
    // Дополнительные опции
    extras: {
        delivery: { name: 'Доставка и установка (по договорённости)', price: 0}
    }
};

// Функция переключения вкладок
function switchTab(tabName) {
    // Скрываем все вкладки
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Убираем активный класс со всех ссылок
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Показываем нужную вкладку
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Активируем соответствующую ссылку
    const targetLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // Плавная прокрутка к секции
    if (targetTab) {
        targetTab.scrollIntoView({ behavior: 'smooth' });
    }
}

// Функция расчета цены
function calculatePrice() {
    const sizeValue = document.getElementById('size').value;
    let totalPrice = parseInt(sizeValue);
    // Если выбрана доставка, добавляем 50 000
    const deliveryCheckbox = document.getElementById('delivery');
    if (deliveryCheckbox && deliveryCheckbox.checked) {
        totalPrice += 0;
    }
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
}

// Функция фильтрации работ
function filterWorks(category) {
    const workCards = document.querySelectorAll('.work-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Убираем активный класс со всех кнопок
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Активируем нажатую кнопку
    const activeButton = document.querySelector(`[data-filter="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Показываем/скрываем карточки
    workCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- Динамическая загрузка каталога бань ---
async function loadCatalog() {
    const grid = document.querySelector('.catalog-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading">Загрузка...</div>';
    try {
        const response = await fetch('/api/catalog');
        if (!response.ok) throw new Error('Ошибка загрузки каталога');
        const baths = await response.json();
        if (!baths.length) {
            grid.innerHTML = '<div class="empty-catalog">Каталог пуст</div>';
            return;
        }
        grid.innerHTML = baths.map(bath => {
            const images = Array.isArray(bath.images) ? bath.images : [bath.image];
            const productSchema = `\n<script type="application/ld+json">${JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": bath.name,
                "image": images.length > 0 ? (images[0].startsWith('http') ? images[0] : (images[0].startsWith('image/') ? 'https://granyuta.ru/' + images[0] : 'https://granyuta.ru/image/' + images[0])) : '',
                "description": bath.description,
                "brand": {
                    "@type": "Brand",
                    "name": "ГрАнь Уюта"
                },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "RUB",
                    "price": bath.price === 0 && bath.name.toLowerCase().includes('викинг') ? "от 280 000" : bath.price,
                    "itemCondition": "https://schema.org/NewCondition",
                    "availability": "https://schema.org/InStock",
                    "seller": { 
                        "@type": "Organization",
                        "name": "ГрАнь Уюта"
                    }
                }
            })}</script>\n`;
            
            const carouselId = `carousel-${bath.id}`;
            const carouselHTML = images.length > 1 ? `
                <div class="carousel-container">
                    <div class="carousel-progress">
                        <div class="carousel-progress-bar"></div>
                    </div>
                    <div class="carousel-wrapper" id="${carouselId}">
                        ${images.map((img, index) => `
                            <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                                <img src="${img.startsWith('http') ? img : (img.startsWith('image/') ? img : 'image/' + img)}" alt="${bath.name}">
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-btn carousel-prev" onclick="changeSlide('${carouselId}', -1)">‹</button>
                    <button class="carousel-btn carousel-next" onclick="changeSlide('${carouselId}', 1)">›</button>
                    <div class="carousel-dots">
                        ${images.map((_, index) => `
                            <span class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide('${carouselId}', ${index})"></span>
                        `).join('')}
                    </div>
                </div>
            ` : `
                <div class="catalog-card-img">
                    <img src="${images[0].startsWith('http') ? images[0] : (images[0].startsWith('image/') ? images[0] : 'image/' + images[0])}" alt="${bath.name}">
                </div>
            `;
            
            return `
                <div class="catalog-card">
                    ${carouselHTML}
                    <div class="catalog-card-content">
                        <h3>${bath.name}</h3>
                        <p>${bath.description}</p>
                    </div>
                    <div class="catalog-card-footer">
                        <div class="catalog-card-price">${bath.price === 0 && bath.name.toLowerCase().includes('викинг') ? 'от 280 000' : Number(bath.price).toLocaleString('ru-RU')} ₽</div>
                        <button class="catalog-btn" onclick="openOrderModal('${bath.name}', '${bath.price}')">Заказать</button>
                    </div>
                    ${productSchema}
                </div>
            `;
        }).join('');
        
        // Инициализируем автопереключение каруселей
        initCarousels();
    } catch (e) {
        grid.innerHTML = '<div class="error">Ошибка загрузки каталога</div>';
    }
}

// Функции для карусели в стиле Flutter
function changeSlide(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
    const progressBar = carousel.parentElement.querySelector('.carousel-progress-bar');
    let currentIndex = 0;
    
    // Находим текущий активный слайд
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Вычисляем новый индекс
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = slides.length - 1;
    if (newIndex >= slides.length) newIndex = 0;
    
    // Анимация перехода
    const currentSlide = slides[currentIndex];
    const newSlide = slides[newIndex];
    
    // Добавляем классы для анимации
    currentSlide.classList.add('exiting');
    newSlide.classList.add('entering');
    
    // Обновляем позицию карусели
    carousel.style.transform = `translateX(-${newIndex * 100}%)`;
    
    // Обновляем активные классы
    setTimeout(() => {
        slides.forEach(slide => slide.classList.remove('active', 'entering', 'exiting'));
        newSlide.classList.add('active');
        
        // Обновляем точки
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[newIndex].classList.add('active');
        }
        
        // Обновляем прогресс-бар
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        }
    }, 250);
}

function goToSlide(carouselId, slideIndex) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.parentElement.querySelectorAll('.carousel-dot');
    const progressBar = carousel.parentElement.querySelector('.carousel-progress-bar');
    
    // Убираем активные классы
    slides.forEach(slide => slide.classList.remove('active', 'entering', 'exiting'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Активируем нужный слайд и точку
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('active');
        carousel.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
    
    // Обновляем прогресс-бар
    if (progressBar) {
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 100);
    }
}

function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const carouselId = carousel.querySelector('.carousel-wrapper').id;
        const slides = carousel.querySelectorAll('.carousel-slide');
        const progressBar = carousel.querySelector('.carousel-progress-bar');
        
        // Устанавливаем начальную позицию
        const wrapper = carousel.querySelector('.carousel-wrapper');
        wrapper.style.transform = 'translateX(0)';
        
        // Активируем первый слайд
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }
        
        // Запускаем автопереключение
        let interval = setInterval(() => {
            changeSlide(carouselId, 1);
        }, 4000); // Переключение каждые 4 секунды
        
        // Останавливаем автопереключение при наведении
        carousel.addEventListener('mouseenter', () => {
            clearInterval(interval);
            if (progressBar) progressBar.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                changeSlide(carouselId, 1);
            }, 4000);
            if (progressBar) progressBar.style.animationPlayState = 'running';
        });
        
        // Добавляем свайп на мобильных
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            clearInterval(interval);
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const wrapper = carousel.querySelector('.carousel-wrapper');
            const currentSlide = carousel.querySelector('.carousel-slide.active');
            const currentIndex = Array.from(slides).indexOf(currentSlide);
            
            wrapper.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
        });
        
        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = currentX - startX;
            
            if (Math.abs(diff) > 50) {
                // Свайп достаточно большой для переключения
                if (diff > 0) {
                    changeSlide(carouselId, -1);
                } else {
                    changeSlide(carouselId, 1);
                }
            } else {
                // Возвращаемся к текущему слайду
                const currentSlide = carousel.querySelector('.carousel-slide.active');
                const currentIndex = Array.from(slides).indexOf(currentSlide);
                const wrapper = carousel.querySelector('.carousel-wrapper');
                wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
            
            // Перезапускаем автопереключение
            interval = setInterval(() => {
                changeSlide(carouselId, 1);
            }, 4000);
        });
    });
}

// Обработка формы заявки
async function handleOrderForm(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    // Добавляем данные калькулятора
    data.calculatedPrice = document.getElementById('totalPrice')?.textContent || '';
    const sizeSelect = document.getElementById('size');
    data.selectedSize = sizeSelect ? sizeSelect.options[sizeSelect.selectedIndex].text : '';
    const materialSelect = document.getElementById('material');
    data.selectedMaterial = materialSelect ? materialSelect.options[materialSelect.selectedIndex].text : '';
    const stoveSelect = document.getElementById('stove');
    data.selectedStove = stoveSelect ? stoveSelect.options[stoveSelect.selectedIndex].text : '';
    const selectedExtras = [];
    Object.keys(CONFIG.extras).forEach(option => {
        const checkbox = document.getElementById(option);
        if (checkbox && checkbox.checked) {
            let name = CONFIG.extras[option].name;
            if(option === 'delivery') name += ' (по договорённости)';
            selectedExtras.push(name);
        }
    });
    data.selectedExtras = selectedExtras.join(', ') || 'Не выбраны';
    try {
        // Отправка на сервер
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                phone: data.phone,
                email: data.email,
                message: data.comment,
                price: data.calculatedPrice,
                size: data.selectedSize,
                extras: data.selectedExtras
            })
        });
        if (!response.ok) throw new Error('Ошибка сервера');
        // Показываем красивый алерт
        showCustomAlert('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут, чтобы обсудить создание уюта и комфорта для вашей семьи.');
        this.reset();
        loadCatalog();
        setTimeout(() => {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) successMessage.classList.remove('show');
        }, 5000);
        console.log('✅ Заявка успешно обработана:', data);
    } catch (error) {
        console.error('❌ Ошибка при отправке заявки:', error);
        showCustomAlert('❌ Произошла ошибка при отправке заявки. Пожалуйста, свяжитесь с нами по телефону.');
    }
}

// Функция фильтрации каталога
function filterCatalog(category) {
    const catalogCards = document.querySelectorAll('.catalog-card');
    const filterButtons = document.querySelectorAll('.catalog-filter .filter-btn');

    // Убираем активный класс со всех кнопок
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Активируем нажатую кнопку
    const activeButton = document.querySelector(`.catalog-filter [data-filter="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Показываем/скрываем карточки
    catalogCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Функции для модального окна заказа
function openOrderModal(productName, productPrice) {
    document.getElementById('orderProductName').textContent = productName;
    document.getElementById('orderProductPrice').textContent = productPrice;
    document.getElementById('orderModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    if (productPrice !== '') {
        showCustomAlert('Вы оформляете заказ из каталога. Пожалуйста, заполните форму и мы свяжемся с вами!');
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Возвращаем прокрутку страницы
    document.getElementById('orderModalForm').reset(); // Очищаем форму
}

// Обработка формы заказа из каталога
async function handleOrderModalForm(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    const productName = document.getElementById('orderProductName').textContent;
    const productPrice = document.getElementById('orderProductPrice').textContent;
    try {
        // Отправка на сервер
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                phone: data.phone,
                email: data.email,
                message: data.comment,
                price: productPrice,
                size: productName,
                extras: ''
            })
        });
        if (!response.ok) throw new Error('Ошибка сервера');
        showCustomAlert('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут, чтобы обсудить создание уюта и комфорта для вашей семьи.');
        closeOrderModal();
    }catch (error) {
        console.error('Ошибка отправки заявки:', error);
        showCustomAlert('❌ Ошибка отправки заявки. Попробуйте позже или свяжитесь с нами по телефону.');
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}


// Функция для управления скроллом хедеров
function initHeaderScroll() {
    const mainHeader = document.getElementById('mainHeader');
    const contactHeader = document.getElementById('contactHeader');
    
    console.log('Поиск хедеров:', { mainHeader, contactHeader });
    
    if (!mainHeader || !contactHeader) {
        console.log('Хедеры не найдены');
        return;
    }
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        console.log('Скролл:', scrollTop);
        
        // Показываем/скрываем контактный хедер при скролле
        if (scrollTop > 50) {
            contactHeader.classList.add('hidden');
            console.log('Скрываем контактный хедер');
        } else {
            contactHeader.classList.remove('hidden');
            console.log('Показываем контактный хедер');
        }
        
        lastScrollTop = scrollTop;
    });
    
    console.log('Скролл хедеров инициализирован');
}

// Функция для управления бургер меню
function initBurgerMenu() {
    const burgerBtn = document.querySelector('.burger'); // Изменил селектор
    const mainNav = document.querySelector('.main-nav'); // Изменил селектор
    
    console.log('Поиск бургер меню:', { burgerBtn, mainNav });
    
    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mainNav.classList.toggle('open');
            burgerBtn.classList.toggle('open');
            console.log('Бургер меню переключено, open:', mainNav.classList.contains('open'));
        });
        
        // Закрытие меню по клику на ссылку
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                burgerBtn.classList.remove('open');
            });
        });
        
        // Закрытие меню по клику вне его
        document.addEventListener('click', function(e) {
            if (!burgerBtn.contains(e.target) && !mainNav.contains(e.target)) {
                mainNav.classList.remove('open');
                burgerBtn.classList.remove('open');
            }
        });
    } else {
        console.log('Бургер или навигация не найдены');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем роутер
    initRouter();
    
    initHeaderScroll();
    initBurgerMenu();
    // Привязываем обработчик к форме заказа из каталога
    const orderModalForm = document.getElementById('orderModalForm');
    if (orderModalForm) {
        orderModalForm.addEventListener('submit', handleOrderModalForm);
    }
    
    // Привязываем обработчик к форме калькулятора
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderForm);
    }
    
    // Обработчики навигации (только для ссылок с data-tab)
    const navLinks = document.querySelectorAll('.nav-link[data-tab]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
            
            // Обновляем URL в адресной строке
            const path = tabName === 'home' ? '/' : `/${tabName}`;
            window.history.pushState({}, '', path);
        });
    });
    
    // Привязываем обработчики к кнопкам фильтрации
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-filter');
            if (this.closest('.catalog-filter')) {
                filterCatalog(category);
            } else {
                filterWorks(category);
            }
        });
    });
    
    // Инициализируем калькулятор
    calculatePrice();
    loadCatalog();

    // Обработчики калькулятора
    const calculatorInputs = document.querySelectorAll('#size, #material, #stove');
    calculatorInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    const calculatorCheckboxes = document.querySelectorAll('#delivery');
    calculatorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками и другими элементами
    const animatedElements = document.querySelectorAll('.feature-card, .work-card, .catalog-card, .team-member, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    console.log('🚀 Сайт БаняБочка успешно загружен!');
});

// Глобальная функция для переключения вкладок (для кнопок)
window.switchTab = switchTab;

// Функции для работы с модальным окном изображений
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Закрытие модального окна при клике вне изображения
document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById('imageModal');
    
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
            closeOrderModal();
        }
    });
});

// Фокус и снятие фокуса в галерее
function showUnfocusBtn(img) {
    const btn = img.nextElementSibling;
    if(btn && btn.classList.contains('unfocus-btn')) {
        btn.style.display = 'inline-block';
    }
}
function hideUnfocusBtn(img) {
    const btn = img.nextElementSibling;
    if(btn && btn.classList.contains('unfocus-btn')) {
        btn.style.display = 'none';
    }
}
function unfocusImage(btn) {
    btn.style.display = 'none';
    if(btn.previousElementSibling) btn.previousElementSibling.blur();
}

// Простое мобильное меню


function showCustomAlert(message) {
    const alertDiv = document.getElementById('customAlert');
    alertDiv.querySelector('.alert-message').textContent = message;
    alertDiv.style.display = 'flex';
    setTimeout(() => alertDiv.classList.add('show'), 10);
    // Автоматически скрывать через 4 секунды
    clearTimeout(window._customAlertTimeout);
    window._customAlertTimeout = setTimeout(closeCustomAlert, 4000);
}
function closeCustomAlert() {
    const alertDiv = document.getElementById('customAlert');
    alertDiv.classList.remove('show');
    setTimeout(() => { alertDiv.style.display = 'none'; }, 400);
}

function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    const burger = document.querySelector('.burger');
    
    if (nav && burger) {
        nav.classList.toggle('open');
        burger.classList.toggle('open');
        
        // Анимация бургера
        const spans = burger.querySelectorAll('span');
        if (burger.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

// --- Модальное окно для просмотра фото из карусели ---
let currentModalImages = [];
let currentModalIndex = 0;

function openCarouselImageModal(images, index) {
    currentModalImages = images;
    currentModalIndex = index;
    const modal = document.getElementById('carouselImageModal');
    const img = document.getElementById('carouselImageModalImg');
    const dots = document.getElementById('carouselImageModalDots');
    img.src = images[index];
    img.classList.remove('zoomed');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // dots
    dots.innerHTML = images.map((_, i) => `<span class="carousel-dot${i === index ? ' active' : ''}" onclick="goToModalImage(${i})"></span>`).join('');
}

function closeCarouselImageModal() {
    document.getElementById('carouselImageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function prevModalImage() {
    let idx = currentModalIndex - 1;
    if (idx < 0) idx = currentModalImages.length - 1;
    goToModalImage(idx);
}
function nextModalImage() {
    let idx = currentModalIndex + 1;
    if (idx >= currentModalImages.length) idx = 0;
    goToModalImage(idx);
}
function goToModalImage(idx) {
    currentModalIndex = idx;
    const img = document.getElementById('carouselImageModalImg');
    img.src = currentModalImages[idx];
    img.classList.remove('zoomed');
    // dots
    const dots = document.getElementById('carouselImageModalDots');
    dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
    });
}
// Zoom
function toggleZoomModalImage() {
    const img = document.getElementById('carouselImageModalImg');
    img.classList.toggle('zoomed');
}
// Навешиваем обработчики после загрузки DOM
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('carouselImageModalClose').onclick = closeCarouselImageModal;
    document.getElementById('carouselImageModalPrev').onclick = prevModalImage;
    document.getElementById('carouselImageModalNext').onclick = nextModalImage;
    document.getElementById('carouselImageModalImg').onclick = toggleZoomModalImage;
    document.getElementById('carouselImageModal').addEventListener('click', function(e) {
        if (e.target === this) closeCarouselImageModal();
    });
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('carouselImageModal').style.display !== 'none') {
            if (e.key === 'Escape') closeCarouselImageModal();
            if (e.key === 'ArrowLeft') prevModalImage();
            if (e.key === 'ArrowRight') nextModalImage();
        }
    });
});

// --- Клик по картинке в карусели ---
document.addEventListener('click', function(e) {
    if (e.target.closest('.carousel-slide img')) {
        const imgEl = e.target.closest('.carousel-slide img');
        const wrapper = imgEl.closest('.carousel-wrapper');
        const slides = Array.from(wrapper.querySelectorAll('.carousel-slide img'));
        const images = slides.map(img => img.src);
        const idx = slides.indexOf(imgEl);
        openCarouselImageModal(images, idx);
    }
});

