import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { useWidgetContext } from "../Widgets/widgetContext";

import BarChartWidget from "../Widgets/barChartWidget";
import LineChartWidget from "../Widgets/lineChartWidget";
import AreaChartWidget from "../Widgets/AreaChartWidget";
import PieChartWidget from "../Widgets/pieChartWidget";
import ScatterPlotWidget from "../Widgets/ScatteredChartWidget";
import TableWidget from "../Widgets/tableWidget";
import KPIWidget from "../Widgets/KPIwidget";

const Home = () => {
  const { widgets, isDashboardConfigured, orders } = useWidgetContext();

  /* -------- screen width tracking -------- */
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const isMobile = width < 640;

  /* -------- split widgets -------- */
  const kpiWidgets = widgets.filter((w) => w.type === "KPI");
  const otherWidgets = widgets.filter((w) => w.type !== "KPI");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Orders</h1>
        <p className="text-gray-500 mt-1">
          View and manage customer orders and details
        </p>
      </div>

      <div className="flex gap-10 mt-6 border-b pb-2">
        <Link
          to="/"
          className="text-green-600 border-b-2 border-green-500 pb-2"
        >
          Dashboard
        </Link>
        <Link to="/create-order" className="text-gray-600 font-semibold">
          Table
        </Link>
      </div>

      {!isDashboardConfigured ? (
        /* NOT CONFIGURED */
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="mb-2 text-lg">Dashboard not configured</p>
          <p className="text-gray-500 text-xs mb-4">
            Configure your dashboard to start viewing analytics
          </p>

          <Link
            to="/dashboard-configure"
            className="border border-green-400 text-green-400 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-50"
          >
            <FiSettings />
            Configure Dashboard
          </Link>
        </div>
      ) : (
        <>
          {/* ================= KPI SECTION (ALWAYS TOP) ================= */}
          {kpiWidgets.length > 0 && (
            <div
              className="
    grid gap-6 mt-4
    grid-cols-1
    sm:grid-cols-6
    lg:grid-cols-12
  "
            >
              {kpiWidgets.map((w) => (
                <div
                  key={w.id}
                  className={`
  bg-white border rounded-md shadow p-4
  ${
    isDesktop
      ? "col-span-3" 
      : isTablet
      ? "col-span-3"
      : "col-span-1"
  }
`}
                >
                  <h3 className="font-semibold mb-2">
                    {w.title || "Untitled"}
                  </h3>
                  <KPIWidget widget={w} data={orders} />
                </div>
              ))}
            </div>
          )}

          {/* ================= OTHER WIDGETS ================= */}
          <div
            className="
              grid gap-6 mt-6
              grid-cols-1
              sm:grid-cols-6
              lg:grid-cols-12
              
            "
          >
            {otherWidgets.map((w) => (
              <div
                key={w.id}
                className={`
                  bg-white border rounded-md shadow p-4
                  flex flex-col h-full
                  ${isDesktop ? "" : isTablet ? "col-span-6" : "col-span-1"}
                `}
                style={
                  isDesktop
                    ? {
                        gridColumn: `${w.col + 1} / span ${w.width}`,
                        gridRow: `${w.row + 1} / span ${w.height}`,
                      }
                    : {}
                }
              >
                <h3 className="font-semibold mb-2">{w.title || "Untitled"}</h3>

                {w.type === "BAR" && (
                  <BarChartWidget widget={w} orders={orders} />
                )}
                {w.type === "LINE" && (
                  <LineChartWidget widget={w} orders={orders} />
                )}
                {w.type === "AREA" && (
                  <AreaChartWidget widget={w} orders={orders} />
                )}
                {w.type === "PIE" && (
                  <PieChartWidget widget={w} orders={orders} />
                )}
                {w.type === "SCATTER" && (
                  <ScatterPlotWidget widget={w} orders={orders} />
                )}
                {w.type === "TABLE" && <TableWidget widget={w} data={orders} />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

