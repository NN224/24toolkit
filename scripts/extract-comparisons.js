const fs = require('fs');
const path = require('path');

function extractFromHTML(html, filePath) {
  const fileName = path.basename(filePath, '.html');
  const lang = filePath.includes('/ar/') ? 'ar' : 'en';

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="(.*?)"/);
  const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);

  const products = fileName.split('-vs-');

  const scoreMatches = [...html.matchAll(/<h3[^>]*>([^<]+)<\/h3>[\s\S]*?<div class="score-item"[\s\S]*?<span>([^<]+)<\/span><span>(\d+)\/10<\/span>/g)];

  const comparisonSections = [...html.matchAll(/<h2[^>]*>(\d+\.\s*[^<]+)<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<strong>([^<]+Winner:[^<]+)<\/strong>\s*([^<]+)</g)];

  const finalVerdictMatch = html.match(/<h3[^>]*>Choose\s+([^<]+)\s+if\.\.\.<\/h3>[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/g);

  return {
    slug: fileName,
    product1: {
      name: products[0] ? products[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '',
      brand: '',
      image: imageMatch ? imageMatch[1] : '',
    },
    product2: {
      name: products[1] ? products[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '',
      brand: '',
      image: imageMatch ? imageMatch[1] : '',
    },
    category: detectCategory(fileName),
    language: lang,
    summary: descMatch ? descMatch[1] : '',
    seo: {
      title: titleMatch ? titleMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
      keywords: products,
    },
    status: 'approved',
    created_at: new Date().toISOString(),
  };
}

function detectCategory(slug) {
  if (slug.includes('netflix') || slug.includes('hulu') || slug.includes('disney') || slug.includes('prime') || slug.includes('hbo')) return 'streaming';
  if (slug.includes('iphone') || slug.includes('samsung') || slug.includes('mac') || slug.includes('android') || slug.includes('playstation') || slug.includes('xbox')) return 'technology';
  if (slug.includes('uber') || slug.includes('lyft') || slug.includes('airbnb') || slug.includes('hotel') || slug.includes('booking')) return 'travel';
  if (slug.includes('spotify') || slug.includes('kindle') || slug.includes('peloton') || slug.includes('coffee') || slug.includes('tea')) return 'lifestyle';
  return 'general';
}

function findAllHTMLFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAllHTMLFiles(filePath, fileList);
    } else if (file.endsWith('.html') && !file.includes('index') && !file.includes('404') && !file.includes('sitemap') && !file.includes('about') && !file.includes('contact') && !file.includes('.html') === file) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('vs') || content.includes('VS') || filePath.includes('-vs-')) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

const enDir = path.join(__dirname, '../en');
const arDir = path.join(__dirname, '../ar');

const allFiles = [
  ...findAllHTMLFiles(enDir),
  ...findAllHTMLFiles(arDir)
];

console.log(`Found ${allFiles.length} comparison files`);

const comparisons = allFiles.slice(0, 3).map(filePath => {
  const html = fs.readFileSync(filePath, 'utf-8');
  return extractFromHTML(html, filePath);
});

console.log(JSON.stringify({ comparisons }, null, 2));
