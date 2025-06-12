const RoleRequest = require('../models/RoleRequest');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

/**
 * @desc    Create a new request to become an author
 * @route   POST /api/requests
 * @access  Private (Readers only)
 */
exports.createRequest = async (req, res) => {
    const { reason, experience, links } = req.body;
    const userId = req.user.id;

    // A user who is already an author or admin cannot make a request
    if (req.user.role !== 'reader') {
        return res.status(403).json({ message: 'Only readers can request to become an author.' });
    }

    try {
        // Check if the user already has a pending request
        const existingRequest = await RoleRequest.findOne({ user: userId, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending request.' });
        }

        // Create new request
        const request = await RoleRequest.create({
            user: userId,
            reason,
            experience,
            links
        });

        // Find all admins to notify them
        const admins = await User.find({ role: 'admin' });
        const adminEmails = admins.map(admin => admin.email);

        if (adminEmails.length > 0) {
            const subject = 'New Author Role Request';
            const text = `A new request to become an author has been submitted by ${req.user.username} (${req.user.email}). Please log in to the admin dashboard to review it.`;
            await sendEmail(adminEmails, subject, text);
        }

        res.status(201).json({ message: 'Your request has been submitted successfully. You will be notified of the decision via email.', data: request });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Get all pending author requests
 * @route   GET /api/requests
 * @access  Private (Admins only)
 */
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await RoleRequest.find({ status: 'pending' }).populate('user', 'username email');
        res.json(requests);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Process an author request (Approve or Deny)
 * @route   PUT /api/requests/:id/process
 * @access  Private (Admins only)
 */
exports.processRequest = async (req, res) => {
    const { status } = req.body; // Expecting 'approved' or 'denied'
    const requestId = req.params.id;
    const adminProcessor = req.user.username;

    if (!['approved', 'denied'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be "approved" or "denied".' });
    }

    try {
        const request = await RoleRequest.findById(requestId);

        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: 'Request not found or has already been processed.' });
        }

        // Find the user who made the request
        const userToUpdate = await User.findById(request.user);
        if (!userToUpdate) {
            request.status = 'denied';
            await request.save();
            return res.status(404).json({ message: 'User who made the request no longer exists.' });
        }

        if (status === 'approved') {
            // Update user role
            userToUpdate.role = 'author';
            await userToUpdate.save();

            // Update request status
            request.status = 'approved';
            await request.save();

            // Notify user of approval
            const subject = 'Your Author Request has been Approved!';
            const text = `Congratulations, ${userToUpdate.username}!\n\nYour request to become an author has been approved by ${adminProcessor}. You can now log in and start creating posts.\n\nWelcome to the team!`;
            await sendEmail(userToUpdate.email, subject, text);
            
            res.json({ message: `Request approved. ${userToUpdate.username} is now an author.` });

        } else { // 'denied'
            request.status = 'denied';
            await request.save();

            // Notify user of denial
            const subject = 'Update on Your Author Request';
            const text = `Hello ${userToUpdate.username},\n\nThank you for your interest in becoming an author. After careful review, we have decided not to move forward with your request at this time.\n\nWe appreciate you taking the time to apply.`;
            await sendEmail(userToUpdate.email, subject, text);

            res.json({ message: 'Request has been denied.' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
