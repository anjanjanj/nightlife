'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BarSchema = new Schema({
  placeId: { type: String, unique: true },
  peopleGoing: [],
  active: Boolean
});

module.exports = mongoose.model('Bar', BarSchema);
