const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'author', 'reader'], default: 'reader' },
  avatar: {
    imageUrl: String, // URL of the image on Cloudinary
    publicId: String // Public ID for the image on Cloudinary

  },
  bio:      { type: String },
  interests: [String], // Only for readers maybe
  socialLinks: {
    twitter: { type: String, default: undefined },
  github: { type: String, default: undefined },
  linkedin: { type: String, default: undefined },
  website: { type: String, default: undefined }
  },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
