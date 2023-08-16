const fs = require('fs');
const http = require('http');
const { env } = require('process');
const PORT = env.PORT || 8080;

function static(req, res) {
  const url = req.url;
  const fileExtension = url.split('.')[1];
  const path = __dirname + url;

  const contentTypes = {
    js: 'application/javascript',
    html: 'text/html',
    css: 'text/css',
    jpg: 'image/jpeg',
    png: 'image/png',
    ico: 'image/x-icon',
    json: 'application/json',
    svg: 'image/svg+xml',
    woff: 'font/woff'
  };

  fs.readFile(path, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentTypes[fileExtension] });
      res.end(data);
    }
  });
}

function users(req, res) {
  const method = req.method;

  const users = [
    { name: 'John', age: 25 },
    { name: 'Paul', age: 22 },
    { name: 'George', age: 23 },
    { name: 'Ringo', age: 24 }
  ];

  if (method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <ul>
        ${users.map(user => `<li>${user.name} - ${user.age}</li>`).join('')}
      </ul>
    `);
  }
}

function api(req, res) {
  const url = req.url;

  if (url === '/api/users') return users(req, res);

  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404: API not found');
}

http.createServer((req, res) => {
  if (req.url.includes('/public/')) return static(req, res);
  if (req.url.includes('/api/')) return api(req, res);
}).listen(PORT);