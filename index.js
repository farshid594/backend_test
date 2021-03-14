const http = require("http");
const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");

const app = express();

const server = http.createServer(app);

app.use(express.json());

let users = [];

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    data: [
      { id: 1, title: "react" },
      { id: 2, title: "react js" },
      { id: 3, title: "react native" },
    ],
  });
});

app.post("/signup", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var errors = [];
  if (password.length < 6) {
    errors.push({ key: "password", message: "password invalid" });
  }
  var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    errors.push({ key: "email", message: "ivalid email" });
  }
  if (errors.length > 0) {
    res.status(400).json({ errors: errors });
  } else {
    users.push({ email: email, password: password });
    console.log(users);
    res.status(201).json({ message: "suucessful message" });
  }
});

app.post("/signin", (req, res) => {
  users.forEach((user) => {
    if (user.email === req.body.email && user.password === req.body.password) {
      var token = jwt.sign(req.body.email, "hjdhdjhdjh");
      user.token = token;
      console.log(users);
      return res.status(200).json({ token: token });
    }
  });
  res.status(401).json({ message: "user not exist" });
});
app.get("/getUser", (req, res) => {
  try {
    var token = req.headers.authorization;
    var email = jwt.verify(token, "hjdhdjhdjh");
    users.forEach((user) => {
      if (user.email === email && token === user.token) {
        return res.status(200).json({ user: user });
      }
    });
    res.status(401).json({ message: "user not found" });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
});

server.listen(8000, () => {
  console.log("server running on port 8000");
});
