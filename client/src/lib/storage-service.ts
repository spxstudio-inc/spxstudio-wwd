import { apiRequest } from "./queryClient";
import { StorageItem, InsertStorageItem } from "@shared/schema";

export async function createFolder(folderPath: string): Promise<StorageItem> {
  const response = await apiRequest("POST", "/api/storage/folders", { path: folderPath });
  return await response.json();
}

export async function uploadFile(file: File, path: string): Promise<StorageItem> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  const response = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }

  return await response.json();
}

export async function deleteStorageItem(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/storage/items/${id}`);
}

export async function getStorageUsage(): Promise<{ used: number, total: number }> {
  const response = await apiRequest("GET", "/api/storage/usage");
  return await response.json();
}
