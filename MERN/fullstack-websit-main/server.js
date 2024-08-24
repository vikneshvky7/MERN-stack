// const express = require("express");
// const app = express();
// app.use(express.json());
// let todo = [];
// app.post("/todo", async (req, res) => {
//   const { title, description } = req.body;
//   const newTodo = {
//     id: todo.length + 1,
//     title,
//     description,
//   };
//   todo.push(newTodo);
//   console.log(todo);
//   res.status(201).json(newTodo);
// });

// //start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log("server is listeneing to port" + port);
// });
//-----------------------------------------------------server---------------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// Connecting to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.error(err);
  });

// Creating the schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

// Creating model
const todoModel = mongoose.model("Todo", todoSchema);

// Create a new todo item
app.post("/todo", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all items
app.get("/todo", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a todo item by ID
app.delete("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await todoModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ message: "Todo not found" });
    } else {
      console.log(result);
      const data={result:result}
      res.status(200).json(result);
    
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a todo item by ID
app.put("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body; // This should be an object containing the fields to update
    const result = await todoModel.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the update is validated according to schema rules
    });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
