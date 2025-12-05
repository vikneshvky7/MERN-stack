// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ====== CONFIG ======
const PORT = process.env.PORT || 8000;

// On Render / cloud: set MONGODB_URI in env vars
// Locally it will fall back to your local MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern-app";

// ====== MIDDLEWARE ======
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local React dev
      "https://mern-stack-five-sigma.vercel.app", // your Vercel frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

// ====== DB CONNECTION ======
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ====== SCHEMA & MODEL ======
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

// ====== ROUTES ======

// Health check / root
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Todo API is running" });
});

// Create a new todo
app.post("/todo", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const newTodo = new Todo({ title: title.trim(), description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("POST /todo error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all todos
app.get("/todo", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: 1 });
    res.json(todos);
  } catch (error) {
    console.error("GET /todo error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a todo by ID
app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Todo.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted", todo: result });
  } catch (error) {
    console.error("DELETE /todo/:id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a todo by ID
app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  try {
    const result = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("PUT /todo/:id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
