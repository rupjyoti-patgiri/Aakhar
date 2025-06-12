// import the models
const Like = require('../../models/Likes');  // Two dots, not one!
const Post = require('../../models/Post');

// define route handler
exports.getLike = async (req, res) => {
    try {
        const like = await Like.find({});

        res.status(200).json(
            {
                success: true,
                data: like,
                message: "Likes fetched successfully!"
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).
        json({
            success: false,
            error: error.message,
            message: "Server error while fetching likes!"
        });
    }
}


exports.getLikeByPostId = async (req, res) => {
    try {
        const { postId } = req.params;

        // Check if postId exists
        const post = await Post.findById(postId).populate('likes');

        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: "Post not found with the given ID!"
            });
        }

        // Check if the post has likes
        if (!post.likes || post.likes.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No likes found for this post!" 
            });
        }

        // Return the likes related to the post
        res.status(200).json({
            success: true,
            message: "Likes retrieved successfully",
            likes: post.likes
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



exports.getLikeById = async (req, res) => {
    try {
        // extract todo items basis on id
        const id = req.params.id;
        const like = await Like.findById( {_id: id} );

        // data for given id not found
        if (!like) {
            return res.status(404).json({
                success: false,
                message: "Like not found with given ID!"
            });
        }

        // data for given id found
        res.status(200).json(
            {
                success: true,
                data: like,
                message: `Like ${id} fetched successfully!`
            }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).
        json({
            success: false,
            error: error.message,
            message: "Server error while fetching likes!"
        });
    }
}