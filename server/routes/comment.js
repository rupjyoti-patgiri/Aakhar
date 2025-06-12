const express = require('express');
const router = express.Router();

// import controller
const {createComment} = require("../controllers/commentController/createComment");
const {getComment, getCommentByPostId, getCommentById} = require("../controllers/commentController/getComment");
const {updateComment} = require("../controllers/commentController/updateComment");
const {deleteComment} = require("../controllers/commentController/deleteComment");


// define API routes
router.post('/createComment', createComment);
router.get("/getComment", getComment);
router.get("/getComment/:id", getCommentById);
router.get("/getCommentByPost/:postId", getCommentByPostId);
router.put("/updateComment/:id", updateComment);
router.delete("/deleteComment/:postId/:commentId", deleteComment);

module.exports = router;