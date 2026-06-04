import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectMongoose from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileRoute.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],

}));

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);


app.listen(process.env.PORT || 5000, async () => {
    ConnectMongoose();
    console.log(` Server running on port ${process.env.PORT || 5000}`);
});

