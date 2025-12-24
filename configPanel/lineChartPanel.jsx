import React, { useState, useEffect } from "react";

export default function WidgetConfigPanel({ isOpen, widget, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Line chart");
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [description, setDescription] = useState("");
  const [xAxis, setX_axis] = useState("");
  const [yAxis, setY_axis] = useState("");
  const [showLable, setShowLable] = useState(true);

  useEffect(() => {
    if (!widget) return;

    setTitle(widget.title || "Untitled");
    setWidth(widget.width ?? 5);
    setHeight(widget.height ?? 5);
    setDescription(widget.description || "");

   
    setX_axis(widget.xAxisField ?? "");
    setY_axis(widget.yAxisField ?? "");

    setShowLable(widget.showLabel ?? true);
  }, [widget]);

  useEffect(() => {
    console.log("CONFIG PANEL OPENED FOR:", widget);
  }, [widget]);

  if (!isOpen || !widget) return null;

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
      <label className="text-sm">Choose X-axis</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option>Line chart</option>
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
      <h3 className="font-semibold mt-4 mb-2">Data setting</h3>

      <label className="text-sm">Choose X-axis</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={xAxis}
        onChange={(e) => setX_axis(e.target.value)}
      >
        <option value="" disabled>
          Choose x-Axis data
        </option>
        <option value="product">Product</option>
        <option value="quantity">Quantity</option>
        <option value="unitPrice">Unit price</option>
        <option value="totalAmount">Total Amount</option>
        <option value="status">Status</option>
        <option value="createdBy">Created By</option>
        <option value="duration">Duration</option>
      </select>

      <label className="text-sm">Choose Y-axis</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={yAxis}
        onChange={(e) => setY_axis(e.target.value)}
      >
        <option value="" disabled>
          Choose y-Axis data
        </option>

        <option value="product">Product</option>
        <option value="quantity">Quantity</option>
        <option value="unitPrice">Unit price</option>
        <option value="totalAmount">Total Amount</option>
        <option value="status">Status</option>
        <option value="createdBy">Created By</option>
        <option value="duration">Duration</option>
      </select>

      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={showLable}
          onChange={(e) => setShowLable(e.target.checked)}
          className="border p-2 rounded"
        />
        <span className="text-sm">Show data label</span>
      </label>

      <div className="flex justify-end gap-2 mt-6">
        <button className="px-4 py-2 border rounded" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => {
            const updatedWidget = {
              title,
              width,
              height,
              xAxisField: xAxis,
              yAxisField: yAxis,
              showLabel: showLable,
            };
            console.log("WIDGET CONFIG SAVE:", updatedWidget);
            if (!xAxis || !yAxis) {
              alert("Please select X and Y axis");
              return;
            }

            onSave({
              ...widget,
              type:"LINE",
              title,
              width,
              height,
              xAxisField: xAxis,
              yAxisField: yAxis,
              showLabel: showLable,
            });

            onClose();
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

