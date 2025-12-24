const fieldMap = {
  product: "product",
  quantity: "quantity",
  unitPrice: "unitPrice",
  totalAmount: "totalAmount",
  status: "status",
  createdBy: "createdBy",
  orderDate: "orderDate",
};

export default function KPIWidget({ widget, data = [] }) {
  const dataKey = fieldMap[widget.metric]; // declare first

  console.log("KPIWidget RENDERED", {
    metric: widget.metric,
    dataKey,
    sampleRow: data[0],
  });

  const colClass = `col-span-${widget.width}`;
  const rowClass = `row-span-${widget.height}`;

   if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        <p className="animate-pulse text-gray-400">Loading data…</p>
      </div>
    );
  }

  let value = "-";

  if (dataKey && data.length) {
    const values = data
      .map((row) => Number(row[dataKey]))
      .filter((v) => !isNaN(v));

    switch (widget.aggregation) {
      case "Sum":
        value = values.reduce((a, b) => a + b, 0);
        break;

      case "Average":
        value = values.length
          ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(
              widget.decimalPrecision
            )
          : 0;
        break;

      case "Count":
        value = values.length;
        break;
    }

    // Add currency symbol for price fields
    if (["totalAmount", "unitPrice"].includes(dataKey)) {
      value = `₹${value}`; // change ₹ to $ if needed
    }
  }

  return (
    <div className={` ${colClass} ${rowClass}`}>
      <p className="text-lg font-bold text-black ">{value}</p>
    </div>
  );
}

