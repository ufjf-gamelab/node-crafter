import { Sidebar } from "@/components/layout/sidebar";
import { TaskBar } from "./components/layout/task-bar";
import { AsideNodeProperties } from "@/components/layout/aside-node-properties";
import { HelpIntroduction } from "./components/layout/help-introduction";
import { DiagramCanvas } from "@/features/workspace/diagram-canvas";
import "@/config/i18n";

function App() {
  return (
    <div className="relative">
      <Sidebar />
      <AsideNodeProperties />
      <TaskBar />
      <HelpIntroduction />
      <DiagramCanvas />
    </div>
  );
}

export default App;
