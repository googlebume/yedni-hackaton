import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

// Create a reusable Express app instance
let cachedApp: Express | null = null;

function getExpressApp(): Express {
  if (cachedApp) {
    return cachedApp;
  }

  const app = express();

  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  // Register routes
  const httpServer = createServer(app);
  registerRoutes(httpServer, app);

  // Error handler
  app.use((err: any, _req: any, res: VercelResponse, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  cachedApp = app;
  return app;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );
    res.status(200).end();
    return;
  }

  const app = getExpressApp();

  // Handle the request
  return new Promise<void>((resolve) => {
    const originalEnd = res.end;
    const originalJson = res.json;
    let finished = false;

    // Override end and json to track completion
    res.end = function (...args: any[]) {
      if (!finished) {
        finished = true;
        originalEnd.apply(res, args);
        resolve();
      }
      return res;
    };

    res.json = function (body: any, ...args: any[]) {
      if (!finished) {
        finished = true;
        originalJson.apply(res, [body, ...args]);
        resolve();
      }
      return res;
    };

    // Handle the request through Express
    app(req as any, res as any);

    // Fallback timeout to prevent hanging
    setTimeout(() => {
      if (!finished) {
        finished = true;
        if (!res.headersSent) {
          res.status(404).json({ message: "Not Found" });
        }
        resolve();
      }
    }, 25000);
  });
}
