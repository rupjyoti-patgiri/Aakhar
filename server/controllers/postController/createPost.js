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



// const Post = require('../../models/Post');
// const User = require('../../models/User'); // Required for populating

// exports.createPost = async (req, res) => {
//     try {
//         const { title, body } = req.body;
//         // Get the logged-in user's ID from the protect middleware
//         const authorId = req.user.id;

//         // Create the post with the author's ID
//         const post = await Post.create({ title, body, author: authorId });

//         // Find the newly created post and populate the author's details
//         // before sending it back. This ensures the frontend has all info.
//         const newPost = await Post.findById(post._id).populate('author', 'username avatar.imageUrl');
        
//         res.status(201).json({
//             success: true,
//             data: newPost,
//             message: "Post created successfully!"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json ({
//             success: false,
//             message: error.message
//         });
//     }
// }