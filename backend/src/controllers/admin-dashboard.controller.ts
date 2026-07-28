import { Response } from "express";
import { z } from "zod";
import { AdminDashboardService, DashboardRange } from "../services/admin-dashboard.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const querySchema = z.object({
  range: z.enum(["today", "7d", "30d", "90d"]).default("30d"),
});

const adminDashboardService = new AdminDashboardService();

export class AdminDashboardController {
  async overview(req: AuthRequest, res: Response) {
    try {
      const parsed = querySchema.safeParse({ range: req.query.range });
      if (!parsed.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      }

      const overview = await adminDashboardService.getOverview({
        range: parsed.data.range as DashboardRange,
      });

      return ApiResponseHelper.success(res, overview, "Dashboard overview fetched successfully");
    } catch {
      return ApiResponseHelper.error(res, "Unable to load dashboard overview", 500);
    }
  }
}
