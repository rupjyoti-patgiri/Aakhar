// import the models
const Like = require('../../models/Likes');  // Two dots, not one!
const Post = require('../../models/Post');

// define route handler
exports.createLike = async (req, res) => {
    try {
        // extract user and body from request body
        const {user, postId} = req.body;
        // check if user already liked the post
        const existingLike = await Like.findOne({ postId, user: user });

        if (existingLike) {
          return res.status(400).json({ message: "User already liked this post" });
        }
        // create new comment object and insert in DB
        const like = new Like({user, postId});
        const savedLike = await like.save();

         // Push the like ID to the corresponding post
        const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: savedLike._id } }, { new: true }).populate("likes").exec();
        // send a json response with a success flag
        res.json(
            {
                post: updatedPost,
            }
        );
    } catch (error) {
        console.error(error);
        console.log(error);
        res.status(500)
        .json ({
            success: false,
            data: "internal server error",
            message:error.message
        })
    }
}
