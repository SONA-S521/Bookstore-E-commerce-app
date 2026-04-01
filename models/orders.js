import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  id: String,
  customer: String,
  customerEmail: String,
  book: String,
  bookId: { type: String }, // CHANGED from Number to String
  quantity: Number,
  total: Number,
  paymentMethod: String,
  source: String,
  status: { type: String, default: 'Pending' },
  date: String
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);
export default Order;