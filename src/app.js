const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const apiRoutes = require('./routes/routes');
const renderRoutes = require('./routes/renders');
const ErrorHandler = require('./exceptions/errorHandler');
const HttpException = require('./exceptions/httpException');
const path = require('path');

// Environment variables
require('dotenv').config({ path: '../env/.env' });

// instance of the app
const app = express();

// to handle the cors
app.use(cors());
// To recognize the incoming request object as a json object
app.use(express.json({ limit: '50mb' }));
// To recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({ extended: true }));
// Get the logs
app.use(morgan('dev'));
// Views engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// Api routes
app.use('/api', apiRoutes);
// Views routes
app.use('/views', renderRoutes);
// To handle the wrong routes
app.all('*', (req, res, next) => {
  next(
    new HttpException(
      `no se encuentra la ruta ${req.originalUrl} en el servidor`
    )
  );
});

// To handle errors
app.use(ErrorHandler);

// Server init
app.listen(process.env.PORT || 7000);
console.log(`server running on port ${process.env.PORT || 7000}`);
