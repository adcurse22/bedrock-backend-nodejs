'use strict';

import mongoose, { Schema } from "mongoose";

/**
 * User profile entity
 */
export default class NoteModel { 
  constructor() {
    const noteSchema = new Schema(this._getFields());
    
    // profileSchema.index({resetPassowrdKey: 1});

    noteSchema.static('findAll', function() {
      return this.find().populate('user');
    });

    noteSchema.static('findByEmail', function(email) {
      return this.findOne({email}).collation({ locale: 'en', strength: 2});
    });

    noteSchema.static('findById', function(id) {
      return this.findOne({_id: id});
    });

    noteSchema.static('addTag', function(id, tag) {
      return this.findOneAndUpdate({_id: id}, {$push: {tags: tag}}, { new: true });
    });

    noteSchema.static('removeTag', function(id, tag) {
      return this.findOneAndUpdate({_id: id}, {$pull: {tags: tag}}, { new: true });
    });

    noteSchema.static('addCategory', function(id, category) {
      return this.findOneAndUpdate({_id: id}, {$push: {categories: category}}, { new: true });
    });

    noteSchema.static('removeCategory', function(id, category) {
      return this.findOneAndUpdate({_id: id}, {$pull: {categories: category}}, { new: true });
    });


    this._Note = mongoose.model('Note', noteSchema);
  }

  _getFields() {
    return {
      text: { type: String, required: true },
      tags: [{ type: String }],
      categories: [{ type: String }],
      createdAt: { type: Date },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }
    }
  }

  get Note() {
    return this._Note;
  }
}