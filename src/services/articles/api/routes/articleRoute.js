const { Router } = require('express');
const articleService = require('../../services/articleService');
const route = Router();

const user = (app) => {
  app.use('/users', route);
  route.post(
    '/', articleRoute.create
  );

  route.post(
    '/search',
    articleRoute.search
  );

  route.get(
    '/:id',
    articleRoute.findOne
  );

};

module.exports = user;
