export const isAuthenticated = (req, res, next) => {
    console.log("=== isAuthenticated ===");
    console.log("URL:", req.originalUrl);
    console.log("Cookie header:", req.headers.cookie);
    console.log("Session ID:", req.sessionID);
    console.log("Session:", req.session);
    console.log("userId:", req.session?.userId);
    if (!req.session) {
        return res.status(401).json({
            message: "You have been logged out. Please log in again.",
            code: "SESSION_EXPIRED",
            loggedIn: false
        });
    }
    next();
};