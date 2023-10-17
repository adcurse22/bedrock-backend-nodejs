import { Router } from "express";
import log4js from 'log4js';

export default class NotesRouter {
  
  constructor(getService) {
    this._logger = log4js.getLogger('NotesRouter');
    this._logger.level = 'debug';
    this._authorization = getService('authorization');
    this._notesService = getService('notesService');
  }

  notesApi() {
    let router = Router();

    const schema = {};

    router.route('/notes')
      // .get(this._authorization.auth, this._profileService.findAll);
      .get(this._notesService.findAllNotes)
      .post(this._notesService.createNote);
    router.route('/notes/tag/:id')
      .post(this._notesService.addTag)
      .delete(this._notesService.removeTag)
    router.route('/notes/category/:id')
      .post(this._notesService.addCategory)
      .delete(this._notesService.removeCategory);
    return router;
  }
}