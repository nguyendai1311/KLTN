const Notification = require('../models/Notification');

const createNotification = (data) => {
    return Notification.create(data);
};
const getUserNotifications = (userId) => {
    return Notification.find({ userId }).sort({ createdAt: -1 });
};


const markAsRead = (notificationId) => {
    return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
}

const deleteNotification = (notificationId) => {
    return Notification.findByIdAndDelete(notificationId);
};

const getAllNotification = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const exams = await Notification.find();
            resolve({
                status: "OK",
                message: "Lấy danh sách thông báo thành công",
                data: exams
            });
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification,
    getAllNotification
};
