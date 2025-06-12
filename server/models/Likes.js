const mongoose = require('mongoose');
const Post = require('./Post');

const likeSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            maxlength: 50,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,  // The comment must belong to a specific post
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Like', likeSchema);