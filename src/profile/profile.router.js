import { Router } from "express";
import ProfileService from "./profile.service.js"
import log4js from 'log4js';
import Authorization from "../authorization/authorization.js";

export default class ProfileRouter {
  
  constructor(getService) {
    this._logger = log4js.getLogger('ProfileRouter');
    this._logger.level = 'debug';
    this._profileService = getService('profileService');
    this._authorization = getService('authorization');
  }

  get start() {
    return this._start.bind(this);
  }

  _start() {
    this._logger.log('DeliveryRouter initialized');
  }

  profileApi() {
    let router = Router();

    const schema = {};

    router.route('/users')
      .post(this._profileService.userSignup)
      // .get(this._authorization.auth, this._profileService.findAll);
      .get(this._profileService.findAll);

    router.route('/users/email/sign-in')
      .post(this._profileService.signin);
      
    router.route('/sign-up/user')
    .post(this._profileService.userSignup)

    router.route('/sign-up/university')
    .post(this._profileService.universitySignup);

    router.route('/cateogries')

    return router;
  }
}