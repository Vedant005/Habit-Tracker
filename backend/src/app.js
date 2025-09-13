import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


//imports

import userRouter from "./routes/user.js"
import habitRouter from "./routes/habit.js"
import followRouter from "./routes/follow.js"
import checkInRouter from "./routes/checkIn.js"


app.use("/ap1/v1/users",userRouter);
app.use("/ap1/v1/habit",habitRouter);
app.use("/ap1/v1/follow",followRouter);
app.use("/ap1/v1/checkIn",checkInRouter);


app.get("/health", (req, res) => {
  res.send("OK");
});

export { app };
