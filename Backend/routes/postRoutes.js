import express from "express";

import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  getComments,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.get("/:id/comments", getComments);

// Protected
router.post("/:id/comments", protect, addComment);

// Admin
router.post("/", protect, uploadSingle, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;