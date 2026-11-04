const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', process.argv[2] === 'dist' ? 'dist' : '.');
const built = process.argv[2] === 'dist';
const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

http.createServer((request, response) => {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
        response.writeHead(400).end('Bad request');
        return;
    }
    if (pathname === '/') pathname = built ? '/app.html' : '/index.html';
    else if ((pathname === '/app' || pathname === '/app/') && built) pathname = '/app.html';
    else if ((pathname === '/app' || pathname === '/app/') && !built) pathname = '/index.html';

    const filename = path.resolve(root, `.${pathname}`);
    if (filename !== root && !filename.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
    }
    fs.stat(filename, (statError, stat) => {
        const file = statError ? filename : (stat.isDirectory() ? path.join(filename, 'index.html') : filename);
        fs.readFile(file, (error, data) => {
            if (error) {
                response.writeHead(404).end('Not found');
                return;
            }
            response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
            response.end(request.method === 'HEAD' ? undefined : data);
        });
    });
}).listen(Number(process.env.PORT) || 4173, () => {
    console.log(`Serving ${built ? 'dist' : 'source'} at http://localhost:${Number(process.env.PORT) || 4173}`);
});
