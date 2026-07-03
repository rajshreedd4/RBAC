const auth = (req, res, next) => {
    try {

        const user = req.user;

        if (!user || !user.role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const permissions = user.role.permissions;

        const method = req.method;
        const baseUrl = req.baseUrl;
        const path = req.route.path;

        const hasPermission = permissions.some((permission) => {
            return (
                permission.method === method &&
                permission.baseUrl === baseUrl &&
                permission.path === path &&
                permission.deletedAt === null
            );
        });

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = auth;