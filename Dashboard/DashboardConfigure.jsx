import React from "react";
import { Rnd } from "react-rnd";
import { HiOutlineCog, HiOutlineTrash } from "react-icons/hi";

import KPIWidget from "../../Widgets/KPIwidget.jsx";
import DeleteConfirmModal from "../../common/DeleteConfirmModal.jsx";
import { useNavigate } from "react-router-dom";
import BarChartWidget from "../../Widgets/barChartWidget.jsx";
import LineChartWidget from "../../Widgets/lineChartWidget.jsx";
import AreaChartWidget from "../../Widgets/AreaChartWidget.jsx";
import ScatteredChartWidget from "../../Widgets/ScatteredChartWidget.jsx";
import PieChartWidget from "../../Widgets/pieChartWidget.jsx";
import TableChartWidget from "../../Widgets/tableWidget.jsx";
import KPIConfigPanel from "../../configPanel/KPIpanel.jsx";
import BarConfigPanel from "../../configPanel/BarChartPanel.jsx";
import LineConfigPanel from "../../configPanel/lineChartPanel.jsx";
import AreaConfigPanel from "../../configPanel/AreaChartPanel.jsx";
import PieConfigPanel from "../../configPanel/piePanel.jsx";
import ScatteredConfigPanel from "../../configPanel/ScatteredChartPanel.jsx";
import TableConfigPanel from "../../configPanel/TablePanel.jsx";
import { useWidgetContext } from "../../Widgets/widgetContext.jsx";
import { useMemo } from "react";

import {
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart,
  LineChart,
  Grid3X3,
  Activity,
} from "lucide-react";

import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";

const ITEM_TYPES = {
  WIDGET: "WIDGET",
};

const GRID_GAP = 10.9;

