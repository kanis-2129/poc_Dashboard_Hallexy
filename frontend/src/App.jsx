import "./index.css";
import WidgetConfigPanel from "./pages/WidgetConfigure";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WidgetProvider } from "./Widgets/widgetContext.jsx";

import DashboardConfigure from "./pages/Dashboard/DashboardConfigure.jsx";
import Home from "./common/home.jsx";
import CreateOrderEmpty from "./pages/CustomerOrder/CreateOrderEmpty.jsx";

function App() {
  return (
    <WidgetProvider>
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard-configure" element={<DashboardConfigure />} />
            <Route path="/create-order" element={<CreateOrderEmpty />} />
            <Route path="/widget-configure" element={<WidgetConfigPanel />} />
          </Routes>
        </DndProvider>
      </BrowserRouter>
    </WidgetProvider>
  );
}


export default App;
