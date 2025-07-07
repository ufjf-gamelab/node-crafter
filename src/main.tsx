import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import { MantineProvider } from "@mantine/core";
import { LayoutProvider } from "./contexts/layout-context.tsx";
import { mantineTheme } from "./config/mantine-theme.ts";
import { SimulationProvider } from "@/contexts/simulation-context.tsx";
import { Notifications } from "@mantine/notifications";

import App from "./App.tsx";

import "./assets/global.scss";
import "./assets/components.scss";
import "@xyflow/react/dist/style.css";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={mantineTheme} defaultColorScheme="light">
      <ReactFlowProvider>
        <LayoutProvider>
          <SimulationProvider>
            <App />
            <Notifications position="top-center" autoClose={5000} classNames={{ notification: "border border-gray-300 shadow-md" }} />
          </SimulationProvider>
        </LayoutProvider>
      </ReactFlowProvider>
    </MantineProvider>
  </StrictMode>
);
