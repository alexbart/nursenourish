export interface CorsConfig {
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

export const corsConfig = (): CorsConfig => ({
  origin: process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  exposedHeaders: ["X-Request-Id"],
  credentials: true,
  maxAge: 86400,
});