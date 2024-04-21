const { sendGrid } = require("../config/sendgrid");
const fs = require("fs");
const path = require("path");

/**
* Send confirmation emails
*/

const sendBuyerRegistrationConfirmationEmail = async (to, user) => {
const html = fs.readFileSync(
path.join(__dirname, "../registration-confirmation-1.html"),
"utf8"
);
const msg = {
to,
from: "no-reply@ugc.nl",
subject: "Bedankt voor je registratie! | UGC.nl",
html: html.replace("{firstname}", user.firstName),
};

const email = await sendGrid.send(msg);

return email;
};
const sendCreatorRegistrationConfirmationEmail = async (to, user) => {
const html = fs.readFileSync(
path.join(__dirname, "../registration-confirmation-1.html"),
"utf8"
);
const msg = {
to,
from: "no-reply@ugc.nl",
subject: "Bedankt voor je registratie! | UGC.nl",
html: html.replace("{firstname}", user.firstName),
};

const email = await sendGrid.send(msg);

return email;
};

module.exports = {
// sendVerificationEmailBuyer,
// sendResetPasswordEmail,
sendBuyerRegistrationConfirmationEmail,
sendCreatorRegistrationConfirmationEmail,
};