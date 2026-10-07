import { z } from "zod";

export const adminDashboardSalesSchema = z.object({
    period: z
        .enum(["7d", "30d", "90d", "1y"])
        .default("30d"),
});

export type AdminDashboardSalesDto = z.infer<
    typeof adminDashboardSalesSchema
>;