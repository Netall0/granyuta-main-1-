const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// SEO middleware
app.use(helmet({
    contentSecurityPolicy: false, // для гибкости
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

app.use(compression()); // Gzip сжатие

// Статические файлы с правильным кешированием
app.use('/static', express.static('public', {
    maxAge: '1y', // Кеш на год для статики
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// SEO роуты
app.get('/sitemap.xml', (req, res) => {
    const sitemap = generateSitemap();
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
});

app.get('/robots.txt', (req, res) => {
    const robots = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$

Sitemap: https://granyuta.ru/sitemap.xml
Host: https://granyuta.ru
    `.trim();
    
    res.set('Content-Type', 'text/plain');
    res.send(robots);
});

// Функция генерации sitemap
function generateSitemap() {
    const pages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/catalog', priority: '0.9', changefreq: 'weekly' },
        { url: '/calculator', priority: '0.8', changefreq: 'monthly' },
        { url: '/about', priority: '0.7', changefreq: 'monthly' },
        { url: '/contacts', priority: '0.8', changefreq: 'monthly' }
    ];
    
    const lastmod = new Date().toISOString().split('T')[0];
    
    const urls = pages.map(page => `
    <url>
        <loc>https://granyuta.ru${page.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Редирект с www на без www
app.use((req, res, next) => {
    if (req.headers.host.startsWith('www.')) {
        return res.redirect(301, `https://${req.headers.host.slice(4)}${req.url}`);
    }
    next();
});

// Middleware для SEO данных страниц
app.use((req, res, next) => {
    const seoData = getSEOData(req.path);
    res.locals.seo = seoData;
    next();
});

function getSEOData(path) {
    const seoPages = {
        '/': {
            title: 'Бани-бочки из сибирского кедра в Новосибирске под ключ | ГрАнь Уюта',
            description: 'Производство качественных бань-бочек из сибирского кедра под ключ в Новосибирске. Доставка, установка, гарантия 2 года. Цены от 169,000₽.',
            keywords: 'баня бочка Новосибирск, кедровая баня, баня под ключ'
        },
        '/catalog': {
            title: 'Каталог бань-бочек из кедра - размеры и цены | ГрАнь Уюта',
            description: 'Каталог бань-бочек из сибирского кедра. Размеры от 2м до 6м. Цены от 169,000₽. Полная комплектация под ключ.',
            keywords: 'каталог бань бочек, размеры бань, цены на бани'
        },
        '/calculator': {
            title: 'Калькулятор стоимости бани-бочки | Рассчитать цену онлайн',
            description: 'Онлайн калькулятор для расчета стоимости бани-бочки из кедра. Выберите размер, комплектацию и получите точную цену.',
            keywords: 'калькулятор бани, расчет стоимости, цена бани бочки'
        }
    };
    
    return seoPages[path] || seoPages['/'];
}