const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    Post.getAll()
      .then((post) => res.send(post))
      .catch((error) => next(error));
  })

  .post('/', authenticate, async (req, res, next) => {
    const { id } = req.user;

    const { body } = req.body;
    Post.create({ body, id })
      .then((post) => res.send(post))
      .catch((error) => next(error));
  });
