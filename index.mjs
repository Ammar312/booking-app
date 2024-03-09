import express from "express";
import "dotenv/config";
import cors from "cors";
import cron from "node-cron";

import apiRoutes from "./routes/index.routes.mjs";
import connectMongoDB from "./connectdb.mjs";
import cookieParser from "cookie-parser";
import checkCompleted from "./cron.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", apiRoutes);
cron.schedule(" 0 0 * * *", async () => {
  app.use(await checkCompleted());
});
connectMongoDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
});
