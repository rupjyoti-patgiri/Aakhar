const Comment = require('../../models/Comment');
const Post = require('../../models/Post');

exports.createComment = async (req, res) => {
    try {
        const { user, body, postId } = req.body;
        
        // The user ID should come from the authenticated request for security
        // But your model uses a username string, so we'll stick to that for now.
        // const authorId = req.user.id; 

        const comment = new Comment({ user, body, postId });
        const savedComment = await comment.save();

        // Find the post and add the new comment's ID to its comments array
        const post = await Post.findByIdAndUpdate(
            postId, 
            { $push: { comments: savedComment._id } }, 
            { new: true } // This option returns the updated document
        );

        // **THE CRITICAL FIX IS HERE**
        // We must re-populate everything the frontend expects, just like getPostById
        const updatedAndPopulatedPost = await Post.findById(post._id)
            .populate('author', 'username avatar.imageUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username avatar.imageUrl _id' // Also select the ID
                }
            })
            .populate('likes');

        res.status(201).json({
            success: true,
            data: updatedAndPopulatedPost,
            message: "Comment created successfully!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating comment."
        });
    }
};