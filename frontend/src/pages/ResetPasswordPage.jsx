import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../components/Input.jsx';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { resetPassword, error, isLoading, message } = useAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success('Password reset successfully, redirecting to login page...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error resetting password');
        }
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
                <h2 className="page-title">Set a new password</h2>
                <p className="page-description">Choose a new password for your account.</p>
                {error && <p className="form-error">{error}</p>}
                {message && <p className="form-note" style={{ marginBottom: 16 }}>{message}</p>}

                <form onSubmit={handleSubmit}>
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <motion.button
                        className="primary-button"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Set New Password'}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};
export default ResetPasswordPage;
