// server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import router from "./routes/userRoutes.js";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/users', router);

app.listen(PORT,() => console.log(`Server started at http://localhost:${PORT}`));
