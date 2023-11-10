const express = require('express');
const { verifyWhatsappWebhook, handleRequest } = require('../controllers/proxy.controller');

const app = express();

app.set('port', process.env.PORT || 443);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).send("<h1 style='text-align: center; margin-top: 40px;'>Server running</h1>");
});

app.get('/webhook/whatsapp', verifyWhatsappWebhook);
app.post('/webhook/whatsapp', handleRequest);


module.exports = app;
