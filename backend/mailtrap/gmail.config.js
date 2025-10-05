import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = (process.env.GMAIL_PASS || '').replace(/\s+/g, '');

if (!GMAIL_USER || !GMAIL_PASS) {
    console.warn('GMAIL_USER or GMAIL_PASS is not set. Email sending will fail until configured.');
}

// Nodemailer transporter configured to use Gmail SMTP
export const gmailClient = nodemailer.createTransport({
    host: process.env.GMAIL_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS, // app password, not normal Gmail password
    },
});

// Sender info
export const sender = {
    name: 'Taufeeq',
    address: GMAIL_USER,
};
