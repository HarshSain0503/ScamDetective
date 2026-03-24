import express from "express";
import { scanURL, getScans } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", scanURL);
router.get("/", getScans);

export default router;