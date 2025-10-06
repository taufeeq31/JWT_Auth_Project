import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
} from './emailTemplates.js';
import { sendMail, defaultSender as sender } from './mailer.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const response = await sendMail({
            from: sender,
            to: email,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: 'verification',
        });

        console.log('Email sent successfully', response);
    } catch (error) {
        console.error('Error sending verification', error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await sendMail({
            from: sender,
            to: email,
            subject: 'Welcome to Our Service',
            html: WELCOME_EMAIL_TEMPLATE.replace('{name}', name),
            category: 'welcome',
        });
        console.log('Welcome email sent successfully', response);
    } catch (err) {
        console.log('Error sending welcome email', err);

        throw new Error(`Error sending welcome email: ${err}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const response = await sendMail({
            from: sender,
            to: email,
            subject: 'Password Reset Request',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
            category: 'password_reset',
        });
    } catch (err) {
        console.log('Error sending password reset email', err);

        throw new Error(`Error sending password reset email: ${err}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await sendMail({
            from: sender,
            to: email,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'password_reset_success',
        });
        console.log('Password reset success email sent successfully', response);
    } catch (err) {
        console.log('Error sending password reset success email', err);

        throw new Error(`Error sending password reset success email: ${err}`);
    }
};
