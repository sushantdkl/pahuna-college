import path from "path";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import adminContactMessageRoutes from "./routes/admin-contact-message.route";
import adminDestinationRoutes from "./routes/admin-destination.route";
import adminExperienceRoutes from "./routes/admin-experience.route";
import adminHotelRoutes from "./routes/admin-hotel.route";
import adminInquiryRoutes from "./routes/admin-inquiry.route";
import adminItineraryRoutes from "./routes/admin-itinerary.route";
import adminUserRoutes from "./routes/admin-user.route";
import contactMessageRoutes from "./routes/contact-message.route";
import inquiryRoutes from "./routes/inquiry.route";
import itineraryRoutes from "./routes/itinerary.route";
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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Pahuna API is running",
  });
});

// Sprint 2 auth endpoints are grouped under /api/v1/auth before being handled by the user route/controller layers.
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/hotels", adminHotelRoutes);
app.use("/api/v1/admin/destinations", adminDestinationRoutes);
app.use("/api/v1/admin/experiences", adminExperienceRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/admin/inquiries", adminInquiryRoutes);
app.use("/api/v1/itineraries", itineraryRoutes);
app.use("/api/v1/admin/itineraries", adminItineraryRoutes);
app.use("/api/v1/contact-messages", contactMessageRoutes);
app.use("/api/v1/admin/contact-messages", adminContactMessageRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Uploaded image is too large"
          : err.message,
      data: null,
    });
  }

  if (err.message.includes("Only JPG, PNG, or WEBP")) {
    return res.status(400).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
