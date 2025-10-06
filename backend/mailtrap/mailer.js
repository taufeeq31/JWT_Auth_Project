import { gmailClient, sender as gmailSender } from './gmail.config.js';

// Provider-agnostic sendMail
// If RESEND_API_KEY and RESEND_FROM are provided, use Resend HTTP API (bypasses SMTP)
// Otherwise, fallback to Gmail SMTP via nodemailer transporter
export const sendMail = async ({ from, to, subject, html, category }) => {
    const useResend = !!process.env.RESEND_API_KEY && !!process.env.RESEND_FROM;

    if (useResend) {
        const apiKey = process.env.RESEND_API_KEY;
        const resendFrom = process.env.RESEND_FROM;
        const body = {
            from: typeof from === 'string' ? from : resendFrom,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            // Resend supports tags; include category if provided
            tags: category ? [{ name: 'category', value: String(category) }] : undefined,
        };

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Resend API error (${res.status}): ${text}`);
        }

        const json = await res.json().catch(() => ({}));
        return { provider: 'resend', response: json };
    }

    // Fallback to Gmail SMTP via nodemailer
    const info = await gmailClient.sendMail({
        from: from || gmailSender,
        to,
        subject,
        html,
    });
    return { provider: 'gmail', response: info };
};

export const defaultSender = gmailSender;
