// const Like = require('../../models/Likes');  // Two dots, not one!
// const Post = require('../../models/Post');
// const Comment = require('../../models/Comment');


// exports.getPost = async (req, res) => {
//     try {
//         const posts = await Post.find().populate("likes").populate("comments").exec();
//         res.json({
//             posts,
//         })
//     }
//     catch (error) {
//         return res.status(400).json({
//             error: "Error while fetching post",
//         })
//     }
// }

// exports.getPostById = async (req, res) => {
//     try {
//         // extract todo items basis on id
//         const id = req.params.id;
//         const comment = await Post.findById( {_id: id} );

//         // data for given id not found
//         if (!comment) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found with given ID!"
//             });
//         }

//         // data for given id found
//         res.status(200).json(
//             {
//                 success: true,
//                 data: comment,
//                 message: `Post ${id} fetched successfully!`
//             }
//         );
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).
//         json({
//             success: false,
//             error: error.message,
//             message: "Server error while fetching comments!"
//         });
//     }
// }



const Post = require('../../models/Post');

exports.getPost = async (req, res) => {
    try {
        // --- UPDATE THIS QUERY ---
        const posts = await Post.find({})
            .populate('author', 'username avatar.imageUrl') // Get author's name and avatar
            .populate("likes")
            .sort({ createdAt: -1 }); // Show newest posts first

        res.json({
            success: true,
            count: posts.length,
            posts,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: "Error while fetching posts",
        });
    }
}

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        // --- UPDATE THIS QUERY ---
        const post = await Post.findById(id)
            .populate('author', 'username avatar.imageUrl') // Get author details
            .populate({ // Populate comments and the user of each comment
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username avatar.imageUrl'
                }
            })
            .populate('likes'); // Populate the full like objects

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found with given ID!"
            });
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Server error while fetching post!"
        });
    }
}