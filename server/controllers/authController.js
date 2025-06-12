const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../utils/emailService');

// Store OTPs temporarily. In a production app, use a more persistent store like Redis.
const otpStore = {};

/**
 * @desc    Register a new user and send verification OTP
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(403).json({
            success: false, 
            message: 'All fields are required, please try again',
        })
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // OTP valid for 10 minutes

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${username}`
        });

        await newUser.save();

        // Send verification email
        const emailSubject = 'Welcome! Please verify your email';
        const emailText = `Thank you for signing up. Your One-Time Password (OTP) is: ${otp}. It is valid for 10 minutes.`;
        await sendEmail(email, emailSubject, emailText);

        console.log('Sending email to:', email);
        console.log('Subject:', emailSubject);
        console.log('OTP:', otp);


        res.status(201).json({ message: 'User registered successfully. Please check your email for the verification OTP.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc    Verify user email with OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    // Basic validation
    if (!email || !otp) {
        return res.status(403).json({
            success: false, 
            message: 'All fields are required, please try again',
        })
    }

    try {
        const storedOtpData = otpStore[email];
        if (!storedOtpData) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired.' });
        }

        if (storedOtpData.expires < Date.now()) {
            delete otpStore[email];
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }
        
        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.isVerified = true; 
        await user.save();

        delete otpStore[email]; // OTP is used, so delete it

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.json({ token, message: "Email verified successfully. You are now logged in." });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(403).json({
            success: false, 
            message: 'All fields are required, please try again',
        })
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // A check to ensure user is verified before login
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/changepassword
 * @access  Private
 */
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // From authMiddleware

    // Basic validation
    if (!oldPassword || !newPassword) {
        return res.status(403).json({
            success: false, 
            message: 'All fields are required, please try again',
        })
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
