import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";

const router = Router();

const mockUser = (req, res, next) => {
  req.user = "a0859fe9-9bf5-4b7b-adf7-8f7a8675780b";
  next();
};

router.get("/", CategoryController.getAll);
router.get("/tree", CategoryController.getTree);
router.get("/parents", CategoryController.getParentCategories);
router.get("/categories", CategoryController.getCategories);
router.get("/:id/children", CategoryController.getChildren);
router.get("/:id", CategoryController.getById);

router.post("/", CategoryController.create);

router.put("/:id", CategoryController.update);

router.delete("/:id", CategoryController.delete);

export default router;
