'use strict';

import express from "express"
import log4js from 'log4js';
import * as dotenv from 'dotenv';
import { CONFIG } from "./config.js";
import Database from "./src/database/database.js";
import bodyParser from "body-parser";
import cors from 'cors';

dotenv.config();

/**
 * Express application
 */
export default class Application {
  _app = express();
  _routes = [];
  _services = {};
  _port = +process.env.PORT || 3001;
  _logger = log4js.getLogger('Application');
  _config = CONFIG;

  /**
   * Constructs express application
   */
  constructor() {
    this._logger.level = "debug";
    this._database = new Database(this._config);
  }

  get start() {
    return this._start.bind(this);
  }

  get getService() {
    return this._getService.bind(this);
  }

  /**
   * Adds router to initialize
   * @param {string} route route of router
   * @param {Router} router express router
   */
  addRouter(route, router) {
    this._routes.push({route, router});
  }

  /**
   * Regisers service to initialize
   * @param {string} name name of service
   * @param {Function|Object} service 
   */
  registerService(name, service) {
    this._services[name] = service;
  }

  async _start() {
    console.clear();
    console.log('\n');
    this._logger.log('Starting application');
    this._middlewareDeclaration();
    
    await this._database.connect();
    this._registerRouters();
    this._app.listen(this._port);

    this._logger.log('Application runs on port', this._port);
  }

  _registerRouters() {
    for(let {route, router} of this._routes) {
      this._app.use(route, router);
    }
  }

  _getService(name) {
    return this._services[name];
  }

  _middlewareDeclaration() {
    this._app.use(bodyParser.json({limit: '50mb'}));
    this._app.use(cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));
  }
}