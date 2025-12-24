import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  orderId: { type: String, required: true },

  firstName: String,
  lastName: String,
  email: String,
  phone: String,

  street: String,
  city: String,
  state: String,
  postal: String,
  country: String,

  fullAddress: String,   // <-- Auto generated

  chooseProduct: String,
  quantity: Number,
  unitPrice: Number,
  totalAmount: Number,

  status: { type: String, default: "Pending" },

  createdBy: String,

  orderDate: { type: Date, default: Date.now } // Auto date
});

export default mongoose.model("Order", orderSchema);
