import { downloadFile } from "@/utils/download-file";

export function downloadJson(data: unknown, fileName: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadFile(blob, fileName);
}
