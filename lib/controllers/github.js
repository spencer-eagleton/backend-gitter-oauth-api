const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const { sign } = require('../utils/jwt');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', (req, res, next) => {
    let profile;

    return exchangeCodeForToken(req.query.code)
      .then((token) => getGithubProfile(token))
      .then(({ username, avatar_url, email }) => {
        profile = { username, avatar_url, email };
        return GithubUser.findByUsername({ username });
      })
      .then((user) => {
        if (!user) {
          return GithubUser.insert(profile);
        } else {
          return user;
        }
      })
      .then((user) => {
        console.log(user);
        res
          .cookie(process.env.COOKIE_NAME, sign(user), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          })
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })

  .delete('/logout', (req, res, next) => {
    try {
      res
        .clearCookie(process.env.COOKIE_NAME)
        .send({ message: 'you have been logged out' });
    } catch (error) {
      next(error);
    }
  });
