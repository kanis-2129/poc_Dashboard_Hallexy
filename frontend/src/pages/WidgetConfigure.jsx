import React, { useState } from "react";
import KPIpanel from "../configPanel/KPIpanel.jsx";

import TableWidget from "../configPanel/TablePanel.jsx";
import BarChartPanel from "../configPanel/BarChartPanel.jsx";

import PieConfigPanel from "../configPanel/piePanel.jsx";
import LineChartPanel from "../configPanel/lineChartPanel.jsx";

import AreaChartPanel from "../configPanel/AreaChartPanel.jsx";


import ScatteredChartPanel from "../configPanel/ScatteredChartPanel.jsx";
import { useNavigate } from "react-router-dom";
import { useWidgetContext } from "../Widgets/widgetContext";

import {
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  Grid3X3,
} from "lucide-react";

const WidgetConfigure = () => {
  const [openKPIs, setOpenKPIs] = useState(true);
  const [openCharts, setOpenCharts] = useState(true);
  const [openTables, setOpenTables] = useState(true);
  const [openText, setOpenText] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const navigate = useNavigate();
 

  const { widgets, setWidgets, orders, setOrders } = useWidgetContext();
   console.log("STEP 2 | DASHBOARD ORDERS FROM CONTEXT:", orders);

  const widgetTypeMap = {
    barChart: "BAR",
    lineChart: "LINE",
    AreaChart: "AREA",
    scatteredChart: "SCATTER",
    pieChart: "PIE",
    table: "TABLE",
    kpi: "KPI",
  };

  const handleSaveWidget = (data) => {
    const newWidget = {
      id: Date.now(),
     type: widgetTypeMap[selectedWidget] || selectedWidget.toUpperCase(),
      ...data,
    };

    setWidgets((prev) => [...prev, newWidget]);

    setIsConfigOpen(false);
    setSelectedWidget(null);
    navigate("/dashboard-configure");
  };

 
  const SidebarItem = ({ name, icon, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm"
    >
      {icon}
      <span>{name}</span>
    </button>
  );

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div className="w-full bg-white shadow-sm p-4 flex items-center gap-4 border-b">
        <button className="text-xl"
         onClick={() => navigate("/dashboard-configure")}>←</button>
        <div>
          <h2 className="text-lg font-semibold">Configure dashboard</h2>
          <p className="text-sm text-gray-500">
            Configure your dashboard to start viewing analytics
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-72 bg-white border-r p-4 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Show data for
          </h3>

          {/* Time Filter */}
          <div className="relative mb-6">
            <select className="w-full border rounded-md p-2 text-sm appearance-none bg-white">
              <option>Last 30 days</option>
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-3 text-gray-500"
              size={16}
            />
          </div>

          {/* Widget Library */}
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Widget library
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            Click to configure widget
          </p>

          {/* Charts */}
          <div className="border rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-3 font-medium"
              onClick={() => setOpenCharts(!openCharts)}
            >
              Charts{" "}
              {openCharts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {openCharts && (
              <div className="border-t p-2 space-y-2">
                <SidebarItem
                  name="Bar Chart"
                  icon={<BarChart2 size={18} />}
                  onClick={() => {
                    setSelectedWidget("barChart"); 
                    setIsConfigOpen(true);
                  }}
                />

                <SidebarItem
                  name="Line Chart"
                  icon={<LineChart size={18} />}
                  onClick={() => {
                    setSelectedWidget("lineChart"); 
                    setIsConfigOpen(true);
                  }}
                />
                <SidebarItem
                  name="Pie Chart"
                  icon={<PieChart size={18} />}
                  onClick={() => {
                    setSelectedWidget("pieChart");
                    setIsConfigOpen(true);
                  }}
                />
                <SidebarItem
                  name="Area Chart"
                  icon={<BarChart2 size={18} />}
                  onClick={() => {
                    setSelectedWidget("AreaChart");
                    setIsConfigOpen(true);
                  }}
                />
                <SidebarItem
                  name="Scatter Plot"
                  icon={<Activity size={18} />}
                  onClick={() => {
                    setSelectedWidget("scatteredChart"); 
                    setIsConfigOpen(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* Tables */}
          <div className="border rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-3 font-medium"
              onClick={() => setOpenTables(!openTables)}
            >
              Tables{" "}
              {openTables ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {openTables && (
              <div className="border-t p-2 space-y-2">
                <SidebarItem
                  name="Table"
                  icon={<Grid3X3 size={18} />}
                  onClick={() => {
                    setSelectedWidget("table");
                    setIsConfigOpen(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* KPIs */}
          <div className="border rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-3 font-medium"
              onClick={() => setOpenKPIs(!openKPIs)}
            >
              KPIs{" "}
              {openKPIs ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {openKPIs && (
              <div className="border-t p-2 space-y-2">
                <SidebarItem
                  name="KPI Value"
                  icon={<Activity size={18} />}
                  onClick={() => {
                    setSelectedWidget("kpi");
                    setIsConfigOpen(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* Text */}
          <div className="border rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-3 font-medium"
              onClick={() => setOpenText(!openText)}
            >
              Text{" "}
              {openText ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {openText && (
              <div className="border-t p-2 space-y-2">
                <SidebarItem
                  name="Text"
                  icon={<Grid3X3 size={18} />}
                  onClick={() => setIsConfigOpen(true)}
                />
              </div>
            )}
          </div>
        </div>
        {/* EMPTY CANVAS */}
        {/* EMPTY CANVAS */}
        {/* <div className="flex-1 relative p-6 grid grid-cols-4 gap-4 bg-gray-50 auto-rows-[180px]">
          {console.log("Rendering widgets:", widgets)}

          {(Array.isArray(widgets) ? widgets : []).map((w) => {
            console.log(`Rendering widget of type: ${w.type}`); // Log widget type
            switch (w.type) {
              case "KPI":
                return <KPIWidget key={w.id} widget={w} />;

              case "BAR":
                return <BarChartWidget key={w.id} widget={w} />;

              case "LINE":
                return <LineChartWidget key={w.id} widget={w} />;

              case "AREA":
                return <AreaChartWidget key={w.id} widget={w} />;

              case "SCATTER":
                return <ScatteredChartWidget key={w.id} widget={w} />;

              case "PIE":
                return <PieChartWidget key={w.id} widget={w} />;

              case "TABLE":
                return <TableWidget key={w.id} widget={w} />;

              default:
                return null;
            }
          })}
        </div> */}

        {/* Widget Config Panels */}
        {/* Bar chart config */}

        {isConfigOpen && selectedWidget === "barChart" && (
          <BarChartPanel
            isOpen={true}
            widget={{ type: "barChart" }}
            onClose={() => {
              setIsConfigOpen(false);
              setSelectedWidget(null);
            }}
            onSave={handleSaveWidget}
          />
        )}

        {/* Line chart config */}

        {isConfigOpen && selectedWidget === "lineChart" && (
          <LineChartPanel
            isOpen={true}
            widget={{ type: "lineChart" }}
            onClose={() => {
              setIsConfigOpen(false);
              setSelectedWidget(null);
            }}
            onSave={handleSaveWidget}
          />
        )}

        {/* Area chart config */}

        {isConfigOpen && selectedWidget === "AreaChart" && (
          <AreaChartPanel
            isOpen={true}
            widget={{ type: "AreaChart" }}
            onClose={() => {
              setIsConfigOpen(false);
              setSelectedWidget(null);
            }}
            onSave={handleSaveWidget}
          />
        )}

        {/* Scattered chart config */}

        {isConfigOpen && selectedWidget === "scatteredChart" && (
          <ScatteredChartPanel
            isOpen={true}
            widget={{ type: "scatteredChart" }}
            onClose={() => {
              setIsConfigOpen(false);
              setSelectedWidget(null);
            }}
            onSave={handleSaveWidget}
          />
        )}

        {/* pie chart right config panel */}
        {isConfigOpen && selectedWidget === "pieChart" && (
          <PieConfigPanel
            isOpen={true}
            widget={{ type: "pieChart" }}
            onClose={() => {
              setIsConfigOpen(false);
              setSelectedWidget(null);
            }}
            onSave={handleSaveWidget}
          />
          
        )}
        

        {/* Table Right config  */}
        {isConfigOpen && selectedWidget === "table" && (
          <TableWidget
            isOpen={true}
            widget={{ type: "table" }}
            onClose={() => {
              setIsConfigOpen(false);
              setSelectedWidget(null);
            }}
            onSave={handleSaveWidget}
          />
        )}

        {/* KPI Right config  */}
        {isConfigOpen && selectedWidget === "kpi" && (
          <KPIpanel
            isOpen={true}
            widget={{ type: "kpi" }}
            onClose={() => {
              setIsConfigOpen(false);
              setSelectedWidget(null);
            }}
            onSave={handleSaveWidget}
          />
        )}
      </div>
    </div>
  );
};

export default WidgetConfigure;

