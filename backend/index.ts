import app from "./src/app";
import { PORT } from "./src/configs/constant";
import { ensureDefaultAdmin } from "./src/database/default-admin.seed";
import { connectToMongoDB } from "./src/database/mongodb";

const startServer = async () => {
  try {
    await connectToMongoDB();
    await ensureDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
