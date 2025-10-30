import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./src/App.jsx";
import "./src/index.css";
import { store } from "./src/stores";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
