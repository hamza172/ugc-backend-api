const { default: axios } = require("axios");
const OneSignal = require('onesignal-node');

const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID, process.env.ONESIGNAL_API_KEY);


const sendNotification = async (id, heading, content) => {
    const notification = {
        contents: {
            en: content
        },
        "target_channel": "push",
        headings: { en: heading },
        include_aliases: {
            external_id: [
                id,
            ],
        },
    };
    client.createNotification(notification)
        .then(response => {
            console.log("Success", response)
        })
        .catch(e => {
            console.log("error: ", e.message)
        });


};

module.exports = {
    sendNotification,
};
