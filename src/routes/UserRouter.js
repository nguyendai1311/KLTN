const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController');
const { authMiddleWare } = require('../middleware/authMiddleware');

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/send-otp', userController.sendOtp)
router.post('/reset-password', userController.resetPassword)
router.post('/log-out', userController.logoutUser)
router.post('/refresh-token', userController.refreshToken)
router.put('/update-user/:id', userController.updateUser)
router.post('/resend-otp', userController.resendOtp)
router.delete('/delete-user/:id', userController.deleteUser)
router.get('/get-details/:id', userController.getDetailsUser)
router.get('/get-all', userController.getAllUser)
router.post('/delete-many', authMiddleWare, userController.deleteMany)
router.post('/create-teacher', userController.createTeacher)
router.get('/get-total-teacher', userController.getTotalTeachers)

module.exports = router