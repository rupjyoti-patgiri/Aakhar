const Like = require('../../models/Likes');  // Two dots, not one!
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');


exports.getPost = async (req, res) => {
    try {
        const posts = await Post.find().populate("likes").populate("comments").exec();
        res.json({
            posts,
        })
    }
    catch (error) {
        return res.status(400).json({
            error: "Error while fetching post",
        })
    }
}