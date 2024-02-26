import express from "express";
import "dotenv/config";
import cors from "cors";

import apiRoutes from "./routes/index.routes.mjs";
import connectMongoDB from "./connectdb.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectMongoDB(process.env.MONGO_URI);

app.use("/api/v1", apiRoutes);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
