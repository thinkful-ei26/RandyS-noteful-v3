'use strict';

const express = require('express');
const mongoose = require('mongoose');


// const Folder = require('../models/folder');
const Note = require('../models/note');
const Tag = require('../models/tag');

const router = express.Router();

router.get('/', (req, res, next) => {

  const { searchTerm } = req.query;
  let filter = {};

  if (searchTerm) {
    filter.name = searchTerm;
  }

  Tag.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }


  Tag.findById(id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const {name} = req.body;

  const newTag = {name};

  if (!name) {
    const err = new Error('Missing `name` field in request body');
    err.status(400);
    return next(err);
  }

  Tag.create(newTag)
    .then(result => {
      console.log(req.body.headers);
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});


router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {name} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error ('That is not a valid id');
    err.status(400);
    return next(err);
  }

  if (!name) {
    const err = new Error('Missing `name` field');
    err.status = 400;
    return next(err);
  }

  // Tag.find()
  //   .then(result => {
  //     console.log(result)
  //       if (name === result) {
  //         const err = new Error(`${name} tag already exists`);
  //         err.status = 404;
  //         return next(err);
  //       }  
  //   });

  Tag.findByIdAndUpdate(id, {name: name})
    .then(result => {
      if (result) {
        res.status(200).json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);  
    });
});


router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        return Note.updateMany(
          { tags: id },
          { $pull: { tags: id } }
        );
      }
    })
    .then(result => {
      console.log(result);
      res.status(204).json(result);
    })  
    .catch(err => {
      next(err);
    });
});




module.exports = router;