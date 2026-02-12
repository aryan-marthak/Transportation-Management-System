import jwt from "jsonwebtoken";
import Employee from "../models/employee.model.js";

const adminRoute = async (req, res, next) => {
    try {
        // First check if user is authenticated
        if (!req.cookies) {
            return res.status(401).json({ error: "No cookies, authorization denied" });
        }
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token" });
        }
        const employee = await Employee.findById(decoded.userId).select("-password");
        if (!employee) {
            return res.status(401).json({ error: "No user found" });
        }

        // Check if user has admin role
        if (employee.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
        }

        req.user = employee;
        next();
    } catch (error) {
        console.log("Error in adminRoute: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default adminRoute;
