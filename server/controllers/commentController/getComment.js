// import the models
const Comment = require('../../models/Comment');  // Two dots, not one!
const Post = require('../../models/Post');

// define route handler
exports.getComment = async (req, res) => {
    try {
        const comment = await Comment.find({});

        res.status(200).json(
            {
                success: true,
                data: comment,
                message: "Comments fetched successfully!"
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).
        json({
            success: false,
            error: error.message,
            message: "Server error while fetching comments!"
        });
    }
}


exports.getCommentByPostId = async (req, res) => {
    try {
        const { postId } = req.params;

        // Check if postId exists
        const post = await Post.findById(postId).populate('comments');

        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: "Post not found with the given ID!"
            });
        }

        // Check if the post has comments
        if (!post.comments || post.comments.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No comments found for this post!" 
            });
        }

        // Return the comments related to the post
        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comments: post.comments
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



exports.getCommentById = async (req, res) => {
    try {
        // extract todo items basis on id
        const id = req.params.id;
        const comment = await Comment.findById( {_id: id} );

        // data for given id not found
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found with given ID!"
            });
        }

        // data for given id found
        res.status(200).json(
            {
                success: true,
                data: comment,
                message: `Comment ${id} fetched successfully!`
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