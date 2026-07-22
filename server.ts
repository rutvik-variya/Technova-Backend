import { env } from "./src/config/env";
import sessionCleanupJob from "./src/jobs/sessionCleanup.job";

import app from "./src/app"
import { logger } from "./src/utils/logger";


const PORT = env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    sessionCleanupJob();
});