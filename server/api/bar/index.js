'use strict';

var express = require('express');
var controller = require('./bar.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// *** disable unused routes (security)
router.get('/', controller.index);
router.get('/p/:id', controller.barByPlaceId);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.patch('/going/:id', auth.isAuthenticated(), controller.setGoing);

module.exports = router;
