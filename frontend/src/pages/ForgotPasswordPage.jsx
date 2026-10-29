import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Input from '../components/Input.jsx';
import { ArrowLeft, Loader, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoading, forgotPassword } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
        setIsSubmitted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-card"
        >
            <div className="auth-content">
                <p className="eyebrow">Account recovery</p>
                <h2 className="page-title">Forgot password?</h2>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                            <p className="page-description">
                            Enter your email address and we'll send you a link to reset your
                            password.
                        </p>
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <motion.button
                            className="primary-button"
                            type="submit"
                        >
                            {isLoading ? (
                                <Loader className="size-6 animate-spin mx-auto" />
                            ) : (
                                'Send Reset Link'
                            )}
                        </motion.button>
                    </form>
                ) : (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="success-mark"
                        >
                            <Mail className="h-8 w-8" />
                        </motion.div>
                        <p className="form-note" style={{ textAlign: 'center', marginBottom: 20 }}>
                            If an account exists for {email}, you will receive a password reset link
                            shortly.
                        </p>
                    </div>
                )}
            </div>

            <div className="auth-footer">
                <Link
                    to={'/login'}
                    className="text-link back-link"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                </Link>
            </div>
        </motion.div>
    );
};
export default ForgotPasswordPage;
