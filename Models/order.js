const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    phone: { type: String, required: true },
  },
  pickUpDate: {
    type: String,
    required: true,
  },
  pickUpTime: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
