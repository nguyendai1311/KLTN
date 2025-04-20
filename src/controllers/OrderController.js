const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        console.log('👉 Request Body:', req.body);

        const { totalPrice, items, userId, ...rest } = req.body;

        if (!totalPrice || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Danh sách sản phẩm không hợp lệ hoặc đang trống.'
            });
        }

        const normalizedItems = items.map(item => ({
            ...item,
            class: item.classId
        }));

        const newOrderData = {
            ...rest,
            totalPrice,
            user: userId,
            orderItems: normalizedItems,
        };

        console.log('✅ Normalized Order:', newOrderData);

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


module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}