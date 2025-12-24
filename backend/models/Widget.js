// models/Widget.js
import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema({
  dashboardId: { type: String, default: "main" },

  type: String, // BAR, LINE, KPI, etc
  title: String,

  row: Number,
  col: Number,
  width: Number,
  height: Number,

  xAxisField: String,
  yAxisField: String,
  categoryField: String,
  valueField: String,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Widget", widgetSchema);
