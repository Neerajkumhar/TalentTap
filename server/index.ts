import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.js";

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URL = "mongodb+srv://ahk:ahk@cluster0.mntnzjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "changeme-secret-key";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

app.get("/api/auth/profile", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
