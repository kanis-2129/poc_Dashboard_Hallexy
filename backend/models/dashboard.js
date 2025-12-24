import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema({
  id: String,
  type: String, 
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  config: Object,
});

const dashboardSchema = new mongoose.Schema({
  layout: [widgetSchema],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Dashboard", dashboardSchema);
