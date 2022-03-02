// This is needed to be able to access environment variables
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
// npm i mongoose
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// The order of these middleware matter. They are executed in this order.
// custom middleware logger
app.use(logger);

// Handle options credentials check - efore CORS!
// and retch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
// When it comes in the url, you can put the data out as a parameter. 
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
// When json data comes in we need to be able to get that json data out
app.use(express.json());

app.use(cookieParser());

// This is a build-in middleware
//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
// routes now acept regexp
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
// This will receive the refresh cookie that has the refresh Token and this 
// will issue another access token ones the Access Token has expired.
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

// app.use is more for middleware.
// This will be use more for routing, and it will be applied to all http methods.
// It will also acept regex. That's why we put the '*'
// We are saying that everything that gets it here will get an 404 error
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

// We are only going to listen to request if we are successfully connected to the Mongo database.
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
