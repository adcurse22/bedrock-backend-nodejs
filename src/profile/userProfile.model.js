'use strict';

import mongoose, { Model, Schema } from "mongoose";
import { UserRoles } from "./enums/roles.js";

/**
 * User profile entity
 */
export default class UserProfileModel { 
  constructor() {
    const profileSchema = new Schema(this._getFields());
    
    // profileSchema.index({resetPassowrdKey: 1});

    /**
     * Searches user by email
     */
    profileSchema.static('findByEmail', function(email) {
      return this.findOne({email}).collation({ locale: 'en', strength: 2});
    });

    profileSchema.static('findById', function(id) {
      return this.findOne({_id: id});
    });

    profileSchema.static('findAll', function() {
      return this.find();
    });


    this._Profile = mongoose.model('UserProfile', profileSchema);
  }

  _getFields() {
    return {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      // phone: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      createdAt: { type: Date },
      role: { type: String, required: true, enum: Object.values(UserRoles), default: UserRoles.USER },
      resetPasswordKey: { type: String, required: false },
      confirmEmailKey: { type: String, required: false },
      emailConfirmed: { type: Boolean, required: false },
      university: { type: mongoose.Schema.Types.ObjectId, ref: 'UniversityProfile' },
      notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
      categories: [{ 
        name: { type: String }, 
        notes: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' }
      }],
      folders: [{ type: String }]
    }
  }

  get Profile() {
    return this._Profile;
  }
}