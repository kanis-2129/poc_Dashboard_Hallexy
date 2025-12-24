// routes/widgetRoutes.js
import express from "express";
import Widget from "../models/Widget.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    console.log("📥 POST widget payload:", req.body);

    const widget = new Widget(req.body);
    await widget.save();

    console.log("✅ SAVED widget ID:", widget._id);
    res.json(widget);
  } catch (err) {
    console.error("❌ WIDGET SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// READ
router.get("/", async (req, res) => {
  const widgets = await Widget.find();
  res.json(widgets);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const widget = await Widget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(widget);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Widget.findByIdAndDelete(req.params.id);
  res.json({ message: "Widget deleted" });
});

export default router;
