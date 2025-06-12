const mongoose = require('mongoose');
const Comment = require('./Comment');
const Like = require('./Likes');

const PostSchema = mongoose.Schema(
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
        comments: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }  // Reference to the Comment model
        ],
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Like' }  // Reference to the Like model
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', PostSchema);