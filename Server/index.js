import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:5173'
];

// CORS middleware — allows multiple dev ports
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);

// frontend serve
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/Client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "Client", "dist", "index.html"));
});

// start
app.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});
