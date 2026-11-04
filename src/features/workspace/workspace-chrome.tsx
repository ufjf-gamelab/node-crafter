import React from "react";
import { useReactFlow } from "@xyflow/react";
import { ActionIcon, Button, Menu, Modal, TextInput } from "@mantine/core";
import { BiCopy, BiEdit, BiFile, BiFolder, BiPlus, BiSave, BiTrash, BiX } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { parseJsonFile } from "@/utils/parse-json-file";
import { ModalImportExport } from "@/features/modal-import-export";
import { HelpIntroduction } from "@/components/layout/help-introduction";
import { useSimulationContext } from "@/contexts/simulation-context";
import { useWorkspace } from "./workspace-provider.tsx";
import type { IWorkspace } from "./types.ts";

export const WorkspaceChrome: React.ComponentType = () => {
  const { t } = useTranslation();
  const flow = useReactFlow();
  const { loading } = useSimulationContext();
  const {
    workspace,
    status,
    createDiagram,
    duplicateDiagram,
    renameDiagram,
    closeDiagram,
    switchDiagram,
    exportDiagram,
    exportWorkspace,
    prepareWorkspaceImport,
    importDiagram,
    replaceWorkspace,
  } = useWorkspace();

  const [renameOpened, setRenameOpened] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState("");
  const [renameError, setRenameError] = React.useState("");
  const [closeTargetId, setCloseTargetId] = React.useState<string | null>(null);
  const [pendingWorkspace, setPendingWorkspace] = React.useState<IWorkspace | null>(null);
  const [chartsOpened, setChartsOpened] = React.useState(false);

  const diagramInputRef = React.useRef<HTMLInputElement>(null);
  const workspaceInputRef = React.useRef<HTMLInputElement>(null);
  const activeTabRef = React.useRef<HTMLButtonElement>(null);
  const disabled = loading;

  const activeDiagram = workspace.diagrams[workspace.activeDiagramId];
  const closeTargetName = closeTargetId ? workspace.diagrams[closeTargetId]?.name ?? "" : "";

  React.useEffect(() => {
    if (renameOpened && activeDiagram) {
      setRenameValue(activeDiagram.name);
      setRenameError("");
    }
  }, [renameOpened, activeDiagram]);

  React.useEffect(() => {
    activeTabRef.current?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [workspace.activeDiagramId]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "s") return;
      event.preventDefault();
      if (event.shiftKey) exportDiagram();
      else exportWorkspace();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [exportDiagram, exportWorkspace]);

  async function handleDiagramFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const raw = await parseJsonFile(file);
      importDiagram(raw, file.name);
    } catch (error) {
      notifications.show({ message: t("workspace.notifications.importFailed", { message: getErrorMessage(error) }), color: "red" });
    }
  }

  async function handleWorkspaceFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const raw = await parseJsonFile(file);
      const importedWorkspace = prepareWorkspaceImport(raw);
      setPendingWorkspace(importedWorkspace);
    } catch (error) {
      notifications.show({ message: t("workspace.notifications.importFailed", { message: getErrorMessage(error) }), color: "red" });
    }
  }

  function submitRename() {
    if (!renameValue.trim()) {
      setRenameError(t("workspace.errors.emptyName"));
      return;
    }

    const finalName = renameDiagram(renameValue);
    setRenameOpened(false);
    notifications.show({ message: t("workspace.notifications.diagramRenamed", { name: finalName }), color: "green" });
  }

  function confirmClose() {
    if (!closeTargetId) return;
    closeDiagram(closeTargetId);
    setCloseTargetId(null);
  }

  function confirmWorkspaceImport() {
    if (!pendingWorkspace) return;
    replaceWorkspace(pendingWorkspace);
    setPendingWorkspace(null);
  }

  function clearCurrentDiagram() {
    flow.setNodes([]);
    flow.setEdges([]);
  }

  const tabs = Object.entries(workspace.diagrams).map(([id, diagram]) => ({ id, name: diagram.name }));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-10 z-30 flex items-center select-none bg-white border-b border-slate-200">
        <div className="flex h-full w-48 shrink-0 items-center gap-2 px-3 border-r border-slate-200 bg-slate-50/60">
          <img src="logo/md.png" alt="Node Crafter" className="h-7 w-auto pointer-events-none" draggable={false} />
        </div>

        <div className="flex items-center gap-1 px-2">
          <Menu shadow="md" width={220}>
            <Menu.Target>
              <Button size="compact-sm" variant="subtle" color="gray" leftSection={<BiFolder />}>{t("workspace.menuFile")}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<BiPlus />} onClick={createDiagram} disabled={disabled}>{t("workspace.newDiagram")}</Menu.Item>
              <Menu.Item leftSection={<BiFile />} onClick={() => diagramInputRef.current?.click()} disabled={disabled}>{t("workspace.importDiagram")}</Menu.Item>
              <Menu.Item leftSection={<BiFile />} onClick={exportDiagram} disabled={disabled}>{t("workspace.exportDiagram")}</Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<BiFile />} onClick={() => workspaceInputRef.current?.click()} disabled={disabled}>{t("workspace.importWorkspace")}</Menu.Item>
              <Menu.Item leftSection={<BiFile />} onClick={exportWorkspace} disabled={disabled}>{t("workspace.exportWorkspace")}</Menu.Item>
              <Menu.Item leftSection={<BiSave />} onClick={exportWorkspace} disabled={disabled}>{t("workspace.saveWorkspace")}</Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<BiFile />} onClick={() => setChartsOpened(true)}>{t("workspace.exportCharts")}</Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button size="compact-sm" variant="subtle" color="gray" leftSection={<BiEdit />}>{t("workspace.menuEdit")}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<BiCopy />} onClick={duplicateDiagram} disabled={disabled || !activeDiagram}>{t("workspace.duplicateDiagram")}</Menu.Item>
              <Menu.Item leftSection={<BiEdit />} onClick={() => setRenameOpened(true)} disabled={disabled || !activeDiagram}>{t("workspace.renameDiagram")}</Menu.Item>
              <Menu.Item leftSection={<BiX />} color="red" onClick={() => activeDiagram && setCloseTargetId(workspace.activeDiagramId)} disabled={disabled || !activeDiagram}>{t("workspace.closeDiagram")}</Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<BiTrash />} onClick={clearCurrentDiagram} disabled={disabled}>{t("workspace.clearDiagram")}</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <div className="ml-auto flex items-center gap-3 pr-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              status === "error" ? "bg-red-50 text-red-600" : status === "saving" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
            }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status === "error" ? "bg-red-500" : status === "saving" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
            {status === "saving" ? t("workspace.saving") : status === "error" ? t("workspace.saveError") : t("workspace.saved")}
          </span>
          <HelpIntroduction />
        </div>
      </header>

      <nav className="fixed top-10 left-48 right-0 h-9 z-20 flex items-end gap-1 px-2 pt-1 bg-slate-50 border-b border-slate-200 overflow-x-auto select-none" aria-label={t("workspace.tabListLabel")}>
        {tabs.map((tab) => {
          const isActive = tab.id === workspace.activeDiagramId;
          return (
            <div key={tab.id} className="flex items-center shrink-0">
              <button
                ref={isActive ? activeTabRef : undefined}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => !disabled && switchDiagram(tab.id)}
                onDoubleClick={() => !disabled && setRenameOpened(true)}
                className={`flex items-center gap-1.5 max-w-[180px] px-3 py-1.5 text-[13px] rounded-t-md border border-b-0 transition-colors ${
                  isActive
                    ? "bg-white border-slate-200 text-slate-900 font-medium shadow-[inset_0_2px_0_0_#3b82f6]"
                    : "bg-transparent border-transparent text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"
                }`}>
                <BiFile className={`shrink-0 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                <span className="truncate">{tab.name}</span>
              </button>
              <ActionIcon
                size="xs"
                variant="subtle"
                color="gray"
                disabled={disabled}
                aria-label={t("workspace.closeTab", { name: tab.name })}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!disabled) setCloseTargetId(tab.id);
                }}>
                <BiX />
              </ActionIcon>
            </div>
          );
        })}

        <ActionIcon
          size="sm"
          variant="default"
          color="gray"
          disabled={disabled}
          onClick={createDiagram}
          aria-label={t("workspace.addTab")}
          className="mb-1 border-dashed border-slate-300 text-slate-500 hover:bg-white">
          <BiPlus />
        </ActionIcon>
      </nav>

      <input ref={diagramInputRef} type="file" accept=".json,.txt,application/json,text/plain" className="hidden" onChange={handleDiagramFileChange} />
      <input ref={workspaceInputRef} type="file" accept=".json,.txt,application/json,text/plain" className="hidden" onChange={handleWorkspaceFileChange} />

      <Modal opened={renameOpened} onClose={() => setRenameOpened(false)} title={t("workspace.renameTitle")} centered>
        <div className="flex flex-col gap-3">
          <TextInput
            label={t("workspace.renameLabel")}
            value={renameValue}
            onChange={(event) => setRenameValue(event.currentTarget.value)}
            error={renameError}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitRename();
            }}
          />
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setRenameOpened(false)}>{t("workspace.cancel")}</Button>
            <Button onClick={submitRename}>{t("workspace.confirm")}</Button>
          </div>
        </div>
      </Modal>

      <Modal opened={closeTargetId !== null} onClose={() => setCloseTargetId(null)} title={t("workspace.closeTitle")} centered>
        <div className="flex flex-col gap-4">
          <p>{t("workspace.closeMessage", { name: closeTargetName })}</p>
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setCloseTargetId(null)}>{t("workspace.cancel")}</Button>
            <Button color="red" onClick={confirmClose}>{t("workspace.confirm")}</Button>
          </div>
        </div>
      </Modal>

      <Modal opened={pendingWorkspace !== null} onClose={() => setPendingWorkspace(null)} title={t("workspace.importWorkspaceTitle")} centered>
        <div className="flex flex-col gap-4">
          <p>{t("workspace.importWorkspaceMessage", { currentCount: Object.keys(workspace.diagrams).length, importedCount: pendingWorkspace ? Object.keys(pendingWorkspace.diagrams).length : 0 })}</p>
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setPendingWorkspace(null)}>{t("workspace.cancel")}</Button>
            <Button color="red" onClick={confirmWorkspaceImport}>{t("workspace.replace")}</Button>
          </div>
        </div>
      </Modal>

      <ModalImportExport opened={chartsOpened} close={() => setChartsOpened(false)} />
    </>
  );
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
