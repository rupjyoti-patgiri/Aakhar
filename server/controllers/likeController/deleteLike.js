// import the models
const Like = require('../../models/Likes');  // Two dots, not one!
const Post = require('../../models/Post');

// define route handler
exports.deleteLike = async (req, res) => {
    try {
       const { postId, likeId } = req.params;

        if (!likeId || !postId) {
            return res.status(400).json({
                success: false,
                message: "likeId and postId are required"
            });
        }

        // Delete the like from the Like collection
        await Like.findByIdAndDelete(likeId);

        // Remove the like reference from the Post
        await Post.findByIdAndUpdate(postId, { $pull: { likes: likeId } });
        res.json({
            success: true,
            message: "Like deleted successfully!"
        })
    } catch (error) {
        console.error(error);
        res.status(500).
        json({
            success: false,
            error: error.message,
            message: "Server error while deleting Likes!"
        });
    }
}
