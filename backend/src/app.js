import express from "express";
import _config from "./config/config.js";
import cors from "cors";
import errorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./features/users/userRouter.js";
import busRouter from "./features/bus/busRouter.js";
// Initialize express app
const app = express();
// Enable CORS(cross-origin resource sharing)
app.use(cors());
//allow json object from frontend
app.use(express.json());
// routes
app.use('/api/users', userRouter);
app.use('/api/buses', busRouter);

app.use(errorHandler);

export default app;