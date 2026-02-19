import winston from "winston";

const { combine, timestamp, printf, errors, json, colorize } = winston.format;

const isProd = process.env.NODE_ENV === "development";

// Format lisible en dev
const devFormat = combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss"}),
    errors({ stack: true}), // log stack automatiquement
    printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";
    return `[${timestamp}] ${level}: ${stack || message} ${metaStr}`;
    })
);

// Format JSON structuré en prod
const prodFormat = combine(
    timestamp(),
    errors({ stack: true }),
    json()
);

// 1️⃣ Priorité à LOG_LEVEL
const level = process.env.LOG_LEVEL ?? (isProd ? "info" : "debug");

export const logger = winston.createLogger({
    level, // ← ICI
    format: isProd ? prodFormat : devFormat,
    transports: [
        new winston.transports.Console(),
    ],
});