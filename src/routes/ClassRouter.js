const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/ClassController");

router.post("/create", ClassController.createClass);
router.get("/get-all", ClassController.getAllClasses);
router.get("/get-class-by-id/:id", ClassController.getClassById);
router.put("/update/:id", ClassController.updateClass);
router.delete("/delete/:id", ClassController.deleteClass);

module.exports = router;
