import ReactDOM from "react-dom/client";
import { WidgetProvider } from "./Widgets/widgetContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WidgetProvider>
    <App />
  </WidgetProvider>
);
