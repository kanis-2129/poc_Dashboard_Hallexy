import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useWidgetContext } from "../Widgets/widgetContext.jsx";
// path un project structure-ku match pannunga

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChartWidget({ widget }) {
  const { orders } = useWidgetContext();
  console.log("FINAL | BAR CHART WIDGET:", widget);
  console.log("FINAL | BAR CHART ORDERS:", orders);
  console.log(
    "🟡 STATUS VALUES:",
    orders?.map((o) => o.status)
  );

  const fieldMap = {
    product: "chooseProduct",
    status: "status",
    totalAmount: "totalAmount",
    unitPrice: "unitPrice",
  };

  const chartData = useMemo(() => {
    if (!widget?.xAxisField || !widget?.yAxisField || !orders?.length)
      return null;

    const xKey = fieldMap[widget.xAxisField] || widget.xAxisField;
    const yKey = fieldMap[widget.yAxisField] || widget.yAxisField;

    const grouped = orders.reduce((acc, o) => {
      const x = o[xKey];
      const y = Number(o[yKey] || 0);

      if (!x || isNaN(y)) return acc;

      acc[x] = (acc[x] || 0) + y;
      return acc;
    }, {});

    const labels = Object.keys(grouped);
    if (!labels.length) return null;

    return {
      labels,
      datasets: [
        {
          label: widget.yAxisField,
          data: labels.map((l) => grouped[l]),
          backgroundColor: "#4f80ff",
          borderRadius: 6,
          barThickness: 40,
          maxBarThickness: 48,
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
        Configure X & Y axis
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },

    layout: {
      padding: { bottom: 25, left: 25 },
    },

    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: "x-axis label",
          align: "center",
        },
        ticks: {
          font: {
            size: 14,
            weight: "400",
          },
          padding: 10,
          callback: function (value, index, ticks) {
            // Ensure value is a number internally
            const numValue = Number(value);
            if (isNaN(numValue)) return ""; // fallback if not a number
            return index < 3 ? `x-${index + 1}` : "";
          },
        },
      },

      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          font: {
            size: 14, // 👈 y-axis numbers size
            weight: "400",
          },
          maxTicksLimit: 5, // 👈 y-1 to y-5 feel
          callback: (value, index) => (index === 0 ? "0" : `y-${index}`),
        },
        title: {
          display: true,
          text: "Y-Axis label",
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* {widget.title && (
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          {widget.title}
        </h3>
      )} */}

      <div className="flex-1 relative">
        <Bar data={chartData} options={options} redraw />
      </div>
    </div>
  );
}
