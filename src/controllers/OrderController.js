const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
  
        const { totalPrice, items, userId, email, name: studentName, ...rest } = req.body;

  
      if (!totalPrice || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Danh sách sản phẩm không hợp lệ hoặc đang trống.'
        });
      }
  
      for (const item of items) {
        if (!item.classId || !item.name || !item.price || !item.amount) {
          return res.status(400).json({
            status: 'ERR',
            message: 'Mỗi sản phẩm phải có classId, name, price và amount.'
          });
        }
      }
  
      const normalizedItems = items.map(item => ({
        classId: item.classId,
        name: item.name,
        price: item.price,
        amount: item.amount,
        image: item.image || '',
        schedule: item.schedule || []
      }));
  
      const newOrderData = {
        ...rest,
        studentName,
        email,
        totalPrice,
        user: userId,
        orderItems: normalizedItems,
      };
  
  
      const response = await OrderService.createOrder(newOrderData);
  
      return res.status(200).json(response);
  
    } catch (e) {
      console.error('❌ Error in createOrder:', e);
      return res.status(500).json({
        status: 'ERR',
        message: e.message || 'Lỗi server nội bộ'
      });
    }
  };

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data = req.body.orderItems
        const orderId = req.body.orderId
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder();
        return res.status(200).json(data);
    } catch (e) {
        console.error(e);  // Logging the error for debugging purposes
        return res.status(500).json({  // Changed to 500 for a server-side error
            message: 'Failed to retrieve orders',
            error: e.message  // Added specific error message
        });
    }
};

const getTotalRevenue = async (req, res) => {
    try {
        const totalRevenue = await OrderService.calculateTotalRevenue();
        res.status(200).json({ totalRevenue });
    } catch (error) {
        console.error("Error calculating total revenue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await OrderService.countTotalOrders();
        res.status(200).json({ totalOrders });
    } catch (error) {
        console.error("Error counting total orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    getTotalRevenue,
    getTotalOrders
}