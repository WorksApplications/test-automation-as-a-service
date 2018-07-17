let logger = require('../logger');
let request = require('request-promise');

let UserModel = require('../models/users').Model;
let jwt = require('jsonwebtoken');
let hasha = require('hasha');
let secret = require('../config').auth.secret;
let GCAuthURL = require('../config').auth.GC_auth_URL;
let GCAppId = require('../config').auth.app_id;
let GCAppCredentials = require('../config').auth.GC_app_secret;
let defaultExpiresIn = require('../config').auth.default_expire;
let dummyUser = require('../config').auth.dummy_user;
let isExcludedRequest = require('./authZ-service').isExcludedRequest;

const hashSHA256 = (str) => hasha(str, {algorithm: 'sha256'});

const getSign = async (ticket) => {
  const content = GCAppId + '-' + ticket + '-' + GCAppCredentials;
  let md5Digest = await hasha(content, {algorithm: 'md5'});
  return md5Digest;
};

const service = {
  login: async (username, pwd) => {
    let pwdHashed = hashSHA256(pwd);
    let user = await UserModel.findByUsernameAndPwd(username, pwdHashed);
    if (user) {
      return service.regenerateTokenForUser(user);
    } else {
      throw new Error('username or password not correct');
    }
  },
  auth: (req, res, next) => {
    if (req.cookies['token']) {
      try {
        let decoded = jwt.verify(req.cookies['token'], secret, { algorithms: ['HS256'] });
        req.user = decoded;
      } catch (err) {
        console.log(err);
      }
    } else if (dummyUser) {
      req.user = dummyUser;
    }

    if (!isExcludedRequest(req) && !req.user){
      res.status(401).json({
        error: 'Invalid token'
      });
    } else {
      next();
    }
  },
  apiTokenAuth: (req, res, next) => {
    let token = req.header('token') || req.params.token || req.query.token;
    if (!token) {
      res.status(401).json({
        error: 'Invalid token'
      });
    } else {
      (async() => {
        let user = await UserModel.findOne({api_token: token});
        if (user) {
          req.user = user.toObject();
          next();
        } else {
          res.status(401).json({
            error: 'Invalid or expired token'
          });
        }
      })();
    }
  },
  getUserFromToken: (req, res, next) => {
    try {
      if (req.cookies['token']) {
        let decoded = jwt.verify(req.cookies['token'], secret, { algorithms: ['HS256'] });
        res.json({
          success: true,
          user: decoded
        });
      } else {
        res.status(401).json({
          success: false,
          user: null
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        user: null
      });
    }
    return next();
  },
  regenerateTokenForUser: (user) => {
    // sign the user
    delete user.password;
    delete user.iat;
    delete user.exp;

    let token = jwt.sign(user, secret, {
      expiresIn: defaultExpiresIn
    });

    //TODO: store in redis

    // return user info
    logger.info(`token for user ${user.username} is generated.`);
    return {
      token,
      user,
      expires: defaultExpiresIn
    };
  },
  getUserInfoFromGeniusCenter: async (ticket) => {
    if (ticket) {
      let md5Digest = await getSign(ticket);
      let result = await request.post(GCAuthURL, {
        form: {
          app_id: GCAppId,
          ticket: ticket,
          sign: md5Digest
        },
        json: true
      });
      if (result && result.status.code === 0) {
        let user = result.user;
        let username = user.email.split('@')[0];
        let userInTaaS = await UserModel.findByUsername(username);
        if (!userInTaaS) {
          let pwdHashed = hashSHA256('');
          userInTaaS = await UserModel.createUserFromGeniusCenter(username, pwdHashed, user.email, user.employee_id, user.use_name);
        }

        delete userInTaaS.password;

        let token = jwt.sign(userInTaaS, secret, {
          expiresIn: defaultExpiresIn
        });
        return {
          token,
          user: userInTaaS,
          expires: defaultExpiresIn
        };
      } else {
        throw new Error(`${result}`);
      }
    } else {
      throw new Error('Invaild ticket or sign');
    }
  }
};

module.exports = service;