// --------------------- DRAG ITEMS ------------------------
const SidebarItem = ({ name, type, icon, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.WIDGET,
    item: { widgetType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
      style={{ opacity: isDragging ? 0.8 : 2 }}
      onClick={onClick} // Added onClick here
    >
      {icon} {name}
    </div>
  );
};

// --------------------- MAIN -----------------------------

export default function DashboardEmptyGridUI() {
  // KPI Widgett config
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [selectedWidget, setSelectedWidget] = React.useState(null);
  const cellSize = 75.5;
  const [openCharts, setOpenCharts] = React.useState(true);
  const [openTables, setOpenTables] = React.useState(true);
  const [openKPIs, setOpenKPIs] = React.useState(true);
  const [showDeletePopup, setShowDeletePopup] = React.useState(false);
  const [widgetToDelete, setWidgetToDelete] = React.useState(null);
  const [activeConfig, setActiveConfig] = React.useState(null);

  const navigate = useNavigate();
  const { widgets, setWidgets, orders, setOrders,setIsDashboardConfigured } = useWidgetContext();
  const updateWidget = (updatedWidget) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((w) => (w.id === updatedWidget.id ? updatedWidget : w))
    );
  };
  React.useEffect(() => {
    setWidgets((prev) =>
      prev.map((w) => {
        // Only assign position if missing
        if (w.row == null || w.col == null) {
          const { row, col } = findNextFreePosition(
            prev,
            w.width || 2,
            w.height || 2
          );
          return { ...w, row, col };
        }
        return w;
      })
    );
  }, []);

  console.log("GRID widgets:", widgets);

  console.log("DASHBOARD ORDERS FROM CONTEXT:", orders);

  const ordersWithDuration = useMemo(() => {
    return orders.map((o) => ({
      ...o,
      duration: o.orderDate
        ? Math.round((Date.now() - new Date(o.orderDate)) / 86400000)
        : 0,
    }));
  }, [orders]);
  console.log("ORDERS WITH DURATION:", ordersWithDuration);

  function findNextFreePosition(widgets, width, height) {
    const maxCols = 12;
    for (let row = 0; row < 100; row++) {
      for (let col = 0; col <= maxCols - width; col++) {
        const overlapping = widgets.some(
          (w) =>
            w.row < row + height &&
            w.row + w.height > row &&
            w.col < col + width &&
            w.col + w.width > col
        );
        if (!overlapping) return { row, col };
      }
    }
    return { row: 0, col: 0 };
  }

  const handleConfigPanels = (updatedWidget) => {
    const fixedWidget = {
      ...updatedWidget,
      width: Math.min(Math.max(1, Math.round(updatedWidget.width)), 12),
      height: Math.max(1, Math.round(updatedWidget.height)),
    };

    setWidgets((prev) =>
      prev.map((w) => (w.id === fixedWidget.id ? fixedWidget : w))
    );

    setActiveConfig(null);
  };

  // Drop handling on grid
  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPES.WIDGET,
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      const gridRect = document
        .getElementById("canvas-grid")
        ?.getBoundingClientRect();

      if (!offset || !gridRect) return;

      // Default widget size
      let width = 6;
      let height = 4;

      if (item.widgetType === "KPI") {
        width = 2;
        height = 1;
      }

      if (
        item.widgetType === "BAR" ||
        item.widgetType === "LINE" ||
        item.widgetType === "PIE" ||
        item.widgetType === "AREA" ||
        item.widgetType === "SCATTER" ||
        item.widgetType === "TABLE"
      ) {
        width = 6;
        height = 4;
      }

      const position = findNextFreePosition(widgets, width, height);

      const row = position.row ?? 0;
      let col = position.col ?? 0; 

      // clamp inside grid
      col = Math.min(col, 12 - width);

      console.log("Dropped widget:", item.widgetType, "row:", row, "col:", col);

      setWidgets((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: item.widgetType,
          row,
          col,
          width,
          height,
          title: "Untitled",

          ...(item.widgetType === "PIE"
            ? {
                categoryField: "status",
                valueField: "totalAmount",
              }
            : {
                xAxisField: "product",
                yAxisField: "totalAmount",
              }),
        },
      ]);
    },
  }));

  return (
    <>
      <div className="w-full h-screen bg-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="w-full bg-white shadow-sm p-4 flex items-center gap-4 border-b">
          <button
            className="text-xl cursor-pointer"
            onClick={() => navigate("/")}
          >
            ←
          </button>

          <div>
            <h2 className="text-lg font-semibold">Configure dashboard</h2>
            <p className="text-sm text-gray-500">
              Configure your dashboard to start viewing analytics
            </p>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-72 bg-white border-r p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Show data for
            </h3>
            <select className="w-full border rounded-md p-2 text-sm mb-6">
              <option>All time</option>
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>

            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Widget library
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Drag and drop to your canvas
            </p>

            {/* Charts */}
            <div className="border rounded-lg mb-4">
              <button
                className="w-full flex justify-between items-center p-3 text-left font-medium"
                onClick={() => setOpenCharts(!openCharts)}
              >
                Charts{" "}
                {openCharts ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openCharts && (
                <div className="border-t p-2 space-y-2">
                  <SidebarItem
                    name="Bar Chart"
                    type="BAR"
                    icon={<BarChart2 size={18} />}
                    onClick={() => navigate("/widget-configure")} // Fixed typo here
                  />

                  <SidebarItem
                    name="Line Chart"
                    type="LINE"
                    icon={<LineChart size={18} />}
                    onClick={() => navigate("/widget-configure")}
                  />
                  <SidebarItem
                    name="Pie Chart"
                    type="PIE"
                    icon={<PieChart size={18} />}
                    onClick={() => navigate("/widget-configure")}
                  />
                  <SidebarItem
                    name="Area Chart"
                    type="AREA"
                    icon={<BarChart2 size={18} />}
                    onClick={() => navigate("/widget-configure")}
                  />
                  <SidebarItem
                    name="Scatter Plot"
                    type="SCATTER"
                    icon={<Activity size={18} />}
                    onClick={() => navigate("/widget-configure")}
                  />
                </div>
              )}
            </div>

            {/* Tables */}
            <div className="border rounded-lg mb-4">
              <button
                className="w-full flex justify-between items-center p-3 text-left font-medium"
                onClick={() => setOpenTables(!openTables)}
              >
                Tables{" "}
                {openTables ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openTables && (
                <div className="border-t p-2 space-y-2">
                  <SidebarItem
                    name="Table"
                    type="TABLE"
                    icon={<Grid3X3 size={18} />}
                    onClick={() => navigate("/widget-configure")}
                  />
                </div>
              )}
            </div>

            {/* KPIs */}
            <div className="border rounded-lg mb-4">
              <button
                className="w-full flex justify-between items-center p-3 text-left font-medium"
                onClick={() => setOpenKPIs(!openKPIs)}
              >
                KPIs{" "}
                {openKPIs ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openKPIs && (
                <div className="border-t p-2 space-y-2">
                  <SidebarItem
                    name="KPI Value"
                    type="KPI"
                    icon={<Activity size={18} />}
                    onClick={() => navigate("/widget-configure")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Grid Canvas */}
          <div className="flex-1 flex flex-col p-6 bg-gray-100">
            <div
              id="canvas-grid"
              ref={drop}
              className="grid grid-cols-12 gap-3 flex-1 overflow-auto relative"
              style={{ minHeight: "2000px" }}
            >
              {/* Background grid */}
              <div className="absolute inset-0 grid grid-cols-12 gap-3 pointer-events-none">
                {Array.from({ length: 1200 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded" />
                ))}
              </div>

              <div className="relative z-10 col-span-12">
                {/* DROPPED WIDGETS */}
                {widgets.map((w) => {
                  console.log("STEP 3 | RENDER WIDGET:", w);
                  console.log("Widget position:", w.id, w.row, w.col);
                  return (
                    <Rnd
                      key={w.id}
                      size={{
                        width: (w.width ?? 2) * cellSize - GRID_GAP,
                        height: (w.height ?? 2) * cellSize - GRID_GAP,
                      }}
                      default={{
                        x: (w.col ?? 0) * cellSize,
                        y: (w.row ?? 0) * cellSize,
                      }}
                      position={{
                        x: (w.col ?? 0) * cellSize, // default 0
                        y: (w.row ?? 0) * cellSize, // default 0
                      }}
                      bounds="#canvas-grid"
                      dragGrid={[cellSize, cellSize]}
                      enableUserSelectHack={false}
                      enableResizing={false}
                      onDragStop={(e, data) => {
                        const widgetPxWidth = w.width * cellSize - GRID_GAP; // account for gap
                        const maxGridPx = 12 * cellSize - GRID_GAP;

                        // clamp x so widget doesn't exceed grid
                        const clampedX = Math.min(
                          Math.max(0, data.x),
                          maxGridPx - widgetPxWidth
                        );
                        const newCol = Math.round(clampedX / cellSize);
                        const newRow = Math.max(
                          0,
                          Math.round(data.y / cellSize)
                        );

                        setWidgets((prev) =>
                          prev.map((obj) =>
                            obj.id === w.id
                              ? { ...obj, col: newCol, row: newRow }
                              : obj
                          )
                        );
                      }}
                      className="absolute bg-white shadow border rounded-md p-3 overflow-hidden"
                    >
                      {/* Top row: Title + buttons */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-lg font-medium ">
                          {w.title || "Untitled"}
                        </div>

                        <div className="flex gap-3">
                          {!isConfigOpen && (
                            <>
                              <HiOutlineTrash
                                className="text-red-400 cursor-pointer"
                                size={16}
                                onClick={() => {
                                  setWidgetToDelete(w); // store which widget to delete
                                  setShowDeletePopup(true); // show confirmation popup
                                }}
                              />
                              <HiOutlineCog
                                className="text-green-600 cursor-pointer"
                                size={16}
                                onClick={() =>
                                  setActiveConfig({
                                    widget: w,
                                    type: w.type,
                                  })
                                }
                              />
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          {w.type === "BAR" && (
                            <BarChartWidget
                              widget={w}
                              orders={ordersWithDuration}
                            />
                          )}

                          {w.type === "LINE" && (
                            <LineChartWidget
                              widget={w}
                              orders={ordersWithDuration}
                            />
                          )}

                          {w.type === "AREA" && (
                            <AreaChartWidget
                              widget={w}
                              orders={ordersWithDuration}
                            />
                          )}

                          {w.type === "SCATTER" && (
                            <ScatteredChartWidget
                              widget={w}
                              orders={ordersWithDuration}
                            />
                          )}

                          {w.type === "PIE" && (
                            <PieChartWidget
                              widget={w}
                              orders={ordersWithDuration} 
                            />
                          )}

                          {w.type === "TABLE" && (
                            <TableChartWidget
                              widget={w}
                              data={ordersWithDuration} 
                            />
                          )}

                          {w.type === "KPI" && (
                            <KPIWidget
                              widget={w}
                              data={ordersWithDuration} 
                            />
                          )}
                        </div>
                      </div>
                    </Rnd>
                  );
                })}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-100 border-t p-4 flex justify-end gap-3 z-20">
              <button className="px-4 py-2 border rounded-md text-gray-700">
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={() => {
                  setIsDashboardConfigured(true);
                  toast.success("Dashboard saved successfully!");
                  navigate("/"); // Home page
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HiOutLine Icons Open Panel */}

      <KPIConfigPanel
        isOpen={activeConfig?.type === "KPI"}
        widget={activeConfig?.widget}
        onClose={() => setActiveConfig(null)}
        onSave={handleConfigPanels}
      />

      <BarConfigPanel
        isOpen={activeConfig?.type === "BAR"}
        widget={activeConfig?.widget}
        onClose={() => setActiveConfig(null)}
        onSave={handleConfigPanels}
      />

      <LineConfigPanel
        isOpen={activeConfig?.type === "LINE"}
        widget={activeConfig?.widget}
        onClose={() => setActiveConfig(null)}
        onSave={handleConfigPanels}
      />

      <AreaConfigPanel
        isOpen={activeConfig?.type === "AREA"}
        widget={activeConfig?.widget}
        onClose={() => setActiveConfig(null)}
        onSave={handleConfigPanels}
      />

      <PieConfigPanel
        isOpen={activeConfig?.type === "PIE"}
        widget={activeConfig?.widget}
        onClose={() => setActiveConfig(null)}
        onSave={handleConfigPanels}
      />

      <ScatteredConfigPanel
        isOpen={activeConfig?.type === "SCATTER"}
        widget={activeConfig?.widget}
        onClose={() => setActiveConfig(null)}
        onSave={handleConfigPanels}
      />

      <TableConfigPanel
        isOpen={activeConfig?.type === "TABLE"}
        widget={activeConfig?.widget}
        onClose={() => setActiveConfig(null)}
        onSave={handleConfigPanels}
      />

      <DeleteConfirmModal
        isOpen={showDeletePopup}
        title={widgetToDelete?.type}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={() => {
          setWidgets((prev) =>
            prev.filter((widget) => widget.id !== widgetToDelete.id)
          );
          setShowDeletePopup(false);
          toast.success("Done your widget has been removed!");
        }}
      />
    </>
  );
}

