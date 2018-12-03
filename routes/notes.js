'use strict';

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;

  let filter = {};

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{'title': re}, {'content': re}];
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tags = tagId;
  }

  console.log(filter);

  Note.find(filter)
    .populate('tags')
    .sort({updateAt: 'desc'})
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const {id} = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findById(id)
    .populate('tags')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const { title, content, folderId, tags } = req.body;


  
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newNote = {title, content, folderId};
  if (folderId === '') {
    delete newNote.folderId;
  }
  console.log('NEW NOTE:', newNote);
  if (tags.length > 0) {
    newNote.tags = tags;
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  for (let i = 0; i < tags.length; i++) {
    if (tags && !mongoose.Types.ObjectId.isValid(tags[i])) {
      const err = new Error('The `tags` is not valid');
      err.status = 400;
      return next(err);
    }
  }

  Note.create(newNote)
    .then(result => {
      res.location(`http://${req.headers.host}/api/notes/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const { title, content, folderId, tags } = req.body;

  const updateNote = { title, content, folderId };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  console.log('FOLDER ID:', folderId);
  console.log(!mongoose.Types.ObjectId.isValid(folderId));
  console.log(folderId && !mongoose.Types.ObjectId.isValid(folderId));

  //note must have a folder
  // if (folderId === '' || !mongoose.Types.ObjectId.isValid(folderId))
  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }
  
  if (folderId === '') {
    delete updateNote.folderId;
  }

  if (tags.length > 0) {
    updateNote.tags = tags;
  }

  for (let i = 0; i < tags.length; i++) {
    if (tags && !mongoose.Types.ObjectId.isValid(tags[i])) {
      const err = new Error('The `tags` is not valid');
      err.status = 400;
      return next(err);
    }
  }

  
  Note.findByIdAndUpdate(id, updateNote, {new: true})
    .populate('tags')
    .then(results => {
      if (results) {
        console.log(results);
        // res.status(204).json(results); why does this break client?
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;