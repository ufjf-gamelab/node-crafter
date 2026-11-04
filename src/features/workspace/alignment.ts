import type { INode } from "@/config/types";

export type IAlignmentMode = "left" | "right" | "top" | "bottom" | "centerHorizontal" | "centerVertical";

export function alignNodes(nodes: INode[], mode: IAlignmentMode): INode[] {
  const selected = nodes.filter((node) => node.selected);
  if (selected.length < 2) return nodes;

  // Obter dimensões estimadas ou medidas de cada nó
  const items = selected.map((node) => {
    const width = node.measured?.width ?? 160;
    const height = node.measured?.height ?? 80;
    return {
      node,
      x: node.position.x,
      y: node.position.y,
      width,
      height,
    };
  });

  let targetValue = 0;

  switch (mode) {
    case "left": {
      targetValue = Math.min(...items.map((i) => i.x));
      break;
    }
    case "right": {
      targetValue = Math.max(...items.map((i) => i.x + i.width));
      break;
    }
    case "top": {
      targetValue = Math.min(...items.map((i) => i.y));
      break;
    }
    case "bottom": {
      targetValue = Math.max(...items.map((i) => i.y + i.height));
      break;
    }
    case "centerHorizontal": {
      const minX = Math.min(...items.map((i) => i.x));
      const maxX = Math.max(...items.map((i) => i.x + i.width));
      targetValue = (minX + maxX) / 2;
      break;
    }
    case "centerVertical": {
      const minY = Math.min(...items.map((i) => i.y));
      const maxY = Math.max(...items.map((i) => i.y + i.height));
      targetValue = (minY + maxY) / 2;
      break;
    }
  }

  const updatedIds = new Set(selected.map((n) => n.id));

  return nodes.map((node) => {
    if (!updatedIds.has(node.id)) return node;
    const width = node.measured?.width ?? 160;
    const height = node.measured?.height ?? 80;
    const currentX = node.position.x;
    const currentY = node.position.y;

    let nextX = currentX;
    let nextY = currentY;

    switch (mode) {
      case "left":
        nextX = targetValue;
        break;
      case "right":
        nextX = targetValue - width;
        break;
      case "top":
        nextY = targetValue;
        break;
      case "bottom":
        nextY = targetValue - height;
        break;
      case "centerHorizontal":
        nextX = targetValue - width / 2;
        break;
      case "centerVertical":
        nextY = targetValue - height / 2;
        break;
    }

    if (nextX === currentX && nextY === currentY) return node;

    return {
      ...node,
      position: { x: nextX, y: nextY },
    };
  });
}
