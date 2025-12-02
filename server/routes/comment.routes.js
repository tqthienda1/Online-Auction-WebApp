import express from "express";

const router = express();

router.post("/", getAllComment);
router.post("/create", createComment);
router.post("/update", updateComment);
router.post("/delete", deleteComment);
