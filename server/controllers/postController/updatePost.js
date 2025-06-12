const Post = require('../../models/Post');

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, body },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedPost,
            message: "Post updated successfully"
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