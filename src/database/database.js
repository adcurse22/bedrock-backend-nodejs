'use strict';

import log4js from 'log4js';
import mongoose from 'mongoose';

export default class Database {
  /**
   * Constructs database
   */
  constructor(config) {
    this._config = config;
    this._logger = log4js.getLogger('Database');
    this._logger.level = 'debug';
  }

  get connect() {
    return this._connect.bind(this);
  }

  get disconnect() {
    return this._disconnect.bind(this);
  }

  async _connect() {
    try {
      this._logger.log('Connecting to database...');
      const url = this._getUrl();
      await mongoose.connect(url);
      this._logger.log('Connected to the database');
    } catch (err){
      this._logger.error('Failed to connect to database', err);
    }
  }

  async _disconnect() {
    if (this._isClosed) {
      return;
    }
    await mongoose.disconnect();
  }

  _getUrl() {
    return this._config.database?.mongo.url || 'mongo://localhost:3000';
  }
}