// import jwt from 'jsonwebtoken';

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({success: false, message: 'No token, authorization denied' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if(!decoded || !decoded.user) {
//             return res.status(401).json({sucess: false, message: 'Token is not valid' });
//         }
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         console.error('Token verification failed:', err);
//         return res.status(401).json({ success: false, message: 'Token is not valid', error: err.message });
//     }
// };

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res
            .status(401)
            .json({ success: false, message: 'Unauthorized - no token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded)
            return res
                .status(401)
                .json({ success: false, message: 'Unauthorized - invalid token' });

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log('Error in verifyToken ', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
