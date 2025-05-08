const NotificationService = require('../services/NotificationService')

const createNotfication = async (req, res) => {
  try {
    const notification = await NotificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo thông báo', error: err.message });
  }
};

const getByUser = async (req, res) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.params.userId);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông báo', error: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    const updated = await NotificationService.markAsRead(req.params.id);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đọc', error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await NotificationService.deleteNotification(req.params.id);
    res.status(200).json({ message: 'Xóa thông báo thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa thông báo', error: err.message });
  }
};

const getAllNotification = async (req, res) => {
  try {
    const exams = await NotificationService.getAllNotification();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports =  {
  createNotfication,
  getByUser,
  markRead,
  deleteNotification,
  getAllNotification
};
