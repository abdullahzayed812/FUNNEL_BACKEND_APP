import dotenv from "dotenv";
import { createServer } from "./server";
import { runMigrations } from "./migrations";
import { runSeeds } from "./seeds";
(async () => {
    dotenv.config();
    const { ENV, PORT } = process.env;
    const args = process.argv.slice(2);
    if (!ENV || !PORT) {
        console.error("Missing some required env variables.");
        process.exit(1);
    }
    if (args.includes("--migrate")) {
        console.log("Running migrations...");
        await runMigrations();
    }
    if (args.includes("--seed")) {
        console.log("Running seeds...");
        await runSeeds();
    }
    const server = await createServer();
    server.listen(PORT, () => console.log(`Listening on port ${PORT} in ${ENV} environment`));
})();
