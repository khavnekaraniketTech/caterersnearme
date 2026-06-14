const express = require('express');
const router = express.Router();
const catererController = require('../controllers/catererController');

router.route('/')
    .get(catererController.getCaterers)
    .post(catererController.createCaterer);

router.route('/:id')
    .get(catererController.getCatererById);

module.exports = router;