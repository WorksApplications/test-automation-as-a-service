const api = require('express').Router();
const userService = require('../service').UserService;
const authNService = require('../service').AuthService;

// auth validation
api.use('/:username', (req, res, next) => {
  if (req.user && req.user.username === req.params.username) {
    return next();
  } else {
    res.statusCode = 401;
    res.json({
      success: false,
      info: 'Invalid Identity'
    });
  }
});

api.post('/:username/api_token', async (req, res, next) => {
  let apiToken = await userService.generateApiToken(req.user.username);
  if (apiToken) {
    let user = req.user;
    user.api_token = apiToken;

    let token = authNService.regenerateTokenForUser(req.user);
    if (token) {
      res.cookie('token', token.token, {
        maxAge: token.expires * 1000,
        path: '/',
        httpOnly: true
      });
    }
    res.json({
      success: true,
      api_token: apiToken
    });
  } else {
    res.statusCode = 500;
    res.json({
      success: false,
      api_token: null
    });
  }
});

api.get('/:username/api_token', async (req, res, next) => {
  let apiToken = await userService.getApiToken(req.user.username);
  res.json({
    success: true,
    api_token: apiToken
  });
});

api.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit);
  let users = await userService.getUsers(limit);
  res.status(200).json({
    success: true,
    users: users
  });
});

module.exports = api;
