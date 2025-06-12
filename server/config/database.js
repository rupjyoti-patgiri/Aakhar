const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('Db connection established'))
.catch((error) => {
    console.log('Error connecting')
    console.error(error.message)
    process.exit(1)  // if error, exit the process with status 1 (non-zero) to indicate an error occurred. This is common practice for Node.js applications.  });
})     
}

module.exports = dbConnect;