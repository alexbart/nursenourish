export interface HelmetConfig {
  contentSecurityPolicy: boolean;
  crossOriginEmbedderPolicy: boolean;
  crossOriginOpenerPolicy: boolean;
  crossOriginResourcePolicy: { policy: string };
  dnsPrefetchControl: boolean;
  frameguard: { action: string };
  hidePoweredBy: boolean;
  hsts: boolean;
  ieNoOpen: boolean;
  noSniff: boolean;
  referrerPolicy: { policy: string };
  xssFilter: boolean;
}

export const helmetConfig = (): HelmetConfig => ({
  contentSecurityPolicy: process.env.NODE_ENV === "production",
  crossOriginEmbedderPolicy: process.env.NODE_ENV === "production",
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: process.env.NODE_ENV === "production",
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
});