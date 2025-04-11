const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");
const { authMiddleWare} = require("../middleware/authMiddleware");

router.post("/create", authMiddleWare, BlogController.createBlog);
router.get("/get-all",BlogController.getAllBLog);
router.get("/get-class-by-id/:id", authMiddleWare, BlogController.getBlogById);
router.put("/update/:id", authMiddleWare, BlogController.updateBlog);
router.delete("/delete/:id", authMiddleWare, BlogController.deleteBlog);

module.exports = router;