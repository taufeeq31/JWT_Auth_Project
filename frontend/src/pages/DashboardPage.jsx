import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../utils/date';

const DashboardPage = () => {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-card"
        >
            <div className="dashboard-heading">
                <div>
                    <p className="eyebrow" style={{ textAlign: 'left' }}>Account overview</p>
                    <h2 className="page-title">Dashboard</h2>
                    <p className="page-description">Your profile and recent account activity.</p>
                </div>
                <motion.button onClick={handleLogout} className="primary-button logout-button">
                    Logout
                </motion.button>
            </div>

            <div>
                <motion.div
                    className="profile-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="section-label">Profile information</h3>
                    <div className="profile-grid">
                        <div><span className="detail-label">Name</span><span className="detail-value">{user.name}</span></div>
                        <div><span className="detail-label">Email address</span><span className="detail-value">{user.email}</span></div>
                    </div>
                </motion.div>
                <motion.div
                    className="profile-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="section-label">Account activity</h3>
                    <div className="activity-list">
                    <div>
                        <span className="detail-label">Joined</span>
                        <span className="detail-value">{new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</span>
                    </div>
                    <div>
                        <span className="detail-label">Last login</span>
                        <span className="detail-value">{formatDate(user.lastLogin)}</span>
                    </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
export default DashboardPage;
