import cron from "node-cron";
import prisma from "../lib/prisma";
import { logger } from "../utils/logger";

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

            logger.info(
                `[Session Cleanup] Deleted ${result.count} expired session(s)`
            );
        } catch (error) {
            logger.error(error);
        }
    });
};

export default sessionCleanupJob;