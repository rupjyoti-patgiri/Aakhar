const fs = require('fs');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Get current logged-in user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        // req.user is populated by the 'protect' middleware. We don't need to find the user again.
        // The user object is already attached to the request, excluding the password.
        const user = req.user;
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Helper function to upload a file to Cloudinary
async function uploadFileToCloudinary(filePath, folder, quality) {
    const options = { folder, resource_type: "auto" };
    if (quality) {
        options.quality = quality;
    }
    // Upload the file and return the response
    const result = await cloudinary.uploader.upload(filePath, options);
    
    // Delete the file from local storage after successful upload
    fs.unlinkSync(filePath); 

    return result;
}

/**
 * @desc    Update current logged-in user's details
 * @route   PUT /api/users/updatedetails
 * @access  Private
 */
exports.updateMyDetails = async (req, res) => {
    const { bio, interests, socialLinks } = req.body;

    const fieldsToUpdate = {};
    if (bio) fieldsToUpdate.bio = bio;
    if (interests) fieldsToUpdate.interests = interests;
    if (socialLinks) fieldsToUpdate.socialLinks = socialLinks;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // UPDATED LOGIC: Check if a new file has been uploaded via multer
        if (req.file) {
            // If there's an existing avatar, delete it from Cloudinary
            if (user.avatar && user.avatar.publicId) {
                await cloudinary.uploader.destroy(user.avatar.publicId);
            }

            // Get the path of the locally stored file from multer
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'BlogProfilePic'
            });
    
            // 2. Optionally delete the local file to save disk space
            fs.unlinkSync(req.file.path);
                fieldsToUpdate.avatar = {
                    imageUrl: result.secure_url,
                    publicId: result.public_id, // for deletion later
                };
            }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating user details:", error.message);
        // If an error occurs and a file was uploaded, delete the temporary file
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send('Server Error');
    }
};




// --- EXISTING ADMIN FUNCTIONS ---

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users but don't include their passwords in the result
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Update user role by ID
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = async (req, res) => {
    const { role } = req.body;
    const userIdToUpdate = req.params.id;

    const validRoles = ['admin', 'author', 'reader'];
    if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role specified. Must be one of: ${validRoles.join(', ')}` });
    }

    try {
        const user = await User.findById(userIdToUpdate);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save({ validateModifiedOnly: true });

        res.json({ message: `User ${user.username}'s role successfully updated to '${role}'.` });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
