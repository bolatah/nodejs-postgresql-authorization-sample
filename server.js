const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
require("./configs/dotenv");
const port = process.env.PORT || 5000;

const client = require("./configs/database");

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Engine started, ready to take off");
});

const user = require("./routes/users");
app.use("/users", user);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
