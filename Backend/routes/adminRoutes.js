import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { adminLogin } from "../controllers/adminAuthController.js";
import { checkAdminSession } from "../controllers/adminAuthController.js";
import { adminLogout } from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", getDashboardStats);
router.get("/check", checkAdminSession);
router.post("/logout", adminLogout);

export default router;