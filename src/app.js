const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const apiRoutes = require('./routes/routes');
const renderRoutes = require('./routes/renders');
const { ErrorHandler } = require('./exceptions/errorHandler');
const { HttpException } = require('./exceptions/httpException');

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
app.listen(process.env.PORT);
console.log(`server running on port ${process.env.PORT}`);
