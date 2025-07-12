import React, { createContext, useContext, useState, ReactNode } from "react";
import { NodeDoc } from "@/components/ui/node-doc";
import { INodeType } from "@/config/types";
import { Modal } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface IStateContextProps {
  isOpen: boolean;
  openDoc: (nodeType: INodeType) => void;
  closeDoc: () => void;
}

const DocumentationContent = createContext<IStateContextProps | undefined>(undefined);

interface UIStateProviderProps {
  children: ReactNode;
}

export const DocumentationProvider: React.ComponentType<UIStateProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [nodeType, setNodeType] = useState<INodeType | null>(null);

  function closeDoc() {
    setNodeType(null);
  }

  function openDoc(nodeType: INodeType) {
    setNodeType(nodeType);
  }

  return (
    <DocumentationContent.Provider value={{ isOpen: !!nodeType, openDoc, closeDoc }}>
      {children}

      <Modal
        size="xl"
        title={nodeType ? t(`nodeFullName.${nodeType}`) : ""}
        opened={!!nodeType}
        onClose={closeDoc}
        classNames={{ title: "text-3xl font-semibold" }}>
        {nodeType && <NodeDoc nodeType={nodeType} />}
      </Modal>
    </DocumentationContent.Provider>
  );
};

export const useDocumentationContext = (): IStateContextProps => {
  const context = useContext(DocumentationContent);
  if (context === undefined) {
    throw new Error("useUIState must be used within a LayoutProvider");
  }
  return context;
};
