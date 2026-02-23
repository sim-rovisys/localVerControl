# Instruction

## Manual

0. Require Node JS, and open port 3000 as a web server.
1. The file to be hosted should reside in "/files/app-release.apk", file name must be exactly "app-release.apk".
2. Run with "npm start".
3. Once ran "npm start", open browser "localhost:3000" to get the qr code.
4. The devices and the web server must be under the same network to scan the qr code.

## To enable random port for Nodejs & IIS

1. firewall inbound rule add new rule for port 85.
1. Install URL Rewrite from IIS official website.
1.IIS add new site for port 85 and new physical path to store web.config (auto generated), physical path must be accessible by IIS preferable in 'C:\inetpub\<new folder>'.
1.In site > URL Rewrite, add new rule to 'localhost:3000' (local url hosted by Nodejs).
1.Click main node to restart server & apply all settings.
1. Run Nodejs service, and play with it.
