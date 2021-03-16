const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  //   imageURL: {
  //     type: String,
  //     required: true,
  //   },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', //User model. Create relation
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
