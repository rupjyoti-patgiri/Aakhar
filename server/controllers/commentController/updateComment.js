// import the models
const Comment = require('../../models/Comment');  // Two dots, not one!


// define route handler
exports.updateComment = async (req, res) => {
    try {
        const {id} = req.params;
                const {user, body} = req.body;
        
                const comment = await Comment.findByIdAndUpdate(
                    {_id:id},
                    {user, body, updatedAt: Date.now()},
                )
        
                res.status(200).json({
                    success: true,
                    data: comment,
                    message: "Comment updated successfully!"
                })
    } catch (error) {
        console.error(error);
        res.status(500).
        json({
            success: false,
            error: error.message,
            message: "Server error while updating comments!"
        });
    }
}