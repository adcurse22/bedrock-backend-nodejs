'use strict';

import jwt from "jsonwebtoken";
import { CONFIG } from "../../config.js";

/**
 * Authorization service
 */
export default class Authorization {

  constructor(getService) {
    this._secretKey = CONFIG.jwt.secret;
    this._userProfileModel = getService('userProfileModel');
    this._universityProfileModel = getService('universityProfileModel');
  }

  get auth() {
    return this._auth.bind(this);
  }

  createToken(data) {
    if (typeof this._secretKey !== 'string') {
      return;
    }
    console.log(data);
    return jwt.sign(data, this._secretKey, { expiresIn: '1d'});
  }

  async _auth(req, res, next) {
    try {
      const token = req['headers']['authorization'];
      if (typeof this._secretKey !== 'string') {
        return;
      }
      if (!token) {
        throw new Error('Unauthorized');
      }
      const decoded = jwt.verify(token, this._secretKey);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send('Unauthorized');
    }
  }
};