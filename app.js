
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path=require("path");
app.use(bodyParser.json());
app.set("view engine","ejs");
app.get("/", async function (request, response) {
  const allTodos=await Todo.getTodos();
  if (request.accepts("html")){
    response.render('index',{
      allTodos
    });
  }else{
    response.json({
      allTodos
    })
  }
});
app.use(express.static(path.join(__dirname,'public'))); 
// eslint-disable-next-line no-unused-vars
app.get("/todos",async function (request, response) {
  console.log("Todo list",request.body);
});

// eslint-disable-next-line no-unused-vars
app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)

  try {
    const todos = await Todo.findAll({ order: [["id", "ASC"]] });
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate:request.body.dueDate});
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    const Row = await Todo.remove(request.params.id );
    return response.json({success: Row===1});
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
