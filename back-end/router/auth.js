let logger = require('../logger');
let express = require('express');
let bodyParser = require('body-parser');

let authService = require('../service').AuthService;

let jsonParser = bodyParser.json();
let api = express.Router();

api.post('/login', jsonParser, (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (typeof username !== 'string' || typeof password !== 'string' || password.length < 6) {
    res.status(401).json({
      error: 'Invalid Username or Password'
    });
  } else {
    (async () => {
      try {
        let token = await authService.login(req.body.username, req.body.password);
        if (token) {
          res.cookie('token', token.token, {
            maxAge: token.expires * 1000,
            path: '/',
            httpOnly: true
          });
          res.json({
            success: true,
            user: token.user
          });
        } else {
          res.send(404).end();
        }
      } catch (error) {
        logger.error(`${error}`);
        res.status(500).json({
          error: `${error}`
        });
      }
    })();
  }
});

api.post('/logout', (req, res, next) => {
  res.clearCookie('token').end();
});

api.get('/userinfo', (req, res, next) => {
  authService.getUserFromToken(req, res, next);
});

api.get('/gc_callback', (req, res, next) => {
  let ticket = req.query.ticket;
  let sign = req.query.ticket;
  let redirect = req.query.redirect_uri;
  if (ticket && sign) {
    authService.getUserInfoFromGeniusCenter(ticket).then(token => {
      if (token) {
        res.cookie('token', token.token, {
          maxAge: token.expires * 1000,
          path: '/',
          httpOnly: true
        });
        res.redirect('/#' + redirect);
      }
    }).catch(err => {
      res.status(500).json(err.message).end();
    });
  } else {
    res.status(400).body('Invalid Parameters').end();
  }
});
module.exports = api;
