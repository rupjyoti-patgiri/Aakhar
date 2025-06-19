// const mongoose = require('mongoose');
// const Comment = require('./Comment');
// const Like = require('./Likes');

// const PostSchema = mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true,
//             maxlength: 50,
//         },
//         body: {
//             type: String,
//             required: true,
//             maxlength: 1000,
//         },
//         comments: [
//             { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }  // Reference to the Comment model
//         ],
//         likes: [
//             { type: mongoose.Schema.Types.ObjectId, ref: 'Like' }  // Reference to the Like model
//         ],
//     },
//     {
//         timestamps: true,
//     }
// );

// module.exports = mongoose.model('Post', PostSchema);

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema( // Use new mongoose.Schema
    {
        title: {
            type: String,
            required: true,
            maxlength: 50,
        },
        body: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        // --- ADD THIS SECTION ---
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        // -------------------------
        comments: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
        ],
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Like' }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', PostSchema);