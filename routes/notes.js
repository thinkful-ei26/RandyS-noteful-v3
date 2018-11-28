'use strict';

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  
  const searchTerm = req.query.searchTerm || '';

  return Note.find( { $or: [
    { title: { $regex: searchTerm, $options: 'i' }}, 
    { content: { $regex: searchTerm, $options: 'i' }}]})
    .sort({updateAt: 'desc'})
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
      res.sendStatus(500);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
      res.sendStatus(500);
    });
 
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const requiredFields = ['title', 'content'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Note.create({
    title: req.body.title,
    content: req.body.content,
  })
    .then(results => {
      res.location(`http://${req.headers.host}/api/notes/${results.id}`).status(201).json(results);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
      res.sendStatus(500);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const updatedObj = {};

  
  const updatableField = ['title', 'content'];

  updatableField.forEach(field => {
    if (field in req.body) {
      updatedObj[field] = req.body[field];
    }
  });

  Note.findByIdAndUpdate(id,
    {$set: updatedObj}, {new: true, upsert: true})

    .then(results => {
      
      res.status(204).json(results);
    
      
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
      res.sendStatus(500);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findByIdAndDelete(id)
    .then(results => {
      res.status(204).end();
    });
});

module.exports = router;