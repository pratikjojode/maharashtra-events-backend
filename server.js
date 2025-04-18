import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import formRoutes from "./routes/formRoutes.js";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

app.use("/api/v1/forms", formRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`.bgBlack.yellow)
);
