import express from "express";
import Dashboard from "../models/dashboard.js";

const router = express.Router();

// Save layout
router.post("/save", async (req, res) => {
  await Dashboard.findOneAndUpdate(
    {},
    { layout: req.body.layout, updatedAt: new Date() },
    { upsert: true }
  );
  res.json({ success: true });
});

// Load layout
router.get("/load", async (req, res) => {
  const dashboard = await Dashboard.findOne({});
  res.json(dashboard || { layout: [] });
});

export default router;
