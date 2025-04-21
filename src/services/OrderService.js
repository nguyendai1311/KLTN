const Order = require('../models/OrderProduct');
const Class = require('../models/ClassModel');
const EmailService = require('./EmailService');
const mongoose = require('mongoose');

const createOrder = async (newOrder) => {
  try {
    const { orderItems, totalPrice, user, isPaid, paidAt, email } = newOrder;
    const failedOrders = [];

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return {
        status: 'ERR',
        message: 'Danh sách sản phẩm không hợp lệ hoặc đang trống.',
      };
    }

    const itemsPrice = orderItems.reduce(
      (total, item) => total + item.price * item.amount,
      0
    );

    for (const order of orderItems) {
      const classToUpdate = await Class.findOne({ _id: order.classId });

      if (!classToUpdate) {
        failedOrders.push(`Không tìm thấy lớp học ID: ${order.classId}`);
        continue;
      }

      if (classToUpdate.students.includes(user)) {
        failedOrders.push(`Học viên đã đăng ký lớp ${classToUpdate.name} trước đó`);
        continue;
      }

      if (classToUpdate.studentCount < order.amount) {
        failedOrders.push(`Lớp ${classToUpdate.name} không đủ chỗ trống`);
        continue;
      }

      const overlappingClass = await Class.findOne({
        students: user,
        schedule: {
          $elemMatch: {
            day: { $in: classToUpdate.schedule.map(s => s.day) },
            $or: classToUpdate.schedule.map(s => ({
              startTime: { $lte: s.endTime },
              endTime: { $gte: s.startTime }
            }))
          }
        },
        _id: { $ne: classToUpdate._id }
      });

      if (overlappingClass) {
        failedOrders.push(`Lớp ${classToUpdate.name} bị trùng lịch với lớp ${overlappingClass.name}`);
        continue;
      }

      const updatedClass = await Class.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(order.classId) },
        {
          $inc: { maxStudent: -1 },
          $addToSet: { students: user }
        },
        { new: true }
      );

      if (!updatedClass) {
        failedOrders.push(`Cập nhật thất bại cho lớp ${order.classId}`);
      } else {
        console.log(`✅ Học sinh ${user} đã được thêm vào lớp ${updatedClass.name}`);
      }
    }

    if (failedOrders.length) {
      return {
        status: 'ERR',
        message: `Có lỗi với các lớp học: ${failedOrders.join(', ')}`,
      };
    }

    const mappedOrderItems = orderItems.map((item) => ({
      class: item.classId,
      name: item.name,
      price: item.price,
      amount: item.amount,
      image: item.image,
      schedule: item.schedule || [],
    }));

    const createdOrder = await Order.create({
      orderItems: mappedOrderItems,
      itemsPrice,
      totalPrice,
      user,
      isPaid,
      paidAt,
      email,
    });

    if (!createdOrder) {
      return {
        status: 'ERR',
        message: 'Không thể tạo đơn hàng',
      };
    }

    if (email) {
      await EmailService.sendEmailCreateOrder(email, mappedOrderItems);
    }

    return {
      status: 'OK',
      message: 'Đơn hàng được tạo thành công',
      data: createdOrder,
    };

  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    return {
      status: 'ERR',
      message: 'Lỗi máy chủ: ' + error.message,
    };
  }
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({ user: id })
        .sort({ createdAt: -1, updatedAt: -1 })
        .populate({
          path: "orderItems.class", 
          select: "schedule",       
        });

      if (!order) {
        resolve({
          status: 'ERR',
          message: 'The order is not defined'
        });
      }

      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: order
      });
    } catch (e) {
      reject(e);
    }
  });
};

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