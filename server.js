const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// import Routes
const userRoutes = require('./routes/UserRoutes');
const reviewRoutes = require('./routes/ReviewRoutes');
const likeRoutes = require('./routes/LikeRoutes');
const bookshelfRoutes = require('./routes/BookShelfRoutes');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initilaize
app.listen(port, () => {
    console.log("Server started on: " + port)
});

// Routes
app.use('/user', userRoutes);
app.use('/review', reviewRoutes);
app.use('/like', likeRoutes);
app.use('/bookshelf', bookshelfRoutes);

// Connect to DB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB!");
}).catch((error) => {
    console.error(error, "Error while connecting to database, please try again later...");
});