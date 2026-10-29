import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader } from 'lucide-react';
import Input from '../components/Input.jsx';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-card"
        >
            <div className="auth-content">
                <p className="eyebrow">Account access</p>
                <h2 className="page-title">Welcome back</h2>
                <p className="page-description">Sign in to continue to your account.</p>
                <form onSubmit={handleLogin}>
                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex items-center mb-6">
                        <Link
                            to="/forgot-password"
                            className="text-link text-sm"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    {error && <p className="form-error">{error}</p>}

                    <motion.button
                        className="primary-button"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : 'Login'}
                    </motion.button>
                </form>
            </div>
            <div className="auth-footer">
                <p>
                    New here?{' '}
                    <Link to={'/signup'}>
                        Create an account
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginPage;
