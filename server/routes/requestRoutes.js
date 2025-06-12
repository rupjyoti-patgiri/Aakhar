const express = require('express');
const router = express.Router();
const { createRequest, getPendingRequests, processRequest } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/requests
// @desc    A logged-in reader creates a request to become an author
// @access  Private (Reader)
router.post('/', protect, authorize('reader'), createRequest);

// @route   GET /api/requests
// @desc    An admin gets all pending requests
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getPendingRequests);

// @route   PUT /api/requests/:id/process
// @desc    An admin approves or denies a request
// @access  Private (Admin)
router.put('/:id/process', protect, authorize('admin'), processRequest);

module.exports = router;
