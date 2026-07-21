import cron from "node-cron";
import prisma from "../lib/prisma";

const sessionCleanupJob = () => {
    cron.schedule("*/1 * * * *", async () => {
        try {
            const result = await prisma.session.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });

            console.log(
                `[Session Cleanup] Deleted ${result.count} expired session(s)`
            );
        } catch (error) {
            console.error("[Session Cleanup] Error:", error);
        }
    });
};

export default sessionCleanupJob;