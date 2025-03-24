const express = require("express");
const router = express.Router()
const CourseController = require('../controllers/CourseController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', CourseController.createCourse)
router.post('/:courseId/classes',CourseController.addClassToCourse);
router.put('/update/:id', CourseController.updateCourse)
router.get('/get-details/:id', CourseController.getDetailsCourse)
router.delete('/delete/:id', CourseController.deleteCourse)
router.get('/get-all', CourseController.getAllCourse)
router.post('/delete-many', CourseController.deleteMany)
router.get('/get-all-type', CourseController.getAllType)

module.exports = router