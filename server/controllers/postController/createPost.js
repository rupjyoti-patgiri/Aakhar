// import the models
const Post = require('../../models/Post');  // Two dots, not one!


// define route handler
exports.createPost = async (req, res) => {
    try {
        // extract user and body from request body
        const {title, body, comments, likes} = req.body;
        // create new comment object and insert in DB
        const response = await Post.create({title, body, comments, likes});
        // send a json response with a success flag
        res.status(200).json(
            {
                success: true,
                data: response,
                message: "Post created successfully!"
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
