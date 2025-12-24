import { Scatter } from "react-chartjs-2";
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function ScatterPlotWidget({ widget, orders }) {
  const fieldMap = {
    product: "chooseProduct",
    status: "status",
    totalAmount: "totalAmount",
    unitPrice: "unitPrice",
    quantity: "quantity",
    createdBy: "createdBy",
    duration: "duration", 
  };

  const isNumber = (val) => !isNaN(Number(val));
  const isDate = (val) => !isNaN(new Date(val).getTime());

  const buildIndexMap = (data, key) => {
    const unique = [...new Set(data.map((o) => o[key]))];
    return Object.fromEntries(unique.map((v, i) => [v, i + 1]));
  };

  const chartData = useMemo(() => {
    if (!widget?.xAxisField || !widget?.yAxisField || !orders?.length)
      return null;

    const xKey = fieldMap[widget.xAxisField];
    const yKey = fieldMap[widget.yAxisField];

    const xIndexMap = buildIndexMap(orders, xKey);
    const yIndexMap = buildIndexMap(orders, yKey);

    const points = orders
      .map((o) => {
        let x, y;

        // X value
        if (isNumber(o[xKey])) x = Number(o[xKey]);
        else if (isDate(o[xKey])) x = new Date(o[xKey]).getTime();
        else x = xIndexMap[o[xKey]];

        // Y value
        if (isNumber(o[yKey])) y = Number(o[yKey]);
        else if (isDate(o[yKey])) y = new Date(o[yKey]).getTime();
        else y = yIndexMap[o[yKey]];

        if (x == null || y == null) return null;
        return { x, y };
      })
      .filter(Boolean);

    if (!points.length) return null;

    return {
      datasets: [
        {
          label: `${widget.yAxisField} vs ${widget.xAxisField}`,
          data: points,
          backgroundColor: "#4f80ff",
          pointRadius: 5,
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
        grid: { display: true },
        title: { display: true, text: widget.xAxisField, align: "center" },
        ticks: {
          font: { size: 14, weight: "400" },
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        grid: { display: true },
        ticks: {
          font: { size: 14, weight: "400" },
          callback: function (value) {
            if (value >= 1000) return value / 1000 + "k";
            return value;
          },
        },
        title: { display: true, text: widget.yAxisField },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <Scatter
        data={chartData}
        options={options}
        key={`${widget.id}-${widget.xAxisField}-${widget.yAxisField}`}
      />
    </div>
  );
}

