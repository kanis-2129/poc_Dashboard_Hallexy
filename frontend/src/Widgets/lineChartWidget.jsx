import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useWidgetContext } from "../Widgets/widgetContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function LineChartWidget({ widget, orders }) {
  const fieldMap = {
    product: "chooseProduct",
    status: "status",
    totalAmount: "totalAmount",
    unitPrice: "unitPrice",
    quantity: "quantity",
    createdBy: "createdBy",
    duration: "duration", 
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = useMemo(() => {
    if (!widget?.xAxisField || !widget?.yAxisField || !orders?.length)
      return null;

    const xKey = fieldMap[widget.xAxisField];
    const yKey = fieldMap[widget.yAxisField];

    if (!xKey || !yKey) return null;

    // Initialize grouped data with all months 0
    const grouped = {};
    monthNames.forEach((m) => (grouped[m] = 0));

    orders.forEach((o) => {
      let x = "Unknown";

      if (xKey === "duration" && o.orderDate) {
        const date = new Date(o.orderDate);
        if (!isNaN(date)) {
          x = monthNames[date.getUTCMonth()];
        }
      } else {
        x = o[xKey] ?? "Unknown";
      }

      const y = Number(o[yKey]);
      if (!isNaN(y)) {
        grouped[x] = (grouped[x] || 0) + y;
      }
    });

    // Only include months that have data
    const labels = monthNames.filter((m) => grouped[m] > 0);
    if (!labels.length) return null;

    return {
      labels: monthNames,
      datasets: [
        {
          label: widget.yAxisField,
          data: monthNames.map((m) => grouped[m]), // missing months = 0
          borderColor: "#4f80ff",
          backgroundColor: "rgba(79,128,255,0.2)",
          tension: 0.4,
          fill: false,
          pointRadius: 4,
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

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 25, 
        left: 10,
        right: 10,
        top: 10,
      },
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        type: "category",
        grid: { display: true },
        title: {
          display: true,
          text: "Month",
        },
        ticks: {
          font: {
            size: 14,
            weight: "400",
          },
          padding: 20,
        },
      },

      y: {
        beginAtZero: true,
        grid: { display: true },
        ticks: {
          font: {
            size: 14,
            weight: "400",
          },
          maxTicksLimit: 5, 
          callback: (value, index) => (index === 0 ? "0" : `y-${index}`),
        },
        title: {
          display: true,
          text: widget.yAxisField,
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <Line data={chartData} options={options} />
    </div>
  );
}

