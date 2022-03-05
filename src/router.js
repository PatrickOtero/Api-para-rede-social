const { login } = require("./Controllers/login");
const {
  newPost,
  likePost,
  commentPost,
  postsFeed,
} = require("./Controllers/posts");
const {
  registerUser,
  findProfile,
  updateProfile,
} = require("./Controllers/users");
const loginVerification = require("./Middlewares/loginVerification");
const express = require("express");
const { uploadImage } = require("./Controllers/uploads");

const routes = express();

// Login
routes.post("/login", login);

routes.post("/upload", uploadImage);

// Users -- >
routes.post("/users", registerUser);

// ----- Verified routes -----
// authentication middleware
routes.use(loginVerification);

//  Users
routes.get("/users", findProfile);
routes.put("/users", updateProfile);

// Posts
routes.post("/posts", newPost);
routes.post("/posts/:postId/like", likePost);
routes.post("/posts/:postId/comment", commentPost);
routes.get("/posts", postsFeed);

module.exports = routes;
