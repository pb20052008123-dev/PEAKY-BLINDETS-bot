const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la page HTML statique depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Route pour demander un code de liaison (Pairing Code) via le site web
app.post('/connect', async (req, res) => {
    const phoneNumber = req.body.phone;
    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: "Veuillez entrer un numéro de téléphone." });
    }

    try {
        const sessionDir = path.join(__dirname, 'sessions');
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir);
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Chrome"),
            auth: state
        });

        sock.ev.on('creds.update', saveCreds);

        // Si le client n'est pas déjà enregistré, on demande le pairing code
        if (!sock.authState.creds.registered) {
            await delay(1500);
            let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
            let code = await sock.requestPairingCode(cleanNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            
            return res.json({ success: true, code: code });
        } else {
            return res.json({ success: false, message: "Le bot est déjà connecté !" });
        }

    } catch (error) {
        console.error("Erreur lors de la génération du code :", error);
        return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
});

// Démarrage du serveur web
app.listen(PORT, () => {
    console.log("Serveur web démarré sur le port " + PORT);
});
