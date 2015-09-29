'use strict';

var _ = require('lodash');
var Bar = require('./bar.model');

// get a single bar by placeId
// *** if a bar doesn't exist, first create its record?
exports.barByPlaceId = function(req, res) {
  Bar.findOne({ 'placeId': req.params.id }, function(err, bar) {
    if(err) { return handleError(res, err); }

    // if the bar doesn't exist in the database, create it and return the empty bar
    if(!bar) {
      Bar.create({placeId: req.params.id, peopleGoing: []}, function(err, bar) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(bar);
      });
    }
    else {
      return res.status(200).json(bar);
    }
  });
};

// Get list of bars
exports.index = function(req, res) {
  Bar.find(function (err, bars) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(bars);
  });
};

// Get a single bar
exports.show = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    return res.json(bar);
  });
};

// Creates a new bar in the DB.
exports.create = function(req, res) {
  Bar.create(req.body, function(err, bar) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(bar);
  });
};

// Updates an existing bar in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Bar.findById(req.params.id, function (err, bar) {
    if (err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    // change _.merge to _.extend
    var updated = _.extend(bar, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(bar);
    });
  });
};

// set if the user is going or not, *** MUST verify the user too ***
exports.setGoing = function(req, res) {
  //if(req.body._id) { delete req.body._id; }
  Bar.findById(req.params.id, function (err, bar) {
    if (err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }

    var userId = req.user._id;

    // user is going, add them to peopleGoing
    if (req.body.isGoing === true) {
      //console.log(bar.peopleGoing);
      //console.log(userId);
      //console.log(bar.peopleGoing);
      //console.log(userId);
      //console.log("user going?", bar.peopleGoing.indexOf(userId));
      if (bar.peopleGoing.indexOf(userId) > -1) { return res.status(400).send('User Already Exists'); }
      bar.peopleGoing.push(userId);
    }
    // user isn't going, remove them from peopleGoing
    else if (req.body.isGoing === false) {
      if (bar.peopleGoing.indexOf(userId) === -1) { return res.status(400).send('User Not Found'); }
      _.remove(bar.peopleGoing, userId);
      bar.collection.update(
        { _id: bar._id },
        { $pull: { 'peopleGoing': userId } },
        function (err) {
          if (err) return handleError(res, err);
        }
      );
    }
    else {
      return res.status(400).send('Bad Request' + req.body.isGoing);
    }

    //var updated = _.extend(bar, req.body);
    bar.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(bar);
    });
  });
};

// Deletes a bar from the DB.
exports.destroy = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    bar.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
