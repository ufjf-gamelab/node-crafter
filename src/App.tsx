import { Sidebar } from "@/components/layout/sidebar";
import { TaskBar } from "./components/layout/task-bar";
import { AsideNodeProperties } from "@/components/layout/aside-node-properties";
import { DiagramCanvas } from "@/features/workspace/diagram-canvas";
import { WorkspaceChrome } from "@/features/workspace/workspace-chrome";
import "@/config/i18n";

function App() {
  return (
    <div className="relative">
      <Sidebar />
      <AsideNodeProperties />
      <TaskBar />
      <WorkspaceChrome />
      <DiagramCanvas />
    </div>
  );
}

export default App;
