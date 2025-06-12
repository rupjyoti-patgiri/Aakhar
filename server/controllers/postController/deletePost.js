const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Like = require('../../models/Likes');

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Delete all associated comments
        await Comment.deleteMany({ postId: id });

        // Delete all associated likes
        await Like.deleteMany({ postId: id });

        // Delete the post itself
        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Post and associated comments & likes deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
