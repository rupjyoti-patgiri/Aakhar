const express = require('express');
const cors = require('cors');
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    'http://localhost:5173',               // for local development
    'https://aakhar.vercel.app/'     // for production deployment
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    })
  );



//import routes from comment API
const commentRoutes = require('./routes/comment');
//import routes from like API
const likeRoutes = require('./routes/like');

//import routes from post API
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes'); 


// mount the comment API routes
app.use("/api/v1/comments", commentRoutes);
// mount the like API routes
app.use("/api/v1/likes", likeRoutes);
// mount the posts API routes
app.use("/api/v1/posts", postRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/requests', requestRoutes); 
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// connect to the database
const dbConnect = require("./config/database");
dbConnect();

//default Route
app.get("/", (req, res) => {
    res.send("<h1> Welcome to BLOG API </h1>");
})