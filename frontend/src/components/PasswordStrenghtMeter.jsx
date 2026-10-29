import { Check, X } from 'lucide-react';

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Contains a number', met: /\d/.test(password) }, //for numerics
        { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
        <div className="criteria-list">
            {criteria.map((item) => (
                <div key={item.label} className={`criteria-item ${item.met ? 'met' : ''}`}>
                    {item.met ? (
                        <Check className="criteria-icon" />
                    ) : (
                        <X className="criteria-icon" />
                    )}
                    <span>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const PasswordStrenghtMeter = ({ password }) => {
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++; //for numerics
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };
    const strength = getStrength(password);

    const getStrengthText = (strength) => {
        if (strength === 0) return 'Very Weak';
        if (strength === 1) return 'Weak';
        if (strength === 2) return 'Fair';
        if (strength === 3) return 'Good';
        return 'Strong';
    };

    return (
        <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="strength-label">Password strength</span>
                <span className="strength-label">{getStrengthText(strength)}</span>
            </div>

            <div className="strength-bars">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="strength-bar"
                        style={index < strength ? { backgroundColor: strength < 2 ? '#9f4148' : '#345779' } : undefined}
                    />
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    );
};
export default PasswordStrenghtMeter;
