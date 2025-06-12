const multer = require('multer');
const path = require('path');

// Configure multer to use disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Files will be saved in the 'uploads/' directory
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename to prevent overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Helper function to filter for supported image types
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// const upload = multer({ 
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         // Limit file size to 5MB
//         fileSize: 5 * 1024 * 1024 
//     }
// });

const upload = multer({ dest: 'uploads/' });


module.exports = upload;