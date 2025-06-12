const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    updateUserRole,
    getMe,              // <-- IMPORT NEW FUNCTION
    updateMyDetails     // <-- IMPORT NEW FUNCTION
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // adjust path if different



// --- ROUTES FOR CURRENT LOGGED-IN USER ---

// @route   GET /api/users/me
// @desc    Get the logged-in user's profile
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/users/me
// @desc    Update the logged-in user's profile
// @access  Private
router.put('/updatedetails', protect, upload.single('imageFile'), updateMyDetails);



// --- ADMIN-ONLY ROUTES ---

// @route   GET /api/users
// @desc    Admin gets all users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAllUsers);

// @route   PUT /api/users/:id/role
// @desc    Admin updates a user's role
// @access  Private/Admin
router.put('/:id/role', protect, authorize('admin'), updateUserRole);


module.exports = router;
