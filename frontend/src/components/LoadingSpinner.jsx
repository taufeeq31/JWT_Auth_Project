import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="loading-state">
            <motion.div
                className="loading-indicator"
                role="status"
                aria-label="Loading"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
};

export default LoadingSpinner;
