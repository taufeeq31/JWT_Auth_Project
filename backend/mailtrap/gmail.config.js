import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = (process.env.GMAIL_PASS || '').replace(/\s+/g, '');

if (!GMAIL_USER || !GMAIL_PASS) {
    console.warn('GMAIL_USER or GMAIL_PASS is not set. Email sending will fail until configured.');
}

// Allow configuring SMTP over env with sensible defaults for PaaS (use 587 with STARTTLS)
const SMTP_HOST = process.env.GMAIL_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.GMAIL_PORT || 587);
const SMTP_SECURE = process.env.GMAIL_SECURE
    ? String(process.env.GMAIL_SECURE).toLowerCase() === 'true'
    : SMTP_PORT === 465; // secure for 465, STARTTLS for 587

const SMTP_TIMEOUT = Number(process.env.SMTP_TIMEOUT_MS || 10000); // 10s

// Nodemailer transporter configured to use Gmail SMTP
export const gmailClient = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    pool: true,
    maxConnections: 5,
    maxMessages: 50,
    connectionTimeout: SMTP_TIMEOUT,
    greetingTimeout: SMTP_TIMEOUT,
    socketTimeout: SMTP_TIMEOUT,
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
