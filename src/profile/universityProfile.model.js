'use strict';

import mongoose, { Schema } from "mongoose";
import { UserRoles } from "./enums/roles.js";

/**
 * User profile entity
 */
export default class UniversityProfileModel { 
  constructor() {
    const profileSchema = new Schema(this._getFields());
    
    // profileSchema.index({resetPassowrdKey: 1});

    /**
     * Searches user by email
     */
    profileSchema.static('findByEmail', function(email) {
      return this.findOne({email}).collation({ locale: 'en', strength: 2});
    });

    profileSchema.static('findAll', function() {
      return this.find();
    });


    this._Profile = mongoose.model('UniversityProfile', profileSchema);
  }

  _getFields() {
    return {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      // phone: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      createdAt: { type: Date },
      role: { type: String, required: true, enum: Object.values(UserRoles), default: UserRoles.UNIVERSITY },
      resetPasswordKey: { type: String, required: false },
      confirmEmailKey: { type: String, required: false },
      emailConfirmed: { type: Boolean, required: false },
      primeAccount: { type: Boolean, default: false },
      staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }]
    }
  }

  get Profile() {
    return this._Profile;
  }
}