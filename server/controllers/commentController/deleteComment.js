// import the models
const Comment = require('../../models/Comment');  // Two dots, not one!
const Post = require('../../models/Post');

// define route handler
exports.deleteComment = async (req, res) => {
    try {
        const { postId ,commentId } = req.params;

        if (!commentId || !postId) {
            return res.status(400).json({
                success: false,
                message: "commentId and postId are required"
            });
        }

        // Delete the comment from the Comment collection
        await Comment.findByIdAndDelete(commentId);

        // Remove the comment reference from the Post
        await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

        res.json({
            success: true,
            message: "Comment deleted successfully!"
        })
    } catch (error) {
        console.error(error);
        res.status(500).
        json({
            success: false,
            error: error.message,
            message: "Server error while deleting todos!"
        });
    }
}
