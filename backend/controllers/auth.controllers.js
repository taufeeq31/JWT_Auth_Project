import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
    sendResetSuccessEmail,
} from '../mailtrap/emails.js';
import { User } from '../models/user.model.js';

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error('All fields are required');
        }
        const userAlreadyExist = await User.findOne({ email });
        console.log(`User already exist: ${userAlreadyExist}`);

        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        sendVerificationEmail(user.email, user.verificationToken);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: { $gt: Date.now() }, // token not expired
        });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;

        //No point in keeping the token once verified
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;

        await user.save();

        // Send welcome email but don't fail verification if email sending fails
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailErr) {
            console.error('Failed to send welcome email:', emailErr);
        }

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (err) {
        console.error('Error verifying email:', err);
        return res
            .status(500)
            .json({ success: false, message: 'Failed to verify email', error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                sucess: false,
                message: 'Invalid email or password',
            });
        }
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (err) {
        console.log('Error in login:', err);
        res.status(500).json({
            success: false,
            message: 'Login failed',
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpireAt = resetTokenExpireAt;

        await user.save();

        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: 'Password reset email sent',
        });
    } catch (err) {
        console.log('Error in forgotpassword:', err);
        res.status(400).json({
            sucess: false,
            message: 'Failed to process forget password request',
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }, // token not expired
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset token',
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;

        // No point in keeping the token once password is reset
        user.resetPasswordToken = undefined;
        user.resetPasswordExpireAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (err) {
        console.log('Error in resetPassword:', err);
        res.status(400).json({
            success: false,
            message: 'Failed to reset password',
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log('Error in checkAuth ', error);
        res.status(400).json({ success: false, message: error.message });
    }
};
