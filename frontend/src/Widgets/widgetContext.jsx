import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const WidgetContext = createContext();

export const WidgetProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isDashboardConfigured, setIsDashboardConfigured] = useState(false);

  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem("dashboard_widgets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("dashboard_widgets", JSON.stringify(widgets));
  }, [widgets]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/orders");

        console.log("🟢 API ORDERS:", res.data);

        setOrders(res.data);

        
        localStorage.setItem("dashboard_orders", JSON.stringify(res.data));
      } catch (err) {
        console.error("🔴 API failed, loading from localStorage");

        // 🧯 fallback
        const cached = JSON.parse(
          localStorage.getItem("dashboard_orders") || "[]"
        );
        setOrders(cached);
      }
    };

    fetchOrders();
  }, []);

  return (
    <WidgetContext.Provider
      value={{
        orders,
        setOrders,
         isDashboardConfigured,
         setIsDashboardConfigured,
        widgets,
        setWidgets,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => useContext(WidgetContext);
