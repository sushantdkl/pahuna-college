import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";

const app: Application = express();

// The app file owns global middleware and mounts auth routes; route files keep endpoint mapping separate from business logic.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Pahuna API is running",
  });
});

// Sprint 2 auth endpoints are grouped under /api/v1/auth before being handled by the user route/controller layers.
app.use("/api/v1/auth", userRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
