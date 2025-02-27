import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';


// const emailTemplate = {
//     verification: {
//         templateName: 'Email Verification',
//         subject: 'Verify your email',
//         html: emailVerificationTemplate
//     }
// }

const emailVerificationTemplate = (name, verificationLink) => {
    return `
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                text-align: center;
            }

            .header img {
                width: 100px;
                margin-bottom: 20px;
            }

            h1 {
                color: #333333;
                font-size: 24px;
                margin: 20px 0;
            }

            p {
                color: #666666;
                font-size: 16px;
                line-height: 1.5;
            }

            .button {
                background: #007bff;
                color: #ffffff !important;
                padding: 14px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                display: inline-block;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
                transition: all 0.3s ease-in-out;
            }

            .button:hover {
                background: #0056d2;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
                transform: translateY(-2px);
            }

            .button:active {
                background: #0041a8;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
                transform: translateY(1px);
            }

            .footer {
                margin-top: 30px;
                color: #999999;
                font-size: 12px;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <!-- <div class="header">
                <img src="logo.png" alt="Artisan Team">
            </div> -->
            <h1>Welcome, ${name}! 🎉</h1>
            <p>Thank you for signing up. Click the button below to verify your email and get started:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <div class="footer">
                <p>If you didn’t sign up, please ignore this email.</p>
            </div>
        </div>
        </body>
        </html>
`;
};

export const sendEmail = async (emailTo, name, verificationLink) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.emailFrom,
            pass: config.email.emailPassword,
        },
    });

    const mailOptions = {
        to: emailTo,
        from: '"Artisan Team" <ashokbaldaniya153@gmail.com>',
        subject: 'Verify Your Email - Artisan Marketplace',
        html: emailVerificationTemplate(name, verificationLink)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info('Email sent: ' + info.response);
    } catch (error) {
        logger.error('Error sending email: ', error);
    }
};
