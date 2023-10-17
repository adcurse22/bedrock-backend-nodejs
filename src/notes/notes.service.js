'use strict';

import log4js from 'log4js';

/**
 * Note service
 */
export default class NotesService {

  /**
   * Constructs note service
   * @param {Function} getService returns registered service
   */
  constructor(getService) {
    this._userProfileModel = getService('userProfileModel');
    this._noteModel = getService('noteModel');
    this._authorization = getService('authorization');
    this._logger = log4js.getLogger('NotesService');
    this._logger.level = 'debug';
  }

  get findAllNotes() {
    return this._findAllNotes.bind(this);
  }

  get createNote() {
    return this._createNote.bind(this);
  }

  get addTag() {
    return this._addTag.bind(this);
  }

  get removeTag() {
    return this._removeTag.bind(this);
  }

  get addCategory() {
    return this._addCategory.bind(this);
  }

  get removeCategory() {
    return this._removeCategory.bind(this);
  }

  async _findAllNotes(req, res, next) {
    return res.send(await this._noteModel.Note.findAll());
  }

  async _createNote(req, res, next) {
    const data = this._validateNote(req, res);
    if (!data) {
      return;
    }
    const user = await this._userProfileModel.Profile.findById(data.user);
    if (!user) {
      res.status(400).send({message: 'User doesn\'t exists'});
      return;
    }
    data.createdAt = new Date();
    const note = await this._noteModel.Note(data);
    return note.save().then((savedNote) => {
      return res.status(201).send(savedNote);
    })
  }

  async _addTag(req, res, next) {
    const id = req.params.id;
    const tag = req.body?.tag;
    const note = await this._noteModel.Note.findById(id);
    if (!note) {
      res.status(400).send({message: 'Note doesn\'t exists'});
      return;
    }
    let isTagExists = false;
    note.tags.forEach((existsTag) => {
      if (existsTag.toLowerCase() === tag.toLocaleLowerCase()) {
        res.status(400).send({message: 'Tag already set'});
        isTagExists = true;
        return;
      }
    });
    if (isTagExists) {
      return;
    }
    return res.send(await this._noteModel.Note.addTag(id, tag));
  }

  async _removeTag(req, res, next) {
    const id = req.params.id;
    const tag = req.body.tag;
    const note = await this._noteModel.Note.findById(id);
    if (!note) {
      res.status(400).send({message: 'Note doesn\'t exists'});
      return;
    }
    return res.send(await this._noteModel.Note.removeTag(id, tag));
  }

  async _addCategory(req, res, next) {
    const id = req.params.id;
    const category = req.body.category;
    const note = await this._noteModel.Note.findById(id);
    if (!note) {
      res.status(400).send({message: 'Note doesn\'t exists'});
      return;
    }
    return res.send(await this._noteModel.Note.addCategory(id, category));
  }

  async _removeCategory(req, res, next) {
    const id = req.params.id;
    const category = req.body.category;
    const note = await this._noteModel.Note.findById(id);
    if (!note) {
      res.status(400).send({message: 'Note doesn\'t exists'});
      return;
    }
    return res.send(await this._noteModel.Note.removeCategory(id, category));
  }

  async _editNote(req, res, next) {
    
  }

  _validateNote(req, res) {
    console.log(req.body);
    if (!req.body) {
      res.status(400).send({message: 'Bad request'});
      return null;
    }
    const { user, text } = req.body;
    if (!user || !text) {
      res.status(400).send({message: 'Bad request'});
    }
    return { user, text };
  }
}