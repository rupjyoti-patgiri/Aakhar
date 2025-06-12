const mongoose = require('mongoose');
const Post = require('./Post');

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            maxlength: 50,
        },
        body: {
            type: String,
            required: true,
            maxlength: 100,
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

module.exports = mongoose.model('Comment', commentSchema);