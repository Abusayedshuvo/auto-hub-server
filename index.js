const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Assignment 10 Server Side");
});

app.listen(port, () => {
  console.log(`This server is running on port: ${port}`);
});
