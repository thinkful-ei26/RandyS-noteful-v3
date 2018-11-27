'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const searchTerm = 'another';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'i' };
//     }

//     return Note.find(filter).sort({ updatedAt: 'content' });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


// find by ID
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  
//   .then(() => {
//     let id = "000000000000000000000007";
//     return Note.findById(id);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//create 
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     let newObj = { title: 'Another thing about cats', content: 'cats r cool'};
//     return Note.create(newObj);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// update 
// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     // let id = '000000000000000000000007';
//     // let updatedObj = { title: 'Another thing about cats', content: 'cats r cool'};
//     return Note.findByIdAndUpdate('000000000000000000000007', 
//     { title: 'Another thing about cats', content: 'cats r cool'}, 
//     { new: true, upsert: true });
//   })
//   .then(results => {
//     console.log('here', results);
  
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     let id = "000000000000000000000007";
//     return Note.findByIdAndDelete(id);
//   })
//   .then(results => {
//     console.log('here', results);
        
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });
