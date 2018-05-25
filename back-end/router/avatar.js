const api = require('express').Router();
const userService = require('../service').UserService;
const hasha = require('hasha');

const hashMD5 = (str) => hasha(str, {algorithm: 'md5'});

api.get('/:username', async (req, res) => {
  const username = req.params.username;
  let user = await userService.getUserByUsername(username);
  if (user === null) {
    return res.status(200).json({
      success: false,
      error: 'User not found',
    }).end();
  } else {
    const hash = hashMD5(user.email);
    return res.status(200).json({
      success: true,
      info: {
        username,
        avatarUrl: `http://www.gravatar.com/avatar/${hash}?d=identicon`,
      },
    });
  }
});

module.exports = api;