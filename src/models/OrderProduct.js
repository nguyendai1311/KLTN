const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String },
            price: { type: Number, required: true },
            discount: { type: Number },
            class: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Class',
                required: true,
            },
            timeAdded: { type: Date, default: Date.now }
        },
    ],
    itemsPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String },
    email: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date }
},
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order