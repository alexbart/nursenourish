import type { StorageProvider } from "./storage.interface.js";

export class CloudinaryStorage implements StorageProvider {
  async upload(file: unknown): Promise<string> {
    throw new Error("Cloudinary not configured");
  }

  async delete(url: string): Promise<void> {
    throw new Error("Cloudinary not configured");
  }
}
