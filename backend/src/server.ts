import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

async function bootstrap() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 API running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Bootstrap error:", err);
  process.exit(1);
});