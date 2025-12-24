import expess from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as systemController from "../controllers/systemController.js";

const router = expess.Router();
// get system parameters
router.get("/parameters"/*, authMiddleware*/, systemController.getSystemParameters);
// update system parameters
router.put("/parameters"/*, authMiddleware*/, systemController.updateSystemParameters);

export default router;