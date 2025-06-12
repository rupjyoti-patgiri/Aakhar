const express = require('express');
const router = express.Router();

// import controller
const {createLike} = require("../controllers/likeController/createLike");
const {getLike, getLikeByPostId ,getLikeById} = require("../controllers/likeController/getLike");
const {deleteLike} = require("../controllers/likeController/deleteLike");

// define API routes
router.post('/createLike', createLike);
router.get("/getLike", getLike);
router.get("/getLike/:id", getLikeById);
router.get("/getLikeByPost/:postId", getLikeByPostId);
router.delete("/deleteLike/:postId/:likeId", deleteLike);

module.exports = router;