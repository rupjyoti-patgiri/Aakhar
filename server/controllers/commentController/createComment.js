// import the models
const Comment = require('../../models/Comment');  // Two dots, not one!
const Post = require('../../models/Post');

// define route handler
exports.createComment = async (req, res) => {
    try {
        // extract user and body from request body
        const {user, body, postId} = req.body;
        // create new comment object and insert in DB
        const comment = new Comment({user, body, postId});

        const savedComment = await comment.save();
        // push the comment on the post associated with the comment
        const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } }, {new: true})
                            .populate('comments')
                            .exec();

        // send a json response with a success flag
        // res.status(200).json(
        //     {
        //         success: true,
        //         data: response,
        //         message: "Comment created successfully!"
        //     }
        // );
        res.json({
            post: updatedPost,
        });
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
