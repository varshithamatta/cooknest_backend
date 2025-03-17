const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }

    try {
        // Verify token and extract role
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        
        if (decoded.role === "chef") {
            req.chef = decoded; // Attach chef details to request
        } else if (decoded.role === "user") {
            req.user = decoded; // Attach user details to request
        } else {
            return res.status(403).json({ error: "Unauthorized role" });
        }

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
