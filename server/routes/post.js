const express = require('express');
const router = express.Router();

// import controller
const {createPost} = require("../controllers/postController/createPost");
const {getPost} = require("../controllers/postController/getPost");
const {updatePost} = require("../controllers/postController/updatePost");
const {deletePost} = require("../controllers/postController/deletePost");

// define API routes
router.post("/createPost", createPost);
router.get("/getPosts", getPost);
router.put("/updatePost/:id", updatePost);
router.delete("/deletePost/:id", deletePost);

module.exports = router;