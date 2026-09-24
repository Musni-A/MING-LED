export const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            message: "You have been logged out. Please log in again.",
            code: "SESSION_EXPIRED",
            loggedIn: false
        });
    }
    next();
};