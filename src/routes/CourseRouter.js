const express = require("express");
const router = express.Router()
const CourseController = require('../controllers/CourseController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authMiddleWare, CourseController.createCourse)
router.put('/update/:id', authMiddleWare, CourseController.updateCourse)
router.get('/get-details/:id', authMiddleWare, CourseController.getDetailsCourse)
router.delete('/delete/:id', authMiddleWare, CourseController.deleteCourse)
router.get('/get-all', authMiddleWare, CourseController.getAllCourse)
router.post('/delete-many', authMiddleWare, CourseController.deleteMany)
router.get('/get-all-type', authMiddleWare, CourseController.getAllType)

module.exports = router