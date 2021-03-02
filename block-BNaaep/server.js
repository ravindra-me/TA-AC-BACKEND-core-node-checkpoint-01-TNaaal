const { mkdir } = require('fs');
let http = require('http');
let server = http.createServer(handleRequest);
let dirPath = __dirname;
let userPath = dirPath + '/contacts/';
let path = require('path');
console.log(dirPath);
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
function handleRequest(req, res) {
  let store = '';
  let parseUrl = url.parse(req.url, true);
  console.log(parseUrl);
  req.on('data', (chunk) => {
    store += chunk;
  });
  req.on('end', () => {
    if (req.url === '/contact' && req.method === 'GET') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./form.html').pipe(res);
    } else if (req.method === 'POST' && req.url === '/form') {
      let parseData = qs.parse(store);
      let username = parseData.username;
      let stringData = JSON.stringify(parseData);
      fs.open(path.join(userPath, username + '.json'), 'wx', (err, fd) => {
        // console.log('hi');
        if (err) {
          return console.log(err);
        }
        fs.writeFile(fd, stringData, (err) => {
          // console.log('write');
          if (err) {
            return console.log(err);
          }
          fs.close(fd, () => {
            // console.log('close');
            res.end(`${username} created`);
          });
        });
      });
    } else if (req.method === 'GET' && parseUrl.pathname === '/users') {
      fs.readFile(userPath + parseUrl.query.username, (err, user) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(user);
      });
    }
  });
  if (req.method === 'GET' && req.url === '/') {
    fs.createReadStream('./index.html').pipe(res);
  } else if (req.method === 'GET' && req.url === '/about') {
    fs.createReadStream('./about.html').pipe(res);
  } else if (req.method === 'GET' && req.url.split('.').pop() === 'css') {
    console.log(req.url);
    fs.createReadStream(path.join(dirPath, '/assets', req.url)).pipe(res);
  } else if (
    req.method === 'GET' &&
    ['png', 'svg'].includes(req.url.split('.').pop())
  ) {
    fs.createReadStream(path.join(dirPath, '/assets', req.url)).pipe(res);
  }
}

server.listen(5000, () => {
  console.log('server is running on port 5000');
});
