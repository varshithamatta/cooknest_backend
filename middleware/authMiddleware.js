const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.chef = decoded;  // Attach chef details to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
