const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const read = (relativePath) => fs.readFile(path.join(root, relativePath), 'utf8');
const hash = (content) => `sha256-${crypto.createHash('sha256').update(content).digest('base64')}`;

function getSiteUrl() {
    const configuredUrl = process.env.SITE_URL || process.env.PUBLIC_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (!configuredUrl) return '';
    return /^https?:\/\//i.test(configuredUrl) ? configuredUrl.replace(/\/$/, '') : `https://${configuredUrl.replace(/\/$/, '')}`;
}

async function main() {
    const [sourceHtml, mainCss, builderCss, mainJs, builderJs, pwaJs] = await Promise.all([
        read('index.html'),
        read('src/styles/main.css'),
        read('src/styles/builder.css'),
        read('src/scripts/main.js'),
        read('src/scripts/builder.js'),
        read('src/scripts/pwa-install.js')
    ]).then((contents) => contents.map((content) => content.replace(/\r\n?/g, '\n')));

    await fs.mkdir(output, { recursive: true });
    await Promise.all([
        fs.cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true }),
        fs.cp(path.join(root, 'config'), path.join(output, 'config'), { recursive: true })
    ]);
    await fs.writeFile(path.join(output, 'vercel.json'), `${JSON.stringify({
        cleanUrls: true,
        rewrites: [
            {
                source: '/',
                destination: '/app'
            }
        ]
    }, null, 2)}\n`);

    let html = sourceHtml
        .replace(/<link\b[^>]*rel="preload"[^>]*href="(?:\.\/|\/)src\/[^"]+"[^>]*>\s*/g, '')
        .replace(/<link rel="stylesheet" href="(?:\.\/|\/)src\/styles\/main\.css">\s*/g, `<style>\n${mainCss}\n</style>\n`)
        .replace(/<link rel="stylesheet" href="(?:\.\/|\/)src\/styles\/builder\.css">\s*/g, `<style>\n${builderCss}\n</style>\n`);
    const siteUrl = getSiteUrl();
    html = html.replace(/__SITE_URL__/g, siteUrl);

    const bundledScripts = {
        './src/scripts/main.js': mainJs,
        '/src/scripts/main.js': mainJs,
        './src/scripts/builder.js': builderJs,
        '/src/scripts/builder.js': builderJs,
        './src/scripts/pwa-install.js': pwaJs,
        '/src/scripts/pwa-install.js': pwaJs
    };
    html = html.replace(/<script\b([^>]*)src="([^"]+)"([^>]*)>\s*<\/script>/g, (tag, before, src, after) => {
        const source = bundledScripts[src];
        if (source === undefined) return tag;
        const safeSource = source.replace(/<\/script/gi, '<\\/script');
        return `<script>${safeSource}</script>`;
    });
    if (/<(?:script|link)\b[^>]*(?:src|href)="(?:\.\/|\/)src\/(?:scripts|styles)\//i.test(html)) {
        throw new Error('Standalone HTML still contains a local source bundle reference');
    }

    const scriptHashes = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => hash(match[1]));
    const styleHashes = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => hash(match[1]));
    html = html.replace(/(script-src\s+)([^;]+)/i, (_, directive, policy) =>
        `${directive}${policy} ${scriptHashes.map((value) => `'${value}'`).join(' ')}`
    );
    html = html.replace(/(style-src\s+)([^;]+)/i, (_, directive, policy) =>
        `${directive}${policy} ${styleHashes.map((value) => `'${value}'`).join(' ')}`
    );

    const manifestPath = path.join(output, 'config', 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    manifest.id = './';
    manifest.start_url = './';
    manifest.scope = './';
    manifest.icons = manifest.icons.map((icon) => ({
        ...icon,
        src: icon.src.replace(/^\.\.\//, './')
    }));
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    await fs.writeFile(path.join(output, 'app.html'), html);
    await fs.writeFile(path.join(output, 'service-worker.js'), `const CACHE_NAME = "pdf-editor-app-v6";
const APP_SHELL = [
    "./app.html",
    "./config/manifest.json",
    "./assets/vendor/fontawesome/css/all.min.css",
    "./assets/vendor/fontawesome/webfonts/fa-brands-400.woff2",
    "./assets/vendor/fontawesome/webfonts/fa-regular-400.woff2",
    "./assets/vendor/fontawesome/webfonts/fa-solid-900.woff2",
    "./assets/vendor/fontawesome/webfonts/fa-v4compatibility.woff2",
    "./assets/vendor/pdfmake/pdfmake.min.js",
    "./assets/vendor/pdfmake/vfs_fonts.js",
    "./assets/icons/favicon.ico",
    "./assets/icons/favicon.svg",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/apple-touch-icon.png"
];
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("pdf-editor-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
    event.respondWith(fetch(request, { cache: "no-cache" }).then(async (response) => {
        if (response.ok && response.type === "basic") {
            await (await caches.open(CACHE_NAME)).put(request, response.clone());
        }
        return response;
    }).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return (await caches.match("./app.html")) || Response.error();
        return Response.error();
    }));
});
`);
    console.log(`Built standalone app: ${path.relative(root, path.join(output, 'app.html'))}`);
}

main().catch((error) => {
    console.error('Build failed:', error);
    process.exitCode = 1;
});
