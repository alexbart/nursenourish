export interface StorageConfig {
  provider: "local" | "cloudinary" | "s3";
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  local?: {
    uploadDir: string;
    baseUrl: string;
  };
}

export const storageConfig = (): StorageConfig => ({
  provider: (process.env.STORAGE_PROVIDER as StorageConfig["provider"]) || "local",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  local: {
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
    baseUrl: process.env.UPLOAD_BASE_URL || "/uploads",
  },
});