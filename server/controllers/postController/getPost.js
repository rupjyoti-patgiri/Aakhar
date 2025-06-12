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

exports.getPostById = async (req, res) => {
    try {
        // extract todo items basis on id
        const id = req.params.id;
        const comment = await Post.findById( {_id: id} );

        // data for given id not found
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Post not found with given ID!"
            });
        }

        // data for given id found
        res.status(200).json(
            {
                success: true,
                data: comment,
                message: `Post ${id} fetched successfully!`
            }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).
        json({
            success: false,
            error: error.message,
            message: "Server error while fetching comments!"
        });
    }
}