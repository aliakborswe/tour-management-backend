import dotenv from 'dotenv';
dotenv.config();

interface IEnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES_IN: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES_IN: string,
    BCRYPT_SALT_ROUND: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
}

const loadEnvVariables = (): IEnvConfig => {
    const requiredEnvVariables: string[] = [
      "PORT",
      "DB_URL",
      "NODE_ENV",
      "JWT_ACCESS_SECRET",
      "JWT_ACCESS_EXPIRES_IN",
      "JWT_REFRESH_SECRET",
      "JWT_REFRESH_EXPIRES_IN",
      "BCRYPT_SALT_ROUND",
      "SUPER_ADMIN_EMAIL",
      "SUPER_ADMIN_PASSWORD",
    ];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })

    return {
      PORT: process.env.PORT as string,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      DB_URL: process.env.DB_URL!,
      NODE_ENV: process.env.NODE_ENV as "development" | "production",
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
      BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
      SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
      SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    };
}

export const envVars = loadEnvVariables();