'use strict';

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

folderSchema.set('timestamps', true);

folderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v,
    delete ret._id;
  }
});


module.exports = mongoose.model('Folder', folderSchema);

