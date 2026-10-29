import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const EmailVerificationPage = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const { error, isLoading, verifyEmail } = useAuthStore();

    const handleChange = (index, value) => {
        const newCode = [...code];

        // Handle pasted content
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split('');
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || '';
            }
            setCode(newCode);

            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input field if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            await verifyEmail(verificationCode);
            navigate('/');
            toast.success('Email verified successfully');
        } catch (error) {
            console.log(error);
        }
    };

    // Auto submit when all fields are filled
    useEffect(() => {
        if (code.every((digit) => digit !== '')) {
            handleSubmit(new Event('submit'));
        }
    }, [code]);

    return (
        <div className="auth-card">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="auth-content"
            >
                <p className="eyebrow">One last step</p>
                <h2 className="page-title">Verify your email</h2>
                <p className="page-description">
                    Enter the 6-digit code sent to your email address.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="verification-code">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="6"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="verification-digit"
                            />
                        ))}
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <motion.button
                        type="submit"
                        disabled={isLoading || code.some((digit) => !digit)}
                        className="primary-button"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};
export default EmailVerificationPage;
