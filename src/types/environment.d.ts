declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV: "development" | "test" | "production";
      SECRET: string;
      ENCRYPTION_KEY: string;
      SOCKET_PORT: string;
    }
  }
}

export {};
