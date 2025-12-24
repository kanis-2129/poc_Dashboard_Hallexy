import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function WidgetConfigPanel({ isOpen, widget, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [description, setDescription] = useState("");
  const [metric, setMetric] = useState("");
  const [aggregation, setAggregation] = useState("");
  const [dataFormat, setDataFormat] = useState("");
  const [decimalPrecision, setDecimalPrecision] = useState(0);

  // State to track validation errors
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (widget) {
      setTitle(widget.title || "Untitled");
      setWidth(widget.width || 2);
      setHeight(widget.height || 2);
      setDescription(widget.description || "");
      setMetric(widget.metric || "");
      setAggregation(widget.aggregation || "");
      setDataFormat(widget.dataFormat || "");
      setDecimalPrecision(widget.decimalPrecision || 0);
    }
  }, [widget]);

  if (!isOpen || !widget) return null;

  const validate = () => {
    const errors = {};

    if (!title.trim()) errors.title = "Please enter a widget title";
    if (!width || width < 1) errors.width = "Width must be at least 1";
    if (!height || height < 1) errors.height = "Height must be at least 1";
    if (!metric) errors.metric = "Please select a metric";
    if (!aggregation) errors.aggregation = "Please select an aggregation";
    if (!dataFormat) errors.dataFormat = "Please select a data format";
    if (decimalPrecision < 0)
      errors.decimalPrecision = "Decimal precision cannot be negative";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...widget,
      type: "KPI", // 🔥 MUST
      title,
      width,
      height,
      metric,
      aggregation,
      dataFormat,
      decimalPrecision,
    });

    onClose();

    toast.success("All set! Your new widget has been added successfully!");
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
        className={`w-full border p-2 rounded mb-1 ${
          validationErrors.title ? "border-red-500" : "border-gray-300"
        }`}
      />
      {validationErrors.title && (
        <p className="text-red-500 text-xs mb-4">{validationErrors.title}</p>
      )}

      {/* Widget Type */}
      <label className="text-sm font-medium">Widget type *</label>
      <input
        type="text"
        value={widget.type}
        readOnly
        className="w-full border p-2 rounded bg-gray-100 mb-4"
      />

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
        className={`w-full border p-2 rounded mb-1 ${
          validationErrors.width ? "border-red-500" : "border-gray-300"
        }`}
      />
      {validationErrors.width && (
        <p className="text-red-500 text-xs mb-4">{validationErrors.width}</p>
      )}

      <label className="text-sm">Height (Rows) *</label>
      <input
        type="number"
        min="1"
        value={height}
        onChange={(e) => setHeight(Number(e.target.value))}
        className={`w-full border p-2 rounded mb-1 ${
          validationErrors.height ? "border-red-500" : "border-gray-300"
        }`}
      />
      {validationErrors.height && (
        <p className="text-red-500 text-xs mb-4">{validationErrors.height}</p>
      )}

      {/* Data Settings */}
      <h3 className="font-semibold mt-4 mb-2">Data setting</h3>

      <label className="text-sm">Select metric *</label>
      <select
        value={metric}
        onChange={(e) => setMetric(e.target.value)}
        className={`w-full border p-2 rounded mb-1 ${
          validationErrors.metric ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select metric</option>
        <option value="customerId">Customer ID</option>
        <option value="firstName">Customer name</option>
        <option value="email">Email id</option>
        <option value="address">Address</option>
        <option value="orderDate">Order date</option>
        <option value="product">Product</option>
        <option value="createdBy">Created by</option>
        <option value="status">Status</option>
        <option value="totalAmount">Total amount</option>
        <option value="unitPrice">Unit price</option>
        <option value="quantity">Quantity</option>
      </select>
      {validationErrors.metric && (
        <p className="text-red-500 text-xs mb-4">{validationErrors.metric}</p>
      )}

      <label className="text-sm">Aggregation *</label>
      <select
        value={aggregation}
        onChange={(e) => setAggregation(e.target.value)}
        className={`w-full border p-2 rounded mb-1 ${
          validationErrors.aggregation ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select aggregation</option>
        <option>Sum</option>
        <option>Average</option>
        <option>Count</option>
      </select>
      {validationErrors.aggregation && (
        <p className="text-red-500 text-xs mb-4">
          {validationErrors.aggregation}
        </p>
      )}

      <label className="text-sm">Data format *</label>
      <select
        value={dataFormat}
        onChange={(e) => setDataFormat(e.target.value)}
        className={`w-full border p-2 rounded mb-1 ${
          validationErrors.dataFormat ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select data format</option>
        <option>Number</option>
        <option>Currency</option>
      </select>
      {validationErrors.dataFormat && (
        <p className="text-red-500 text-xs mb-4">
          {validationErrors.dataFormat}
        </p>
      )}

      <label className="text-sm">Decimal precision *</label>
      <input
        type="number"
        min="0"
        value={decimalPrecision}
        onChange={(e) => setDecimalPrecision(Number(e.target.value))}
        className={`w-full border p-2 rounded mb-1 ${
          validationErrors.decimalPrecision
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />
      {validationErrors.decimalPrecision && (
        <p className="text-red-500 text-xs mb-4">
          {validationErrors.decimalPrecision}
        </p>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <button className="px-4 py-2 border rounded" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleSave}
        >
          Add
        </button>
      </div>
    </div>
  );
}
