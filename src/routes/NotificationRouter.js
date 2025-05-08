const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const { authMiddleWare} = require("../middleware/authMiddleware");

router.post("/create",NotificationController.createNotfication);
router.get("/get-notification/:id", NotificationController.getByUser);
router.put("/update/:id", NotificationController.markRead);
router.delete("/delete/:id", authMiddleWare, NotificationController.deleteNotification);
router.get('/get-all-notification', NotificationController.getAllNotification);
module.exports = router;