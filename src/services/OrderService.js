const Order = require('../models/OrderProduct')
const Course = require('../models/CourseModel')
const Class = require('../models/ClassModel');
const EmailService = require('./EmailService')

const createOrder = async (newOrder) => {
    try {
        const { orderItems, itemsPrice, totalPrice, user, isPaid, paidAt, email } = newOrder;
        const failedOrders = [];

        // Kiểm tra học viên đã đăng ký khóa học hay chưa và kiểm tra trùng lịch
        for (const order of orderItems) {
            const classToUpdate = await Class.findOne({ _id: order.class });

            if (!classToUpdate) {
                failedOrders.push(order.class);
                continue;
            }

            // Kiểm tra nếu học viên đã đăng ký khóa học
            if (classToUpdate.students.includes(user)) {
                failedOrders.push(`Học viên đã đăng ký lớp học ${classToUpdate.name} trước đó`);
                continue;
            }

            // Kiểm tra nếu lớp học không đủ chỗ
            if (classToUpdate.maxStudent < order.amount) {
                failedOrders.push(`Lớp học ${classToUpdate.name} không đủ chỗ`);
                continue;
            }

            // Kiểm tra trùng lịch học với các lớp đã đăng ký của học viên
            const overlappingClass = await Class.findOne({
                students: user,
                schedule: {
                    $elemMatch: {
                        day: { $in: classToUpdate.schedule.map(schedule => schedule.day) },
                        $or: classToUpdate.schedule.map(schedule => ({
                            startTime: { $lte: schedule.endTime },
                            endTime: { $gte: schedule.startTime }
                        }))
                    }
                },
                _id: { $ne: classToUpdate._id } // Không xét chính lớp đang cập nhật
            });

            if (overlappingClass) {
                failedOrders.push(`Lịch học của lớp ${classToUpdate.name} trùng với lớp đã đăng ký: ${overlappingClass.name}`);
                continue;
            }

            // Cập nhật lớp học nếu tất cả các kiểm tra đều thành công
            const updatedClass = await Class.findOneAndUpdate(
                { _id: order.class },
                { 
                    $inc: { maxStudent: -order.amount },
                    $addToSet: { students: user }
                },
                { new: true }
            );

            if (!updatedClass) {
                failedOrders.push(order.class); // Lớp học không được cập nhật
            } else {
                console.log(`✅ Học sinh ${user} đã được thêm vào lớp ${updatedClass.name}`);
            }
        }

        // Nếu có lớp không đủ chỗ, không tồn tại hoặc bị lỗi
        if (failedOrders.length) {
            return {
                status: 'ERR',
                message: `Có lỗi với các lớp học: ${failedOrders.join(', ')}`
            };
        }

        // Tạo đơn hàng mới
        const createdOrder = await Order.create({
            orderItems,
            itemsPrice,
            totalPrice,
            user,
            isPaid,
            paidAt
        });

        if (!createdOrder) {
            return {
                status: 'ERR',
                message: 'Không thể tạo đơn hàng'
            };
        }

        // Gửi email xác nhận đơn hàng nếu có email
        if (email) {
            await EmailService.sendEmailCreateOrder(email, orderItems);
        }

        return {
            status: 'OK',
            message: 'Đơn hàng được tạo thành công',
            data: createdOrder
        };
    } catch (error) {
        console.error("❌ Lỗi khi tạo đơn hàng:", error);
        return {
            status: 'ERR',
            message: 'Lỗi máy chủ: ' + error.message
        };
    }
};



const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            maxStudent: +order.amount,
                            selled: -order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id

            if (newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}