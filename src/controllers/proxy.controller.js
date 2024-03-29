const { default: axios } = require("axios");
const DB = require("../config/db");

const handleRequest = async (req, res) => {
    const msg = getMessage(req);
    if (!msg) return returnBadRequest(res);
    if (msg.to.displayPhoneNumber != '15550984712') return returnBadRequest(res);

    const target = await getTarget(msg);
    console.log(msg.from, target);
    if (target) {
        axios.post(target, req.body);
        res.sendStatus(200);
    } else {
        return returnBadRequest(res);
    }
}

const returnBadRequest = (res) => {
    return res.status(400).send('Invalid message');
}

const getTarget = async (msg) => {
    if (msg && msg.from && DB.numbers[msg.from]) {
        const key = DB.numbers[msg.from];
        return DB.endpoints[key];
    }
    return DB.endpoints.qopus;
}

const getMessage = (req) => {
    const reqBody = req.body;
    if (reqBody &&
        reqBody.entry &&
        reqBody.entry[0] &&
        reqBody.entry[0].changes &&
        reqBody.entry[0].changes[0] &&
        reqBody.entry[0].changes[0].value
    ) {
        const value = reqBody.entry[0].changes[0].value;
        const messageData = Array.isArray(value.messages) ? value.messages[0] : null;
        const contact = Array.isArray(value.contacts) ? value.contacts[0] : null;

        if (messageData && contact) {
            const phoneNumberId = value.metadata.phone_number_id;
            const displayPhoneNumber = value.metadata.display_phone_number;
            const to = { phoneNumberId, displayPhoneNumber };
            const from = messageData.from;
            const body = getBody(messageData);
            const buttonReply = getButtonReply(messageData);
            const profileName = contact?.profile?.name;

            return { to, from, body, profileName, buttonReply }
        }
    }
}

const getBody = (messageData) => {
    return getResponse(messageData).body;
}

const getResponse = (messageData) => {
    return messageData[messageData.type] ?? {};
}

const getButtonReply = (messageData) => {
    return getResponse(messageData).button_reply;
}

const verifyWhatsappWebhook = (req, res) => {
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == process.env.META_WHATSAPP_API_TOKEN_VERIFY || 'qopus'
    ) {
        return res.send(req.query['hub.challenge']);
    }
    res.sendStatus(400);
};

module.exports = {
    handleRequest,
    getMessage,
    verifyWhatsappWebhook
}