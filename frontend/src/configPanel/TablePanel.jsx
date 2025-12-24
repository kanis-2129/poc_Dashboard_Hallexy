import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function TablePanel({ isOpen, widget, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("data");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);

  const [selectedColumns, setSelectedColumns] = useState([]);
  const [sortBy, setSortBy] = useState("asc");
  const [pagination, setPagination] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);

  //Filter states
  const [attribute, setAttribute] = useState("");
  const [operator, setOperator] = useState("=");
  const [filterValue, setFilterValue] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [headerBg, setHeaderBg] = useState("#D8D8D8");
  const COLUMN_OPTIONS = [
    { label: "Customer ID", value: "customerId" },
    { label: "Customer Name", value: "firstName" },
    { label: "Email ID", value: "email" },
    { label: "Phone Number", value: "phone" },
    { label: "Address", value: "address" },
    { label: "Order ID", value: "orderId" },
    { label: "Order Date", value: "orderDate" },
    { label: "Product", value: "chooseProduct" },
    { label: "Quantity", value: "quantity" },
    { label: "Unit Price", value: "unitPrice" },
    { label: "Total Amount", value: "totalAmount" },
    { label: "Status", value: "status" },
    { label: "Created By", value: "createdBy" },
  ];

  useEffect(() => {
    if (widget) {
      setTitle(widget.title || "Untitled");
      setDescription(widget.description || "");
      setWidth(widget.width || 5);
      setHeight(widget.height || 5);
      setSelectedColumns(widget.columns || []);
      setSortBy(widget.sortBy || "asc");
      setPagination(widget.pagination || "");
      setApplyFilter(widget.applyFilter || false);

     
      setFontSize(widget.fontSize ?? 14);
      setHeaderBg(widget.headerBg ?? "#D8D8D8");

      if (widget.filter) {
        setAttribute(widget.filter.attribute || "");
        setOperator(widget.filter.operator || "=");
        setFilterValue(widget.filter.value || "");
      }
    }
  }, [widget]);

  if (!isOpen || !widget) return null;

  return (
    <div className="fixed top-0 right-0 w-[420px] h-full bg-white shadow-xl border-l z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b">
        <h2 className="text-lg font-semibold">Widget configuration</h2>
        <button className="text-gray-600 text-xl" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mt-4 px-5">
        <button
          onClick={() => setActiveTab("data")}
          className={`w-1/2 py-2 font-medium rounded-l-xl border 
          ${activeTab === "data" ? "bg-[#0aa160] text-white" : "bg-gray-100"}`}
        >
          Data
        </button>
        <button
          onClick={() => setActiveTab("styling")}
          className={`w-1/2 py-2 font-medium rounded-r-xl border 
          ${
            activeTab === "styling" ? "bg-[#0aa160] text-white" : "bg-gray-100"
          }`}
        >
          Styling
        </button>
      </div>

      <div className="flex-1">
        {/* DATA TAB */}
        {activeTab === "data" && (
          <div className="px-5 py-4">
            {/* Title */}
            <label className="text-sm font-medium">Widget title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            {/* Type */}
            <label className="text-sm font-medium">Widget type *</label>
            <input
              type="text"
              value="Table"
              readOnly
              className="w-full border p-2 rounded bg-gray-100 mb-4"
            />

            {/* Description */}
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            {/* Size */}
            <h3 className="font-semibold mb-2">Widget size</h3>

            <label className="text-sm font-medium">Width *</label>
            <input
              type="number"
              min={1}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full border p-2 rounded mb-4"
            />

            <label className="text-sm font-medium">Height *</label>
            <input
              type="number"
              min={1}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full border p-2 rounded mb-4"
            />

            {/* Columns */}

            <label className="text-sm font-medium">Choose columns *</label>

            <div className="border rounded p-2">
              {/* Selected chips */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedColumns.map((col) => {
                  const label =
                    COLUMN_OPTIONS.find((c) => c.value === col)?.label || col;

                  return (
                    <span
                      key={col}
                      className="flex items-center gap-1 bg-green-200 px-2 py-1 rounded text-sm"
                    >
                      {label}
                      <button
                        onClick={() =>
                          setSelectedColumns(
                            selectedColumns.filter((c) => c !== col)
                          )
                        }
                        className="font-bold"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Dropdown */}
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !selectedColumns.includes(value)) {
                    setSelectedColumns([...selectedColumns, value]);
                  }
                  e.target.value = "";
                }}
                className="w-full border p-2 rounded"
              >
                <option value="">Select column</option>
                {COLUMN_OPTIONS.filter(
                  (col) => !selectedColumns.includes(col.value)
                ).map((col) => (
                  <option key={col.value} value={col.value}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <label className="text-sm font-medium">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            {/* Pagination */}
            <label className="text-sm font-medium">Pagination</label>
            <select
              value={pagination}
              onChange={(e) => setPagination(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">None</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>

            {/* Apply Filter */}
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={applyFilter}
                onChange={(e) => setApplyFilter(e.target.checked)}
              />
              Apply filter
            </label>

            {/* FILTER UI */}
            {applyFilter && (
              <div className="border p-3 rounded mt-4 bg-gray-50">
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="text-sm font-medium">Attribute</label>
                    <select
                      value={attribute}
                      onChange={(e) => setAttribute(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select</option>
                      <option value="chooseProduct">Product</option>
                      <option value="quantity">Quantity</option>
                      <option value="status">Status</option>
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className="text-sm font-medium">Operator</label>
                    <select
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="=">=</option>
                      <option value="!=">!=</option>
                      <option value="contains">Contains</option>
                      <option value="starts">Starts with</option>
                      <option value="ends">Ends with</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Value</label>
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "styling" && (
          <div className="px-5 py-4">
           

            <label className="text-sm font-medium">
              Font size <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center border rounded mb-4">
              <input
                type="number"
                min={12}
                max={20}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full p-2"
              />
              <span className="px-3 bg-gray-100 border-l">px</span>
            </div>

            <label className="text-sm font-medium">Header background</label>
            <input
              type="color"
              value={headerBg}
              onChange={(e) => setHeaderBg(e.target.value)}
              className="w-full h-10"
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 px-5 py-4 border-t bg-white">
        <button className="px-4 py-2 border rounded" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-5 py-2 bg-green-600 text-white rounded"
          onClick={() => {
            onSave({
              ...widget,
              type: "TABLE",
              title,
              description,
              width,
              height,

              columns: selectedColumns,
              sortBy,
              pagination,
              applyFilter,

              
              filter: applyFilter
                ? { attribute, operator, value: filterValue }
                : null,

             
              fontSize,
              headerBg,
            });

            toast.success("Table widget added successfully!");
            onClose();
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

