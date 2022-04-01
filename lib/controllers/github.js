const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const { sign } = require('../utils/jwt');


module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', async (req, res) => {

    const token = await exchangeCodeForToken(req.query.code);
    const { login, avatar_url, email } = await getGithubProfile(token);
    let user = await GithubUser.findByUsername(login);
    
    if (!user)
      user = await GithubUser.insert({
        username: login,
        avatar: avatar_url,
        email,
      });


    res
      .cookie(process.env.COOKIE_NAME, sign(user), {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .redirect('/api/v1/posts');
  })
  .delete('/logout', async (req, res, next) => {
    try {
      res
        .clearCookie(process.env.COOKIE_NAME)
        .send({ message: 'you have been logged out' });
    } catch (error) {
      next(error);
    }
  });
