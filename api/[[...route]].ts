import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
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
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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
    let finished = false;

    // Override end method to track completion
    const originalEnd = res.end.bind(res);
    res.end = function () {
      if (!finished) {
        finished = true;
        originalEnd();
        resolve();
      }
      return res;
    } as any;

    // Override json method to track completion
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      if (!finished) {
        finished = true;
        originalJson(body);
        resolve();
      }
      return res;
    } as any;

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

    // Ensure resolution when response is sent
    res.on("finish", () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    });
  });
}
