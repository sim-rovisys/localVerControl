var express = require('express');
var router = express.Router();
var path = require('path');

const dgram = require('dgram');
const QRCode = require('qrcode');
const os = require('os');

const INBOUND_PORT = 85; // <--- change this port number for inbound rule, and remember to add rule to allow this port in firewall settings

// Get lan IP address
function getLanIp() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        iface.netmask === '255.255.255.0'   // typical LAN subnet
      ) {
        return `${iface.address}:${INBOUND_PORT}`;
      }
    }
  }

  return `127.0.0.1:${port}`;
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  const ip = getLanIp();
  const url = `http://${ip}`; // example: serving a local web app

  // Generate QR code and output to terminal
  QRCode.toString(url, { type: 'terminal' }, function (err, qr) {
    if (err) return console.error(err);
    console.log(`\nQR Code for ${url}`);
  });

  const qrDataUrl = await QRCode.toDataURL(url, { width: 400 });
  res.render('index', { qrCode: qrDataUrl });

});


// Set up download route
router.get('/download', (req, res) => {
  const fileName = 'app-release.apk';
  const filePath = path.join(__dirname, '../files', fileName);
  let aborted = false;

  req.on('aborted', () => {
    aborted = true;
    console.warn('Request aborted by the client');
  });

  res.on('close', () => {
    if (aborted) {
      console.log('Client closed connection before download completed');
    }
  });

  res.on('finish', () => {
    if (!aborted) {
      console.log('Download completed fully');
    }
  });

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Download failed:', err);
      // If headers already sent, Express will handle it. Optional: handle custom logic.
      if (!res.headersSent) {
        res.status(500).send('Download failed');
      }
    } else {
      console.log('Download initiated');
    }
  });

});

module.exports = router;
