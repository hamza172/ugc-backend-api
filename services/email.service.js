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

const send2factorAuthenticationToken = async (to, token, firstName) => {
    const html = fs.readFileSync(
        path.join(__dirname, "../2fa-email.html"),
        "utf8"
    );
    const msg = {
        to,
        from: "no-reply@ugc.nl",
        subject: "Bedankt voor je registratie! | UGC.nl",
        html: html.replace("{firstname}", firstName)
            .replace('{pin1}',token[0])
            .replace('{pin2}',token[1])
            .replace('{pin3}',token[2])
            .replace('{pin4}',token[3])
            .replace('{pin5}',token[4])
            .replace('{pin6}',token[5])
    };

    const email = await sendGrid.send(msg);

    return email;
};

module.exports = {
    // sendVerificationEmailBuyer,
    // sendResetPasswordEmail,
    sendBuyerRegistrationConfirmationEmail,
    sendCreatorRegistrationConfirmationEmail,
    send2factorAuthenticationToken
};