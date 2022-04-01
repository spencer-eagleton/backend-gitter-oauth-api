const { Router } = require('express');

module.exports = Router().get('/', async (req, res) => {
  res.send('lets go');
});
