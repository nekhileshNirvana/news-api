const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const routes = require('../commonRoutes');
const config = require('../config');

const expressLoader = (app) => {
  app.get(config.appRootPath + '/status', (req, res) => {
    res.status(200).end();
  });
  app.head(config.appRootPath + '/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Transforms the raw string of req.body into json
  app.use(express.json());
  app.use(express.text());

  // Compress all HTTP responses
  app.use(compression());


  // Load API routes
  app.use(config.api.prefix, routes());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError' || err.name === 'Error') {
      return res.status(err.status).send({ message: err.message });
    }
    return next(err);
  });
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};

module.exports = expressLoader;
