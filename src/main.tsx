import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error logging for debugging blank screen
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global JS Error:", { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
};

console.log("MahmudGPT: Initializing app...");

const container = document.getElementById("root");
if (!container) {
  console.error("Critical Error: Root container not found!");
} else {
  try {
    const root = createRoot(container);
    root.render(<App />);
    console.log("MahmudGPT: App rendered successfully.");
  } catch (err) {
    console.error("MahmudGPT: Failed to render app:", err);
  }
}
