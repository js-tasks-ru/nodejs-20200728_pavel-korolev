const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST': {

      if (!pathname) {
        res.statusCode = 400;
        res.end('Please, provide a file');
      } else if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Nested directories are not allowed');
      } else if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File exists');
      } else {
        const writer = fs.createWriteStream(filepath);
        const limitSizeStream = new LimitSizeStream({ limit: 1000000 });

        req.on('aborted', () => {
          fs.unlink(filepath, (err) => {});
        });

        limitSizeStream.on('error', (err) => {
          fs.unlink(filepath, (err) => {});
          if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('File size limit exceeded');
          } else {
            res.statusCode = 500;
            res.end('Server error');
          }
        });

        writer.on('finish', () => {
          res.statusCode = 201;
          res.end('File uploaded');
        });

        req.pipe(limitSizeStream).pipe(writer);
      }

      break;
    }
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
