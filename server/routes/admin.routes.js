import { Router } from "express";
import { AdminController } from "../controllers/adminController.js";

const router = Router();

router.get("/users", AdminController.getTotalUsers);
router.get("/categories", AdminController.getTotalCategories);
router.get("/requests", AdminController.getTotalRequests);
router.get("/products", AdminController.getTotalProducts);

export default router;
