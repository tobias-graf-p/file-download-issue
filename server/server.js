const http = require('http');
const fs = require('fs');
const path = require('path');

function serveFile(res, filePath, fileName, contentType) {
  const contentDisposition = `attachment; filename="${encodeURIComponent(fileName)}"`;
  res.setHeader('Content-Disposition', contentDisposition);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.setHeader('Content-Type', contentType);
  res.setHeader('Access-Control-Allow-Origin', '*');
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.url === '/file1') {
    const filePath = path.join(__dirname, 'file1.txt');
    serveFile(res, filePath, 'file1.txt', 'text/plain');
  } else if (req.url === '/file2') {
    setTimeout(() => {
      const filePath = path.join(__dirname, 'file2.txt');
      serveFile(res, filePath, 'file2.txt', 'text/plain');
    }, 6000);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const ipAddress = '0.0.0.0'; // Bind to all available network interfaces
const port = 3000;
server.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});
