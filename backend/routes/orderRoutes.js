import express from "express";
import Order from "../models/CustomerOrder.js";
import { generateCustomerId, generateOrderId } from "../utils/generatedID.js";

const router = express.Router();

// CREATE ORDER
router.post("/create", async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      street, city, state, postal, country,
      quantity, unitPrice, chooseProduct, createdBy,
    } = req.body;

    const lastOrder = await Order.findOne().sort({ _id: -1 });
    let nextNumber = lastOrder ? parseInt(lastOrder.orderId.split("-")[1]) + 1 : 1;

    const customerId = generateCustomerId(nextNumber);
    const orderId = generateOrderId(nextNumber);

    const fullAddress = `${street}, ${city}, ${state}, ${postal}, ${country}`;
    const totalAmount = quantity * unitPrice;

    const newOrder = await Order.create({
      customerId,
      orderId,
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      postal,
      country,
      fullAddress,
      chooseProduct,
      quantity,
      unitPrice,
      totalAmount,
      createdBy,
    });

    res.json({ success: true, message: "Order Created Successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - GET ALL
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE ORDER
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE ORDER
router.delete("/delete/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
