import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import { connectCloudinary } from "./configs/cloudinary.js";
import { auth } from "./middlewares/auth.js";

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());

// clerk auth middleware
app.use(clerkMiddleware());

// test route
app.get('/', (req, res) => res.send("Server is live!"));

app.use("/api/ai", auth, aiRouter);
app.use("/api/user", auth, userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));