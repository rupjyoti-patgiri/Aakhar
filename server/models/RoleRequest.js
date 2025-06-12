const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleRequestSchema = new Schema({
    // A reference to the user who is making the request
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Ensures a user can only have one open request at a time
    },
    // A brief personal statement or reason for wanting to become an author
    reason: {
        type: String,
        required: [true, 'Please provide a reason for your request.'],
        trim: true,
        maxlength: [500, 'Reason cannot be more than 500 characters']
    },
    // Details about their writing experience
    experience: {
        type: String,
        required: [true, 'Please describe your writing experience.'],
        trim: true,
        maxlength: [1000, 'Experience description cannot be more than 1000 characters']
    },
    // Array of strings to store links to their portfolio, blog, or published articles
    links: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5 links']
    },
    // The current status of the request
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    // Timestamp for when the request was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model('RoleRequest', RoleRequestSchema);
