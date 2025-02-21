import { createTransport } from 'nodemailer';
import { config } from './env.js';

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: config.email.fromEmail,
        pass: "",
    },
});

async function sendMail(toMail, subject, text) {
    const info = await transporter.sendMail({
        from: "ashok.baldaniya@appgambit.com",
        to: toMail,
        subject,
        text,
    });

    console.log("Message sent: %s", info.messageId);
}

sendMail().catch(console.error);
