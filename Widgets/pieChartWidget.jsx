import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { useWidgetContext } from "./widgetContext.jsx";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartWidget({ widget }) {
  console.log("PIE CHART FILE LOADED");

  const { orders } = useWidgetContext();

  const fieldMap = {
    product: "chooseProduct",
    status: "status",
    totalAmount: "totalAmount",
    unitPrice: "unitPrice",
  };
  console.log("PIE WIDGET:", widget);
  console.log("ORDERS SAMPLE:", orders[0]);

  const chartData = useMemo(() => {
    if (!widget?.pieField || !orders?.length) return null;

    const field = widget.pieField;
    const mode = widget.pieMode; // "count" | "sum"

    const grouped = orders.reduce((acc, o) => {
      const key = o[field];
      if (!key) return acc;

      if (mode === "count") {
        acc[key] = (acc[key] || 0) + 1;
      } else {
        const val = Number(o[field] || 0);
        acc[key] = (acc[key] || 0) + val;
      }

      return acc;
    }, {});

    const labels = Object.keys(grouped);
    if (!labels.length) return null;

    return {
      labels,
      datasets: [
        {
          label: mode === "count" ? `Count by ${field}` : `Sum of ${field}`,
          data: labels.map((l) => grouped[l]),
          backgroundColor: [
            "#4f80ff",
            "#22c55e",
            "#f97316",
            "#ef4444",
            "#a855f7",
            "#14b8a6",
          ],
        },
      ],
    };
  }, [widget, orders]);

   if (!orders || orders.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        <p className="animate-pulse text-gray-400">Loading data…</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        Choose chart data from settings
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    radius: "75%", 
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 10,
          padding: 5,
          font: {
            size: 11, 
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

