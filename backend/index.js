import express, { response } from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/User.js";
import initializeSocket from "./socket.js";
import userRouter from "./routes/user.js";
import tabRouter from "./routes/tab.js";
import roomRouter from "./routes/room.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://protectify-df3q.onrender.com",
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }
});

// Initialize socket logic
initializeSocket(io);

main().then(() => {
    console.log("DB Connected");
}).catch((error) => {
    console.log("Error while connecting to DB:", error);
});

async function main() {
    await mongoose.connect("mongodb+srv://protectify:7XEZcHLBJq0BmN5o@cluster0.5xf24.mongodb.net/");
}

// Session configuration
const sessionOptions = {
    secret: "HelloProtectify",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
    },
};

app.use(cookieParser());
app.use(cors({
    origin: "https://protectify-df3q.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes

app.use("/", userRouter);
app.use("/", tabRouter);
app.use("/", roomRouter)


app.all("*", (req, res) => {
    res.redirect("/");
});

app.use((err, req, res, next) => {
    console.log("error", err)

})

server.listen(8080, () => {
    console.log("Server running on port 8080");
});

