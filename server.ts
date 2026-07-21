import dotenv from "dotenv"
import sessionCleanupJob from "./src/jobs/sessionCleanup.job";
dotenv.config();

import app from "./src/app"

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    sessionCleanupJob();
});