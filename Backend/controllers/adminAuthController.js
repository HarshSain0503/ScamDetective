let adminSession = false;

export const adminLogin = (req, res) => {

    const { password } = req.body;

    if (!password) {
        adminSession = false;

        return res.status(400).json({
            success: false,
            message: "Password required"
        });
    }

    if (password === process.env.ADMIN_PASSWORD) {

        adminSession = true;

        return res.json({
            success: true
        });

    }

    res.status(401).json({
        message: "Invalid password"
    });

};

export const checkAdminSession = (req, res) => {

    if (!adminSession) {

        return res.status(401).json({
            message: "Session expired"
        });

    }

    res.json({ success: true });

};

export const adminLogout = (req, res) => {

    adminSession = false;

    res.json({ success: true });

};