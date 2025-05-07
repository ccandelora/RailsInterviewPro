import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import Prism from "prismjs";
import "prismjs/components/prism-ruby";

// Initialize Prism.js for syntax highlighting
document.addEventListener("DOMContentLoaded", () => {
  Prism.highlightAll();
});

createRoot(document.getElementById("root")!).render(<App />);
