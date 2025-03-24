const Order = require('../models/OrderProduct')
const Course = require('../models/CourseModel')
const Class = require('../models/ClassModel');
const EmailService = require('./EmailService')


// const createOrder = async (newOrder) => {
//     const { orderItems, paymentMethod, itemsPrice, totalPrice, user, isPaid, paidAt, email } = newOrder;
//     try {
//         // Kiểm tra tồn kho và cập nhật số lượng khóa học đã bán
//         const promises = orderItems.map(async (order) => {
//             const CourseData = await Course.findOneAndUpdate(
//                 { _id: order.course, countInStock: { $gte: order.amount } },
//                 {
//                     $inc: {
//                         countInStock: -order.amount,
//                         selled: order.amount
//                     }
//                 },
//                 { new: true }
//             );

//             return CourseData
//                 ? { status: 'OK', message: 'SUCCESS' }
//                 : { status: 'ERR', id: order.course };
//         });

//         const results = await Promise.all(promises);
//         const failedOrders = results.filter((item) => item.status === 'ERR');

//         if (failedOrders.length) {
//             const arrId = failedOrders.map((item) => item.id);
//             return { status: 'ERR', message: `Lớp học với ID: ${arrId.join(', ')} không đủ chỗ` };
//         }

//         // Tạo đơn hàng
//         const createdOrder = await Order.create({
//             orderItems,
//             paymentMethod,
//             itemsPrice,
//             totalPrice,
//             user,
//             isPaid,
//             paidAt
//         });

//         // ✅ Sau khi tạo đơn hàng, tự động thêm sinh viên vào lớp học
//         await Promise.all(orderItems.map(async (order) => {
//             await ClassroomService.addStudentToClass(order.course, user);
//         }));

//         // Gửi email xác nhận đơn hàng
//         await EmailService.sendEmailCreateOrder(email, orderItems);

//         return { status: 'OK', message: 'Success' };
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

const createOrder = async (newOrder) => {
    try {
        const { orderItems, paymentMethod, itemsPrice, totalPrice, fullName, city, phone, user, isPaid, paidAt, email } = newOrder;
        const failedOrders = [];

        for (const order of orderItems) {
            const CourseData = await Course.findOneAndUpdate(
                { _id: order.course, countInStock: { $gte: order.amount } },
                { $inc: { countInStock: -order.amount, selled: order.amount } },
                { new: true }
            );

            if (!CourseData) {
                failedOrders.push(order.course);
            } else {
                // 🔥 Cập nhật danh sách học sinh trong lớp học (tránh trùng lặp)
                const updatedClass = await Class.findOneAndUpdate(
                    { course: order.course },
                    { $addToSet: { students: user } },
                    { new: true }
                );

                if (updatedClass) {
                    console.log(`✅ Học sinh ${user} đã được thêm vào lớp ${updatedClass.name}`);
                }
            }
        }

        if (failedOrders.length) {
            return {
                status: 'ERR',
                message: `Lớp học với ID: ${failedOrders.join(', ')} không đủ chỗ`
            };
        }

        // 🛒 Tạo đơn hàng mới
        const createdOrder = await Order.create({
            orderItems,
            paymentMethod,
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

        // 📧 Gửi email xác nhận đơn hàng nếu có email
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
        throw new Error(error.message);
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
                            countInStock: +order.amount,
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