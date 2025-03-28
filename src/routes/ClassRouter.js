const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/ClassController");
const { authMiddleWare} = require("../middleware/authMiddleware");

router.post("/create", authMiddleWare, ClassController.createClass);
router.get("/get-all", authMiddleWare, ClassController.getAllClasses);
router.get("/get-class-by-id/:id", authMiddleWare, ClassController.getClassById);
router.put("/update/:id", authMiddleWare, ClassController.updateClass);
router.delete("/delete/:id", authMiddleWare, ClassController.deleteClass);

module.exports = router;
