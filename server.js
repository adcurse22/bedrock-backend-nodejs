import Application from "./app.js";
import UserProfileModel from "./src/profile/userProfile.model.js";
import ProfileRouter from "./src/profile/profile.router.js";
import ProfileService from "./src/profile/profile.service.js";
import Authorization from "./src/authorization/authorization.js";
import UniversityProfileModel from "./src/profile/universityProfile.model.js";
import NoteModel from "./src/notes/note.model.js";
import NotesService from "./src/notes/notes.service.js";
import NotesRouter from "./src/notes/notes.router.js";


/**
 * Setup server class
 */
export default class Server {
  _app = new Application()

  /**
   * Constructs server
   */
  constructor() {}

  async _initialize(app) {
    /**
     * Register models
     */
    app.registerService('userProfileModel', new UserProfileModel());
    app.registerService('universityProfileModel', new UniversityProfileModel());
    app.registerService('noteModel', new NoteModel());
    
    /**
     * Register services
     */
    app.registerService('authorization', new Authorization(app.getService));
    app.registerService('profileService', new ProfileService(app.getService));
    app.registerService('profileRouter', new ProfileRouter(app.getService));
    app.registerService('notesService', new NotesService(app.getService));

    /**
     * Register routers
     */
    app.addRouter('/', (new ProfileRouter(app.getService)).profileApi());
    app.addRouter('/', (new NotesRouter(app.getService)).notesApi());

  }

  async run() {
    this._initialize(this._app);
    this._app.start();
  }
}