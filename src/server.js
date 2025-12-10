import { errors } from "celebrate";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import ToolsRout from "./routes/ToolsRout.js";



const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====


app.use(cors());
app.use(express.json());
app.use(logger);

// ===== Routes =====

app.use(ToolsRout);


// ===== Handlers =====
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// ===== DB =====
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
