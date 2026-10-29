import { motion } from 'framer-motion';
import Input from '../components/Input.jsx';
import { Loader, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PasswordStrenghtMeter from '../components/PasswordStrenghtMeter';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { signup, error, isLoading } = useAuthStore();

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            await signup(email, password, name);
            navigate('/verify-email');
        } catch (error) {
            console.log(error);
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
                <p className="eyebrow">Get started</p>
                <h2 className="page-title">Create account</h2>
                <p className="page-description">Set up your account with a few details.</p>

                <form onSubmit={handleSignUp}>
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    {error && <p className="form-error">{error}</p>}
                    <PasswordStrenghtMeter password={password} />

                    <motion.button
                        className="primary-button"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader className=" animate-spin mx-auto" size={24} />
                        ) : (
                            'Sign Up'
                        )}
                    </motion.button>
                </form>
            </div>
            <div className="auth-footer">
                <p>
                    Already have an account?{' '}
                    <Link to={'/login'}>
                        Login
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};
export default SignUpPage;
