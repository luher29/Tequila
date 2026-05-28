import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"]?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, "tequila_secret_key");
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};
