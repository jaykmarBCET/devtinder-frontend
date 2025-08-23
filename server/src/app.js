const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
require("dotenv").config();
const PORT = process.env.PORT || 3000;




app.use(
  cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PATCH","PUT"],
    credentials: true,
    exposedHeaders:["TOKEN"]
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");


app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);


const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => console.log("Database connection established..."))
  .catch((err) => console.error("Database not connected: ", err.message));

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});