import mongoose from "mongoose";
import OrderModel from "../models/CustomerOrder.js";
import { v4 as uuidv4 } from "uuid"; // npm i uuid

// Create
exports.createOrder = async (req, res) => {
  try {
    // Map frontend payload to backend schema
    const {
      firstName,
      lastName,
      emailId,
      phoneNumber,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      chooseProduct,
      quantity,
      unitPrice,
      totalAmount,
      status,
      createdBy,
    } = req.body;

    const fullAddress = `${streetAddress}, ${city}, ${stateProvince}, ${postalCode}, ${country}`;

    const order = new OrderModel({
      customerId: `CUST-${uuidv4().slice(0, 8)}`, // e.g., CUST-1a2b3c4d
      orderId: `ORD-${uuidv4().slice(0, 8)}`,
      firstName,
      lastName,
      email: emailId,
      phone: phoneNumber,
      street: streetAddress,
      city,
      state: stateProvince,
      postal: postalCode,
      country,
      fullAddress,
      chooseProduct,
      quantity,
      unitPrice,
      totalAmount,
      status,
      createdBy,
    });

    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ orderDate: -1 }); // use orderDate
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteOrder = async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
