import * as bcrypt from 'bcrypt';
import log4js from 'log4js'
import _ from 'lodash';

/**
 * User profile service
 */
export default class ProfileService {

  constructor(getService) {
    this._userProfileModel = getService('userProfileModel');
    this._universityProfileModel = getService('universityProfileModel');
    this._authorization = getService('authorization');
    this._logger = log4js.getLogger('ProfileService');
    this._logger.level = 'debug';
  }

  get start() {
    return this._start.bind(this);
  }

  get userSignup() {
    return this._userSignup.bind(this);
  }

  get universitySignup() {
    return this._universitySignup.bind(this);
  }

  get signin() {
    return this._signin.bind(this);
  }

  get findAll() {
    return this._findAll.bind(this);
  }

  get findById() {
    return this._findById.bind(this);
  }

  _start() {
    this._logger.log('Profile service initialized');
  }

  async _universitySignup(req, res, next) {
    try {
      const data = this._validateUniversityProfile(req, res);
      if (!data){
        return;
      }
      let user = await this._universityProfileModel.Profile.findByEmail(data.email);
      if (user) {
        return res.status(400).send({message: 'This email already taken'});
      }
      data.createdAt = new Date();
      data.email = data.email.toLowerCase();
      data.password = await bcrypt.hash(data.password, 12);
      user = new this._universityProfileModel.Profile(data);
      return user.save().then((savedProfile) => {
        return res.status(201).send(this._removeAllSecrets(savedProfile));
      });
    } catch (err) {
      next(err);
    }
  }

  async _userSignup(req, res, next) {
    try {
      const data = req.body;
      let user = await this._userProfileModel.Profile.findByEmail(data.email);
      if (!user) {
        user = await this._universityProfileModel.Profile.findByEmail(data.email);
      }
      if (user) {
        // dev-line
        // return;
        return res.status(400).send({message: 'This email already taken'});
      }
      data.createdAt = new Date();
      data.email = data.email.toLowerCase();
      data.password = await bcrypt.hash(data.password, 12);
      user = new this._userProfileModel.Profile(data);
      return user.save().then((savedProfile) => {
        return res.status(201).send(this._removeAllSecrets(savedProfile));
      });
    } catch (err) {
      next(err);
    }
  }

  async _signin(req, res, next) {
    try {
      const { email, password } = req.body;
      let user = await this._userProfileModel.Profile.findByEmail(email);
      if (!user) {
        user = await this._universityProfileModel.Profile.findByEmail(email);
      }
      if (!user || !await bcrypt.compare(password, user?.password)) {
        return res.status(401).send({message: 'Invalid credentials'});
      }
      const token = this._authorization.createToken(this._removeAllSecrets(user.toObject()));
      res.send({
        token
      });
    } catch (err) {
      next(err);
    }
  }

  _findById(id) {
    return this._userProfileModel.Profile.findById(id).then((profile) => profile ? this.removeAllSecrets(profile) : profile);
  }

  async _findAll(req, res, next) {
    try {
      const users = [...await this._userProfileModel.Profile.findAll(), ...await this._universityProfileModel.Profile.findAll()];
      res.send(users);
    } catch (err) {
      next(err);
    }
  }

  _validateUserProfile(req, res) {
    if (!req.body) {
      res.status(400).send({message: 'Bad request'});
      return null;
    }
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      res.status(400).send({message: 'Bad request'});
      return null;
    }
    return { firstname, lastname, email, password };
  }

  _validateUniversityProfile(req, res) {
    if (!req.body) {
      res.status(400).send({message: 'Bad request'});
      return null;
    }
    const { name, password, email } = req.body;
    if (!name || !email ||!password) {
      res.status(400).send({message: 'Bad request'});
      return null;
    }
    return { name, email, password};
  }

  _removeAllSecrets(user) {
    const userWithoutSecrets = _.cloneDeep(user);
    delete userWithoutSecrets.password;
    return userWithoutSecrets;
  }
}