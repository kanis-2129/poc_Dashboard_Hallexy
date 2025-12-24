import React, { useState, useEffect } from "react";

export default function WidgetConfigPanel({ isOpen, widget, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [description, setDescription] = useState("");
  const [selectedField, setSelectedField] = useState(""); // Single dropdown selection
  const [showLegend, setShowLegend] = useState(true);

  const FIELD_TYPE_MAP = {
    product: "string",
    status: "string",
    createdBy: "string",
    quantity: "number",
    unitPrice: "number",
    totalAmount: "number",
  };

  // When widget changes, set initial values
  useEffect(() => {
    if (!widget) return;

    setTitle(widget.title || "Untitled");
    setType(widget.type || "PIE");
    setWidth(widget.width ?? 1);
    setHeight(widget.height ?? 1);
    setDescription(widget.description || "");

    
    setSelectedField(widget.pieField ?? "");
    setShowLegend(widget.showLegend ?? true);
  }, [widget]);

  useEffect(() => {
    console.log("CONFIG PANEL OPENED FOR:", widget);
  }, [widget]);

  if (!isOpen || !widget) return null;

  // Handle saving the configuration
  const handleSave = () => {
    if (!selectedField) {
      alert("Please choose a field");
      return;
    }

    const fieldType = FIELD_TYPE_MAP[selectedField];
    console.log("Selected Field Type:", fieldType);

    const updatedWidget = {
      ...widget,
      type: "PIE",
      title,
      width,
      height,
      description,
      pieField: selectedField,
      pieMode: fieldType === "number" ? "sum" : "count",
      showLegend,
    };

    console.log("Updated Widget:", updatedWidget);

    onSave(updatedWidget);
    onClose();
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg border-l p-6 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Widget configuration</h2>
        <button className="text-gray-500 text-xl" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Widget Title */}
      <label className="text-sm font-medium">Widget title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Widget Type */}
      <label className="text-sm">Choose Chart Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option>Pie Chart</option>
      </select>

      {/* Description */}
      <label className="text-sm font-medium">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        rows={3}
      />

      {/* Widget Size */}
      <h3 className="font-semibold mt-4 mb-2">Widget size</h3>

      <label className="text-sm">Width (Columns) *</label>
      <input
        type="number"
        min="1"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />

      <label className="text-sm">Height (Rows) *</label>
      <input
        type="number"
        min="1"
        value={height}
        onChange={(e) => setHeight(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Data Settings */}
      <h3 className="font-semibold mt-4 mb-2">Data Settings</h3>

      {/* Single Dropdown for Category or Value Field */}
      <label className="text-sm">Choose Field</label>
      <select
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="product">Product</option>
        <option value="status">Status</option>
        <option value="createdBy">Created By</option>
        <option value="quantity">Quantity</option>
        <option value="unitPrice">Unit Price</option>
        <option value="totalAmount">Total Amount</option>
      </select>

      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={showLegend}
          onChange={(e) => setShowLegend(e.target.checked)}
          className="border p-2 rounded"
        />
        <span className="text-sm">Show legend</span>
      </label>

      <div className="flex justify-end gap-2 mt-6">
        <button className="px-4 py-2 border rounded" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

