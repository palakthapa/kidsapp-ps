import nodemailer from 'nodemailer';
import config from '../config';
import { MAIL_ERROR_MESSAGES } from '../errorMessages/mailErrors';
import { logError, logMessage } from './loggingService';
const { GMAIL_ADDRESS, GMAIL_PASS, MAIL_SERVICE_PORT } = config;

export default (function () {

    if (!(GMAIL_ADDRESS && GMAIL_PASS && MAIL_SERVICE_PORT)) {
        return async function () {
            const error = new Error(MAIL_ERROR_MESSAGES["CREDS_UNDEF"]);
            error.code = "CREDS_UNDEF";
            throw error;
        }
    }

    let transporter = null;

    function getTransporter() {

        if (transporter) return;

        /* Creating a transporter object that will be used to send emails. */
        transporter = nodemailer.createTransport({
            port: MAIL_SERVICE_PORT,
            host: "smtp.gmail.com",
            auth: {
                user: GMAIL_ADDRESS,
                pass: GMAIL_PASS,
            },
            secure: true,
        });

        transporter.verify().then(logMessage.bind("MAIL_TRANSPORTER_CONN_VERIFY")).catch(logError.bind("MAIL_TRANSPORTER_CONN_ERROR"));
    }

    /**
     * It sends an email to the specified email address
     * @param {String} to - The email address of the receiver
     * @param {object} data - data contains the email data to be sent
     * @param {Function} callback - a function that will be called when the email is sent.
     * @param {object} from - The email address of the sender.
     */
    return function (to, data = {}, from = GMAIL_ADDRESS, callback = () => { }) {

        getTransporter();

        if (!to) {
            return {
                success: false,
                message: "please provide a valid receiver's email address"
            };
        }

        const mailData = {
            from: from,  // sender address
            to: to,   // list of receivers
            subject: data.subject,
            text: data.text,
            html: data.html,
        };

        transporter.sendMail(mailData, callback);
    }
})()
